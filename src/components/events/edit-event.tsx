import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EventForm } from './event-form';
import { EventService } from '../../services/event.service';
import { useAuthStore } from '../../store/auth-store';
import type { CreateEventRequest,EventData } from '../../types';

export function EditEvent() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = React.useState<EventData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const { user } = useAuthStore();

  React.useEffect(() => {
    const fetchEvent = async () => {
      if (!id) {
        console.error('No event ID provided');
        navigate('/events');
        return;
      }
      
      try {
        setLoading(true);
        console.log('Fetching event:', id);
        const response = await EventService.getEvent(parseInt(id));
        console.log('Event data:', response);
        
        // Check if we got valid data
        if (!response) {
          throw new Error('Event not found');
        }

        // Check if user is the owner
        if (response.creator?.email !== user?.email) {
          setError('You do not have permission to edit this event');
          navigate('/events');
          return;
        }
        
        setEvent(response);
      } catch (err: any) {
        console.error('Error fetching event:', err);
        setError(err.message || 'Failed to fetch event');
        navigate('/events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, user, navigate]);

  const handleSubmit = async (eventData: CreateEventRequest) => {
    if (!id) return;
    
    try {
      setLoading(true);
      await EventService.updateEvent(parseInt(id), eventData);
      navigate('/events');
    } catch (err: any) {
      console.error('Error updating event:', err);
      setError(err.message || 'Failed to update event');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-50 text-red-600 p-4 rounded-md">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <EventForm event={event} onSubmit={handleSubmit} />
    </div>
  );
}