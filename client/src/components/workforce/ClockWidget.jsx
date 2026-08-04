import { Clock } from 'lucide-react';

export function ClockWidget({ activeClock }) {
  const isClockedIn = Boolean(activeClock && !activeClock.clockOut);

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
        isClockedIn
          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-sm shadow-emerald-500/20'
          : 'bg-slate-800 text-slate-400 border-slate-700'
      }`}
    >
      <Clock className={`w-3.5 h-3.5 ${isClockedIn ? 'animate-spin' : ''}`} />
      <span>{isClockedIn ? 'Clocked In' : 'Off Clock'}</span>
    </div>
  );
}
