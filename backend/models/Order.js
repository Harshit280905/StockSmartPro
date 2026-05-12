const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customerName: String,
    products: [
        {
            productId: String,
            quantity: Number
        }
    ],
    totalAmount: Number
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
