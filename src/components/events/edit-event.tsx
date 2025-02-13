import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EventForm } from './event-form';
import { eventApi } from '../../services/api';
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
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await eventApi.getById(parseInt(id));
        const eventData = response.data;
        
        // Check if user is the owner
        if (eventData.user_id !== user?.id) {
          setError('You do not have permission to edit this event');
          navigate('/events');
          return;
        }
        
        setEvent(eventData);
      } catch (err: any) {
        console.error('Error fetching event:', err);
        setError(err.message || 'Failed to fetch event');
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
      await eventApi.update(parseInt(id), eventData);
      navigate('/events');
    } catch (err: any) {
      console.error('Error updating event:', err);
      throw new Error(err.message || 'Failed to update event');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Loading event...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4 text-center">
        <p className="text-sm text-red-700">{error}</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Event not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Event</h1>
      <EventForm event={event} onSubmit={handleSubmit} />
    </div>
  );
}