/**
 * Admin Login Page
 * Secure login for admin dashboard access
 */
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Mail, Lock, Eye, EyeOff, AlertCircle, Loader2, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/admin/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError(''); // Clear error on type
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await login(formData);
      const from = location.state?.from?.pathname || '/admin/dashboard';
      navigate(from, { replace: true });
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        'Login failed. Please check your credentials.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 bg-hero-gradient">
        <div className="absolute inset-0 grid-overlay opacity-30" />
        <div className="orb orb-1" aria-hidden="true" />
        <div className="orb orb-2" aria-hidden="true" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white/80 transition-colors"
          >
            <Heart className="w-4 h-4" />
            Back to She Can Foundation
          </Link>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="glass-card rounded-2xl p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="font-heading font-bold text-2xl text-white">Admin Login</h1>
            <p className="mt-1 text-sm text-white/50">
              Sign in to access the admin dashboard
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 flex items-center gap-3 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20"
              role="alert"
              aria-live="assertive"
            >
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <p className="text-sm text-rose-300">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} noValidate aria-label="Admin login form">
            <div className="space-y-5">
              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="admin-email" className="block text-sm font-medium text-white/80">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="admin-email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="admin@shecafoundation.org"
                    autoComplete="email"
                    required
                    aria-required="true"
                    className="form-input w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label htmlFor="admin-password" className="block text-sm font-medium text-white/80">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="admin-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    aria-required="true"
                    className="form-input w-full pl-10 pr-11 py-3 rounded-xl text-sm text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                className="btn-primary w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-sm font-semibold text-white mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    Sign In
                  </>
                )}
              </motion.button>
            </div>
          </form>

          {/* Setup hint */}
          <div className="mt-6 pt-5 border-t border-white/8 text-center">
            <p className="text-xs text-white/30">
              First time?{' '}
              <a
                href="http://localhost:5000/api/auth/setup"
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-400 hover:text-violet-300 underline transition-colors"
              >
                Set up admin account
              </a>{' '}
              via the backend API.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
