import { Button } from '@components/ui/Button';

export function LoadingSubmitButton({
  children = 'Submit',
  loading = false,
  disabled = false,
  variant = 'primary',
  size = 'md',
  fullWidth = true,
  className,
  ...props
}) {
  return (
    <Button
      type="submit"
      variant={variant}
      size={size}
      loading={loading}
      disabled={disabled || loading}
      fullWidth={fullWidth}
      className={className}
      {...props}
    >
      {children}
    </Button>
  );
}
