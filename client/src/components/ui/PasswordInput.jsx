import { forwardRef, useState } from 'react';
import { Input } from './Input';
import { PasswordStrengthIndicator } from '../forms/PasswordStrengthIndicator';

const PasswordInput = forwardRef(
  (
    {
      label = 'Password',
      showStrength = false,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const [passwordValue, setPasswordValue] = useState(value || '');

    const handleChange = (e) => {
      setPasswordValue(e.target.value);
      if (onChange) {
        onChange(e);
      }
    };

    const currentValue = value !== undefined ? value : passwordValue;

    return (
      <div className="w-full flex flex-col gap-2">
        <Input
          ref={ref}
          type="password"
          label={label}
          value={currentValue}
          onChange={handleChange}
          {...props}
        />
        {showStrength && <PasswordStrengthIndicator password={String(currentValue || '')} />}
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';

export { PasswordInput };
