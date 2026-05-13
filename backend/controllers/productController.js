const Product = require('../models/Product');
const Transaction = require('../models/Transaction');

exports.addProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        
        // Log transaction
        await Transaction.create({
            product: product._id,
            type: 'ADD',
            quantityChange: product.quantity,
            previousQuantity: 0,
            newQuantity: product.quantity,
            performedBy: req.user.id,
            note: 'Initial stock entry'
        });

        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getProducts = async (req, res) => {
    try {
        const { search, category, stockStatus } = req.query;
        let query = {};

        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }
        if (category) {
            query.category = category;
        }
        if (stockStatus === 'low') {
            query.$expr = { $lte: ['$quantity', '$lowStockThreshold'] };
        } else if (stockStatus === 'out') {
            query.quantity = 0;
        }

        const products = await Product.find(query).sort({ updatedAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const oldProduct = await Product.findById(req.params.id);
        if (!oldProduct) return res.status(404).json({ message: 'Product not found' });

        // Staff protection: Cannot change price
        if (req.user.role === 'staff' && req.body.price !== undefined && Number(req.body.price) !== oldProduct.price) {
            return res.status(403).json({ message: 'Forbidden: Staff members are not authorized to change product prices.' });
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        // Log transaction if quantity changed
        if (req.body.quantity !== undefined && req.body.quantity !== oldProduct.quantity) {
            await Transaction.create({
                product: product._id,
                type: 'UPDATE',
                quantityChange: product.quantity - oldProduct.quantity,
                previousQuantity: oldProduct.quantity,
                newQuantity: product.quantity,
                performedBy: req.user.id,
                note: 'Manual quantity update'
            });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        await Transaction.create({
            product: product._id,
            type: 'DELETE',
            quantityChange: -product.quantity,
            previousQuantity: product.quantity,
            newQuantity: 0,
            performedBy: req.user.id,
            note: 'Product deleted from inventory'
        });

        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};