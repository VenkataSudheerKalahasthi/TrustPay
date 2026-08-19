import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '@contexts/AuthContext';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { ROUTES } from '@constants';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState('');

  const from = location.state?.from?.pathname || ROUTES.HOME;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setServerError('');
    try {
      await login(data);
      navigate(from, { replace: true });
    } catch (err) {
      setServerError(err.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-surface-50 font-display">Welcome Back</h1>
        <p className="text-sm text-surface-400 mt-1">Sign in to your TrustPay account</p>
      </div>

      {serverError && (
        <div className="mb-6 p-4 rounded-xl bg-danger-50 border border-danger-500/30 text-danger-500 text-sm flex items-start gap-2">
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

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium text-surface-200">Password</label>
            <Link
              to={ROUTES.FORGOT_PASSWORD}
              className="text-xs text-primary-500 hover:text-primary-600 font-medium transition-colors"
            >
              Forgot Password?
            </Link>
          </div>
          <Input
            type="password"
            placeholder="••••••••"
            leftIcon={<Lock size={16} />}
            error={errors.password?.message}
            {...register('password')}
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          loading={isSubmitting}
          rightIcon={<ArrowRight size={16} />}
          className="mt-6"
        >
          Sign In
        </Button>
      </form>

      <div className="mt-6 text-center text-xs text-surface-400">
        Don't have an account?{' '}
        <Link to={ROUTES.REGISTER} className="text-primary-400 hover:text-primary-300 font-semibold">
          Create Account
        </Link>
      </div>
    </div>
  );
}
