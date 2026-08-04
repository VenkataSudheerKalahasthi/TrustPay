import { cn } from '@utils';

/**
 * Responsive Container Component
 *
 * @param {object} props
 * @param {'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'} props.maxWidth
 * @param {boolean} props.padded
 * @param {'section' | 'page' | 'none'} props.spacing
 */
export function Container({
  children,
  maxWidth = 'xl',
  padded = true,
  spacing = 'none',
  className,
  as: Tag = 'div',
  ...props
}) {
  const maxWidthStyles = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-5xl',
    xl: 'max-w-7xl',
    '2xl': 'max-w-screen-2xl',
    full: 'max-w-full',
  };

  const spacingStyles = {
    section: 'py-16 sm:py-20 lg:py-24',
    page: 'py-8 sm:py-12',
    none: '',
  };

  return (
    <Tag
      className={cn(
        'mx-auto w-full',
        maxWidthStyles[maxWidth],
        padded && 'px-4 sm:px-6 lg:px-8',
        spacingStyles[spacing],
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
