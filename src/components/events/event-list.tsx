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
  const [selectedEventId, setSelectedEventId] = React.useState<string | null>(
    localStorage.getItem('selectedEventId')
  );

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await EventService.listEvents();
      
      // If there's a selected event, filter to show only that event
      if (selectedEventId) {
        const filteredEvents = response.filter(
          (event: EventData) => event.id === parseInt(selectedEventId)
        );
        setEvents(filteredEvents);
        setFilteredEvents(filteredEvents);
        // Clear the selected event ID after filtering
        localStorage.removeItem('selectedEventId');
        setSelectedEventId(null);
      } else {
        setEvents(response || []);
        setFilteredEvents(response || []);
      }
      
      setError('');
    } catch (err: any) {
      console.error('Error fetching events:', err);
      setError(err.message || 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchEvents();
  }, [selectedEventId]);

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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold">Events</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 rounded-lg border border-gray-300 p-2 pl-8 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <svg 
              className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
          </div>
        </div>
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
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event: EventData) => (
              <EventCard
                key={event.id}
                event={event}
                onJoin={handleJoinEvent}
                onLeave={handleLeaveEvent}
                onEdit={handleEditEvent}
              />
            ))}
            {filteredEvents.length === 0 && (
              <div className="col-span-full flex h-[calc(100vh-16rem)] items-center justify-center">
                <p className="text-center text-gray-500">
                  {searchTerm 
                    ? "No events found matching your search."
                    : "No events available."}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}