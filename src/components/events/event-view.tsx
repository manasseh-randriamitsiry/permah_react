import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { EventService } from '../../services/event.service';
import { useAuthStore } from '../../store/auth-store';
import type { EventData } from '../../types';
import { LoadingState } from '../common/LoadingState';
import { EventImage } from './event-card/EventImage';
import { EventDetails } from './event-card/EventDetails';
import { Button } from '../ui/button';

export function EventView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [event, setEvent] = React.useState<EventData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isJoinLoading, setIsJoinLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const data = await EventService.getEvent(parseInt(id));
        setEvent(data);
      } catch (err: any) {
        console.error('Error fetching event:', err);
        setError(err.message || 'Failed to fetch event');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const isOwner = React.useMemo(() => {
    if (!user || !event) return false;
    return user.email === event.creator?.email;
  }, [user, event]);

  const isAttending = React.useMemo(() => {
    if (!user || !event || (!event.attendees && !event.participants)) return false;
    const attendeesList = event.attendees || event.participants || [];
    return attendeesList.some(attendee => attendee.id === user.id);
  }, [user, event]);

  const handleJoinLeave = async () => {
    if (!event || !user) return;
    
    try {
      setIsJoinLoading(true);
      if (isAttending) {
        await EventService.leaveEvent(event.id);
      } else {
        await EventService.joinEvent(event.id);
      }
      // Refresh event data
      const updatedEvent = await EventService.getEvent(event.id);
      setEvent(updatedEvent);
    } catch (err: any) {
      console.error('Error updating attendance:', err);
      setError(err.message || 'Failed to update attendance');
    } finally {
      setIsJoinLoading(false);
    }
  };

  const handleEdit = () => {
    if (event) {
      navigate(`/events/${event.id}/edit`);
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error || !event) {
    return (
      <div className="w-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {t('errors.eventNotFound.title')}
          </h2>
          <p className="text-gray-600 mb-8">
            {error || t('errors.eventNotFound.message')}
          </p>
          <Button
            onClick={() => navigate('/events')}
            variant="outline"
          >
            {t('common.backToEvents')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <EventImage imageUrl={event.image_url} title={event.title} />
          
          <div className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
              <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
              <div className="flex space-x-4">
                {isOwner ? (
                  <Button
                    variant="outline"
                    onClick={handleEdit}
                  >
                    {t('events.actions.edit')}
                  </Button>
                ) : (
                  <Button
                    variant={isAttending ? "destructive" : "primary"}
                    onClick={handleJoinLeave}
                    disabled={isJoinLoading}
                  >
                    {isJoinLoading ? (
                      <div className="flex items-center">
                        <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        {t('events.actions.processing')}
                      </div>
                    ) : isAttending ? (
                      t('events.actions.leave')
                    ) : (
                      t('events.actions.join')
                    )}
                  </Button>
                )}
              </div>
            </div>

            <EventDetails event={event} />

            {event.description && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  {t('events.details.description')}
                </h2>
                <p className="text-gray-600 whitespace-pre-line">
                  {event.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 