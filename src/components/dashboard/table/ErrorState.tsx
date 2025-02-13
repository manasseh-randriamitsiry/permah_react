import React from 'react';
import { useTranslation } from 'react-i18next';

interface ErrorStateProps {
  error: Error | null;
  onRetry?: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  const { t } = useTranslation();

  const getErrorMessage = (error: Error | null) => {
    if (!error) return t('An unknown error occurred');

    // Handle specific error types
    if (error.message.includes('Failed to fetch')) {
      return t('Unable to connect to the server. Please check your internet connection.');
    }
    if (error.message.includes('401') || error.message.includes('unauthorized')) {
      return t('Your session has expired. Please log in again.');
    }
    if (error.message.includes('403')) {
      return t('You do not have permission to view these events.');
    }
    if (error.message.includes('404')) {
      return t('The requested events could not be found.');
    }
    if (error.message.includes('500')) {
      return t('A server error occurred. Please try again later.');
    }

    return error.message;
  };

  return (
    <div className="rounded-lg bg-red-50 p-6 text-red-800">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <svg 
            className="h-6 w-6 text-red-600" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
            />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-lg font-medium">{t('Error Loading Dashboard')}</h3>
          <p className="mt-2 text-sm">{getErrorMessage(error)}</p>
        </div>
      </div>
      {onRetry && (
        <div className="mt-4">
          <button
            onClick={onRetry}
            className="inline-flex items-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            <svg 
              className="mr-2 -ml-1 h-4 w-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
              />
            </svg>
            {t('Try Again')}
          </button>
        </div>
      )}
    </div>
  );
} 