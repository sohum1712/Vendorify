const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const vendorRoutes = require('./routes/vendorRoutes');

const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins for now (dev mode)
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Attach IO to request for controllers
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vendorify')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/vendors', vendorRoutes);

// Health Check
app.get('/', (req, res) => {
    res.send('Vendorify API is running');
});

// Socket.IO Connection
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('join_vendor_room', (vendorId) => {
        socket.join(`vendor_${vendorId}`);
        console.log(`Socket ${socket.id} joined vendor_${vendorId}`);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Start Server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
