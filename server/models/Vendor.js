const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true, // Links to Auth User (e.g., Clerk/Supabase ID)
    },
    shopName: {
        type: String,
        required: true,
    },
    ownerName: String,
    phone: String,
    email: String,
    address: String,
    location: {
        type: { type: String, default: 'Point' },
        coordinates: [Number], // [lng, lat]
    },
    image: String, // Shop image URL
    category: {
        type: String,
        enum: ['food', 'grocery', 'fashion', 'electronics', 'other'],
        default: 'other',
    },
    rating: {
        type: Number,
        default: 0,
    },
    totalReviews: {
        type: Number,
        default: 0,
    },
    isOnline: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Index for Geospatial queries (finding vendors nearby)
vendorSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Vendor', vendorSchema);
