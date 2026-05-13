const express = require('express');
const router = express.Router();
const { authMiddleware, checkRole } = require('../middlewares/authMiddleware');
const { exportInventoryCSV } = require('../controllers/reportController');

router.get('/csv', authMiddleware, checkRole(['admin']), exportInventoryCSV);

module.exports = router;
