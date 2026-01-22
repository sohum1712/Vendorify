const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const Vendor = require('../models/Vendor');

const testVendors = [
  {
    email: 'pizza@test.com',
    password: 'vendor123',
    name: 'Mario\'s Pizza',
    shopName: 'Mario\'s Pizza Palace',
    category: 'food',
    coordinates: { lat: 23.0225, lng: 72.5714 }, // Ahmedabad
    address: 'CG Road, Ahmedabad, Gujarat',
    phone: '+91 9876543210',
    isOnline: true,
    isVerified: true,
    rating: 4.5
  },
  {
    email: 'coffee@test.com',
    password: 'vendor123',
    name: 'Brew & Beans',
    shopName: 'Brew & Beans Coffee Shop',
    category: 'beverages',
    coordinates: { lat: 23.0304, lng: 72.5662 }, // Ahmedabad
    address: 'Satellite, Ahmedabad, Gujarat',
    phone: '+91 9876543211',
    isOnline: true,
    isVerified: true,
    rating: 4.2
  },
  {
    email: 'fruits@test.com',
    password: 'vendor123',
    name: 'Fresh Fruits',
    shopName: 'Fresh Fruits Corner',
    category: 'fruits',
    coordinates: { lat: 23.0258, lng: 72.5873 }, // Ahmedabad
    address: 'Maninagar, Ahmedabad, Gujarat',
    phone: '+91 9876543212',
    isOnline: true,
    isVerified: false,
    rating: 4.0
  },
  {
    email: 'grocery@test.com',
    password: 'vendor123',
    name: 'Daily Needs',
    shopName: 'Daily Needs Grocery',
    category: 'grocery',
    coordinates: { lat: 23.0395, lng: 72.5660 }, // Ahmedabad
    address: 'Vastrapur, Ahmedabad, Gujarat',
    phone: '+91 9876543213',
    isOnline: false,
    isVerified: true,
    rating: 3.8
  }
];

const addTestVendors = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vendorify');
    console.log('✅ Connected to MongoDB');

    for (const vendorData of testVendors) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: vendorData.email });
      
      if (!existingUser) {
        // Create user
        const user = new User({
          name: vendorData.name,
          email: vendorData.email,
          password: vendorData.password,
          role: 'vendor'
        });
        await user.save();

        // Create vendor profile
        const vendor = new Vendor({
          userId: user._id,
          shopId: `SHOP-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
          shopName: vendorData.shopName,
          category: vendorData.category,
          location: {
            type: 'Point',
            coordinates: [vendorData.coordinates.lng, vendorData.coordinates.lat]
          },
          address: vendorData.address,
          phone: vendorData.phone,
          isOnline: vendorData.isOnline,
          isVerified: vendorData.isVerified,
          rating: vendorData.rating,
          totalReviews: Math.floor(Math.random() * 50) + 10
        });
        await vendor.save();

        console.log(`✅ Created vendor: ${vendorData.shopName}`);
      } else {
        console.log(`ℹ️  Vendor already exists: ${vendorData.shopName}`);
      }
    }

    console.log('🎉 Test vendors added successfully!');
    
  } catch (error) {
    console.error('❌ Error adding test vendors:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

addTestVendors();