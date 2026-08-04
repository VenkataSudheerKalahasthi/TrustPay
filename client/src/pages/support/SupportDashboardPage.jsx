import { useState, useEffect } from 'react';
import { Headset, Sparkles, AlertTriangle, ShieldCheck, FileText } from 'lucide-react';
import { supportService } from '@services/support.service';
import { SupportDashboardCard } from '@components/support/SupportDashboardCard';
import { CustomerHealthCard } from '@components/support/CustomerHealthCard';
import { TicketCard } from '@components/support/TicketCard';

export function SupportDashboardPage() {
  const [tickets, setTickets] = useState([]);
  const [health, setHealth] = useState(null);
  const [aiInsights, setAiInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [tcks, hlth, ins] = await Promise.all([
        supportService.getTickets().catch(() => []),
        supportService.getCustomerHealth().catch(() => null),
        supportService.getAIInsights().catch(() => null),
      ]);
      setTickets(tcks);
      setHealth(hlth);
      setAiInsights(ins);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const openTicketsCount = tickets.filter((t) => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length;
  const escalatedCount = tickets.filter((t) => t.status === 'ESCALATED').length;
  const resolvedCount = tickets.filter((t) => t.status === 'RESOLVED' || t.status === 'CLOSED').length;

  return (
    <div className={`space-y-8 pb-12 transition-opacity ${loading ? 'opacity-50' : ''}`}>
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950/40 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-widest text-sky-400">Enterprise Service Ops</span>
          <h1 className="text-3xl md:text-4xl font-black text-white mt-1">Customer Success & Support Desk</h1>
          <p className="text-slate-300 text-sm md:text-base mt-2">
            Integrated service desk operations, SLA monitoring, contract disputes, knowledge base search, and AI advisory recommendations.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <SupportDashboardCard title="Active Tickets" count={openTicketsCount} subtitle="Open & In-Progress" icon={Headset} color="sky" />
        <SupportDashboardCard title="Escalations" count={escalatedCount} subtitle="Requires Supervisor" icon={AlertTriangle} color="rose" />
        <SupportDashboardCard title="Resolved Tickets" count={resolvedCount} subtitle="Satisfied Customers" icon={ShieldCheck} color="emerald" />
        <SupportDashboardCard title="Health Score" count={`${health?.healthScore || 98}%`} subtitle="CSAT Index" icon={FileText} color="purple" />
      </div>

      {/* Grid: Health Card & AI Advisory */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CustomerHealthCard health={health} />

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-sky-500/10 text-sky-400 rounded-xl">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">AI Advisory Support Insights</h3>
              <p className="text-xs text-slate-400">Automated SLA risk detection & dispute recommendations</p>
            </div>
          </div>

          <div className="space-y-3">
            {aiInsights?.insights?.length > 0 ? (
              aiInsights.insights.map((ins) => (
                <div key={ins.id} className="bg-slate-800/40 border border-slate-800 rounded-xl p-4">
                  <h4 className="text-sm font-bold text-white mb-1">{ins.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{ins.recommendation}</p>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-xs italic">All customer support SLA targets are on track.</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Tickets Feed */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white">Recent Support Tickets</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tickets.length === 0 ? (
            <div className="col-span-full py-12 text-center border border-dashed border-slate-800 rounded-xl">
              <Headset className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-400 font-medium text-sm">No tickets found</p>
            </div>
          ) : (
            tickets.slice(0, 6).map((t) => <TicketCard key={t.id} ticket={t} />)
          )}
        </div>
      </div>
    </div>
  );
}
