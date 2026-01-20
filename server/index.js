const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const vendorRoutes = require('./routes/vendorRoutes');
const publicRoutes = require('./routes/publicRoutes');
const orderRoutes = require('./routes/orderRoutes');

const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // In production this should be the specific frontend URL
        methods: ["GET", "POST", "PATCH", "DELETE"]
    }
});

const PORT = process.env.PORT || 5000;

// Security & Performance Middleware
app.use(helmet());
app.use(compression());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api', limiter);

app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increased limit for image uploads if needed

app.use((req, res, next) => {
    req.io = io;
    next();
});

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vendorify')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/vendors', vendorRoutes);
app.use('/api/public/vendors', publicRoutes);
app.use('/api/orders', orderRoutes);

app.get('/', (req, res) => {
    res.send('Vendorify API is running');
});

const vendorLocations = new Map();

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('join_vendor_room', (vendorId) => {
        socket.join(`vendor_${vendorId}`);
        console.log(`Socket ${socket.id} joined vendor_${vendorId}`);
    });

    socket.on('join_customer_room', (customerId) => {
        socket.join(`customer_${customerId}`);
        console.log(`Socket ${socket.id} joined customer_${customerId}`);
    });

    // Updated for text-based address updates if needed, mostly handled via API now
    // But keeping a generic update event if we want to broadcast profile changes
    socket.on('vendor_profile_update', (data) => {
        const { vendorId } = data;
        io.emit('vendor_updated', { vendorId }); // Broadcast to refresh lists
    });

    socket.on('vendor_online', async (vendorId) => {
        try {
            const Vendor = require('./models/Vendor');
            await Vendor.findByIdAndUpdate(vendorId, { isOnline: true });
            io.emit('vendor_status_changed', { vendorId, isOnline: true });
        } catch (err) {
            console.error('Error setting vendor online:', err);
        }
    });

    socket.on('vendor_offline', async (vendorId) => {
        try {
            const Vendor = require('./models/Vendor');
            await Vendor.findByIdAndUpdate(vendorId, { isOnline: false });
            io.emit('vendor_status_changed', { vendorId, isOnline: false });
        } catch (err) {
            console.error('Error setting vendor offline:', err);
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
