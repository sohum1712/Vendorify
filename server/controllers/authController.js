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
            return res.status(400).json({ message: 'Problem with these credentials only: missing required fields' });
        }

        const query = [];
        if (email) query.push({ email });
        if (mobile) query.push({ mobile });

        if (query.length > 0) {
            const userExists = await User.findOne({ $or: query });
            if (userExists) {
                return res.status(400).json({ message: 'Problem with these credentials only: email or mobile already registered' });
            }
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
                try {
                    await Vendor.create({
                        userId: user._id,
                        shopName: shopName || `${name}'s Shop`,
                        address: address || '',
                        ownerName: name,
                        phone: mobile || '',
                        email: email || ''
                    });
                } catch (vendorErr) {
                    console.error('Vendor creation error:', vendorErr);
                    // Even if vendor creation fails, the user is created. 
                    // But for a robust system, we might want to handle this.
                }
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
            return res.status(400).json({ message: 'Problem with these credentials only: invalid user data' });
        }
    } catch (err) {
        console.error('Register error:', err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: `Problem with these credentials only: ${err.message}` });
        }
        if (err.code === 11000) {
            return res.status(400).json({ message: 'Problem with these credentials only: email or mobile already in use' });
        }
        return res.status(500).json({ error: 'Internal server error. please try again.' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, mobile, password } = req.body;

        if ((!email && !mobile) || !password) {
            return res.status(400).json({ message: 'Problem with these credentials only: missing email/mobile or password' });
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
            return res.status(401).json({ message: 'Problem with these credentials only' });
        }
    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ error: 'Internal server error. please try again.' });
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
