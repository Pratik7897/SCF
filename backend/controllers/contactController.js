/**
 * Contact Form Controller
 * Handles form submission and admin retrieval of submissions
 */
const { validationResult } = require('express-validator');
const ContactSubmission = require('../models/ContactSubmission');

/**
 * @desc    Submit a new contact form
 * @route   POST /api/contact
 * @access  Public
 */
const submitContactForm = async (req, res, next) => {
  try {
    // Check for validation errors from express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Please fix the following errors:',
        errors: errors.array().map((e) => e.msg),
      });
    }

    const { fullName, email, message } = req.body;

    // Get client IP for security logging
    const ipAddress =
      req.ip ||
      req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      '';

    // Create new submission document
    const submission = await ContactSubmission.create({
      fullName,
      email,
      message,
      ipAddress,
    });

    res.status(201).json({
      success: true,
      message: 'Form Submitted Successfully! We will get back to you soon.',
      data: {
        id: submission._id,
        fullName: submission.fullName,
        email: submission.email,
        submittedAt: submission.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all contact submissions (Admin only)
 * @route   GET /api/contact/submissions
 * @access  Private (Admin)
 */
const getAllSubmissions = async (req, res, next) => {
  try {
    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Filter by status if provided
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }

    // Search by name or email
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      filter.$or = [{ fullName: searchRegex }, { email: searchRegex }];
    }

    const [submissions, total] = await Promise.all([
      ContactSubmission.find(filter)
        .sort({ createdAt: -1 })  // Newest first
        .skip(skip)
        .limit(limit),
      ContactSubmission.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: submissions,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single submission by ID (Admin only)
 * @route   GET /api/contact/submissions/:id
 * @access  Private (Admin)
 */
const getSubmissionById = async (req, res, next) => {
  try {
    const submission = await ContactSubmission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found.',
      });
    }

    // Auto-mark as read when viewed
    if (submission.status === 'new') {
      submission.status = 'read';
      await submission.save();
    }

    res.status(200).json({
      success: true,
      data: submission,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update submission status (Admin only)
 * @route   PATCH /api/contact/submissions/:id
 * @access  Private (Admin)
 */
const updateSubmissionStatus = async (req, res, next) => {
  try {
    const { status, adminNotes } = req.body;

    const submission = await ContactSubmission.findByIdAndUpdate(
      req.params.id,
      { status, adminNotes },
      { new: true, runValidators: true }
    );

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Submission updated successfully.',
      data: submission,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a submission (Admin only)
 * @route   DELETE /api/contact/submissions/:id
 * @access  Private (Admin)
 */
const deleteSubmission = async (req, res, next) => {
  try {
    const submission = await ContactSubmission.findByIdAndDelete(req.params.id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Submission deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get dashboard statistics (Admin only)
 * @route   GET /api/contact/stats
 * @access  Private (Admin)
 */
const getDashboardStats = async (req, res, next) => {
  try {
    const [total, newCount, readCount, repliedCount] = await Promise.all([
      ContactSubmission.countDocuments(),
      ContactSubmission.countDocuments({ status: 'new' }),
      ContactSubmission.countDocuments({ status: 'read' }),
      ContactSubmission.countDocuments({ status: 'replied' }),
    ]);

    // Recent submissions for dashboard
    const recentSubmissions = await ContactSubmission.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('fullName email status createdAt');

    res.status(200).json({
      success: true,
      data: {
        stats: { total, new: newCount, read: readCount, replied: repliedCount },
        recentSubmissions,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitContactForm,
  getAllSubmissions,
  getSubmissionById,
  updateSubmissionStatus,
  deleteSubmission,
  getDashboardStats,
};
