import { useRouteError, Link, isRouteErrorResponse } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, RefreshCw, Bug } from 'lucide-react';
import { Button } from '@components/ui/Button';
import { ROUTES } from '@constants';

/**
 * Global Error Boundary Page (React Router errorElement)
 *
 * Catches route-level errors and renders a user-friendly error page.
 * Shows technical details in development only.
 */
export function ErrorPage() {
  const error = useRouteError();
  const isDev = import.meta.env.DEV;

  let title = 'Something went wrong';
  let message = 'An unexpected error occurred. Please try again.';
  let statusCode = null;

  if (isRouteErrorResponse(error)) {
    statusCode = error.status;
    if (error.status === 404) {
      title = 'Page not found';
      message = "The page you're looking for doesn't exist.";
    } else if (error.status === 401) {
      title = 'Unauthorized';
      message = 'You need to sign in to access this page.';
    } else if (error.status === 403) {
      title = 'Forbidden';
      message = "You don't have permission to access this page.";
    } else if (error.status >= 500) {
      title = 'Server error';
      message = 'Our servers encountered an error. Please try again later.';
    }
  }

  return (
    <div
      id="error-boundary-page"
      className="min-h-screen bg-surface-950 flex items-center justify-center px-4 relative overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-warning-500/8 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-lg relative z-10"
      >
        <div className="mb-6 flex justify-center">
          <div className="w-24 h-24 rounded-3xl bg-warning-500/15 border border-warning-500/30 flex items-center justify-center">
            <Bug className="w-12 h-12 text-warning-500" />
          </div>
        </div>

        {statusCode && (
          <p className="text-6xl font-display font-black text-warning-500/40 mb-2">{statusCode}</p>
        )}

        <h1 className="text-2xl sm:text-3xl font-display font-bold text-surface-100 mb-3">
          {title}
        </h1>
        <p className="text-surface-400 text-base mb-6 leading-relaxed">{message}</p>

        {/* Dev error details */}
        {isDev && error?.message && (
          <pre className="bg-surface-800 border border-surface-700 rounded-xl p-4 text-left text-xs text-danger-300 overflow-auto mb-6 text-wrap">
            {error.message}
            {error.stack && `\n\n${error.stack}`}
          </pre>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="primary"
            size="lg"
            leftIcon={<Home size={18} />}
            id="error-page-home-btn"
          >
            <Link to={ROUTES.HOME}>Go Home</Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            leftIcon={<RefreshCw size={18} />}
            onClick={() => window.location.reload()}
            id="error-page-retry-btn"
          >
            Retry
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
