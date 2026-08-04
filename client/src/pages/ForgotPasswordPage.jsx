import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '@contexts/AuthContext';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { ROUTES } from '@constants';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data) => {
    setServerError('');
    try {
      await forgotPassword(data.email);
      setSubmitted(true);
    } catch (err) {
      setServerError(err.message || 'Failed to request password reset.');
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-4">
        <div className="w-12 h-12 rounded-full bg-success-500/15 text-success-400 flex items-center justify-center mx-auto mb-4 border border-success-500/30">
          <CheckCircle2 size={24} />
        </div>
        <h2 className="text-xl font-bold text-surface-50 font-display mb-2">Check Your Email</h2>
        <p className="text-sm text-surface-300 mb-6">
          If an account exists for that email, we've sent password reset instructions.
        </p>
        <Link to={ROUTES.LOGIN}>
          <Button variant="outline" fullWidth leftIcon={<ArrowLeft size={16} />}>
            Back to Login
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-surface-50 font-display">Reset Password</h1>
        <p className="text-sm text-surface-400 mt-1">
          Enter your email and we'll send you a password reset link
        </p>
      </div>

      {serverError && (
        <div className="mb-6 p-4 rounded-xl bg-danger-500/10 border border-danger-500/30 text-danger-400 text-sm flex items-start gap-2">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Input
          label="Email Address"
          type="email"
          placeholder="name@example.com"
          leftIcon={<Mail size={16} />}
          error={errors.email?.message}
          {...register('email')}
        />

        <Button
          type="submit"
          variant="gradient"
          fullWidth
          loading={isSubmitting}
          className="mt-6"
        >
          Send Reset Link
        </Button>
      </form>

      <div className="mt-6 text-center text-xs">
        <Link to={ROUTES.LOGIN} className="text-surface-400 hover:text-surface-200 inline-flex items-center gap-1">
          <ArrowLeft size={12} /> Back to Sign In
        </Link>
      </div>
    </div>
  );
}
