import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar } from 'lucide-react';

interface EmptyStateProps {
  searchTerm: string;
}

export function EmptyState({ searchTerm }: EmptyStateProps) {
  const { t } = useTranslation();

  return (
    <div 
      className="flex h-[calc(100vh-16rem)] items-center justify-center"
      role="region"
      aria-label={t('common.empty.title')}
    >
      <div className="text-center">
        <Calendar 
          className="mx-auto h-12 w-12 text-gray-400" 
          aria-hidden="true"
        />
        <h3 
          className="mt-2 text-sm font-medium text-gray-900"
          role="status"
        >
          {searchTerm ? t('events.list.noSearchResults') : t('events.list.noEvents')}
        </h3>
        <p 
          className="mt-1 text-sm text-gray-500"
          aria-live="polite"
        >
          {searchTerm 
            ? t('events.list.tryDifferentSearch')
            : t('events.list.createFirstEvent')}
        </p>
      </div>
    </div>
  );
} 