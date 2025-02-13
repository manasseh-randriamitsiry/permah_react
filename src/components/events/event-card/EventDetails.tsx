import React from 'react';
import { Calendar, MapPin, Users } from 'lucide-react';
import type { EventData } from '../../../types';

interface EventDetailsProps {
  event: EventData;
}

export function EventDetails({ event }: EventDetailsProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-3 mb-4">
      <div className="flex items-center text-sm text-gray-600">
        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
        <div className="flex flex-col">
          <span>From: {formatDate(event.startDate)}</span>
          <span>To: {formatDate(event.endDate)}</span>
        </div>
      </div>

      <div className="flex items-center text-sm text-gray-600">
        <MapPin className="h-4 w-4 mr-2 text-gray-400" />
        <span>{event.location}</span>
      </div>

      <div className="flex items-center text-sm text-gray-600">
        <Users className="h-4 w-4 mr-2 text-gray-400" />
        <div className="flex items-center space-x-1">
          <span>
            {event.available_places - (event.attendees?.length || 0)} spots left
          </span>
          {event.attendees && (
            <>
              <span className="text-gray-400">•</span>
              <span className="text-gray-400">
                {event.attendees.length} joined
              </span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-400">
                {event.available_places} total spots
              </span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center text-sm font-medium">
        <svg className="h-4 w-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-gray-900">${event.price}</span>
      </div>
    </div>
  );
} 