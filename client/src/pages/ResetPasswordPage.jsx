import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '@contexts/AuthContext';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { ROUTES } from '@constants';

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/\d/, 'Password must contain at least one number')
      .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export function ResetPasswordPage() {
  const { resetPassword } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data) => {
    if (!token) {
      setServerError('Reset token is missing from the URL.');
      return;
    }

    setServerError('');
    try {
      await resetPassword({ token, password: data.password });
      setSuccess(true);
      setTimeout(() => {
        navigate(ROUTES.LOGIN, { replace: true });
      }, 3000);
    } catch (err) {
      setServerError(err.message || 'Failed to reset password. Token may be expired.');
    }
  };

  if (!token) {
    return (
      <div className="text-center py-4">
        <div className="w-12 h-12 rounded-full bg-danger-500/15 text-danger-600 flex items-center justify-center mx-auto mb-4 border border-danger-200">
          <AlertCircle size={24} />
        </div>
        <h2 className="text-xl font-bold text-surface-900 font-display mb-2">Invalid Link</h2>
        <p className="text-sm text-surface-700 mb-6">
          This password reset link is invalid or missing a token.
        </p>
        <Link to={ROUTES.FORGOT_PASSWORD}>
          <Button variant="primary" fullWidth>
            Request New Link
          </Button>
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center py-4">
        <div className="w-12 h-12 rounded-full bg-success-500/15 text-success-600 flex items-center justify-center mx-auto mb-4 border border-success-200">
          <CheckCircle2 size={24} />
        </div>
        <h2 className="text-xl font-bold text-surface-900 font-display mb-2">Password Reset Complete</h2>
        <p className="text-sm text-surface-700 mb-6">
          Your password has been reset successfully. Redirecting you to login...
        </p>
        <Link to={ROUTES.LOGIN}>
          <Button variant="primary" fullWidth>
            Go to Login
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-surface-900 font-display">New Password</h1>
        <p className="text-sm text-surface-600 mt-1">Enter your new password below</p>
      </div>

      {serverError && (
        <div className="mb-6 p-4 rounded-xl bg-danger-50 border border-danger-200 text-danger-600 text-sm flex items-start gap-2">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Input
          label="New Password"
          type="password"
          placeholder="Min. 8 chars, A-Z, 0-9, @#$"
          leftIcon={<Lock size={16} />}
          error={errors.password?.message}
          {...register('password')}
        />

        <Input
          label="Confirm New Password"
          type="password"
          placeholder="Re-enter new password"
          leftIcon={<Lock size={16} />}
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <Button
          type="submit"
          variant="gradient"
          fullWidth
          loading={isSubmitting}
          className="mt-6"
        >
          Reset Password
        </Button>
      </form>
    </div>
  );
}

