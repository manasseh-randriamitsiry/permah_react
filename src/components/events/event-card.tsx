import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Button } from '../ui/button';
import { useAuthStore } from '../../store/auth-store';
import type { EventData } from '../../types';

interface EventCardProps {
  event: EventData;
  onJoin: () => Promise<void>;
  onLeave: () => Promise<void>;
}

export function EventCard({ event, onJoin, onLeave }: EventCardProps) {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  // Check if user is attending
  const isAttending = React.useMemo(() => {
    if (!user || !event.attendees) return false;
    console.log('Checking attendance:', {
      userId: user.id,
      attendees: event.attendees,
      isAttending: event.attendees.some(attendee => attendee.id === user.id)
    });
    return event.attendees.some(attendee => attendee.id === user.id);
  }, [event.attendees, user]);

  const handleAction = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to join events');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      if (isAttending) {
        console.log('Leaving event...');
        await onLeave();
      } else {
        console.log('Joining event...', {
          userId: user.id,
          eventId: event.id,
          token: localStorage.getItem('token')
        });
        await onJoin();
      }
    } catch (err: any) {
      console.error('Action error:', err);
      const errorMessage = err.response?.data?.message || 'Failed to process request';
      setError(errorMessage);
      if (err.response?.status === 401) {
        // Redirect to login if unauthorized
        window.location.href = '/login';
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isOrganizer = event.organizer_id === user?.id;

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <div className="flex flex-col h-full">
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(event.date)}</span>
        </div>
        
        {event.image_url && (
          <img 
            src={event.image_url} 
            alt={event.title} 
            className="w-full h-48 object-cover rounded-md mb-4"
          />
        )}

        <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
        <p className="text-gray-600 mb-4 flex-grow">{event.description}</p>

        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <MapPin className="h-4 w-4" />
            <span>{event.location}</span>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Users className="h-4 w-4" />
            <span>{event.available_places} spots available</span>
            {event.attendees && (
              <span className="text-gray-400">
                ({event.attendees.length} attending)
              </span>
            )}
          </div>

          <div className="text-sm text-gray-500">
            Price: ${event.price}
          </div>

          {error && (
            <div className="text-sm text-red-600">
              {error}
            </div>
          )}

          {!isOrganizer && user && (
            <Button
              onClick={handleAction}
              disabled={isLoading}
              variant={isAttending ? "outline" : "primary"}
              className="w-full"
            >
              {isLoading 
                ? 'Processing...' 
                : isAttending 
                  ? 'Leave Event' 
                  : 'Join Event'
              }
            </Button>
          )}

          {!user && (
            <Link to="/login">
              <Button className="w-full">
                Login to Join
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}