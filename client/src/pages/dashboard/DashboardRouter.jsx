import { Navigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { PageLoader } from '@components/error/PageLoader';

export function DashboardRouter() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <PageLoader message="Initializing User Workspace..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role) {
    case 'ADMIN':
      return <Navigate to="/dashboard/admin" replace />;
    case 'WORKER':
      return <Navigate to="/dashboard/worker" replace />;
    case 'CLIENT':
    default:
      return <Navigate to="/dashboard/client" replace />;
  }
}
