import { useState, useEffect } from 'react';
import { financeService } from '@services/finance.service';
import { FileText, Plus, Download } from 'lucide-react';

export function FinancialReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await financeService.getReports();
      setReports(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleGenerateReport = async () => {
    try {
      await financeService.generateReport({
        title: `P&L Executive Summary ${new Date().toLocaleDateString()}`,
        reportType: 'PROFIT_LOSS',
        startDate: '2026-01-01',
        endDate: '2026-12-31',
      });
      fetchReports();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className={`space-y-8 pb-12 transition-opacity ${loading ? 'opacity-50' : ''}`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-sky-400 dark:text-primary-400" />
            Executive Financial Reporting
          </h1>
          <p className="text-slate-400 text-sm">Generate P&L statements, cash flow summaries, and audit ledgers</p>
        </div>

        <button
          onClick={handleGenerateReport}
          className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-sky-600/20"
        >
          <Plus className="w-4 h-4" />
          Generate P&L Report
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-800/60 text-slate-400 text-xs font-semibold uppercase">
            <tr>
              <th className="py-3.5 px-4">Report Title</th>
              <th className="py-3.5 px-4">Type</th>
              <th className="py-3.5 px-4 font-mono">Revenue</th>
              <th className="py-3.5 px-4 font-mono">Expense</th>
              <th className="py-3.5 px-4 font-mono">Net Profit</th>
              <th className="py-3.5 px-4 font-mono">Generated At</th>
              <th className="py-3.5 px-4 text-right">Download</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {reports.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-500 font-medium">
                  No financial reports generated yet
                </td>
              </tr>
            ) : (
              reports.map((rep) => (
                <tr key={rep.id} className="hover:bg-slate-800/30">
                  <td className="py-3.5 px-4 font-bold text-white">{rep.title}</td>
                  <td className="py-3.5 px-4 text-xs font-bold text-sky-400 dark:text-primary-400">{rep.reportType}</td>
                  <td className="py-3.5 px-4 font-mono text-emerald-400 font-bold">₹{rep.totalRevenue.toLocaleString()}</td>
                  <td className="py-3.5 px-4 font-mono text-rose-400 font-bold">₹{rep.totalExpense.toLocaleString()}</td>
                  <td className="py-3.5 px-4 font-mono text-white font-bold">₹{rep.netProfit.toLocaleString()}</td>
                  <td className="py-3.5 px-4 text-xs font-mono text-slate-400">
                    {new Date(rep.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button className="p-1.5 text-slate-400 hover:text-white transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
