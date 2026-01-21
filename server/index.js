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
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST", "PATCH", "DELETE"]
    }
});

const PORT = process.env.PORT || 5001;

// Security & Performance Middleware
app.use(helmet());
app.use(compression());

// CORS Configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true
}));

// Rate Limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.'
    }
});
app.use('/api', limiter);

// Body parsing middleware
app.use(express.json({ limit: process.env.MAX_FILE_SIZE || '10mb' }));
app.use(express.urlencoded({ extended: true, limit: process.env.MAX_FILE_SIZE || '10mb' }));

// Socket.io middleware
app.use((req, res, next) => {
    req.io = io;
    next();
});

// MongoDB Connection with proper error handling
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vendorify';
        
        const conn = await mongoose.connect(mongoURI, {
            // Remove deprecated options, use only necessary ones
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`📊 Database: ${conn.connection.name}`);
        
        // Handle connection events
        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️  MongoDB disconnected');
        });

        mongoose.connection.on('reconnected', () => {
            console.log('🔄 MongoDB reconnected');
        });

    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
        
        // In development, exit process on connection failure
        if (process.env.NODE_ENV === 'development') {
            process.exit(1);
        }
        
        // In production, attempt to reconnect after delay
        setTimeout(connectDB, 5000);
    }
};

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/vendors', vendorRoutes);
app.use('/api/public/vendors', publicRoutes);
app.use('/api/orders', orderRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Vendorify API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Welcome to Vendorify API',
        version: '1.0.0',
        documentation: '/api/health'
    });
});

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('🔌 Client connected:', socket.id);

    socket.on('join_vendor_room', (vendorId) => {
        socket.join(`vendor_${vendorId}`);
        console.log(`📦 Socket ${socket.id} joined vendor_${vendorId}`);
    });

    socket.on('join_customer_room', (customerId) => {
        socket.join(`customer_${customerId}`);
        console.log(`🛒 Socket ${socket.id} joined customer_${customerId}`);
    });

    socket.on('vendor_profile_update', (data) => {
        const { vendorId } = data;
        io.emit('vendor_updated', { vendorId });
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
        console.log('🔌 Client disconnected:', socket.id);
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('🚨 Global Error:', err.stack);
    
    res.status(err.status || 500).json({
        success: false,
        message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// Handle 404 routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 SIGTERM received, shutting down gracefully');
    server.close(() => {
        console.log('💤 Process terminated');
        mongoose.connection.close();
    });
});

process.on('SIGINT', () => {
    console.log('🛑 SIGINT received, shutting down gracefully');
    server.close(() => {
        console.log('💤 Process terminated');
        mongoose.connection.close();
    });
});

// Start server
server.listen(PORT, () => {
    console.log('🚀 ================================');
    console.log(`🚀 Vendorify Server is running!`);
    console.log(`🚀 Environment: ${process.env.NODE_ENV}`);
    console.log(`🚀 Port: ${PORT}`);
    console.log(`🚀 URL: http://localhost:${PORT}`);
    console.log('🚀 ================================');
});
