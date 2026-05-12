const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        unique: true
    },
    password: String,
    role: {
        type: String,
        enum: ['admin', 'staff'],
        default: 'staff'
    },
    notificationPreferences: {
        lowStockAlerts: { type: Boolean, default: true },
        aiStrategicInsights: { type: Boolean, default: true },
        weeklyDigest: { type: Boolean, default: false }
    }
});

module.exports = mongoose.model('User', userSchema);