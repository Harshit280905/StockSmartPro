const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    type: {
        type: String,
        enum: ['ADD', 'UPDATE', 'SALE', 'DELETE'],
        required: true
    },
    quantityChange: {
        type: Number,
        required: true
    },
    previousQuantity: {
        type: Number,
        required: true
    },
    newQuantity: {
        type: Number,
        required: true
    },
    performedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    note: String
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
