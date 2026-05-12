const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { name, email, password, role: requestedRole } = req.body;

        const existing = await User.findOne({ email });

        if (existing) {
            return res.status(400).json({ message: 'User exists' });
        }

        const hashed = await bcrypt.hash(password, 10);

        const userCount = await User.countDocuments();
        // If role is provided, use it. Otherwise, first user is admin, others are staff.
        const role = requestedRole || (userCount === 0 ? 'admin' : 'staff');

        const user = await User.create({
            name,
            email,
            password: hashed,
            role
        });

        res.json(user);
    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ 
            message: error.message || 'Server error during registration',
            details: error.stack
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(400).json({ message: 'Wrong password' });
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({ token, user });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ 
            message: error.message || 'Server error during login',
            details: error.stack
        });
    }
};

exports.verifyMe = async (req, res) => {
    try {
        const fullUser = await User.findById(req.user.id);
        res.json({
            user: fullUser,
            serverTime: new Date().toISOString(),
            authHeader: req.headers.authorization ? "Present" : "Missing"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updatePreferences = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { notificationPreferences: req.body },
            { new: true }
        );
        res.json(user.notificationPreferences);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};