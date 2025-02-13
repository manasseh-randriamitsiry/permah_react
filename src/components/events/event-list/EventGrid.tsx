import React from 'react';
import { EventCard } from '../event-card';
import type { EventData } from '../../../types';

interface EventGridProps {
  events: EventData[];
  onJoin: (eventId: number) => Promise<void>;
  onLeave: (eventId: number) => Promise<void>;
  onEdit: (eventId: number) => void;
}

export function EventGrid({ events, onJoin, onLeave, onEdit }: EventGridProps) {
  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {events.map((event: EventData) => (
        <EventCard
          key={event.id}
          event={event}
          onJoin={onJoin}
          onLeave={onLeave}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
} 