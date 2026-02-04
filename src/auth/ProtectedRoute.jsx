import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';

/**
 * ProtectedRoute Component
 * Protects routes based on user authentication and role
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Component to render if authorized
 * @param {string} props.requiredRole - Required role (customer, admin, seller) or null for any authenticated user
 */
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, hasRole, loading, user } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If role is required and user doesn't have it, redirect to appropriate dashboard or login
  if (requiredRole && !hasRole(requiredRole)) {
    // Redirect to user's own dashboard if authenticated but wrong role
    const userRole = user?.role;
    if (userRole === 'customer') return <Navigate to="/customer" replace />;
    if (userRole === 'seller') return <Navigate to="/seller" replace />;
    if (userRole === 'admin') return <Navigate to="/admin" replace />;
    return <Navigate to="/" replace />;
  }

  // User is authenticated and has required role
  return children;
};

export default ProtectedRoute;