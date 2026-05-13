const express = require('express');
const router = express.Router();
const { authMiddleware, checkRole } = require('../middlewares/authMiddleware');
const {
    addProduct,
    getProducts,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');

router.post('/', authMiddleware, addProduct);
router.get('/', authMiddleware, getProducts);
router.put('/:id', authMiddleware, updateProduct);
router.delete('/:id', authMiddleware, checkRole(['admin']), deleteProduct);

module.exports = router;