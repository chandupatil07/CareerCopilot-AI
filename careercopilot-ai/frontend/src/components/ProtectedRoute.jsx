import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FullScreenLoader from './FullScreenLoader';
import { ROUTES } from '../constants/routes';

/**
 * Route protection wrapper component. Redirects unauthorized visitors
 * to the login screen and renders loading overlays during session boots.
 */
export function ProtectedRoute({ children }) {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <FullScreenLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return children;
}

export default ProtectedRoute;
