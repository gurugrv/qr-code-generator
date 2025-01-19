import React from 'react';
import clsx from 'clsx';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'ghost';
  /** Button size */
  size?: 'small' | 'medium' | 'large';
  /** Is the button in a loading state? */
  loading?: boolean;
  /** Should the button take up the full width of its container? */
  fullWidth?: boolean;
  /** Icon to display before the label */
  startIcon?: React.ReactNode;
  /** Icon to display after the label */
  endIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'medium',
      loading = false,
      fullWidth = false,
      startIcon,
      endIcon,
      children,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type="button"
        className={clsx(
          'inline-flex items-center justify-center border font-medium rounded-button',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'transition-colors duration-200',
          {
            'px-4 py-2 text-sm': size === 'small',
            'px-5 py-2.5 text-base': size === 'medium',
            'px-6 py-3 text-lg': size === 'large',
            'w-full': fullWidth,
            'bg-primary text-white border-transparent hover:bg-primary-light':
              variant === 'primary',
            'bg-secondary text-white border-transparent hover:bg-secondary-light':
              variant === 'secondary',
            'bg-transparent text-primary border-primary hover:bg-primary/10':
              variant === 'ghost',
          },
          className
        )}
        disabled={loading || props.disabled}
        aria-busy={loading}
        {...props}
      >
        {loading && (
          <span className="animate-spin -ml-1 mr-3 h-5 w-5" aria-hidden="true">
            {/* Loading spinner icon */}
          </span>
        )}
        {startIcon && <span className="mr-2">{startIcon}</span>}
        {children}
        {endIcon && <span className="ml-2">{endIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
