import { Shield } from 'lucide-react';

export function AnimatedLogo3D({ className = 'w-10 h-10' }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <div className="absolute inset-0 bg-sky-500/20 rounded-full blur-md animate-pulse" />
      <Shield className="w-full h-full text-sky-400 dark:text-primary-400 drop-shadow-[0_0_12px_rgba(14,165,233,0.8)] transform hover:rotate-6 transition-transform duration-300" />
    </div>
  );
}
