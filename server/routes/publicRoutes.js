const express = require('express');
const router = express.Router();
const Vendor = require('../models/Vendor');
const Product = require('../models/Product');
const Review = require('../models/Review');

router.get('/nearby', async (req, res) => {
    try {
        const { lat, lng, radius = 5000, category } = req.query;
        
        if (!lat || !lng) {
            return res.status(400).json({ message: 'lat and lng are required' });
        }

        const query = {
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                    },
                    $maxDistance: parseInt(radius)
                }
            },
            isOnline: true
        };

        if (category && category !== 'all') {
            query.category = category;
        }

        const vendors = await Vendor.find(query)
            .select('-userId')
            .limit(50);

        const vendorsWithDistance = vendors.map(vendor => {
            const vendorCoords = vendor.location?.coordinates || [0, 0];
            const distance = calculateDistance(
                parseFloat(lat), 
                parseFloat(lng), 
                vendorCoords[1], 
                vendorCoords[0]
            );
            return {
                ...vendor.toObject(),
                distance: Math.round(distance * 10) / 10
            };
        });

        res.json(vendorsWithDistance);
    } catch (err) {
        console.error('Nearby vendors error:', err);
        res.status(500).json({ error: err.message });
    }
});

router.get('/search', async (req, res) => {
    try {
        const { q, category, lat, lng } = req.query;
        
        const query = {};
        
        if (q) {
            query.$or = [
                { shopName: { $regex: q, $options: 'i' } },
                { address: { $regex: q, $options: 'i' } },
                { 'schedule.currentStop': { $regex: q, $options: 'i' } }
            ];
        }
        
        if (category && category !== 'all') {
            query.category = category;
        }

        let vendors = await Vendor.find(query)
            .select('-userId')
            .limit(50);

        if (lat && lng) {
            vendors = vendors.map(vendor => {
                const vendorCoords = vendor.location?.coordinates || [0, 0];
                const distance = calculateDistance(
                    parseFloat(lat), 
                    parseFloat(lng), 
                    vendorCoords[1], 
                    vendorCoords[0]
                );
                return {
                    ...vendor.toObject(),
                    distance: Math.round(distance * 10) / 10
                };
            }).sort((a, b) => a.distance - b.distance);
        }

        res.json(vendors);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/all', async (req, res) => {
    try {
        const { category, lat, lng } = req.query;
        
        const query = {};
        if (category && category !== 'all') {
            query.category = category;
        }

        let vendors = await Vendor.find(query)
            .select('-userId')
            .sort({ rating: -1 })
            .limit(100);

        if (lat && lng) {
            vendors = vendors.map(vendor => {
                const vendorCoords = vendor.location?.coordinates || [0, 0];
                const distance = calculateDistance(
                    parseFloat(lat), 
                    parseFloat(lng), 
                    vendorCoords[1], 
                    vendorCoords[0]
                );
                return {
                    ...vendor.toObject(),
                    distance: Math.round(distance * 10) / 10
                };
            });
        }

        res.json(vendors);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/roaming', async (req, res) => {
    try {
        const { lat, lng } = req.query;
        
        const vendors = await Vendor.find({
            'schedule.isRoaming': true,
            isOnline: true
        }).select('-userId');

        let result = vendors;
        if (lat && lng) {
            result = vendors.map(vendor => {
                const vendorCoords = vendor.location?.coordinates || [0, 0];
                const distance = calculateDistance(
                    parseFloat(lat), 
                    parseFloat(lng), 
                    vendorCoords[1], 
                    vendorCoords[0]
                );
                return {
                    ...vendor.toObject(),
                    distance: Math.round(distance * 10) / 10
                };
            }).sort((a, b) => a.distance - b.distance);
        }

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/deals', async (req, res) => {
    try {
        const vendors = await Vendor.find({
            'deals.0': { $exists: true },
            'deals.isActive': true,
            isVerified: true
        }).select('shopName image deals rating category');

        const deals = [];
        vendors.forEach(vendor => {
            vendor.deals.forEach(deal => {
                if (deal.isActive && (!deal.validUntil || new Date(deal.validUntil) > new Date())) {
                    deals.push({
                        ...deal.toObject(),
                        vendorId: vendor._id,
                        vendorName: vendor.shopName,
                        vendorImage: vendor.image,
                        vendorRating: vendor.rating
                    });
                }
            });
        });

        res.json(deals);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const vendor = await Vendor.findById(req.params.id).select('-userId');
        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }
        res.json(vendor);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:id/menu', async (req, res) => {
    try {
        const products = await Product.find({ 
            vendorId: req.params.id,
            isAvailable: true 
        });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:id/reviews', async (req, res) => {
    try {
        const reviews = await Review.find({ vendorId: req.params.id })
            .sort({ createdAt: -1 })
            .limit(50);
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/:id/reviews', async (req, res) => {
    try {
        const { customerId, customerName, rating, text } = req.body;
        
        if (!customerId || !customerName || !rating) {
            return res.status(400).json({ message: 'customerId, customerName, and rating are required' });
        }

        const review = new Review({
            vendorId: req.params.id,
            customerId,
            customerName,
            rating,
            text
        });
        await review.save();

        const reviews = await Review.find({ vendorId: req.params.id });
        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        
        await Vendor.findByIdAndUpdate(req.params.id, {
            rating: Math.round(avgRating * 10) / 10,
            totalReviews: reviews.length
        });

        res.status(201).json(review);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

function deg2rad(deg) {
    return deg * (Math.PI/180);
}

module.exports = router;
