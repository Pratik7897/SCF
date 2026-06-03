/**
 * Admin Authentication Controller
 * Handles admin login, profile, and token management
 */
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const AdminUser = require('../models/AdminUser');

/**
 * Generate a signed JWT token for the admin user
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

/**
 * @desc    Admin login
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid credentials.',
        errors: errors.array().map((e) => e.msg),
      });
    }

    const { email, password } = req.body;

    // Find admin by email (explicitly include password field)
    const admin = await AdminUser.findOne({ email }).select('+password');

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Verify password using bcrypt comparison
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Update last login timestamp
    admin.lastLogin = new Date();
    await admin.save({ validateBeforeSave: false });

    // Generate JWT token
    const token = generateToken(admin._id);

    res.status(200).json({
      success: true,
      message: 'Login successful. Welcome back!',
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        lastLogin: admin.lastLogin,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current logged-in admin profile
 * @route   GET /api/auth/me
 * @access  Private (Admin)
 */
const getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: req.admin,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create initial admin user (run once during setup)
 * @route   POST /api/auth/setup
 * @access  Public (only works if no admin exists)
 */
const setupAdmin = async (req, res, next) => {
  try {
    // Only allow if no admins exist
    const adminCount = await AdminUser.countDocuments();
    if (adminCount > 0) {
      return res.status(403).json({
        success: false,
        message: 'Admin setup is disabled. An admin already exists.',
      });
    }

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.',
      });
    }

    const admin = await AdminUser.create({
      name,
      email,
      password,
      role: 'superadmin',
    });

    const token = generateToken(admin._id);

    res.status(201).json({
      success: true,
      message: 'Admin account created successfully!',
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { login, getMe, setupAdmin };
