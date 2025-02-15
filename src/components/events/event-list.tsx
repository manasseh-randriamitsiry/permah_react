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
  const [activeFilters, setActiveFilters] = React.useState<string[]>([]);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const events = await EventService.listEvents();
      setEvents(events);
      applyFilters(events, searchTerm, activeFilters);
    } catch (err: any) {
      console.error('Error fetching events:', err);
      setError(err.message || 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = React.useCallback((events: EventData[], search: string, filters: string[]) => {
    let filtered = [...events];
    const searchLower = search.toLowerCase();
    const now = new Date();

    // Apply search filter
    if (search) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchLower) ||
        event.description?.toLowerCase().includes(searchLower) ||
        event.location.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filters
    if (filters.length > 0) {
      filtered = filtered.filter(event => {
        const startDate = new Date(event.startDate);
        const endDate = new Date(event.endDate);
        const isFull = event.available_places <= (event.attendees?.length || 0);

        return filters.some(filter => {
          switch (filter) {
            case 'upcoming':
              return now < startDate;
            case 'ongoing':
              return now >= startDate && now <= endDate;
            case 'past':
              return now > endDate;
            case 'full':
              return isFull;
            case 'available':
              return !isFull;
            default:
              return false;
          }
        });
      });
    }

    setFilteredEvents(filtered);
  }, []);

  React.useEffect(() => {
    const debounceTimer = setTimeout(() => {
      applyFilters(events, searchTerm, activeFilters);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, activeFilters, events, applyFilters]);

  React.useEffect(() => {
    fetchEvents();
  }, []);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleFiltersChange = (filters: string[]) => {
    setActiveFilters(filters);
  };

  const handleJoinEvent = async (eventId: number) => {
    try {
      await EventService.joinEvent(eventId);
      await fetchEvents();
    } catch (err: any) {
      console.error('Error joining event:', err);
      // Handle error (show notification, etc.)
    }
  };

  const handleLeaveEvent = async (eventId: number) => {
    try {
      await EventService.leaveEvent(eventId);
      await fetchEvents();
    } catch (err: any) {
      console.error('Error leaving event:', err);
      // Handle error (show notification, etc.)
    }
  };

  const handleEditEvent = (eventId: number) => {
    navigate(`/events/${eventId}/edit`);
  };

  if (loading) return <LoadingState />;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <SearchHeader 
        searchTerm={searchTerm} 
        onSearchChange={handleSearchChange}
        activeFilters={activeFilters}
        onFiltersChange={handleFiltersChange}
      />
      {filteredEvents.length === 0 ? (
        <EmptyState searchTerm={searchTerm} />
      ) : (
        <EventGrid
          events={filteredEvents}
          currentUser={user}
          onJoin={handleJoinEvent}
          onLeave={handleLeaveEvent}
          onEdit={handleEditEvent}
        />
      )}
    </div>
  );
}