const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');

const { protect } = require('../middleware/authMiddleware');

// Profile Routes
router.get('/profile', protect, vendorController.getVendorProfile);
router.put('/profile', protect, vendorController.updateVendorProfile);
router.post('/location', protect, vendorController.updateLocation);

// Menu Routes
router.get('/products', protect, vendorController.getProducts);
router.post('/products', protect, vendorController.addProduct);
router.delete('/products/:id', protect, vendorController.deleteProduct);

// AI Routes
router.post('/ai/generate', protect, vendorController.aiGenerateMenu);

module.exports = router;
