import React from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  type?: 'auth' | 'data' | 'submission';
}

export function LoadingState({ type = 'data' }: LoadingStateProps) {
  const { t } = useTranslation();

  const getLoadingMessage = () => {
    switch (type) {
      case 'auth':
        return t('loading.auth');
      case 'submission':
        return t('loading.submission');
      default:
        return t('loading.data');
    }
  };

  const getScreenReaderMessage = () => {
    switch (type) {
      case 'auth':
        return t('common.loading.screenReader.auth');
      case 'submission':
        return t('common.loading.screenReader.submission');
      default:
        return t('common.loading.screenReader.data');
    }
  };

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-[200px] p-8"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <Loader2 
        className="h-8 w-8 animate-spin text-blue-500 mb-4" 
        aria-hidden="true"
      />
      <p className="text-gray-600">
        {getLoadingMessage()}
      </p>
      <span className="sr-only">
        {getScreenReaderMessage()}
      </span>
    </div>
  );
} 