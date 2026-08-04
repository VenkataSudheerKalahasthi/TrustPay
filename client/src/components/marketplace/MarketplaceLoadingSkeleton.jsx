export function MarketplaceLoadingSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="p-5 rounded-2xl bg-surface-900 border border-surface-800 space-y-4 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="h-4 w-3/4 bg-surface-800 rounded-lg" />
            <div className="h-4 w-12 bg-surface-800 rounded-lg" />
          </div>
          <div className="h-12 w-full bg-surface-800 rounded-lg" />
          <div className="flex justify-between pt-2">
            <div className="h-3 w-1/3 bg-surface-800 rounded" />
            <div className="h-3 w-1/4 bg-surface-800 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
