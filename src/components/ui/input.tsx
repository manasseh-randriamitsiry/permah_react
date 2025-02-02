import React from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="relative">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <input
          {...props}
          ref={ref}
          className={`
            block w-full rounded-md
            border-gray-200
            bg-white
            px-4 py-2
            text-gray-700
            shadow-sm
            transition-colors
            duration-200
            placeholder:text-gray-400
            focus:border-blue-300
            focus:outline-none
            focus:ring-2
            focus:ring-blue-100
            focus:ring-offset-0
            disabled:cursor-not-allowed
            disabled:bg-gray-50
            disabled:text-gray-500
            ${error ? 'border-red-300 focus:border-red-300 focus:ring-red-100' : ''}
            ${className}
          `}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';