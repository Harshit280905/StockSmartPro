const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/verify-me', authMiddleware, authController.verifyMe);
router.put('/preferences', authMiddleware, authController.updatePreferences);

module.exports = router;