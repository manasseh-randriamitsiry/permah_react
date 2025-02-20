import React from 'react';
import { useTranslation } from 'react-i18next';
import type { EventData, EventStatistics } from '../../../types';
import type { SortConfig } from '../types';
import { TableHeader } from '../table/TableHeader';
import { DashboardEventRow } from './DashboardEventRow';
import { LoadingState } from '../table/LoadingState';
import { ErrorState } from '../table/ErrorState';
import { EmptyState } from '../table/EmptyState';
import { EventService } from '../../../services/event.service';

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
  const [eventStats, setEventStats] = React.useState<Record<number, EventStatistics>>({});
  const [loadingStats, setLoadingStats] = React.useState<Record<number, boolean>>({});

  React.useEffect(() => {
    const fetchEventStats = async () => {
      const newStats: Record<number, EventStatistics> = {};
      const newLoadingStats: Record<number, boolean> = {};
      
      for (const event of events) {
        if (!eventStats[event.id] && !loadingStats[event.id]) {
          newLoadingStats[event.id] = true;
          try {
            const stats = await EventService.getEventStatistics(event.id);
            newStats[event.id] = stats;
          } catch (error) {
            console.error(`Failed to fetch stats for event ${event.id}:`, error);
          }
          newLoadingStats[event.id] = false;
        }
      }
      
      setEventStats(prev => ({ ...prev, ...newStats }));
      setLoadingStats(prev => ({ ...prev, ...newLoadingStats }));
    };

    fetchEventStats();
  }, [events]);

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

  const formatDate = (date: string) => {
    const d = new Date(date);
    return {
      date: d.toLocaleDateString(),
      time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const getEventStatus = (event: EventData) => {
    const now = new Date();
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    
    if (now > endDate) return { label: t('dashboard.status.closed'), classes: 'bg-gray-100 text-gray-800' };
    if (now >= startDate && now <= endDate) return { label: t('dashboard.status.ongoing'), classes: 'bg-green-100 text-green-800' };
    return { label: t('dashboard.status.upcoming'), classes: 'bg-blue-100 text-blue-600' };
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
      {/* Desktop View */}
      <div className="hidden md:block flex-1 overflow-hidden">
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
                  stats={eventStats[event.id]}
                  isLoadingStats={loadingStats[event.id]}
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

      {/* Mobile View */}
      <div className="block md:hidden">
        <div className="divide-y divide-gray-200">
          {events.map((event) => (
            <div 
              key={event.id}
              className="p-3 hover:bg-gray-50"
              onClick={() => onEventClick(event.id)}
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium text-gray-900 truncate">{event.title}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${getEventStatus(event).classes}`}>
                  {getEventStatus(event).label}
                </span>
              </div>
              
              <div className="text-sm text-gray-600">
                <div className="flex justify-between items-center mb-1">
                  <span>{formatDate(event.startDate).date}</span>
                  <span>
                    {loadingStats[event.id] ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="h-3 w-3 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                      </div>
                    ) : eventStats[event.id] ? (
                      `${eventStats[event.id].total_places - eventStats[event.id].available_places} / ${eventStats[event.id].total_places}`
                    ) : (
                      `${event.attendees?.length || 0} / ${event.available_places}`
                    )}
                  </span>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEventEdit(event.id);
                  }}
                  className="text-xs text-blue-600 hover:text-blue-900"
                >
                  {t('Edit')}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEventDelete(event.id);
                  }}
                  className="text-xs text-red-600 hover:text-red-900"
                >
                  {t('Delete')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto border-t border-gray-200 bg-white">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              {t('dashboard.table.showing', { count: events.length })}
            </p>
            {selectedEvents.length > 0 && (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">
                  {t('dashboard.table.selected', { count: selectedEvents.length })}
                </span>
                <button
                  className="text-sm text-red-600 hover:text-red-700"
                  onClick={() => {
                    selectedEvents.forEach(id => onEventDelete(id));
                    setSelectedEvents([]);
                  }}
                >
                  {t('dashboard.table.deleteSelected')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}