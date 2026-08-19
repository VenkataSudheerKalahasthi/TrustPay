import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, RefreshCw, AlertTriangle } from 'lucide-react';
import { Button } from '@components/ui/Button';
import { ROUTES } from '@constants';

/**
 * 500 Server Error Page
 */
export function ServerErrorPage() {
  const handleRefresh = () => window.location.reload();

  return (
    <div
      id="server-error-page"
      className="min-h-screen bg-card flex items-center justify-center px-4 relative overflow-hidden"
    >
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-danger-600/8 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-lg relative z-10"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6 flex justify-center"
        >
          <div className="w-28 h-28 rounded-3xl bg-danger-500/15 border border-danger-200 flex items-center justify-center">
            <AlertTriangle className="w-14 h-14 text-danger-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <span className="text-[8rem] font-display font-black leading-none text-danger-500/40 select-none">
            500
          </span>
        </motion.div>

        <h1 className="text-2xl sm:text-3xl font-display font-bold text-surface-900 mb-3">
          Something went wrong
        </h1>
        <p className="text-surface-600 text-base mb-8 leading-relaxed">
          Our servers encountered an unexpected error. Our team has been notified.
          Please try again in a few moments.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="danger"
            size="lg"
            leftIcon={<RefreshCw size={18} />}
            onClick={handleRefresh}
            id="server-error-refresh-btn"
          >
            Try Again
          </Button>
          <Button
            variant="outline"
            size="lg"
            leftIcon={<Home size={18} />}
            id="server-error-home-btn"
          >
            <Link to={ROUTES.HOME}>Go Home</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

