import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/ui/Loader';

interface ProtectedRouteProps {
  children: React.ReactElement;
  adminOnly?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  adminOnly = false
}) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  // Show premium full-page loader while restoring auth state
  if (isLoading) {
    return <Loader fullPage text="تحميل حسابك الشخصي..." />;
  }

  if (!isAuthenticated) {
    // Redirect to login but save original location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin) {
    // Non-admin trying to access admin pages -> Redirect to home
    return <Navigate to="/" replace />;
  }

  return children;
};
export default ProtectedRoute;
