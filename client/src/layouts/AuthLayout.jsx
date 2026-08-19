import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@constants';

/**
 * AuthLayout
 *
 * Clean, centered layout for authentication pages (login, register,
 * forgot password, reset password). Features a subtle background
 * gradient and centered card container.
 *
 * Will be used in Phase 1 Part 2.
 */
export function AuthLayout() {
  return (
    <div
      id="auth-layout"
      className="min-h-screen bg-surface-950 flex items-center justify-center px-4 py-16 relative overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link
            to={ROUTES.HOME}
            className="inline-flex items-center gap-2 group"
            id="auth-logo"
          >
            <div className="w-10 h-10 rounded-2xl bg-primary-500 flex items-center justify-center shadow-sm transition-shadow duration-300">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-2xl text-surface-50">
              Trust<span className="gradient-text">Pay</span>
            </span>
          </Link>
        </div>

        {/* Auth Card */}
        <div className="glass-card p-8 shadow-glow">
          <Outlet />
        </div>
      </motion.div>
    </div>
  );
}

