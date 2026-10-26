const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate, requireAuth } = require('../middleware/auth');

// Dedicated Citizen Module
router.post('/citizen/login', authController.citizenLogin);
router.post('/citizen/register', authController.citizenRegister);

// Dedicated Admin & Official Personnel Module
router.post('/admin/login', authController.adminLogin);

// Legacy routes for compatibility
router.post('/login', authController.login);
router.post('/register', authController.register);

// Profile and Demo Directory
router.get('/demo-users', authController.getDemoUsers);
router.get('/me', authenticate, requireAuth, authController.getCurrentUser);

module.exports = router;
