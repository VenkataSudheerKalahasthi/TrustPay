import { AnimatedLogo3D } from './AnimatedLogo3D';
import { ShieldCheck, Lock, ArrowRight, Zap } from 'lucide-react';

export function LandingHero3D() {
  return (
    <div className="relative overflow-hidden py-24 px-4 sm:px-6 lg:px-8 text-center space-y-8 bg-slate-950">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold uppercase tracking-wider">
        <Zap className="w-4 h-4 fill-sky-400" />
        Next-Generation Enterprise Escrow Platform
      </div>

      <div className="flex justify-center">
        <AnimatedLogo3D className="w-24 h-24" />
      </div>

      <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight max-w-4xl mx-auto">
        Autonomous <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-purple-400 to-emerald-400">Escrow & Milestone</span> Payments
      </h1>

      <p className="text-slate-400 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed">
        TrustPay guarantees secure B2B payments, contingent workforce compliance, digital smart contracts, and real-time automated milestone releases.
      </p>

      <div className="flex flex-wrap justify-center gap-4 pt-4">
        <a
          href="/auth/register"
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl transition-all shadow-xl shadow-sky-600/30"
        >
          Get Started Enterprise Free <ArrowRight className="w-4 h-4" />
        </a>
        <a
          href="#workflow"
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold rounded-xl border border-slate-800 transition-all"
        >
          Explore Workflow
        </a>
      </div>

      <div className="flex justify-center items-center gap-6 text-xs text-slate-400 pt-6">
        <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% Escrow Protected</span>
        <span className="flex items-center gap-1.5"><Lock className="w-4 h-4 text-sky-400" /> ISO 27001 Security</span>
      </div>
    </div>
  );
}
