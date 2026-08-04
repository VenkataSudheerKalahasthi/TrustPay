import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@components/ui/Button';
import { ROUTES } from '@constants';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-md w-full glass-card p-8 flex flex-col items-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-surface-800 border border-surface-700 flex items-center justify-center text-primary-400 mb-6 shadow-glow">
          <Home size={32} />
        </div>
        <h1 className="text-4xl font-bold font-display text-surface-50">404</h1>
        <h2 className="text-lg font-semibold text-surface-200 mt-2">Page Not Found</h2>
        <p className="text-xs text-surface-400 mt-2 leading-relaxed">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="flex items-center gap-3 mt-6 w-full">
          <Link to={ROUTES.HOME} className="flex-1">
            <Button variant="primary" fullWidth leftIcon={<ArrowLeft size={16} />}>
              Return Home
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
