import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  loading?: boolean;
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  children,
  loading,
  'aria-label': ariaLabel,
  ...props 
}: ButtonProps) {
  const baseStyles = cn(
    'inline-flex items-center justify-center rounded-md font-medium transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50'
  );
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-500',
    outline: 'border border-gray-300 bg-white hover:bg-gray-100 focus-visible:ring-gray-500',
    destructive: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500'
  };

  const sizes = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-sm',
    lg: 'h-11 px-8 text-base',
    xl: 'h-12 px-8 text-base'
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      aria-label={ariaLabel}
      aria-busy={loading}
      aria-disabled={props.disabled}
      {...props}
    >
      {loading ? (
        <>
          <span className="sr-only">Loading</span>
          <span className="animate-spin mr-2">⟳</span>
        </>
      ) : null}
      {children}
    </button>
  );
}