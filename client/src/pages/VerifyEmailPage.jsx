import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@contexts/AuthContext';
import { Button } from '@components/ui/Button';
import { ROUTES } from '@constants';

export function VerifyEmailPage() {
  const { verifyEmail } = useAuth();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Verification token is missing from URL');
      return;
    }

    let isMounted = true;
    verifyEmail(token)
      .then((res) => {
        if (isMounted) {
          setStatus('success');
          setMessage(res.message || 'Email verified successfully!');
        }
      })
      .catch((err) => {
        if (isMounted) {
          setStatus('error');
          setMessage(err.message || 'Email verification failed. Link may be expired.');
        }
      });

    return () => {
      isMounted = false;
    };
  }, [token, verifyEmail]);

  return (
    <div className="text-center py-6">
      {status === 'loading' && (
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={36} className="animate-spin text-primary-400" />
          <h2 className="text-xl font-bold text-surface-50 font-display">Verifying Email...</h2>
          <p className="text-sm text-surface-400">Please wait while we confirm your email address.</p>
        </div>
      )}

      {status === 'success' && (
        <div>
          <div className="w-14 h-14 rounded-full bg-success-500/15 text-success-400 flex items-center justify-center mx-auto mb-4 border border-success-500/30">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="text-2xl font-bold text-surface-50 font-display mb-2">Email Verified!</h2>
          <p className="text-sm text-surface-300 mb-6">{message}</p>
          <Link to={ROUTES.HOME}>
            <Button variant="gradient" fullWidth>
              Go to Dashboard
            </Button>
          </Link>
        </div>
      )}

      {status === 'error' && (
        <div>
          <div className="w-14 h-14 rounded-full bg-danger-500/15 text-danger-400 flex items-center justify-center mx-auto mb-4 border border-danger-500/30">
            <AlertCircle size={32} />
          </div>
          <h2 className="text-2xl font-bold text-surface-50 font-display mb-2">Verification Failed</h2>
          <p className="text-sm text-surface-400 mb-6">{message}</p>
          <div className="space-y-3">
            <Link to={ROUTES.HOME}>
              <Button variant="outline" fullWidth>
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
