import { Navigate, useLocation } from 'react-router-dom';
import { ROUTES } from '@constants';
import { useAuth } from '@contexts/AuthContext';

/**
 * ProtectedRoute
 *
 * Guards routes that require authentication and role permissions.
 *
 * @param {{ children: React.ReactNode, allowedRoles?: string[] }} props
 */
export function ProtectedRoute({ children, allowedRoles = [] }) {
  const location = useLocation();
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-surface-400">Loading session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return children;
}
