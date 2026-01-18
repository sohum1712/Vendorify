const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
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
        origin: "*",
        methods: ["GET", "POST", "PATCH", "DELETE"]
    }
});

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

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

    socket.on('vendor_location_update', async (data) => {
        const { vendorId, lat, lng, currentStop } = data;
        
        vendorLocations.set(vendorId, { lat, lng, currentStop, timestamp: Date.now() });
        
        io.emit('vendor_moved', { vendorId, lat, lng, currentStop });

        try {
            const Vendor = require('./models/Vendor');
            await Vendor.findByIdAndUpdate(vendorId, {
                location: {
                    type: 'Point',
                    coordinates: [lng, lat]
                },
                'schedule.currentStop': currentStop,
                lastLocationUpdate: new Date()
            });
        } catch (err) {
            console.error('Error updating vendor location:', err);
        }
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

    socket.on('customer_location', (data) => {
        const { customerId, lat, lng } = data;
        socket.broadcast.emit('customer_nearby', { customerId, lat, lng });
    });

    socket.on('get_all_vendor_locations', () => {
        const locations = Array.from(vendorLocations.entries()).map(([vendorId, loc]) => ({
            vendorId,
            ...loc
        }));
        socket.emit('all_vendor_locations', locations);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
