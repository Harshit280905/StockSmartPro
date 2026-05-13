const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    sku: String,
    category: String,
    quantity: Number,
    price: Number,
    supplier: String,
    barcode: String,
    image: String,
    lowStockThreshold: {
        type: Number,
        default: 5
    }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);