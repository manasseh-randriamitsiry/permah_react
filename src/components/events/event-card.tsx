import React from 'react';
import { useTranslation } from 'react-i18next';
import type { EventData, User } from '../../types';
import { EventImage } from './event-card/EventImage';
import { EventDetails } from './event-card/EventDetails';
import { EventActions } from './event-card/EventActions';

interface EventCardProps {
  event: EventData;
  currentUser: User | null;
  onJoin: (eventId: number) => Promise<void>;
  onLeave: (eventId: number) => Promise<void>;
  onEdit: (eventId: number) => void;
}

export function EventCard({ event, currentUser, onJoin, onLeave, onEdit }: EventCardProps) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  // Check if user is the owner
  const isOwner = React.useMemo(() => {
    return currentUser?.email === event.creator?.email;
  }, [currentUser?.email, event.creator?.email]);

  // Check if user is attending
  const isAttending = React.useMemo(() => {
    if (!currentUser || (!event.attendees && !event.participants)) return false;
    
    const attendeesList = event.attendees || event.participants || [];
    return attendeesList.some(attendee => attendee.id === currentUser.id);
  }, [event.attendees, event.participants, currentUser]);

  const handleAction = async () => {
    if (!currentUser) {
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
      setError(err.message || t('events.errors.actionFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <EventImage imageUrl={event.image_url} title={event.title} />
      <EventDetails event={event} />
      <EventActions
        isOwner={isOwner}
        isAttending={isAttending}
        isLoading={isLoading}
        onJoin={handleAction}
        onEdit={() => onEdit(event.id)}
      />
    </div>
  );
}