import { FileQuestion, Home } from 'lucide-react';
import { Button } from '@components/ui/Button';
import { Link } from 'react-router-dom';
import { ROUTES } from '@constants';

export function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <div className="p-4 rounded-3xl bg-surface-50 border border-surface-300 text-primary-600 mb-6">
        <FileQuestion size={48} />
      </div>
      <h1 className="text-3xl font-bold font-display text-surface-900">404 – Page Not Found</h1>
      <p className="text-sm text-surface-600 mt-2 max-w-md leading-relaxed">
        The page or section you requested does not exist or has been moved.
      </p>
      <Link to={ROUTES.HOME} className="mt-6">
        <Button variant="primary" size="md" leftIcon={<Home size={16} />}>
          Return Home
        </Button>
      </Link>
    </div>
  );
}

