import React from 'react';
import { useTranslation } from 'react-i18next';
import type { EventData } from '../../../types';
import type { SortConfig } from '../types';
import { TableHeader } from '../table/TableHeader';
import { DashboardEventRow } from './DashboardEventRow';
import { LoadingState } from '../table/LoadingState';
import { ErrorState } from '../table/ErrorState';
import { EmptyState } from '../table/EmptyState';

interface DashboardEventTableProps {
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

export function DashboardEventTable({
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
}: DashboardEventTableProps) {
  const { t } = useTranslation();
  const [selectedEvents, setSelectedEvents] = React.useState<number[]>([]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedEvents(events.map(event => event.id));
    } else {
      setSelectedEvents([]);
    }
  };

  const handleSelectEvent = (eventId: number, checked: boolean) => {
    if (checked) {
      setSelectedEvents(prev => [...prev, eventId]);
    } else {
      setSelectedEvents(prev => prev.filter(id => id !== eventId));
    }
  };

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
    <div className="flex flex-col h-full min-h-[600px] bg-white rounded-lg border border-gray-200">
      <div className="flex-1 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <TableHeader 
                sortConfig={sortConfig} 
                onSort={onSort}
                onSelectAll={handleSelectAll}
                allSelected={selectedEvents.length === events.length}
                someSelected={selectedEvents.length > 0 && selectedEvents.length < events.length}
              />
            </thead>
            <tbody className="divide-y divide-gray-200">
              {events.map((event) => (
                <DashboardEventRow
                  key={event.id}
                  event={event}
                  onClick={() => onEventClick(event.id)}
                  onEdit={() => onEventEdit(event.id)}
                  onDelete={() => onEventDelete(event.id)}
                  isSelected={selectedEvents.includes(event.id)}
                  onSelect={(checked) => handleSelectEvent(event.id, checked)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-auto border-t border-gray-200 bg-white">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Showing {events.length} events
            </p>
            {selectedEvents.length > 0 && (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">
                  {selectedEvents.length} selected
                </span>
                <button
                  className="text-sm text-red-600 hover:text-red-700"
                  onClick={() => {
                    selectedEvents.forEach(id => onEventDelete(id));
                    setSelectedEvents([]);
                  }}
                >
                  Delete Selected
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 