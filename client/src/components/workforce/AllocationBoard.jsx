import { User, Briefcase, Plus } from 'lucide-react';

export function AllocationBoard({ allocations = [], onAddAllocation }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-sky-400 dark:text-primary-400" />
            Resource Allocation Board
          </h3>
          <p className="text-slate-400 text-sm">Assign workforce capacity to active projects and tasks</p>
        </div>
        {onAddAllocation && (
          <button
            onClick={onAddAllocation}
            className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-lg text-sm transition-all shadow-md shadow-sky-600/20"
          >
            <Plus className="w-4 h-4" />
            Allocate Resource
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allocations.length === 0 ? (
          <div className="col-span-full py-12 text-center border border-dashed border-slate-800 rounded-xl">
            <User className="w-8 h-8 text-surface-600 mx-auto mb-2" />
            <p className="text-slate-400 font-medium">No work allocations configured</p>
          </div>
        ) : (
          allocations.map((alloc) => (
            <div key={alloc.id} className="bg-slate-800/40 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-sky-500/10 text-sky-400 dark:text-primary-400 flex items-center justify-center font-bold text-xs">
                    {alloc.workerUser?.firstName?.[0] || 'W'}
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-white">
                      {alloc.workerUser?.firstName} {alloc.workerUser?.lastName}
                    </h5>
                    <span className="text-[11px] text-slate-400">{alloc.role || 'Team Member'}</span>
                  </div>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-sky-400 dark:text-primary-400 font-semibold border border-slate-700">
                  {alloc.status}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
                <div className="flex justify-between">
                  <span className="text-slate-400">Allocated Hours:</span>
                  <span className="font-bold text-white">{alloc.allocatedHours}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Plan:</span>
                  <span className="text-slate-300">{alloc.capacityPlan?.name || 'General'}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
