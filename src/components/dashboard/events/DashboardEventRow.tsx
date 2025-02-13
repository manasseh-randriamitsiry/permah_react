import React from 'react';
import { useTranslation } from 'react-i18next';
import type { EventData } from '../../../types';

interface DashboardEventRowProps {
  event: EventData;
  onClick: (eventId: number) => void;
  onEdit: (eventId: number) => void;
  onDelete: (eventId: number) => void;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
}

export function DashboardEventRow({ 
  event, 
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
  const joinedCount = event.attendees?.length || 0;
  const totalPlaces = event.available_places || 0;
  const freePlaces = totalPlaces - joinedCount;
  const totalEarnings = (event.price || 0) * joinedCount;
  
  const formatDate = (date: Date) => {
    return {
      date: t('{{date}}', { date, format: 'date', formatParams: { format: 'short' } }),
      time: t('{{date}}', { date, format: 'date', formatParams: { format: 'time' } })
    };
  };

  const startDateInfo = formatDate(startDate);
  const endDateInfo = formatDate(endDate);

  return (
    <tr 
      onClick={() => onClick(event.id)}
      className={`hover:bg-gray-50 cursor-pointer ${isSelected ? 'bg-blue-50' : ''}`}
    >
      <td className="w-8 p-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              onSelect(e.target.checked);
            }}
          />
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          {event.image_url ? (
            <img 
              src={event.image_url} 
              alt={event.title}
              className="h-10 w-10 rounded-lg object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-200">
              <span className="text-sm text-gray-600">
                {event.title.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div className="ml-4">
            <div className="font-medium text-gray-900">{event.title}</div>
            <div className="text-sm text-gray-500">{event.location}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <div>
          <div>{startDateInfo.date}</div>
          <div className="text-gray-400">{startDateInfo.time}</div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <div>
          <div>{endDateInfo.date}</div>
          <div className="text-gray-400">{endDateInfo.time}</div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
        {totalPlaces}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
        {joinedCount}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
        {freePlaces}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
        {new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(totalEarnings)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-center">
        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${status.classes}`}>
          {status.label}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onEdit(event.id);
          }}
          className="text-blue-600 hover:text-blue-900 mr-3"
        >
          {t('Edit')}
        </button>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onDelete(event.id);
          }}
          className="text-red-600 hover:text-red-900"
        >
          {t('Delete')}
        </button>
      </td>
    </tr>
  );
} 