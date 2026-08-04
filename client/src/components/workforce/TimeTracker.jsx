import { useState, useEffect } from 'react';
import { Play, Square, Clock, Coffee } from 'lucide-react';
import { workforceService } from '@services/workforce.service';

export function TimeTracker({ activeClock, onStateChange }) {
  const [loading, setLoading] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    let interval = null;
    if (activeClock && activeClock.clockIn && !activeClock.clockOut) {
      const startMs = new Date(activeClock.clockIn).getTime();
      interval = setInterval(() => {
        const nowMs = new Date().getTime();
        const diffSecs = Math.max(0, Math.floor((nowMs - startMs) / 1000) - (activeClock.breakMinutes || 0) * 60);
        setElapsedSeconds(diffSecs);
      }, 1000);
    } else {
      setElapsedSeconds(0);
    }
    return () => clearInterval(interval);
  }, [activeClock]);

  const formatTimer = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleClockIn = async () => {
    try {
      setLoading(true);
      await workforceService.clockIn({ isBillable: true });
      if (onStateChange) onStateChange();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    try {
      setLoading(true);
      await workforceService.clockOut();
      if (onStateChange) onStateChange();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePause = async () => {
    try {
      setLoading(true);
      await workforceService.pauseResume({ breakMinutes: 15, notes: 'Short Break' });
      if (onStateChange) onStateChange();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const isClockedIn = Boolean(activeClock && !activeClock.clockOut);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-4">
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
            isClockedIn ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 animate-pulse' : 'bg-slate-800 text-slate-400'
          }`}
        >
          <Clock className="w-7 h-7" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Live Time Tracking</span>
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                isClockedIn ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {isClockedIn ? 'ACTIVE SESSION' : 'OFF THE CLOCK'}
            </span>
          </div>
          <div className="text-3xl font-black font-mono text-white tracking-wider mt-1">
            {isClockedIn ? formatTimer(elapsedSeconds) : '00:00:00'}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto">
        {!isClockedIn ? (
          <button
            onClick={handleClockIn}
            disabled={loading}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-emerald-600/25 disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-current" />
            Clock In
          </button>
        ) : (
          <>
            <button
              onClick={handlePause}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-semibold text-sm rounded-xl border border-amber-500/30 transition-all disabled:opacity-50"
            >
              <Coffee className="w-4 h-4" />
              Pause
            </button>
            <button
              onClick={handleClockOut}
              disabled={loading}
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-rose-600/25 disabled:opacity-50"
            >
              <Square className="w-4 h-4 fill-current" />
              Clock Out
            </button>
          </>
        )}
      </div>
    </div>
  );
}
