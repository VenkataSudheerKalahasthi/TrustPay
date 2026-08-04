import { AnimatedLogo3D } from './AnimatedLogo3D';

export function EnterpriseFooter() {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-12 px-4 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <AnimatedLogo3D className="w-8 h-8" />
          <span className="font-extrabold text-white text-base tracking-tight">TrustPay Enterprise</span>
        </div>
        <p className="text-slate-500">© 2026 TrustPay Inc. All rights reserved. ISO 27001 Certified Escrow Infrastructure.</p>
        <div className="flex gap-4">
          <a href="/auth/login" className="hover:text-white">Portal Sign In</a>
          <a href="/auth/register" className="hover:text-white">Register</a>
        </div>
      </div>
    </footer>
  );
}
