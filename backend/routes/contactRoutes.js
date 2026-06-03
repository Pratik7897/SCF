/**
 * Contact Routes
 * Defines all REST API endpoints for the contact form
 */
const express = require('express');
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');
const {
  submitContactForm,
  getAllSubmissions,
  getSubmissionById,
  updateSubmissionStatus,
  deleteSubmission,
  getDashboardStats,
} = require('../controllers/contactController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Rate limiter: max 5 submissions per 15 minutes per IP
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    success: false,
    message: 'Too many submissions. Please wait 15 minutes before trying again.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Validation rules for contact form submission
const contactValidation = [
  body('fullName')
    .trim()
    .notEmpty().withMessage('Full name is required.')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2–100 characters.'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email address is required.')
    .isEmail().withMessage('Please provide a valid email address.')
    .normalizeEmail(),

  body('message')
    .trim()
    .notEmpty().withMessage('Message is required.')
    .isLength({ min: 10, max: 2000 }).withMessage('Message must be 10–2000 characters.'),
];

// ─── Public Routes ────────────────────────────────────────────────────────────
// POST /api/contact — Submit a contact form
router.post('/', contactLimiter, contactValidation, submitContactForm);

// ─── Protected Admin Routes ───────────────────────────────────────────────────
// GET /api/contact/stats — Dashboard statistics
router.get('/stats', protect, getDashboardStats);

// GET /api/contact/submissions — List all submissions with pagination & filters
router.get('/submissions', protect, getAllSubmissions);

// GET /api/contact/submissions/:id — Get single submission
router.get('/submissions/:id', protect, getSubmissionById);

// PATCH /api/contact/submissions/:id — Update submission status
router.patch('/submissions/:id', protect, updateSubmissionStatus);

// DELETE /api/contact/submissions/:id — Delete a submission
router.delete('/submissions/:id', protect, deleteSubmission);

module.exports = router;
