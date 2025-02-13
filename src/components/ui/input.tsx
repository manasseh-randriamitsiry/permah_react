import React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, ...props }, ref) => {
    return (
      <div className="relative mb-6">
        {label && (
          <label 
            htmlFor={props.name} 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={props.name}
          className={cn(`
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
          `, className)}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? `${props.name}-error` : 
            hint ? `${props.name}-hint` : 
            undefined
          }
          {...props}
        />
        <div className="min-h-[20px] mt-1">
          {error ? (
            <p 
              className="text-sm text-red-600" 
              id={`${props.name}-error`}
              role="alert"
            >
              {error}
            </p>
          ) : hint ? (
            <p 
              className="text-sm text-gray-500"
              id={`${props.name}-hint`}
            >
              {hint}
            </p>
          ) : null}
        </div>
      </div>
    );
  }
);

Input.displayName = 'Input';