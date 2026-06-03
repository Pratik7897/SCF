/**
 * Auth Routes
 * Authentication endpoints for admin access
 */
const express = require('express');
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');
const { login, getMe, setupAdmin } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Strict rate limit on login to prevent brute force
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    success: false,
    message: 'Too many login attempts. Please wait 15 minutes.',
  },
});

// Validation for login
const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Please provide a valid email.'),
  body('password')
    .notEmpty().withMessage('Password is required.'),
];

// POST /api/auth/login — Admin login
router.post('/login', loginLimiter, loginValidation, login);

// GET /api/auth/me — Get current admin profile (protected)
router.get('/me', protect, getMe);

// POST /api/auth/setup — One-time admin setup (disabled after first admin created)
router.post('/setup', setupAdmin);

module.exports = router;
