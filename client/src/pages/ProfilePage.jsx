import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  User as UserIcon,
  Mail,
  Phone,
  ShieldCheck,
  Briefcase,
  Lock,
  Camera,
  CheckCircle2,
  AlertCircle,
  LogOut,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '@contexts/AuthContext';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Card } from '@components/ui/Card';
import { Badge } from '@components/ui/Badge';
import { formatDate, getInitials } from '@utils';
import { createClient } from '@supabase/supabase-js';

// Supabase client for avatar uploads to profile-photos bucket
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = (supabaseUrl && supabaseAnonKey) ? createClient(supabaseUrl, supabaseAnonKey) : null;

const profileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number')
    .optional()
    .or(z.literal('')),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/\d/, 'Password must contain at least one number')
      .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export function ProfilePage() {
  const { user, updateProfile, changePassword, logout, logoutAll } = useAuth();

  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || '');

  // Profile Form
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors, isSubmitting: isSubmittingProfile },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
    },
  });

  // Change Password Form
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors, isSubmitting: isSubmittingPassword },
  } = useForm({
    resolver: zodResolver(passwordSchema),
  });

  // Avatar Upload to Supabase Storage bucket 'profile-photos'
  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setProfileError('Avatar size must be under 2MB');
      return;
    }

    setAvatarUploading(true);
    setProfileError('');
    try {
      if (!supabase) {
        // Fallback: convert to data URL for preview if Supabase config not present
        const reader = new FileReader();
        reader.onloadend = async () => {
          const url = reader.result;
          setAvatarUrl(url);
          await updateProfile({ avatar: url });
          setAvatarUploading(false);
        };
        reader.readAsDataURL(file);
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}_${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('profile-photos')
        .upload(fileName, file, { upsert: true });

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(data.path);

      const publicUrl = publicUrlData.publicUrl;
      setAvatarUrl(publicUrl);
      await updateProfile({ avatar: publicUrl });
      setProfileSuccess('Avatar updated successfully!');
    } catch (err) {
      setProfileError(err.message || 'Failed to upload avatar.');
    } finally {
      setAvatarUploading(false);
    }
  };

  const onUpdateProfile = async (data) => {
    setProfileSuccess('');
    setProfileError('');
    try {
      await updateProfile({
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone || null,
        avatar: avatarUrl || undefined,
      });
      setProfileSuccess('Profile details updated successfully!');
    } catch (err) {
      setProfileError(err.message || 'Failed to update profile.');
    }
  };

  const onChangePassword = async (data) => {
    setPasswordSuccess('');
    setPasswordError('');
    try {
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      setPasswordSuccess('Password updated successfully! Please sign in again.');
      resetPasswordForm();
    } catch (err) {
      setPasswordError(err.message || 'Failed to change password.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-surface-900 font-display tracking-tight">Account Profile</h1>
        <p className="text-surface-600 text-sm mt-1">Manage your personal identity, security settings, and sessions</p>
      </div>

      {/* User Summary Header Card */}
      <Card className="flex flex-col sm:flex-row items-center gap-6 p-6">
        <div className="relative group">
          <div className="w-24 h-24 rounded-full bg-gradient-brand flex items-center justify-center text-white text-2xl font-bold overflow-hidden shadow-sm">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              getInitials(`${user?.firstName} ${user?.lastName}`)
            )}
          </div>
          <label className="absolute inset-0 bg-card/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white">
            <Camera size={20} />
            <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
          </label>
        </div>

        <div className="flex-1 text-center sm:text-left space-y-2">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-xl font-bold text-surface-900">
              {user?.firstName} {user?.lastName}
            </h2>
            <Badge variant={user?.role === 'ADMIN' ? 'danger' : user?.role === 'WORKER' ? 'secondary' : 'primary'}>
              {user?.role === 'WORKER' ? <Briefcase size={12} /> : <ShieldCheck size={12} />}
              {user?.role}
            </Badge>
            {user?.isEmailVerified ? (
              <Badge variant="success">Verified</Badge>
            ) : (
              <Badge variant="warning">Unverified Email</Badge>
            )}
          </div>
          <p className="text-sm text-surface-600 flex items-center justify-center sm:justify-start gap-1.5">
            <Mail size={14} /> {user?.email}
          </p>
          <p className="text-xs text-surface-500">
            Member since {user?.createdAt ? formatDate(user.createdAt) : '2026'}
          </p>
        </div>

        <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
          <Button variant="ghost" size="sm" onClick={logout} leftIcon={<LogOut size={14} />}>
            Sign Out
          </Button>
        </div>
      </Card>

      {/* Profile Details Form */}
      <Card padded={true}>
        <Card.Header>
          <Card.Title className="flex items-center gap-2">
            <UserIcon size={18} className="text-primary-600" />
            Personal Details
          </Card.Title>
        </Card.Header>

        {profileSuccess && (
          <div className="mb-4 p-3 rounded-xl bg-success-50 border border-success-200 text-success-700 text-sm flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{profileSuccess}</span>
          </div>
        )}
        {profileError && (
          <div className="mb-4 p-3 rounded-xl bg-danger-50 border border-danger-200 text-danger-700 text-sm flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{profileError}</span>
          </div>
        )}

        <form onSubmit={handleSubmitProfile(onUpdateProfile)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="First Name"
              error={profileErrors.firstName?.message}
              {...registerProfile('firstName')}
            />
            <Input
              label="Last Name"
              error={profileErrors.lastName?.message}
              {...registerProfile('lastName')}
            />
          </div>

          <Input
            label="Phone Number"
            placeholder="10-digit Indian mobile number"
            leftIcon={<Phone size={16} />}
            error={profileErrors.phone?.message}
            {...registerProfile('phone')}
          />

          <div className="pt-2 flex justify-end">
            <Button type="submit" variant="primary" loading={isSubmittingProfile || avatarUploading}>
              Save Profile
            </Button>
          </div>
        </form>
      </Card>

      {/* Security & Change Password */}
      <Card padded={true}>
        <Card.Header>
          <Card.Title className="flex items-center gap-2">
            <Lock size={18} className="text-secondary-600" />
            Security & Password
          </Card.Title>
        </Card.Header>

        {passwordSuccess && (
          <div className="mb-4 p-3 rounded-xl bg-success-50 border border-success-200 text-success-700 text-sm flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{passwordSuccess}</span>
          </div>
        )}
        {passwordError && (
          <div className="mb-4 p-3 rounded-xl bg-danger-50 border border-danger-200 text-danger-700 text-sm flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{passwordError}</span>
          </div>
        )}

        <form onSubmit={handleSubmitPassword(onChangePassword)} className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            error={passwordErrors.currentPassword?.message}
            {...registerPassword('currentPassword')}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="New Password"
              type="password"
              placeholder="Min 8 chars, A-Z, 0-9, @#$"
              error={passwordErrors.newPassword?.message}
              {...registerPassword('newPassword')}
            />
            <Input
              label="Confirm New Password"
              type="password"
              error={passwordErrors.confirmPassword?.message}
              {...registerPassword('confirmPassword')}
            />
          </div>

          <div className="pt-2 flex justify-end">
            <Button type="submit" variant="secondary" loading={isSubmittingPassword}>
              Update Password
            </Button>
          </div>
        </form>

        <Card.Footer className="justify-between flex-wrap">
          <div>
            <p className="text-sm font-medium text-surface-900">Active Sessions</p>
            <p className="text-xs text-surface-600">Log out from all other devices & browsers</p>
          </div>
          <Button variant="danger" size="sm" onClick={logoutAll} leftIcon={<ShieldAlert size={14} />}>
            Logout All Devices
          </Button>
        </Card.Footer>
      </Card>
    </div>
  );
}

