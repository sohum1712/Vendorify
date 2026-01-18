const User = require('../models/User');
const Vendor = require('../models/Vendor');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
        expiresIn: '30d',
    });
};

exports.register = async (req, res) => {
    try {
        const { name, email, password, role, mobile, shopName, address } = req.body;

        if (!name || (!email && !mobile) || !password) {
            return res.status(400).json({ message: 'Please provide name, password and either email or mobile' });
        }

        const query = [];
        if (email) query.push({ email });
        if (mobile) query.push({ mobile });

        const userExists = await User.findOne({ $or: query });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const userData = {
            name,
            password,
            role: role || 'customer'
        };
        if (email) userData.email = email;
        if (mobile) userData.mobile = mobile;

        const user = await User.create(userData);

        if (user) {
            if (role === 'vendor') {
                await Vendor.create({
                    userId: user._id,
                    shopName: shopName || `${name}'s Shop`,
                    address: address || '',
                    ownerName: name,
                    phone: mobile || '',
                    email: email || ''
                });
            }

            return res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            return res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (err) {
        console.error('Register error:', err);
        return res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, mobile, password } = req.body;

        if ((!email && !mobile) || !password) {
            return res.status(400).json({ message: 'Please provide email/mobile and password' });
        }

        const query = [];
        if (email) query.push({ email });
        if (mobile) query.push({ mobile });

        const user = await User.findOne({ $or: query }).select('+password');

        if (user && (await user.comparePassword(password))) {
            return res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ error: err.message });
    }
};

exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        return res.status(200).json(user);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
