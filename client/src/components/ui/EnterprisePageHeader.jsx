export function EnterprisePageHeader({ title, description, icon: Icon, action }) {
  return (
    <div className="flex items-center justify-between pb-4 border-b border-slate-800">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          {Icon && <Icon className="w-6 h-6 text-sky-400" />}
          {title}
        </h1>
        {description && <p className="text-slate-400 text-sm">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
