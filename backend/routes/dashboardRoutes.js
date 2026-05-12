const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const { getDashboard, getAIInsights } = require('../controllers/dashboardController');

router.get('/', authMiddleware, getDashboard);
router.get('/insights', authMiddleware, getAIInsights);

module.exports = router;
