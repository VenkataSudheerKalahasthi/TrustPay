import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, Briefcase, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '@contexts/AuthContext';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { ROUTES, USER_ROLES } from '@constants';

const registerSchema = z
  .object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    phone: z
      .string()
      .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number')
      .optional()
      .or(z.literal('')),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/\d/, 'Password must contain at least one number')
      .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
    confirmPassword: z.string(),
    role: z.enum([USER_ROLES.CLIENT, USER_ROLES.WORKER]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export function RegisterPage() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(USER_ROLES.CLIENT);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: USER_ROLES.CLIENT,
    },
  });

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setValue('role', role);
  };

  const onSubmit = async (data) => {
    setServerError('');
    try {
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        phone: data.phone || undefined,
        role: data.role,
      };
      await registerUser(payload);
      navigate(ROUTES.HOME, { replace: true });
    } catch (err) {
      setServerError(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-surface-900 font-display">Create Account</h1>
        <p className="text-sm text-surface-500 mt-1">Join TrustPay for secure digital contracts & escrow</p>
      </div>

      {serverError && (
        <div className="mb-6 p-4 rounded-xl bg-danger-50 border border-danger-200 text-danger-700 text-sm flex items-start gap-2">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Role Selection Tabs */}
      <div className="mb-6 grid grid-cols-2 gap-3 p-1 bg-surface-100 rounded-xl border border-surface-200">
        <button
          type="button"
          onClick={() => handleRoleSelect(USER_ROLES.CLIENT)}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
            selectedRole === USER_ROLES.CLIENT
              ? 'bg-card text-primary-600 shadow-sm border border-surface-200'
              : 'text-surface-500 hover:text-surface-900'
          }`}
        >
          <ShieldCheck size={16} />
          I'm a Client
        </button>
        <button
          type="button"
          onClick={() => handleRoleSelect(USER_ROLES.WORKER)}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
            selectedRole === USER_ROLES.WORKER
              ? 'bg-card text-primary-600 shadow-sm border border-surface-200'
              : 'text-surface-500 hover:text-surface-900'
          }`}
        >
          <Briefcase size={16} />
          I'm a Worker
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="First Name"
            placeholder="Rahul"
            leftIcon={<User size={16} />}
            error={errors.firstName?.message}
            {...register('firstName')}
          />
          <Input
            label="Last Name"
            placeholder="Mehta"
            error={errors.lastName?.message}
            {...register('lastName')}
          />
        </div>

        <Input
          label="Email Address"
          type="email"
          placeholder="rahul@example.com"
          leftIcon={<Mail size={16} />}
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Phone Number (Optional)"
          type="tel"
          placeholder="9876543210"
          leftIcon={<Phone size={16} />}
          error={errors.phone?.message}
          {...register('phone')}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Min. 8 chars, A-Z, 0-9, @#$"
          leftIcon={<Lock size={16} />}
          error={errors.password?.message}
          {...register('password')}
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Re-enter password"
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
          Create Account
        </Button>
      </form>

      <div className="mt-6 text-center text-xs text-surface-500">
        Already have an account?{' '}
        <Link to={ROUTES.LOGIN} className="text-primary-600 hover:text-primary-700 font-semibold">
          Sign In
        </Link>
      </div>
    </div>
  );
}
