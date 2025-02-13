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

  // Add this debug log
  React.useEffect(() => {
    console.log('Auth Debug:', {
      user,
      token: localStorage.getItem('token'),
      event_creator_id: event.user_id
    });
  }, [user, event]);

  // Check if user is the owner with more detailed logging
  const isOwner = React.useMemo(() => {
    const ownerCheck = {
      userEmail: user?.email,
      eventCreatorEmail: event.creator?.email,
      isOwnerByEmail: user?.email === event.creator?.email
    };
    
    console.log('Ownership check details:', ownerCheck);
    
    // Check by email since we don't have reliable user_id
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
      setError('You must be logged in to join events');
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
      setError(err.message || 'Failed to process request');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[28rem] flex-col rounded-xl border bg-white shadow-sm transition-all hover:shadow-md">
      {/* Image Section */}
      {event.image_url ? (
        <div className="relative h-48 w-full overflow-hidden rounded-t-xl">
          <img 
            src={event.image_url} 
            alt={event.title} 
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      ) : (
        <div className="h-48 w-full rounded-t-xl bg-gray-100 flex items-center justify-center">
          <Calendar className="h-12 w-12 text-gray-400" />
        </div>
      )}

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">{event.title}</h3>
          {isOwner && (
            <Button
              onClick={() => onEdit(event.id)}
              variant="outline"
              size="sm"
              className="flex items-center gap-1 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 ml-2 flex-shrink-0"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={1.5} 
                stroke="currentColor" 
                className="w-4 h-4"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" 
                />
              </svg>
              Edit
            </Button>
          )}
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
            <span>{new Date(event.date).toLocaleDateString(undefined, {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}</span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2 text-gray-400" />
            <span>{event.location}</span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <Users className="h-4 w-4 mr-2 text-gray-400" />
            <div className="flex items-center space-x-1">
              <span>{event.available_places} spots available</span>
              {event.attendees && (
                <span className="text-gray-400">
                  • {event.attendees.length} attending
                </span>
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

        <p className="text-sm text-gray-600 line-clamp-2 flex-grow">{event.description}</p>

        {error && (
          <div className="text-sm text-red-600 mt-2 mb-2">
            {error}
          </div>
        )}

        <div className="mt-auto pt-4">
          {user && !isOwner && (
            <Button 
              onClick={handleAction}
              variant="outline"
              disabled={isLoading || (!isAttending && event.available_places === 0)}
              className={`w-full font-medium ${
                isAttending
                  ? "bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
                  : event.available_places > 0
                    ? "bg-green-50 text-green-600 hover:bg-green-100 border-green-200"
                    : "bg-gray-50 text-gray-400 cursor-not-allowed"
              }`}
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
          )}

          {!user && (
            <Link to="/login" className="block">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Login to Join
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}