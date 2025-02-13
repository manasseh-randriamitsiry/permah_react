import React from 'react';
import { useTranslation } from 'react-i18next';
import type { EventData } from '../../../types';
import type { SortConfig } from '../types';
import { TableHeader } from './TableHeader';
import { DashboardEventRow } from '../events/DashboardEventRow';
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';
import { EmptyState } from './EmptyState';

interface EventTableProps {
  events: EventData[];
  isLoading: boolean;
  error: Error | null;
  searchTerm: string;
  sortConfig: SortConfig;
  onSort: (key: SortConfig['key']) => void;
  onEventClick: (eventId: number) => void;
  onEventEdit: (eventId: number) => void;
  onEventDelete: (eventId: number) => void;
  onRetry: () => void;
}

export function EventTable({
  events,
  isLoading,
  error,
  searchTerm,
  sortConfig,
  onSort,
  onEventClick,
  onEventEdit,
  onEventDelete,
  onRetry,
}: EventTableProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={onRetry} />;
  }

  if (events.length === 0) {
    return <EmptyState searchTerm={searchTerm} />;
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <TableHeader sortConfig={sortConfig} onSort={onSort} />
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {events.map((event) => (
              <DashboardEventRow
                key={event.id}
                event={event}
                onClick={() => onEventClick(event.id)}
                onEdit={() => onEventEdit(event.id)}
                onDelete={() => onEventDelete(event.id)}
              />
            ))}
          </tbody>
        </table>
      </div>
      {events.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            {t('Showing {{count}} events', { count: events.length })}
          </p>
        </div>
      )}
    </div>
  );
} 