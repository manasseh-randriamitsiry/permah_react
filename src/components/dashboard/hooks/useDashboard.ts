import React from 'react';
import { useNavigate } from 'react-router-dom';
import { EventService } from '../../../services/event.service';
import { useAuthStore } from '../../../store/auth-store';
import type { EventData, EventStatistics, EventWithStats, CreatedEventsResponse, AttendedEventsResponse } from '../../../types';
import type { SortConfig, DashboardStats } from '../types';

export function useDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [createdEvents, setCreatedEvents] = React.useState<EventWithStats[]>([]);
  const [attendedEvents, setAttendedEvents] = React.useState<EventData[]>([]);
  const [upcomingEvents, setUpcomingEvents] = React.useState<EventWithStats[]>([]);
  const [pastEvents, setPastEvents] = React.useState<EventWithStats[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [activeFilters, setActiveFilters] = React.useState<string[]>([]);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [eventToDelete, setEventToDelete] = React.useState<EventData | null>(null);
  const [sortConfig, setSortConfig] = React.useState<SortConfig>({
    key: 'startDate',
    direction: 'desc'
  });

  const [stats, setStats] = React.useState<DashboardStats>({
    upcoming: 0,
    incoming: 0,
    past: 0,
    totalParticipants: 0,
    totalIncome: 0,
    totalAvailablePlaces: 0,
    averageOccupancyRate: 0
  });

  const loadEventData = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Load created and attended events in parallel
      const [createdResponse, attendedResponse] = await Promise.all([
        EventService.getMyCreatedEvents(),
        EventService.getMyAttendedEvents()
      ]);

      const created = createdResponse.events;
      const attended = attendedResponse.events;

      // Split created events into upcoming and past
      const now = new Date();
      const upcoming = created.filter((event: EventWithStats) => new Date(event.endDate) > now);
      const past = created.filter((event: EventWithStats) => new Date(event.endDate) <= now);

      // Fetch statistics only for upcoming events
      const statsPromises = upcoming.map((event: EventWithStats) => EventService.getEventStatistics(event.id));
      const eventStats = await Promise.all(statsPromises.map((p: Promise<EventStatistics>) => p.catch((e: Error) => null)));

      console.log('Upcoming events:', upcoming.map((event: EventWithStats) => ({
        id: event.id,
        attendees_count: event.attendees_count,
        available_places: event.available_places
      })));

      console.log('Event statistics:', eventStats);

      setCreatedEvents(created);
      setAttendedEvents(attended);
      setUpcomingEvents(upcoming);
      setPastEvents(past);

      // Calculate enhanced stats
      const newStats: DashboardStats = {
        upcoming: upcoming.length,
        incoming: upcoming.filter((event: EventWithStats) => {
          const startDate = new Date(event.startDate);
          const nextWeek = new Date();
          nextWeek.setDate(nextWeek.getDate() + 7);
          return startDate <= nextWeek;
        }).length,
        past: past.length,
        totalParticipants: created.reduce((sum: number, event: EventWithStats) => sum + (event.attendees_count || 0), 0),
        totalIncome: created.reduce((sum: number, event: EventWithStats) => sum + (event.price * (event.attendees_count || 0)), 0),
        totalAvailablePlaces: eventStats.filter(Boolean).length > 0
          ? eventStats.reduce((sum: number, stats) => {
              if (!stats) return sum;
              return sum + (stats.total_places - stats.attendees_count);
            }, 0)
          : 0,
        averageOccupancyRate: eventStats.filter(Boolean).length > 0
          ? eventStats.reduce((sum: number, stats) => {
              if (!stats) return sum;
              const occupancyRate = ((stats.total_places - stats.available_places) / stats.total_places) * 100;
              return sum + occupancyRate;
            }, 0) / eventStats.filter(Boolean).length
          : 0
      };

      setStats(newStats);
    } catch (error: any) {
      handleAuthError(error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleAuthError = (error: any) => {
    if (error.message.includes('401') || 
        error.message.includes('unauthorized') || 
        error.message.includes('No authentication token found')) {
      logout();
      navigate('/login', { 
        state: { 
          message: 'Your session has expired. Please log in again.',
          redirectTo: '/dashboard'
        }
      });
    }
  };

  const handleSearch = React.useCallback(async () => {
    if (!searchTerm) {
      loadEventData();
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const searchResults = await EventService.searchEvents({
        q: searchTerm,
      });

      setCreatedEvents(searchResults);
    } catch (error: any) {
      handleAuthError(error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm]);

  React.useEffect(() => {
    const debounceTimer = setTimeout(() => {
      handleSearch();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, handleSearch]);

  React.useEffect(() => {
    loadEventData();
  }, [loadEventData]);

  const handleEventClick = (eventId: number) => {
    navigate(`/events/${eventId}`);
  };

  const handleEditEvent = (eventId: number) => {
    navigate(`/events/${eventId}/edit`);
  };

  const handleCreateEvent = () => {
    navigate('/events/new');
  };

  const handleDeleteEvent = (eventId: number) => {
    const event = createdEvents.find(e => e.id === eventId);
    if (event) {
      setEventToDelete(event);
      setShowDeleteModal(true);
    }
  };

  const confirmDelete = async () => {
    if (!eventToDelete) return;

    try {
      setIsLoading(true);
      await EventService.deleteEvent(eventToDelete.id);
      setShowDeleteModal(false);
      setEventToDelete(null);
      await loadEventData(); // Refresh the list
    } catch (err: any) {
      console.error('Error deleting event:', err);
      handleAuthError(err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (key: SortConfig['key']) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Apply sorting and filtering
  const filteredAndSortedEvents = React.useMemo(() => {
    let result = [...createdEvents];
    const now = new Date();

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(event =>
        event.title.toLowerCase().includes(searchLower) ||
        event.description?.toLowerCase().includes(searchLower) ||
        event.location.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filters
    if (activeFilters.length > 0) {
      result = result.filter(event => {
        const startDate = new Date(event.startDate);
        const endDate = new Date(event.endDate);
        const isFull = event.available_places <= (event.attendees?.length || 0);

        return activeFilters.some(filter => {
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

    // Apply sorting
    result.sort((a, b) => {
      const direction = sortConfig.direction === 'asc' ? 1 : -1;
      
      switch (sortConfig.key) {
        case 'startDate':
          return (new Date(a.startDate).getTime() - new Date(b.startDate).getTime()) * direction;
        case 'endDate':
          return (new Date(a.endDate).getTime() - new Date(b.endDate).getTime()) * direction;
        case 'title':
          return a.title.localeCompare(b.title) * direction;
        case 'totalPlaces':
          return (a.available_places - b.available_places) * direction;
        case 'earnings':
          const aEarnings = (a.price || 0) * (a.attendees?.length || 0);
          const bEarnings = (b.price || 0) * (b.attendees?.length || 0);
          return (aEarnings - bEarnings) * direction;
        case 'status':
          const aStatus = now > new Date(a.endDate) ? 2 : now >= new Date(a.startDate) ? 1 : 0;
          const bStatus = now > new Date(b.endDate) ? 2 : now >= new Date(b.startDate) ? 1 : 0;
          return (aStatus - bStatus) * direction;
        default:
          return 0;
      }
    });

    return result;
  }, [createdEvents, searchTerm, sortConfig, activeFilters]);

  return {
    events: filteredAndSortedEvents,
    upcomingEvents,
    pastEvents,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    activeFilters,
    setActiveFilters,
    showDeleteModal,
    setShowDeleteModal,
    eventToDelete,
    setEventToDelete,
    sortConfig,
    stats,
    handleEventClick,
    handleEditEvent,
    handleCreateEvent,
    handleDeleteEvent,
    confirmDelete,
    handleSort,
    retry: loadEventData,
  };
} 