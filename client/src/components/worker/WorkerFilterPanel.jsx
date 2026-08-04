import { useState } from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import { Button } from '@components/ui/Button';

export function WorkerFilterPanel({ categories = [], onApplyFilters, onResetFilters }) {
  const [category, setCategory] = useState('');
  const [minRate, setMinRate] = useState('');
  const [maxRate, setMaxRate] = useState('');
  const [minExp, setMinExp] = useState('');
  const [availability, setAvailability] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('');

  const handleApply = () => {
    onApplyFilters({
      category: category || undefined,
      minRate: minRate ? Number(minRate) : undefined,
      maxRate: maxRate ? Number(maxRate) : undefined,
      minExp: minExp ? Number(minExp) : undefined,
      availability: availability || undefined,
      verificationStatus: verificationStatus || undefined,
    });
  };

  const handleReset = () => {
    setCategory('');
    setMinRate('');
    setMaxRate('');
    setMinExp('');
    setAvailability('');
    setVerificationStatus('');
    onResetFilters();
  };

  return (
    <div className="glass-card p-5 flex flex-col gap-5 w-full">
      <div className="flex items-center justify-between border-b border-surface-800 pb-3">
        <div className="flex items-center gap-2 text-surface-100 font-bold text-sm">
          <Filter size={16} className="text-primary-400" />
          <span>Advanced Filters</span>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="text-2xs text-surface-400 hover:text-surface-200 flex items-center gap-1"
        >
          <RotateCcw size={12} />
          Reset All
        </button>
      </div>

      {/* Category Selection */}
      <div className="flex flex-col gap-1.5">
        <label className="text-2xs font-semibold text-surface-300 uppercase tracking-wider">
          Category
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2 text-xs bg-surface-950 border border-surface-800 rounded-xl text-surface-200 focus:outline-none focus:border-primary-500"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug || cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Hourly Rate Range */}
      <div className="flex flex-col gap-1.5">
        <label className="text-2xs font-semibold text-surface-300 uppercase tracking-wider">
          Hourly Rate (₹)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min Rate"
            value={minRate}
            onChange={(e) => setMinRate(e.target.value)}
            className="w-full px-3 py-1.5 text-xs bg-surface-950 border border-surface-800 rounded-xl text-surface-200 focus:outline-none focus:border-primary-500"
          />
          <input
            type="number"
            placeholder="Max Rate"
            value={maxRate}
            onChange={(e) => setMaxRate(e.target.value)}
            className="w-full px-3 py-1.5 text-xs bg-surface-950 border border-surface-800 rounded-xl text-surface-200 focus:outline-none focus:border-primary-500"
          />
        </div>
      </div>

      {/* Experience Level */}
      <div className="flex flex-col gap-1.5">
        <label className="text-2xs font-semibold text-surface-300 uppercase tracking-wider">
          Min Experience (Years)
        </label>
        <input
          type="number"
          placeholder="e.g. 3"
          value={minExp}
          onChange={(e) => setMinExp(e.target.value)}
          className="w-full px-3 py-1.5 text-xs bg-surface-950 border border-surface-800 rounded-xl text-surface-200 focus:outline-none focus:border-primary-500"
        />
      </div>

      {/* Availability */}
      <div className="flex flex-col gap-1.5">
        <label className="text-2xs font-semibold text-surface-300 uppercase tracking-wider">
          Availability Status
        </label>
        <select
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
          className="w-full px-3 py-2 text-xs bg-surface-950 border border-surface-800 rounded-xl text-surface-200 focus:outline-none focus:border-primary-500"
        >
          <option value="">Any Status</option>
          <option value="AVAILABLE">Available Now</option>
          <option value="BUSY">Busy</option>
          <option value="ON_VACATION">On Vacation</option>
          <option value="OFFLINE">Offline</option>
        </select>
      </div>

      {/* Verification Status */}
      <div className="flex flex-col gap-1.5">
        <label className="text-2xs font-semibold text-surface-300 uppercase tracking-wider">
          Verification
        </label>
        <select
          value={verificationStatus}
          onChange={(e) => setVerificationStatus(e.target.value)}
          className="w-full px-3 py-2 text-xs bg-surface-950 border border-surface-800 rounded-xl text-surface-200 focus:outline-none focus:border-primary-500"
        >
          <option value="">All Workers</option>
          <option value="VERIFIED">Verified Only</option>
          <option value="PENDING">Pending Verification</option>
        </select>
      </div>

      <Button type="button" variant="primary" size="sm" fullWidth onClick={handleApply}>
        Apply Filters
      </Button>
    </div>
  );
}
