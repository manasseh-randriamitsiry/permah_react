import React from 'react';
import { useTranslation } from 'react-i18next';
import type { EventData, EventStatistics } from '../../../types';

interface DashboardEventRowProps {
  event: EventData;
  stats?: EventStatistics;
  isLoadingStats?: boolean;
  onClick: (eventId: number) => void;
  onEdit: (eventId: number) => void;
  onDelete: (eventId: number) => void;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
}

export function DashboardEventRow({ 
  event, 
  stats,
  isLoadingStats,
  onClick, 
  onEdit, 
  onDelete,
  isSelected,
  onSelect,
}: DashboardEventRowProps) {
  const { t } = useTranslation();
  
  const now = new Date();
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);
  
  const getEventStatus = () => {
    if (now > endDate) return { label: t('dashboard.status.closed'), classes: 'bg-gray-100 text-gray-800' };
    if (now >= startDate && now <= endDate) return { label: t('dashboard.status.ongoing'), classes: 'bg-green-100 text-green-800' };
    return { label: t('dashboard.status.upcoming'), classes: 'bg-blue-100 text-blue-600' };
  };

  const status = getEventStatus();
  const totalEarnings = stats 
    ? event.price * stats.attendees_count 
    : (event.price || 0) * (event.attendees?.length || 0);
  
  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return {
      date: `${day}-${month}-${year}`,
      time: `${hours}:${minutes}`
    };
  };

  const startDateFormatted = formatDate(startDate);
  const endDateFormatted = formatDate(endDate);

  return (
    <tr 
      className="cursor-pointer hover:bg-gray-50"
      onClick={() => onClick(event.id)}
    >
      <td className="w-12 px-6 py-4" onClick={e => e.stopPropagation()}>
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 text-blue-600"
          checked={isSelected}
          onChange={(e) => onSelect(e.target.checked)}
        />
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">{event.title}</span>
          <span className="text-sm text-gray-500">{event.location}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className="text-gray-900">{startDateFormatted.date}</span>
          <span className="text-sm text-gray-500">{startDateFormatted.time}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className="text-gray-900">{endDateFormatted.date}</span>
          <span className="text-sm text-gray-500">{endDateFormatted.time}</span>
        </div>
      </td>
      <td className="px-6 py-4 text-center">
        {isLoadingStats ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
            <span className="text-sm text-gray-500">{t('dashboard.loading')}</span>
          </div>
        ) : stats ? (
          <div className="flex flex-col items-center">
            <span className="font-medium text-gray-900">
              {stats.attendees_count} / {stats.available_places}
            </span>
            {stats.is_full && (
              <span className="mt-1 inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                {t('dashboard.status.full')}
              </span>
            )}
          </div>
        ) : (
          <span className="text-gray-500">-</span>
        )}
      </td>
      <td className="px-6 py-4 text-center">
        <span className="font-medium text-gray-900">
          ${totalEarnings.toFixed(2)}
        </span>
      </td>
      <td className="px-6 py-4 text-center">
        <span className={`inline-flex items-center justify-center rounded-full px-2.5 py-1 text-xs font-medium ${status.classes}`}>
          {status.label}
        </span>
      </td>
      <td className="px-6 py-4 text-right" onClick={e => e.stopPropagation()}>
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => onEdit(event.id)}
            className="rounded bg-blue-50 px-2 py-1 text-sm font-medium text-blue-600 hover:bg-blue-100"
          >
            {t('dashboard.table.edit')}
          </button>
          <button
            onClick={() => onDelete(event.id)}
            className="rounded bg-red-50 px-2 py-1 text-sm font-medium text-red-600 hover:bg-red-100"
          >
            {t('dashboard.table.delete')}
          </button>
        </div>
      </td>
    </tr>
  );
} 