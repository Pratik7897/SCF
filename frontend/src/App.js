/**
 * App.js — Root Component
 * Sets up routing, context providers, and global toast notifications
 */
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

// Show navbar only on non-admin pages
const MainLayout = ({ children }) => (
  <>
    <Navbar />
    {children}
  </>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Global toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'rgba(26, 16, 51, 0.95)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              color: '#e2e8f0',
              borderRadius: '12px',
              fontSize: '14px',
              padding: '12px 16px',
            },
            success: {
              iconTheme: { primary: '#34d399', secondary: '#0f0a1e' },
            },
            error: {
              iconTheme: { primary: '#f43f5e', secondary: '#0f0a1e' },
            },
          }}
        />

        {/* Accessibility: skip to main content */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <MainLayout>
                <HomePage />
              </MainLayout>
            }
          />

          {/* Admin Login (no navbar) */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Protected Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Redirect /admin → /admin/dashboard */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

          {/* 404 Fallback */}
          <Route
            path="*"
            element={
              <div className="min-h-screen bg-[#0f0a1e] flex items-center justify-center text-center px-4">
                <div>
                  <h1 className="font-heading font-bold text-6xl gradient-text mb-4">404</h1>
                  <p className="text-white/60 mb-6">This page doesn't exist.</p>
                  <a
                    href="/"
                    className="btn-primary inline-block px-6 py-3 rounded-xl text-sm font-semibold text-white"
                  >
                    Go Home
                  </a>
                </div>
              </div>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
