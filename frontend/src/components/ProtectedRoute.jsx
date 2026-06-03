/**
 * ProtectedRoute Component
 * Guards admin routes - redirects unauthenticated users to login
 */
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // While checking token validity on mount, show spinner
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f0a1e] flex items-center justify-center">
        <LoadingSpinner size="lg" text="Verifying session..." />
      </div>
    );
  }

  // Not authenticated → redirect to login, preserve intended location
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
