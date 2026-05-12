const Product = require('../models/Product');
const Order = require('../models/Order');
const Transaction = require('../models/Transaction');

exports.getDashboard = async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();
        
        // Always show total inventory value to everyone
        const stockValueResult = await Product.aggregate([
            { $group: { _id: null, totalStockValue: { $sum: { $multiply: ["$price", "$quantity"] } } } }
        ]);
        const totalStockValue = stockValueResult[0]?.totalStockValue || 0;

        const lowStock = await Product.find({
            $expr: { $lte: ['$quantity', '$lowStockThreshold'] }
        });

        // Category breakdown - always show value
        const categoryData = await Product.aggregate([
            { 
                $group: { 
                    _id: "$category", 
                    count: { $sum: 1 }, 
                    value: { $sum: { $multiply: ["$price", "$quantity"] } } 
                } 
            }
        ]);

        const recentTransactions = await Transaction.find()
            .populate('product', 'name sku')
            .sort({ createdAt: -1 })
            .limit(10);

        res.json({
            totalProducts,
            totalOrders,
            totalStockValue,
            lowStockCount: lowStock.length,
            lowStockItems: lowStock,
            categoryData,
            recentTransactions
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const { sendAIInsightAlert } = require('../services/emailService');
const User = require('../models/User');

exports.getAIInsights = async (req, res) => {
    try {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const oneMonthAgo = new Date();
        oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);

        const recentSalesData = await Transaction.aggregate([
            { $match: { type: 'SALE', createdAt: { $gte: oneWeekAgo } } },
            { $group: { _id: "$product", totalSoldRecent: { $sum: { $abs: "$quantityChange" } } } }
        ]);

        const products = await Product.find();
        let insights = [];

        const totalSales = recentSalesData.reduce((acc, curr) => acc + curr.totalSoldRecent, 0);
        const avgSales = totalSales / (recentSalesData.length || 1);

        // Get user preferences
        const user = await User.findById(req.user.id);
        const allowEmail = user?.notificationPreferences?.aiStrategicInsights;

        for (const product of products) {
            const saleData = recentSalesData.find(r => r._id.toString() === product._id.toString());
            const totalSoldRecent = saleData ? saleData.totalSoldRecent : 0;
            const dailyVelocity = totalSoldRecent / 7;

            if (product.quantity === 0) {
                const revenueAtRisk = Math.round(product.price * dailyVelocity * 7);
                const insight = {
                    type: 'DANGER',
                    message: `Out of Stock: ${product.name}`,
                    recommendation: `Restock now! You are losing ~$${revenueAtRisk.toLocaleString()} in potential revenue this week.`,
                    impact: revenueAtRisk
                };
                insights.push(insight);
                
                // Trigger email if revenue impact is significant
                if (allowEmail && revenueAtRisk > 500) {
                    sendAIInsightAlert(insight);
                }
                continue;
            }

            if (dailyVelocity > 0) {
                const daysLeft = product.quantity / dailyVelocity;
                if (daysLeft < 7) {
                    const lostDays = 7 - daysLeft;
                    const revenueAtRisk = Math.round(product.price * dailyVelocity * lostDays);
                    
                    const insight = {
                        type: 'DANGER',
                        message: `Critical Stock Level: ${product.name}`,
                        recommendation: `Expected to run out in ${Math.round(daysLeft)} days. ~$${revenueAtRisk.toLocaleString()} revenue is at risk.`,
                        impact: revenueAtRisk
                    };
                    insights.push(insight);

                    if (allowEmail && daysLeft < 3) {
                        sendAIInsightAlert(insight);
                    }
                }

                if (totalSoldRecent > avgSales * 1.5 && product.price > 100) {
                    insights.push({
                        type: 'SUCCESS',
                        message: `Cash Cow Detected: ${product.name}`,
                        recommendation: `This is a high-performing product. Consider increasing stock levels by 50%.`,
                        isCashCow: true
                    });
                }
            } else if (product.quantity > 0 && product.createdAt < oneMonthAgo) {
                insights.push({
                    type: 'INFO',
                    message: `Slow Moving Stock: ${product.name}`,
                    recommendation: `Haven't sold in 30+ days. Consider a promotion to free up capital.`,
                    isDeadStock: true
                });
            }
        }

        insights.sort((a, b) => (b.impact || 0) - (a.impact || 0));
        res.json(insights.slice(0, 8));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
