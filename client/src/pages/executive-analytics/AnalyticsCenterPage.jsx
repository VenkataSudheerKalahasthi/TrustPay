import { FinanceAnalyticsChart } from '@components/executive-analytics/FinanceAnalyticsChart';
import { ProjectAnalyticsChart } from '@components/executive-analytics/ProjectAnalyticsChart';
import { OrganizationAnalyticsChart } from '@components/executive-analytics/OrganizationAnalyticsChart';
import { PieChart } from 'lucide-react';

export function AnalyticsCenterPage() {
  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <PieChart className="w-6 h-6 text-sky-400 dark:text-primary-400" />
          Enterprise Analytics Center Directory
        </h1>
        <p className="text-slate-400 text-sm">Deep-dive domain analytics synthesising finance, projects, and organization metrics</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <FinanceAnalyticsChart />
        <ProjectAnalyticsChart />
        <OrganizationAnalyticsChart />
      </div>
    </div>
  );
}
