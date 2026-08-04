import { TrendingUp } from 'lucide-react';

export function RevenueChart({ mrr = 150000, arr = 1800000 }) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const data = [110, 125, 130, 142, 148, 155, 160, 168, 175, 180, 185, 192];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            Recurring Revenue Velocity (MRR)
          </h3>
          <p className="text-xs text-slate-400">Monthly subscription growth trajectory</p>
        </div>

        <div className="text-right font-mono">
          <span className="text-2xl font-black text-emerald-400">₹{mrr.toLocaleString()}</span>
          <span className="text-xs text-slate-400 block">ARR: ₹{arr.toLocaleString()}</span>
        </div>
      </div>

      <div className="flex items-end justify-between gap-2 h-40 pt-6 border-t border-slate-800">
        {data.map((val, idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
            <div
              className="w-full bg-emerald-500/20 group-hover:bg-emerald-500 rounded-t transition-all"
              style={{ height: `${(val / 200) * 100}%` }}
            />
            <span className="text-[10px] text-slate-400 font-mono">{months[idx]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
