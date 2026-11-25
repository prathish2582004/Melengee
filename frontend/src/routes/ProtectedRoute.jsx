import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { DASHBOARD_ROUTES } from '../utils/constants';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner message="Verifying authentication..." fullPage />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // If authenticated but unauthorized for this role, redirect to their proper dashboard
    const targetDashboard = DASHBOARD_ROUTES[user?.role] || '/';
    return <Navigate to={targetDashboard} replace />;
  }

  return children;
};

export default ProtectedRoute;

