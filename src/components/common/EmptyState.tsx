import React from 'react';
import { useTranslation } from 'react-i18next';

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
}

export function EmptyState({ 
  title, 
  message, 
  icon 
}: EmptyStateProps) {
  const { t } = useTranslation();
  
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="text-center">
        {icon && (
          <div className="mx-auto h-12 w-12 text-gray-400">
            {icon}
          </div>
        )}
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          {title || t('common.empty.title')}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {message || t('common.empty.message')}
        </p>
      </div>
    </div>
  );
} 