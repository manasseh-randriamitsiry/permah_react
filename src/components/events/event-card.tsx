import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/auth-store';
import type { EventData } from '../../types';
import { EventImage } from './event-card/EventImage';
import { EventDetails } from './event-card/EventDetails';
import { EventActions } from './event-card/EventActions';

interface EventCardProps {
  event: EventData;
  onJoin: (eventId: number) => Promise<void>;
  onLeave: (eventId: number) => Promise<void>;
  onEdit: (eventId: number) => void;
}

export function EventCard({ event, onJoin, onLeave, onEdit }: EventCardProps) {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  // Check if user is the owner
  const isOwner = React.useMemo(() => {
    return user?.email === event.creator?.email;
  }, [user?.email, event.creator?.email]);

  // Check if user is attending
  const isAttending = React.useMemo(() => {
    if (!user || (!event.attendees && !event.participants)) return false;
    
    const attendeesList = event.attendees || event.participants || [];
    return attendeesList.some(attendee => attendee.id === user.id);
  }, [event.attendees, event.participants, user]);

  const handleAction = async () => {
    if (!user) {
      setError(t('events.errors.loginRequired'));
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      if (isAttending) {
        await onLeave(event.id);
      } else {
        await onJoin(event.id);
      }
    } catch (err: any) {
      console.error('Action error:', err);
      setError(err.message || t('events.errors.actionFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[28rem] flex-col rounded-xl border bg-white shadow-sm transition-all hover:shadow-md">
      <EventImage imageUrl={event.image_url} title={event.title} />
      
      <div className="flex flex-1 flex-col p-5">
        <EventDetails event={event} />
        
        <p className="text-sm text-gray-600 line-clamp-2 flex-grow">{event.description}</p>

        {error && (
          <div className="text-sm text-red-600 mt-2 mb-2">
            {error}
          </div>
        )}

        <EventActions 
          event={event}
          isOwner={isOwner}
          isAttending={isAttending}
          isLoading={isLoading}
          user={user}
          onJoin={handleAction}
          onEdit={() => onEdit(event.id)}
        />
      </div>
    </div>
  );
}