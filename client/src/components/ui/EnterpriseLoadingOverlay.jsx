export function EnterpriseLoadingOverlay({ message = 'Loading enterprise telemetry...' }) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 space-y-4">
      <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-xs font-bold text-white tracking-wide">{message}</p>
    </div>
  );
}
