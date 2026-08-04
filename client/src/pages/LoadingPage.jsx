import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

/**
 * App Loading Screen
 *
 * Shown during initial app load, route transitions, or
 * when waiting for async data before rendering.
 */
export function LoadingPage({ message = 'Loading TrustPay...' }) {
  return (
    <div
      id="loading-page"
      className="fixed inset-0 z-[9999] bg-surface-950 flex flex-col items-center justify-center"
    >
      {/* Animated logo */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'backOut' }}
        className="mb-8"
      >
        <div className="relative">
          {/* Outer pulse ring */}
          <motion.div
            animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 rounded-3xl bg-gradient-brand blur-md"
          />
          <div className="relative w-20 h-20 rounded-3xl bg-gradient-brand flex items-center justify-center shadow-glow-lg">
            <Shield className="w-10 h-10 text-white" />
          </div>
        </div>
      </motion.div>

      {/* Brand name */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="text-center"
      >
        <h1 className="font-display font-bold text-3xl text-surface-50 mb-1">
          Trust<span className="gradient-text">Pay</span>
        </h1>
        <p className="text-surface-500 text-sm">Secure Contract & Escrow Platform</p>
      </motion.div>

      {/* Loading indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 flex flex-col items-center gap-3"
      >
        <div className="relative w-48 h-1 bg-surface-800 rounded-full overflow-hidden">
          <motion.div
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-y-0 w-1/2 bg-gradient-brand rounded-full"
          />
        </div>
        <p className="text-surface-500 text-xs">{message}</p>
      </motion.div>
    </div>
  );
}
