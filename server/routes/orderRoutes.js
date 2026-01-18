const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Vendor = require('../models/Vendor');

router.post('/', async (req, res) => {
    try {
        const { vendorId, customerId, customerName, customerPhone, customerLocation, items, total, paymentMethod, notes } = req.body;
        
        if (!vendorId || !customerId || !customerName || !items || !total) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const order = new Order({
            vendorId,
            customerId,
            customerName,
            customerPhone,
            customerLocation,
            items,
            total,
            paymentMethod,
            notes
        });

        await order.save();

        if (req.io) {
            req.io.to(`vendor_${vendorId}`).emit('new_order', order);
        }

        res.status(201).json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/customer/:customerId', async (req, res) => {
    try {
        const orders = await Order.find({ customerId: req.params.customerId })
            .populate('vendorId', 'shopName image phone')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/vendor/:vendorId', async (req, res) => {
    try {
        const { status } = req.query;
        const query = { vendorId: req.params.vendorId };
        
        if (status) {
            query.status = status;
        }

        const orders = await Order.find(query).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('vendorId', 'shopName image phone address');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'];
        
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status, updatedAt: new Date() },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (req.io) {
            req.io.emit('order_status_update', { orderId: order._id, status, customerId: order.customerId });
        }

        res.json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/vendor/:vendorId/analytics', async (req, res) => {
    try {
        const vendorId = req.params.vendorId;
        const orders = await Order.find({ vendorId });
        
        const completedOrders = orders.filter(o => o.status === 'COMPLETED');
        const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total, 0);
        
        const hourlyData = Array(24).fill(0);
        orders.forEach(order => {
            const hour = new Date(order.createdAt).getHours();
            hourlyData[hour]++;
        });

        const itemSales = {};
        orders.forEach(order => {
            order.items.forEach(item => {
                itemSales[item.name] = (itemSales[item.name] || 0) + item.quantity;
            });
        });

        const topItems = Object.entries(itemSales)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, qty]) => ({ name, qty }));

        res.json({
            totalOrders: orders.length,
            completedOrders: completedOrders.length,
            totalRevenue,
            avgOrderValue: completedOrders.length > 0 ? Math.round(totalRevenue / completedOrders.length) : 0,
            hourlyData,
            topItems
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
