/**
 * Navbar Component
 * Top navigation bar with logo and admin link
 */
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Shield, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Add blur/bg effect on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0f0a1e]/90 backdrop-blur-xl border-b border-white/10 shadow-2xl'
          : 'bg-transparent'
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
            aria-label="She Can Foundation - Home"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-fuchsia-500 to-violet-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="font-heading font-bold text-lg text-white">
              She Can{' '}
              <span className="gradient-text">Foundation</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/'
                  ? 'text-violet-400'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Home
            </Link>
            <Link
              to="/admin/login"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/8 border border-white/15 text-sm font-medium text-white/80 hover:text-white hover:border-violet-500/50 hover:bg-violet-500/10 transition-all"
              aria-label="Admin Dashboard Login"
            >
              <Shield className="w-4 h-4" />
              Admin
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-white/70 hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden pb-4 border-t border-white/10 pt-3 space-y-2"
          >
            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-all"
            >
              Home
            </Link>
            <Link
              to="/admin/login"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-violet-400 hover:text-violet-300 hover:bg-violet-500/10 rounded-lg transition-all"
            >
              <Shield className="w-4 h-4" />
              Admin Dashboard
            </Link>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
