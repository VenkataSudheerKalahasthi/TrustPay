import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@constants';

export function AuthLayout() {
  return (
    <div id="auth-layout" className="min-h-screen bg-surface-50 dark:bg-surface-50 flex overflow-hidden transition-colors duration-300">
      
      {/* Left Panel - Visual/Trust Statement (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-brand dark:bg-none dark:bg-gradient-to-br dark:from-[#020403] dark:via-[#07100B] dark:to-[#020403] relative flex-col justify-between p-12 text-white transition-all duration-300">
        {/* Background glow effects */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-white/10 dark:bg-primary-600/5 rounded-full blur-3xl" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary-400/20 dark:bg-primary-600/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          <Link to={ROUTES.HOME} className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-2xl bg-white/20 dark:bg-primary-600/10 backdrop-blur-md flex items-center justify-center border border-white/30 dark:border-primary-600/20">
              <Shield className="w-5 h-5 text-white dark:text-primary-600" />
            </div>
            <span className="font-display font-bold text-2xl text-white">
              Trust<span className="dark:text-primary-600">Pay</span>
            </span>
          </Link>
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl font-display font-bold mb-6 leading-tight text-white">
            The premium standard for digital escrow and contracts.
          </h1>
          <p className="text-primary-100 dark:text-surface-700 text-lg mb-8 font-medium">
            Join thousands of enterprises and freelancers managing payments securely with automated milestones and compliance.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-accent-300 dark:text-primary-600 w-5 h-5 shrink-0" />
              <span className="text-primary-50 dark:text-white font-medium">Bank-grade security & encryption</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-accent-300 dark:text-primary-600 w-5 h-5 shrink-0" />
              <span className="text-primary-50 dark:text-white font-medium">Automated milestone payouts</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-accent-300 dark:text-primary-600 w-5 h-5 shrink-0" />
              <span className="text-primary-50 dark:text-white font-medium">Global compliance out-of-the-box</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-sm text-primary-200 dark:text-surface-500 font-medium">
          <span>© {new Date().getFullYear()} TrustPay Inc.</span>
          <a href="#" className="hover:text-white dark:hover:text-surface-300 transition-colors">Privacy</a>
          <a href="#" className="hover:text-white dark:hover:text-surface-300 transition-colors">Terms</a>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 relative bg-surface-50 dark:bg-[#050A07] transition-colors duration-300">
        {/* Mobile Header (Only visible on small screens) */}
        <div className="absolute top-6 left-6 lg:hidden">
          <Link to={ROUTES.HOME} className="inline-flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-brand dark:bg-primary-600/10 dark:border dark:border-primary-600/20 flex items-center justify-center shadow-sm">
              <Shield className="w-4 h-4 text-white dark:text-primary-600" />
            </div>
            <span className="font-display font-bold text-xl text-surface-900">
              Trust<span className="dark:text-primary-600">Pay</span>
            </span>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="bg-card dark:bg-[#0A120E] p-8 sm:p-10 rounded-3xl shadow-xl border border-surface-200/60 dark:border-[rgba(255,255,255,0.12)] transition-colors duration-300">
            <Outlet />
          </div>
        </motion.div>
      </div>

    </div>
  );
}
