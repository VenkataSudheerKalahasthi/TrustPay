import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { cn } from '@utils';

/**
 * Reusable PageHeader Component
 *
 * Provides a consistent, responsive header across all dashboard & application pages.
 * Supports title, subtitle, breadcrumb trail, status badge, and action buttons.
 *
 * @param {object} props
 * @param {string | React.ReactNode} props.title - Page title
 * @param {string | React.ReactNode} [props.subtitle] - Subtitle or description
 * @param {Array<{ label: string, href?: string }>} [props.breadcrumbs] - Breadcrumb path items
 * @param {React.ReactNode} [props.actions] - Right-hand action buttons/controls
 * @param {React.ReactNode} [props.badge] - Optional status badge or tag
 * @param {React.ReactNode} [props.icon] - Optional title icon
 * @param {string} [props.className] - Additional styling
 */
export function PageHeader({
  title,
  subtitle,
  breadcrumbs = [],
  actions,
  badge,
  icon: Icon,
  className,
}) {
  return (
    <div className={cn('flex flex-col gap-3 w-full', className)}>
      {/* Breadcrumb Trail */}
      {breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-surface-400 font-medium overflow-x-auto scrollbar-hide">
          <Link to="/" className="hover:text-surface-200 transition-colors">
            Home
          </Link>
          {breadcrumbs.map((item, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <div key={idx} className="flex items-center gap-1.5 whitespace-nowrap">
                <ChevronRight size={12} className="text-surface-600 shrink-0" />
                {item.href && !isLast ? (
                  <Link to={item.href} className="hover:text-surface-200 transition-colors">
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-surface-200 font-semibold">{item.label}</span>
                )}
              </div>
            );
          })}
        </nav>
      )}

      {/* Main Header Content */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3 flex-wrap">
            {Icon && (
              <div className="p-2 rounded-xl bg-primary-500/10 text-primary-400 border border-primary-500/20 shrink-0">
                <Icon size={22} />
              </div>
            )}
            <h1 className="text-2xl sm:text-3xl font-bold text-surface-50 font-display tracking-tight">
              {title}
            </h1>
            {badge && <div className="shrink-0">{badge}</div>}
          </div>

          {subtitle && (
            <p className="text-xs text-surface-400 max-w-3xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* Action Buttons Slot */}
        {actions && (
          <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
