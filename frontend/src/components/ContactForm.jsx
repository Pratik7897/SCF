/**
 * ContactForm Component
 * Feature-rich contact form with validation, loading state, and success message
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, MessageSquare, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { contactAPI } from '../services/api';

// ─── Field validation helpers ─────────────────────────────────
const validate = (name, value) => {
  switch (name) {
    case 'fullName':
      if (!value.trim()) return 'Full name is required.';
      if (value.trim().length < 2) return 'Name must be at least 2 characters.';
      if (value.trim().length > 100) return 'Name cannot exceed 100 characters.';
      return '';

    case 'email':
      if (!value.trim()) return 'Email address is required.';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value.trim())) return 'Please enter a valid email address.';
      return '';

    case 'message':
      if (!value.trim()) return 'Message is required.';
      if (value.trim().length < 10) return 'Message must be at least 10 characters.';
      if (value.trim().length > 2000) return 'Message cannot exceed 2000 characters.';
      return '';

    default:
      return '';
  }
};

// ─── Animated Input Field ─────────────────────────────────────
const FormField = ({ icon: Icon, label, id, error, touched, children }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    className="space-y-1.5"
  >
    <label htmlFor={id} className="block text-sm font-medium text-white/80">
      {label} <span className="text-fuchsia-400" aria-hidden="true">*</span>
    </label>
    <div className="relative">
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none">
        <Icon className="w-4 h-4" />
      </div>
      {children}
    </div>
    <AnimatePresence mode="wait">
      {touched && error && (
        <motion.p
          key="error"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.2 }}
          className="flex items-center gap-1.5 text-xs text-rose-400"
          role="alert"
          aria-live="polite"
        >
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  </motion.div>
);

// ─── Main ContactForm ─────────────────────────────────────────
const ContactForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
  const [apiMessage, setApiMessage] = useState('');

  // Live validate on change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Only show live errors if field was already touched
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
    }
  };

  // Mark field as touched on blur
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
  };

  // Validate all fields before submit
  const validateAll = () => {
    const newErrors = {
      fullName: validate('fullName', formData.fullName),
      email: validate('email', formData.email),
      message: validate('message', formData.message),
    };
    setErrors(newErrors);
    setTouched({ fullName: true, email: true, message: true });
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateAll()) return;

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const { data } = await contactAPI.submit(formData);

      if (data.success) {
        setSubmitStatus('success');
        setApiMessage(data.message);
        // Clear form after successful submission
        setFormData({ fullName: '', email: '', message: '' });
        setTouched({});
        setErrors({});
      }
    } catch (error) {
      setSubmitStatus('error');
      const errMsg =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0] ||
        'Something went wrong. Please try again later.';
      setApiMessage(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const charCount = formData.message.length;

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Success State */}
      <AnimatePresence mode="wait">
        {submitStatus === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', duration: 0.6 }}
            className="glass-card rounded-2xl p-10 text-center space-y-5"
            role="alert"
            aria-live="assertive"
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center pulse-ring">
              <CheckCircle className="w-10 h-10 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-2xl text-white mb-2">
                Form Submitted Successfully! 🎉
              </h3>
              <p className="text-white/60 text-sm leading-relaxed">{apiMessage}</p>
            </div>
            <button
              onClick={() => setSubmitStatus(null)}
              className="px-6 py-2.5 rounded-xl text-sm font-medium bg-white/8 border border-white/15 text-white/80 hover:text-white hover:bg-white/12 transition-all"
            >
              Send Another Message
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card rounded-2xl p-8 md:p-10"
          >
            {/* Card header */}
            <div className="mb-8 text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
                <Mail className="w-7 h-7 text-white" />
              </div>
              <h2 className="font-heading font-bold text-2xl text-white">
                Get in Touch
              </h2>
              <p className="mt-1 text-sm text-white/50">
                Fill the form below and we'll respond shortly.
              </p>
            </div>

            {/* API Error Message */}
            <AnimatePresence>
              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20"
                  role="alert"
                  aria-live="assertive"
                >
                  <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-rose-300">{apiMessage}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} noValidate className="space-y-5" aria-label="Contact form">
              {/* Full Name */}
              <FormField
                icon={User}
                label="Full Name"
                id="fullName"
                error={errors.fullName}
                touched={touched.fullName}
              >
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Jane Doe"
                  autoComplete="name"
                  required
                  aria-required="true"
                  aria-invalid={touched.fullName && !!errors.fullName}
                  aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                  className={`form-input w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white transition-all ${
                    touched.fullName && errors.fullName ? 'error' : ''
                  }`}
                />
              </FormField>

              {/* Email */}
              <FormField
                icon={Mail}
                label="Email Address"
                id="email"
                error={errors.email}
                touched={touched.email}
              >
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="jane@example.com"
                  autoComplete="email"
                  required
                  aria-required="true"
                  aria-invalid={touched.email && !!errors.email}
                  className={`form-input w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white transition-all ${
                    touched.email && errors.email ? 'error' : ''
                  }`}
                />
              </FormField>

              {/* Message */}
              <FormField
                icon={MessageSquare}
                label="Message"
                id="message"
                error={errors.message}
                touched={touched.message}
              >
                <div className="relative">
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Tell us how we can help you..."
                    rows={5}
                    required
                    aria-required="true"
                    aria-invalid={touched.message && !!errors.message}
                    className={`form-input w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white resize-none transition-all ${
                      touched.message && errors.message ? 'error' : ''
                    }`}
                  />
                  {/* Character counter */}
                  <span
                    className={`absolute bottom-2.5 right-3 text-xs ${
                      charCount > 1800 ? 'text-rose-400' : 'text-white/30'
                    }`}
                    aria-live="polite"
                  >
                    {charCount}/2000
                  </span>
                </div>
              </FormField>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                className="btn-primary w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                aria-label={isSubmitting ? 'Submitting form...' : 'Submit contact form'}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </>
                )}
              </motion.button>

              <p className="text-center text-xs text-white/30">
                We respect your privacy. Your data will not be shared.
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContactForm;
