import React from 'react';
import { EventService } from '../../services/event.service';
import type { EventData } from '../../types';
import { useAuthStore } from '../../store/auth-store';
import { useNavigate } from 'react-router-dom';
import { SearchHeader } from './event-list/SearchHeader';
import { LoadingState } from './event-list/LoadingState';
import { EmptyState } from './event-list/EmptyState';
import { EventGrid } from './event-list/EventGrid';

export function EventList() {
  const [events, setEvents] = React.useState<EventData[]>([]);
  const [filteredEvents, setFilteredEvents] = React.useState<EventData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [searchTerm, setSearchTerm] = React.useState('');
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await EventService.listEvents();
      // Filter out closed events
      const openEvents = response.filter((event: EventData) => new Date(event.startDate) > new Date());
      setEvents(openEvents);
      
      // Check if we have a selected event from dashboard
      const selectedEventId = localStorage.getItem('selectedEventId');
      if (selectedEventId) {
        const selectedEvent = openEvents.find(
          (event: EventData) => event.id === parseInt(selectedEventId)
        );
        if (selectedEvent) {
          setFilteredEvents([selectedEvent]);
          setSearchTerm(selectedEvent.title);
        } else {
          setFilteredEvents(openEvents);
        }
        localStorage.removeItem('selectedEventId');
      } else {
        setFilteredEvents(openEvents);
      }
    } catch (err: any) {
      console.error('Error fetching events:', err);
      setError(err.message || 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchEvents();
  }, []);

  React.useEffect(() => {
    const filtered = events.filter(event => 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEvents(filtered);
  }, [searchTerm, events]);

  const handleJoinEvent = async (eventId: number) => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await EventService.joinEvent(eventId);
      await fetchEvents();
    } catch (err) {
      console.error('Error joining event:', err);
    }
  };

  const handleLeaveEvent = async (eventId: number) => {
    if (!user) return;
    try {
      await EventService.leaveEvent(eventId);
      await fetchEvents();
    } catch (err) {
      console.error('Error leaving event:', err);
    }
  };

  const handleEditEvent = (eventId: number) => {
    navigate(`/events/${eventId}/edit`);
  };

  return (
    <div>
      <SearchHeader 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <div className="min-h-[calc(100vh-12rem)]">
        {loading ? (
          <LoadingState />
        ) : error ? (
          <div className="rounded-lg bg-red-50 p-4 text-red-800">
            <p>{error}</p>
          </div>
        ) : (
          <EventGrid
            events={filteredEvents}
            onJoin={handleJoinEvent}
            onLeave={handleLeaveEvent}
            onEdit={handleEditEvent}
          />
        )}

        {filteredEvents.length === 0 && !loading && (
          <EmptyState searchTerm={searchTerm} />
        )}
      </div>
    </div>
  );
}