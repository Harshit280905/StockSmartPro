const Product = require('../models/Product');
const path = require('path');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

exports.exportInventoryCSV = async (req, res) => {
    try {
        const products = await Product.find();
        
        const uploadsDir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir);
        }

        const filePath = path.join(uploadsDir, `inventory_report_${Date.now()}.csv`);
        
        const csvWriter = createCsvWriter({
            path: filePath,
            header: [
                { id: 'name', title: 'Product Name' },
                { id: 'sku', title: 'SKU' },
                { id: 'category', title: 'Category' },
                { id: 'quantity', title: 'Quantity' },
                { id: 'price', title: 'Price' },
                { id: 'supplier', title: 'Supplier' },
                { id: 'lowStockThreshold', title: 'Threshold' }
            ]
        });

        await csvWriter.writeRecords(products);

        res.download(filePath, 'inventory_report.csv', (err) => {
            if (err) {
                console.error('Error downloading file:', err);
            }
            // Optional: delete file after download
            // fs.unlinkSync(filePath);
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
