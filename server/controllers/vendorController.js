const Vendor = require('../models/Vendor');
const Product = require('../models/Product');

// --- Vendor Profile Controllers ---

exports.getVendorProfile = async (req, res) => {
    try {
        // Assuming user ID is attached to req by auth middleware
        const vendor = await Vendor.findOne({ userId: req.user.id });
        if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
        res.json(vendor);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateVendorProfile = async (req, res) => {
    try {
        const vendor = await Vendor.findOneAndUpdate(
            { userId: req.user.id },
            req.body,
            { new: true, upsert: true } // Create if doesn't exist
        );
        res.json(vendor);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateLocation = async (req, res) => {
    try {
        const { lat, lng } = req.body;
        const vendor = await Vendor.findOneAndUpdate(
            { userId: req.user.id },
            {
                location: {
                    type: 'Point',
                    coordinates: [lng, lat]
                }
            },
            { new: true }
        );
        // Emit Socket.IO event for real-time tracking
        if (req.io) {
            req.io.emit('vendor_location_update', { vendorId: vendor._id, lat, lng });
        }

        res.json({ message: 'Location updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// --- Menu Management Controllers ---

exports.getProducts = async (req, res) => {
    try {
        const vendor = await Vendor.findOne({ userId: req.user.id });
        const products = await Product.find({ vendorId: vendor._id });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addProduct = async (req, res) => {
    try {
        const vendor = await Vendor.findOne({ userId: req.user.id });
        const newProduct = new Product({
            ...req.body,
            vendorId: vendor._id
        });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// --- AI Feature Stub ---

const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "YOUR_API_KEY");

exports.aiGenerateMenu = async (req, res) => {
    try {
        const { query } = req.body;

        if (!query) {
            return res.status(400).json({ message: "Query is required" });
        }

        // 1. Generate Metadata using Gemini
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = `Generate a JSON object for a food item named "${query}". 
        The JSON should have these fields: 
        - description (short, appetizing, max 20 words)
        - calories (e.g., "350 kcal")
        - price (estimated in INR, number only, e.g., 250)
        - category (one of: "Starters", "Main Course", "Dessert", "Beverage")
        - ingredients (array of strings)
        
        Do not include markdown formatting, just the raw JSON string.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up markdown code blocks if present
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const aiData = JSON.parse(jsonStr);

        // 2. Generate Image URL (Free Source)
        // Using LoremFlickr for relevant food images
        const encodedQuery = encodeURIComponent(query);
        const image = `https://loremflickr.com/500/500/food,${encodedQuery}/all`;

        res.json({
            name: query,
            ...aiData,
            image
        });

    } catch (err) {
        console.error("AI Generation Error:", err);
        // Fallback if AI fails (e.g., no API key)
        res.json({
            name: query,
            description: "Delicious freshly prepared dish.",
            price: 199,
            calories: "Unknown",
            category: "Main Course",
            ingredients: ["Fresh Ingredients"],
            image: `https://loremflickr.com/500/500/food,${encodeURIComponent(query)}/all`
        });
    }
};
