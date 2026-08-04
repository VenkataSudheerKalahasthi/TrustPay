import { Building2, Mail, MapPin, FileCheck } from 'lucide-react';

export function BillingProfileCard({ profile, onEdit }) {
  if (!profile) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Building2 className="w-5 h-5 text-sky-400" />
          Corporate Billing Profile
        </h3>
        {onEdit && (
          <button
            onClick={onEdit}
            className="text-xs font-semibold text-sky-400 hover:text-sky-300 transition-colors"
          >
            Edit Profile
          </button>
        )}
      </div>

      <div className="space-y-3 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-slate-500" />
          <span className="text-white font-medium">{profile.companyName || 'Individual Entity'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-slate-500" />
          <span>{profile.billingEmail}</span>
        </div>
        {profile.gstNumber && (
          <div className="flex items-center gap-2 font-mono text-emerald-400">
            <FileCheck className="w-4 h-4" />
            <span>GSTIN: {profile.gstNumber}</span>
          </div>
        )}
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-slate-500 mt-0.5" />
          <span>
            {profile.billingAddress || 'No address registered'} {profile.city ? `, ${profile.city}` : ''} {profile.state ? `, ${profile.state}` : ''} {profile.country}
          </span>
        </div>
      </div>
    </div>
  );
}
