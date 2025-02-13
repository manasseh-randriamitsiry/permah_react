import React from 'react';
import { useNavigate } from 'react-router-dom';
import { EventService } from '../../../services/event.service';
import { useAuthStore } from '../../../store/auth-store';
import type { EventData } from '../../../types';
import type { SortConfig, DashboardStats } from '../types';

export function useDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [events, setEvents] = React.useState<EventData[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);
  const [searchTerm, setSearchTerm] = React.useState('');
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
    totalIncome: 0
  });

  const calculateStats = (events: EventData[]) => {
    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    const newStats: DashboardStats = {
      upcoming: 0,
      incoming: 0,
      past: 0,
      totalParticipants: 0,
      totalIncome: 0
    };

    events.forEach(event => {
      const startDate = new Date(event.startDate);
      const endDate = new Date(event.endDate);
      const attendeeCount = event.attendees?.length || 0;

      // Count events by status
      if (now > endDate) {
        newStats.past++;
      } else if (startDate > now) {
        newStats.upcoming++;
        if (startDate <= nextWeek) {
          newStats.incoming++;
        }
      }

      // Calculate totals
      newStats.totalParticipants += attendeeCount;
      newStats.totalIncome += (event.price || 0) * attendeeCount;
    });

    setStats(newStats);
  };

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

  const fetchEvents = React.useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);
      const response = await EventService.listEvents();
      // Filter events created by the current user
      const userEvents = response.filter((event: EventData) => event.creator?.email === user.email);
      setEvents(userEvents);
      calculateStats(userEvents);
    } catch (err: any) {
      console.error('Error fetching events:', err);
      handleAuthError(err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [user, navigate, logout]);

  React.useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleEventClick = (eventId: number) => {
    localStorage.setItem('selectedEventId', eventId.toString());
    navigate('/events');
  };

  const handleEditEvent = (eventId: number) => {
    navigate(`/events/${eventId}/edit`);
  };

  const handleCreateEvent = () => {
    navigate('/events/new');
  };

  const handleDeleteEvent = (eventId: number) => {
    const event = events.find(e => e.id === eventId);
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
      await fetchEvents(); // Refresh the list
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
    let result = [...events];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(event =>
        event.title.toLowerCase().includes(searchLower) ||
        event.description.toLowerCase().includes(searchLower) ||
        event.location.toLowerCase().includes(searchLower)
      );
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
        case 'joinedCount':
          return ((a.attendees?.length || 0) - (b.attendees?.length || 0)) * direction;
        case 'earnings':
          const aEarnings = (a.price || 0) * (a.attendees?.length || 0);
          const bEarnings = (b.price || 0) * (b.attendees?.length || 0);
          return (aEarnings - bEarnings) * direction;
        case 'status':
          const now = new Date();
          const aStatus = now > new Date(a.endDate) ? 2 : now >= new Date(a.startDate) ? 1 : 0;
          const bStatus = now > new Date(b.endDate) ? 2 : now >= new Date(b.startDate) ? 1 : 0;
          return (aStatus - bStatus) * direction;
        default:
          return 0;
      }
    });

    return result;
  }, [events, searchTerm, sortConfig]);

  return {
    events: filteredAndSortedEvents,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
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
    retry: fetchEvents,
  };
} 