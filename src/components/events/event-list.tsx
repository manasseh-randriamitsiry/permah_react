import React from 'react';
import { EventCard } from './event-card';
import { eventApi } from '../../services/api';
import type { EventData } from '../../types';
import { useAuthStore } from '../../store/auth-store';
import { useNavigate } from 'react-router-dom';

export function EventList() {
  const [events, setEvents] = React.useState<EventData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventApi.getAll();
      setEvents(response.data);
      setError('');
    } catch (err: any) {
      if (err.response?.status === 401) {
        setEvents([]); // Clear events on unauthorized
      } else {
        console.error('Error fetching events:', err);
        setError(err.message || 'Failed to fetch events');
      }
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchEvents();
  }, [user]);

  const handleJoinEvent = async (eventId: number) => {
    if (!user) {
      navigate('/login');
      return;
    }
    await eventApi.join(eventId);
    await fetchEvents();
  };

  const handleLeaveEvent = async (eventId: number) => {
    if (!user) return;
    await eventApi.leave(eventId);
    await fetchEvents();
  };

  if (loading) return <div className="text-center py-8">Loading events...</div>;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">All Events</h1>
      {events.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No events found. Be the first to create one!
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard 
              key={event.id} 
              event={event}
              onJoin={() => handleJoinEvent(event.id)}
              onLeave={() => handleLeaveEvent(event.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}