import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '@components/ui/Button';
import { Link } from 'react-router-dom';
import { ROUTES } from '@constants';

export function NotAuthorized() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <div className="p-4 rounded-3xl bg-danger-500/15 border border-danger-500/30 text-danger-400 mb-6 shadow-glow">
        <ShieldAlert size={48} />
      </div>
      <h1 className="text-3xl font-bold font-display text-surface-50">403 – Access Denied</h1>
      <p className="text-sm text-surface-400 mt-2 max-w-md leading-relaxed">
        You do not have the required permissions or role to access this portal or resource.
      </p>
      <Link to={ROUTES.HOME} className="mt-6">
        <Button variant="primary" size="md" leftIcon={<ArrowLeft size={16} />}>
          Back to Dashboard
        </Button>
      </Link>
    </div>
  );
}
