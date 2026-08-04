export function AnimatedStatistics() {
  const stats = [
    { label: 'Total Escrow Secured', value: '₹500M+' },
    { label: 'Active Contracts', value: '1,400+' },
    { label: 'Dispute SLA Resolution', value: '98.4%' },
    { label: 'Enterprise Retention', value: '99.2%' },
  ];

  return (
    <div className="bg-slate-900/60 border-y border-slate-800/80 py-12 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((s, idx) => (
          <div key={idx} className="space-y-1">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{s.value}</h3>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
