const mongoose = require('mongoose');

const scheduleStopSchema = new mongoose.Schema({
    location: String,
    time: String,
    coordinates: {
        type: { type: String, default: 'Point' },
        coordinates: [Number]
    }
}, { _id: false });

const dealSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    discountPercent: Number,
    validUntil: Date,
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

const vendorSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
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
        coordinates: [Number],
    },
    image: String,
    gallery: [String],
    category: {
        type: String,
        enum: ['food', 'beverages', 'fruits', 'grocery', 'fashion', 'electronics', 'services', 'other'],
        default: 'food',
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
    isVerified: {
        type: Boolean,
        default: false,
    },
    schedule: {
        isRoaming: { type: Boolean, default: false },
        currentStop: String,
        nextStops: [scheduleStopSchema],
        operatingHours: { type: String, default: '10:00 AM - 9:00 PM' }
    },
    deals: [dealSchema],
    lastLocationUpdate: Date,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

vendorSchema.index({ location: '2dsphere' });
vendorSchema.index({ category: 1 });
vendorSchema.index({ isOnline: 1 });
vendorSchema.index({ 'schedule.isRoaming': 1 });

module.exports = mongoose.model('Vendor', vendorSchema);
