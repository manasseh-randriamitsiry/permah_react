import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Button } from '../ui/button';
import { useAuthStore } from '../../store/auth-store';
import type { EventData } from '../../types';

interface EventCardProps {
  event: EventData;
  onJoin: (eventId: number) => Promise<void>;
  onLeave: (eventId: number) => Promise<void>;
  onEdit: (eventId: number) => void;
}

export function EventCard({ event, onJoin, onLeave, onEdit }: EventCardProps) {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  // Check if user is attending
  const isAttending = React.useMemo(() => {
    if (!user) return false;
    
    // Check both attendees and participants arrays
    return (
      (event.attendees?.some(attendee => attendee.id === user.id)) ||
      (event.participants?.some(participant => participant.id === user.id))
    );
  }, [event.attendees, event.participants, user]);

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
        await onLeave(event.id);
      } else {
        console.log('Joining event...', {
          userId: user.id,
          eventId: event.id,
          token: localStorage.getItem('token')
        });
        await onJoin(event.id);
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
  const isOwner = user?.id === event.user_id;
  const hasJoined = event.participants?.some(p => p.id === user?.id);

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <div className="flex justify-between">
        <h3 className="text-xl font-semibold">{event.title}</h3>
        {isOwner && (
          <Button
            onClick={() => onEdit(event.id)}
            variant="outline"
            size="sm"
          >
            Edit
          </Button>
        )}
      </div>
      
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
            <div className="mt-4 flex justify-end space-x-2">
              <Button 
                onClick={handleAction}
                variant="outline"
                disabled={isLoading || (!isAttending && event.available_places === 0)}
                className={
                  isAttending
                    ? "bg-red-50 text-red-600 hover:bg-red-100"
                    : event.available_places > 0
                      ? "bg-green-50 text-green-600 hover:bg-green-100"
                      : "bg-gray-50 text-gray-400 cursor-not-allowed"
                }
              >
                {isLoading 
                  ? 'Processing...' 
                  : isAttending 
                    ? 'Leave Event' 
                    : event.available_places > 0 
                      ? 'Join Event' 
                      : 'Event Full'
                }
              </Button>
            </div>
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