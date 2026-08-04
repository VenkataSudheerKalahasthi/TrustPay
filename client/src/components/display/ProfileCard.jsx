import { Card } from '@components/ui/Card';
import { Avatar } from '@components/ui/Avatar';
import { Badge } from '@components/ui/Badge';
import { Button } from '@components/ui/Button';
import { Mail, Calendar, ShieldCheck, Edit3 } from 'lucide-react';

export function ProfileCard({ user, onEdit }) {
  if (!user) {
    return null;
  }

  const roleVariants = {
    CLIENT: 'primary',
    WORKER: 'secondary',
    ADMIN: 'danger',
  };

  return (
    <Card variant="elevated" className="flex flex-col gap-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Avatar
            name={`${user.firstName || ''} ${user.lastName || ''}`}
            src={user.avatar}
            size="xl"
            status="online"
          />
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-surface-50 font-display">
                {user.firstName} {user.lastName}
              </h3>
              {user.isEmailVerified && (
                <ShieldCheck size={18} className="text-success-400" title="Email Verified" />
              )}
            </div>
            <p className="text-xs text-surface-400 flex items-center gap-1.5">
              <Mail size={12} />
              {user.email}
            </p>
            <div className="mt-1">
              <Badge variant={roleVariants[user.role] || 'primary'} size="sm">
                {user.role}
              </Badge>
            </div>
          </div>
        </div>

        {onEdit && (
          <Button variant="ghost" size="xs" leftIcon={<Edit3 size={14} />} onClick={onEdit}>
            Edit Profile
          </Button>
        )}
      </div>

      <div className="pt-4 border-t border-surface-700/60 grid grid-cols-2 gap-4 text-xs">
        <div>
          <span className="text-surface-400 block">Member Since</span>
          <span className="text-surface-200 font-medium flex items-center gap-1 mt-0.5">
            <Calendar size={12} />
            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
          </span>
        </div>
        <div>
          <span className="text-surface-400 block">Account Status</span>
          <span className="text-success-400 font-semibold mt-0.5 block">Active</span>
        </div>
      </div>
    </Card>
  );
}
