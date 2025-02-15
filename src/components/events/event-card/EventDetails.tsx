import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, MapPin, Users } from 'lucide-react';
import type { EventData } from '../../../types';

interface EventDetailsProps {
  event: EventData;
}

export function EventDetails({ event }: EventDetailsProps) {
  const { t } = useTranslation();

  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const formatCurrency = (amount: number) => {
    return t('{{amount}}', { amount, format: 'currency' });
  };

  return (
    <div className="p-5 space-y-4">
      <div className="flex items-start">
        <Calendar className="h-5 w-5 text-gray-400 flex-shrink-0" />
        <div className="ml-3 flex flex-col">
          <span className="text-sm text-gray-600">{t('events.details.from')}: {formatDate(new Date(event.startDate))}</span>
          <span className="text-sm text-gray-600">{t('events.details.to')}: {formatDate(new Date(event.endDate))}</span>
        </div>
      </div>

      <div className="flex items-center">
        <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0" />
        <span className="ml-3 text-sm text-gray-600">{event.location}</span>
      </div>

      <div className="flex items-start">
        <Users className="h-5 w-5 text-gray-400 flex-shrink-0" />
        <div className="ml-3">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>
              {t('events.details.spotsLeft', { count: event.available_places - (event.attendees?.length || 0) })}
            </span>
            {event.attendees && (
              <>
                <span className="text-gray-400">•</span>
                <span>
                  {t('events.details.joined', { count: event.attendees.length })}
                </span>
                <span className="text-gray-400">•</span>
                <span>
                  {t('events.details.totalSpots', { count: event.available_places })}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center">
        <svg className="h-5 w-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="ml-3 text-sm font-medium text-gray-900">{formatCurrency(event.price)}</span>
      </div>
    </div>
  );
} 