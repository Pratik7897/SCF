/**
 * Contact Submission Model
 * Schema for storing contact form submissions in MongoDB
 */
const mongoose = require('mongoose');

const contactSubmissionSchema = new mongoose.Schema(
  {
    // Full name of the person submitting the form
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },

    // Email address of the submitter
    email: {
      type: String,
      required: [true, 'Email address is required'],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },

    // Message content from the form
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      minlength: [10, 'Message must be at least 10 characters'],
      maxlength: [2000, 'Message cannot exceed 2000 characters'],
    },

    // Status of the submission (for admin management)
    status: {
      type: String,
      enum: ['new', 'read', 'replied', 'archived'],
      default: 'new',
    },

    // Admin notes for internal use
    adminNotes: {
      type: String,
      default: '',
    },

    // IP address for security logging
    ipAddress: {
      type: String,
      default: '',
    },
  },
  {
    // Automatically adds createdAt and updatedAt timestamps
    timestamps: true,
  }
);

// Index for efficient querying by email and creation date
contactSubmissionSchema.index({ email: 1, createdAt: -1 });
contactSubmissionSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('ContactSubmission', contactSubmissionSchema);
