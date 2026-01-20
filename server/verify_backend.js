const axios = require('axios');
const io = require('socket.io-client');

const BASE_URL = 'http://localhost:5000/api';
const SOCKET_URL = 'http://localhost:5000';

let vendorToken;
let customerToken;
let vendorId;
let customerId;
let orderId;

const fs = require('fs');

function log(msg) {
    console.log(msg);
    fs.appendFileSync('verify.log', msg + '\n');
}

async function runTests() {
    try {
        log('--- Starting Verification ---');

        // 1. Register/Login Vendor
        log('1. Registering Vendor...');
        const uniqueSuffix = Date.now();
        try {
            const vendorRes = await axios.post(`${BASE_URL}/auth/register`, {
                name: `Test Vendor ${uniqueSuffix}`,
                email: `vendor${uniqueSuffix}@test.com`,
                password: 'password123',
                role: 'vendor'
            });
            vendorToken = vendorRes.data.token;
            vendorId = vendorRes.data._id;
            log('   Vendor Registered:', vendorId);
        } catch (e) {
            log('   Vendor Registration failed: ' + JSON.stringify(e.response ? e.response.data : e.message));
            log('   Trying login...');
            try {
                const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
                    email: `vendor${uniqueSuffix}@test.com`,
                    password: 'password123'
                });
                vendorToken = loginRes.data.token;
                vendorId = loginRes.data._id;
                log('   Vendor Logged In:', vendorId);
            } catch (loginErr) {
                console.error('   Login also failed. Cannot proceed.');
                throw loginErr;
            }
        }

        // Create Vendor Profile immediately because registration might not make a Vendor doc automatically 
        // depending on implementation. 
        // Checking authController: it creates a User. Does it create a Vendor doc?
        // vendorController.getVendorProfile looks for { userId: req.user.id }. 
        // If it doesn't exist, we might need a "create profile" flow.
        // updateVendorProfile has `upsert: true`, so we can just update to create.

        log('2. Creating/Updating Vendor Profile...');
        const profileRes = await axios.put(`${BASE_URL}/vendors/profile`, {
            shopName: `Test Shop ${uniqueSuffix}`,
            address: '123 Test St, Test City', // Initial address
            category: 'food'
        }, { headers: { Authorization: `Bearer ${vendorToken}` } });
        log('   Profile Updated:', profileRes.data.shopName);

        // 3. Update Location (Address)
        log('3. Updating Location (Address)...');
        const locRes = await axios.post(`${BASE_URL}/vendors/location`, {
            address: '456 New St, New City'
        }, { headers: { Authorization: `Bearer ${vendorToken}` } });
        log('   Location Updated:', locRes.data.address);

        // 4. Verify Vendor Profile History (Requires checking DB or logic, we can just check if profile still works)
        // Ideally we'd have an admin route to check history or inspect DB, but let's assume if no error, it's good.

        // 5. Search Vendor
        log('5. Searching Vendor...');
        // Wait a bit for indexing? MongoDB text index might take a moment? Usually fast.
        await new Promise(r => setTimeout(r, 1000));
        const searchRes = await axios.get(`${BASE_URL}/vendors/search?query=New City`);
        const found = searchRes.data.find(v => v.userId === vendorId);
        log('   Vendor Found by Address:', !!found);

        // 6. Register Customer
        log('6. Registering Customer...');
        try {
            const custRes = await axios.post(`${BASE_URL}/auth/register`, {
                name: `Test Customer ${uniqueSuffix}`,
                email: `customer${uniqueSuffix}@test.com`,
                password: 'password123',
                role: 'customer'
            });
            customerToken = custRes.data.token;
            customerId = custRes.data._id;
            log('   Customer Registered: ' + customerId);
        } catch (e) {
            log('   Customer Registration failed: ' + JSON.stringify(e.response ? e.response.data : e.message));
            log('   Trying login...');
            try {
                const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
                    email: `customer${uniqueSuffix}@test.com`,
                    password: 'password123'
                });
                customerToken = loginRes.data.token;
                customerId = loginRes.data._id;
                log('   Customer Logged In: ' + customerId);
            } catch (loginErr) {
                console.error('   Login also failed. Cannot proceed.');
                throw loginErr;
            }
        }

        // 7. Test Socket Connection
        log('7. Connecting Sockets...');
        const vendorSocket = io(SOCKET_URL);
        const customerSocket = io(SOCKET_URL);

        vendorSocket.on('connect', () => {
            log('   [Socket] Vendor Socket Connected: ' + vendorSocket.id);
            vendorSocket.emit('join_vendor_room', profileRes.data._id);
        });

        customerSocket.on('connect', () => {
            log('   [Socket] Customer Socket Connected: ' + customerSocket.id);
            customerSocket.emit('join_customer_room', customerId);
        });

        // Listen for new order on vendor
        const newOrderPromise = new Promise(resolve => {
            vendorSocket.on('new_order', (order) => {
                log('   [Socket] Vendor received new order:', order._id);
                resolve(order);
            });
        });

        // 8. Create Order
        log('8. Creating Order...');
        await new Promise(r => setTimeout(r, 2000)); // Wait for sockets to join rooms
        const orderRes = await axios.post(`${BASE_URL}/orders`, {
            vendorId: profileRes.data._id, // Need the VENDOR _id, not userId
            items: [{ productId: new mongoose.mongo.ObjectId(), quantity: 2, price: 100, name: 'Test Item' }],
            totalAmount: 200,
            deliveryAddress: 'Customer Address'
        }, { headers: { Authorization: `Bearer ${customerToken}` } });
        orderId = orderRes.data._id;
        log('   Order Created: ' + orderId);

        await newOrderPromise; // Wait for socket event

        // Listen for status update on customer
        const statusUpdatePromise = new Promise(resolve => {
            customerSocket.on('order_status_update', (data) => {
                console.log('   [Socket] Customer received status update: ' + data.status);
                resolve(data);
            });
        });

        // 9. Update Order Status (by Vendor)
        console.log('9. Updating Order Status...');
        const updateRes = await axios.patch(`${BASE_URL}/orders/${orderId}/status`, {
            status: 'confirmed'
        }, { headers: { Authorization: `Bearer ${vendorToken}` } });
        console.log('   Status Updated:', updateRes.data.status);

        await statusUpdatePromise; // Wait for socket event

        console.log('--- Verification Complete ---');
        process.exit(0);

    } catch (err) {

        log('VERIFICATION FAILED: ' + JSON.stringify(err.response ? err.response.data : err.message));
        process.exit(1);
    }
}

// Need mongoose for ObjectId generation if simulating items
const mongoose = require('mongoose');

runTests();
