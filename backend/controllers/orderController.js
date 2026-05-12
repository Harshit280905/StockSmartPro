const Order = require('../models/Order');
const Product = require('../models/Product');
const Transaction = require('../models/Transaction');
const { sendLowStockEmail } = require('../services/emailService');

const mongoose = require('mongoose');

exports.createOrder = async (req, res) => {
    console.log('--- New Order Request Received ---');
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { customerName, products } = req.body;
        let totalAmount = 0;
        const lowStockProducts = [];

        // Process each product in the order
        for (const item of products) {
            const product = await Product.findById(item.productId).session(session);
            if (!product) {
                await session.abortTransaction();
                session.endSession();
                return res.status(404).json({ message: `Product ${item.productId} not found` });
            }

            if (product.quantity < item.quantity) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
            }

            const previousQuantity = product.quantity;
            product.quantity -= item.quantity;
            await product.save({ session });

            totalAmount += product.price * item.quantity;

            // Check for low stock
            if (product.quantity <= product.lowStockThreshold) {
                lowStockProducts.push(product);
            }

            // Log transaction
            await Transaction.create([{
                product: product._id,
                type: 'SALE',
                quantityChange: -item.quantity,
                previousQuantity: previousQuantity,
                newQuantity: product.quantity,
                performedBy: req.user.id,
                note: `Sold to ${customerName}`
            }], { session });
        }

        const order = await Order.create([{
            customerName,
            products,
            totalAmount
        }], { session });

        await session.commitTransaction();
        session.endSession();

        // Send emails after successful commit
        lowStockProducts.forEach(p => sendLowStockEmail(p));

        res.status(201).json(order[0]);
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: error.message });
    }
};

exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
