/**
 * Home Page
 * Landing page with hero section and contact form
 */
import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, Globe, Sparkles, BookOpen, Award } from 'lucide-react';
import ContactForm from '../components/ContactForm';

// ─── Hero Feature Badges ──────────────────────────────────────
const features = [
  { icon: Users, label: '10,000+ Students Empowered' },
  { icon: Globe, label: 'Nationwide Reach' },
  { icon: Award, label: 'Excellence in NGO Impact' },
];

// ─── Impact Stats ─────────────────────────────────────────────
const stats = [
  { value: '10K+', label: 'Students Helped', icon: Users },
  { value: '50+', label: 'Programs Offered', icon: BookOpen },
  { value: '5+', label: 'Years of Impact', icon: Award },
  { value: '25+', label: 'Cities Covered', icon: Globe },
];

// ─── Animation variants ───────────────────────────────────────
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const HomePage = () => {
  return (
    <main id="main-content" className="relative min-h-screen overflow-hidden">
      {/* ─── Animated Background ─────────────────────────────── */}
      <div className="fixed inset-0 bg-hero-gradient">
        {/* Grid pattern */}
        <div className="absolute inset-0 grid-overlay opacity-40" />

        {/* Floating orbs */}
        <div className="orb orb-1" aria-hidden="true" />
        <div className="orb orb-2" aria-hidden="true" />
        <div className="orb orb-3" aria-hidden="true" />
      </div>

      {/* ─── Content ─────────────────────────────────────────── */}
      <div className="relative z-10 pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* ── Hero Section ─────────────────────────────────── */}
          <motion.section
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center mb-16"
            aria-labelledby="hero-title"
          >
            {/* Pill badge */}
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 mb-6">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/15 border border-violet-500/25 text-violet-300 text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                <span>Empowering the Next Generation</span>
              </div>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              id="hero-title"
              variants={itemVariants}
              className="font-heading font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-tight mb-6"
            >
              Contact{' '}
              <span className="gradient-text">She Can</span>
              <br />
              <span className="text-white/90">Foundation</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="max-w-2xl mx-auto text-lg sm:text-xl text-white/60 leading-relaxed mb-10"
            >
              Empowering students through{' '}
              <span className="text-violet-400 font-medium">technology</span> and{' '}
              <span className="text-fuchsia-400 font-medium">opportunities</span>.
              Join thousands of students on their journey to success.
            </motion.p>

            {/* Feature badges */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center justify-center gap-3 mb-4"
            >
              {features.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/6 border border-white/10 text-white/70 text-sm"
                >
                  <Icon className="w-4 h-4 text-violet-400" />
                  {label}
                </div>
              ))}
            </motion.div>
          </motion.section>

          {/* ── Stats Bar ─────────────────────────────────────── */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 max-w-3xl mx-auto"
            aria-label="Impact statistics"
          >
            {stats.map(({ value, label, icon: Icon }) => (
              <div key={label} className="stat-card rounded-2xl p-4 text-center">
                <Icon className="w-5 h-5 text-violet-400 mx-auto mb-2" />
                <div className="font-heading font-bold text-2xl gradient-text">{value}</div>
                <div className="text-xs text-white/50 mt-0.5">{label}</div>
              </div>
            ))}
          </motion.section>

          {/* ── Contact Form ──────────────────────────────────── */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.7, ease: 'easeOut' }}
            aria-labelledby="contact-heading"
            className="mb-20"
          >
            <div className="text-center mb-8">
              <h2 id="contact-heading" className="sr-only">Contact Form</h2>
              <p className="text-white/40 text-sm">
                Have a question or want to collaborate? We'd love to hear from you.
              </p>
            </div>
            <ContactForm />
          </motion.section>

          {/* ── Footer ────────────────────────────────────────── */}
          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="text-center pt-8 border-t border-white/8"
            role="contentinfo"
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-fuchsia-500 to-violet-600 flex items-center justify-center">
                <Heart className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="font-heading font-semibold text-white/80">She Can Foundation</span>
            </div>
            <p className="text-sm text-white/35">
              © {new Date().getFullYear()} She Can Foundation. All rights reserved.
            </p>
            <p className="text-xs text-white/25 mt-1">
              Empowering students through technology and opportunities.
            </p>
          </motion.footer>
        </div>
      </div>
    </main>
  );
};

export default HomePage;
