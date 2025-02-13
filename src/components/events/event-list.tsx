import React from 'react';
import { EventCard } from './event-card';
import { EventService } from '../../services/event.service';
import type { EventData } from '../../types';
import { useAuthStore } from '../../store/auth-store';
import { useNavigate } from 'react-router-dom';

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
      const openEvents = response.filter((event: EventData) => new Date(event.date) > new Date());
      setEvents(openEvents);
      
      // Check if we have a selected event from dashboard
      const selectedEventId = localStorage.getItem('selectedEventId');
      if (selectedEventId) {
        const selectedEvent = openEvents.find(
          (event: EventData) => event.id === parseInt(selectedEventId)
        );
        if (selectedEvent) {
          setFilteredEvents([selectedEvent]);
          // Set the search term to the event title to maintain the filter
          setSearchTerm(selectedEvent.title);
        } else {
          setFilteredEvents(openEvents);
        }
        // Clear the selectedEventId after using it
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

  // Update filtered events when search term changes
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
    try {
      console.log('Navigating to edit event:', eventId);
      navigate(`/events/${eventId}/edit`);
    } catch (err) {
      console.error('Navigation error:', err);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Events</h1>
        <div className="w-full max-w-md">
          <input
            type="search"
            placeholder="Search events..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex-1"></div> {/* Spacer */}
      </div>

      <div className="min-h-[calc(100vh-12rem)]">
        {loading ? (
          <div className="flex h-[calc(100vh-12rem)] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="rounded-lg bg-red-50 p-4 text-red-800">
            <p>{error}</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredEvents.map((event: EventData) => (
              <EventCard
                key={event.id}
                event={event}
                onJoin={handleJoinEvent}
                onLeave={handleLeaveEvent}
                onEdit={handleEditEvent}
              />
            ))}
          </div>
        )}

        {filteredEvents.length === 0 && !loading && (
          <div className="flex h-[calc(100vh-16rem)] items-center justify-center">
            <p className="text-center text-gray-500">
              {searchTerm 
                ? "No events found matching your search."
                : "No events available."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}