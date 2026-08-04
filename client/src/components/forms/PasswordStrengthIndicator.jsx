import { cn } from '@utils';
import { Check, X } from 'lucide-react';

export function PasswordStrengthIndicator({ password = '' }) {
  const checks = [
    { label: 'At least 8 characters', valid: password.length >= 8 },
    { label: 'One uppercase letter', valid: /[A-Z]/.test(password) },
    { label: 'One number', valid: /[0-9]/.test(password) },
    { label: 'One special character (!@#$%^&*)', valid: /[^A-Za-z0-9]/.test(password) },
  ];

  const score = checks.filter((c) => c.valid).length;

  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-danger-500', 'bg-warning-500', 'bg-info-500', 'bg-success-500'];

  return (
    <div className="flex flex-col gap-2 mt-1 w-full">
      <div className="flex items-center gap-1.5 h-1.5 w-full">
        {[0, 1, 2, 3].map((idx) => (
          <div
            key={idx}
            className={cn(
              'h-full flex-1 rounded-full transition-all duration-300',
              idx < score ? strengthColors[score - 1] : 'bg-surface-700'
            )}
          />
        ))}
      </div>

      {password && (
        <div className="flex items-center justify-between text-2xs text-surface-400">
          <span>Password Strength:</span>
          <span className="font-semibold text-surface-200">
            {score > 0 ? strengthLabels[score - 1] : 'Very Weak'}
          </span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-1">
        {checks.map((check, idx) => (
          <div key={idx} className="flex items-center gap-1.5 text-2xs">
            {check.valid ? (
              <Check size={12} className="text-success-400 shrink-0" />
            ) : (
              <X size={12} className="text-surface-500 shrink-0" />
            )}
            <span className={check.valid ? 'text-surface-200' : 'text-surface-500'}>
              {check.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
