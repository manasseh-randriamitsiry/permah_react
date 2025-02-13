import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth-store';
import type { EventData } from '../../types';
import { EventService } from '../../services/event.service';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  className?: string;
}

function StatCard({ title, value, icon, className = '' }: StatCardProps) {
  const isCurrency = title.toLowerCase().includes('income');

  return (
    <div className={`rounded-lg p-6 shadow ${className}`}>
      <div className="flex items-center">
        <div className="mr-4 text-2xl">{icon}</div>
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">
            {isCurrency 
              ? new Intl.NumberFormat(undefined, {
                  style: 'currency',
                  currency: 'USD'
                }).format(value)
              : value}
          </p>
        </div>
      </div>
    </div>
  );
}

interface SortConfig {
  key: 'date' | 'totalPlaces' | 'joinedCount' | 'status' | 'title' | 'earnings';
  direction: 'asc' | 'desc';
}

function DashboardEventRow({ 
  event, 
  onClick, 
  onEdit,
  onDelete 
}: { 
  event: EventData; 
  onClick: (eventId: number) => void;
  onEdit: (eventId: number) => void;
  onDelete: (eventId: number) => void;
}) {
  const { t } = useTranslation();
  
  const isUpcoming = new Date(event.date) > new Date();
  const joinedCount = event.attendees?.length || event.participants?.length || 0;
  const totalPlaces = event.available_places || 0;
  const freePlaces = totalPlaces - joinedCount;
  const totalEarnings = (event.price || 0) * joinedCount;
  
  const formatDate = (date: string) => {
    const d = new Date(date);
    return {
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    };
  };

  const dateInfo = formatDate(event.date);
  
  return (
    <div className="border-b border-gray-200 hover:bg-gray-50">
      {/* Mobile view */}
      <div className="flex flex-col p-4 md:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300"
              onClick={(e) => e.stopPropagation()}
            />
            {event.image_url ? (
              <img 
                src={event.image_url} 
                alt={event.title}
                className="h-10 w-10 rounded-lg object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-200">
                <span className="text-sm text-gray-600">
                  {event.title.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <h3 className="font-medium text-gray-900">{event.title}</h3>
              <p className="text-sm text-gray-500">{dateInfo.date} at {dateInfo.time}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-3 flex justify-between text-sm">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <span className="text-gray-500">Total</span>
              <p className="font-medium">{totalPlaces}</p>
            </div>
            <div>
              <span className="text-gray-500">Joined</span>
              <p className="font-medium">{joinedCount}</p>
            </div>
            <div>
              <span className="text-gray-500">Free</span>
              <p className="font-medium">{freePlaces}</p>
            </div>
            <div>
              <span className="text-gray-500">Earnings</span>
              <p className="font-medium">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD'
                }).format(totalEarnings)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
              isUpcoming ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {isUpcoming ? t('Ongoing') : t('Closed')}
            </span>
          </div>
        </div>
        
        <div className="mt-3 flex justify-end space-x-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onEdit(event.id);
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDelete(event.id);
            }}
            className="text-gray-400 hover:text-red-600"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Desktop view */}
      <div 
        onClick={() => onClick(event.id)}
        className="hidden cursor-pointer items-center px-6 py-3 md:flex"
      >
        <div className="flex w-8">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        
        <div className="flex flex-1 items-center space-x-4">
          {event.image_url ? (
            <img 
              src={event.image_url} 
              alt={event.title}
              className="h-10 w-10 rounded-lg object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-200">
              <span className="text-sm text-gray-600">
                {event.title.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <span className="font-medium text-gray-900">{event.title}</span>
        </div>

        <div className="flex items-center">
          <div className="w-40 text-sm text-gray-500">{dateInfo.date}</div>
          <div className="w-24 text-center text-sm text-gray-500">{totalPlaces}</div>
          <div className="w-24 text-center text-sm text-gray-500">{joinedCount}</div>
          <div className="w-24 text-center text-sm text-gray-500">{freePlaces}</div>
          <div className="w-32 text-center text-sm text-gray-500">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD'
            }).format(totalEarnings)}
          </div>
          <div className="w-28">
            <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
              isUpcoming ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {isUpcoming ? t('Ongoing') : t('Closed')}
            </span>
          </div>
          <div className="ml-8 flex w-20 justify-end space-x-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onEdit(event.id);
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onDelete(event.id);
              }}
              className="text-gray-400 hover:text-red-600"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const [events, setEvents] = React.useState<EventData[]>([]);
  const [filteredEvents, setFilteredEvents] = React.useState<EventData[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);
  const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);
  const [eventToDelete, setEventToDelete] = React.useState<number | null>(null);
  const [sortConfig, setSortConfig] = React.useState<SortConfig>({ 
    key: 'date', 
    direction: 'desc' 
  });

  React.useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const response = await EventService.listEvents();
        
        const userEvents = response.filter((event: EventData) => 
          event.creator?.email === user?.email
        );
        
        setEvents(userEvents);
        setFilteredEvents(userEvents);
      } catch (err) {
        console.error('Dashboard error:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch events'));
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.email) {
      fetchEvents();
    }
  }, [user?.email]);

  React.useEffect(() => {
    const filtered = events.filter(event => 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEvents(filtered);
  }, [searchTerm, events]);

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
    setEventToDelete(eventId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!eventToDelete) return;
    
    try {
      const response = await EventService.deleteEvent(eventToDelete);
      if (response.ok) {
        setEvents(events.filter(event => event.id !== eventToDelete));
        setFilteredEvents(filteredEvents.filter(event => event.id !== eventToDelete));
        setShowDeleteModal(false);
        setEventToDelete(null);
      } else {
        throw new Error('Failed to delete event');
      }
    } catch (err) {
      console.error('Error deleting event:', err);
      setError(err instanceof Error ? err : new Error('Failed to delete event'));
    }
  };

  const sortEvents = (events: EventData[]) => {
    return [...events].sort((a, b) => {
      const getJoinedCount = (event: EventData) => 
        event.attendees?.length || event.participants?.length || 0;

      switch (sortConfig.key) {
        case 'date':
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
        
        case 'totalPlaces':
          const totalA = a.available_places || 0;
          const totalB = b.available_places || 0;
          return sortConfig.direction === 'asc' ? totalA - totalB : totalB - totalA;
        
        case 'joinedCount':
          const joinedA = getJoinedCount(a);
          const joinedB = getJoinedCount(b);
          return sortConfig.direction === 'asc' ? joinedA - joinedB : joinedB - joinedA;
        
        case 'status':
          const statusA = new Date(a.date) > new Date() ? 1 : 0;
          const statusB = new Date(b.date) > new Date() ? 1 : 0;
          return sortConfig.direction === 'asc' ? statusA - statusB : statusB - statusA;

        case 'title':
          return sortConfig.direction === 'asc' 
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title);
        
        case 'earnings':
          const earningsA = (a.price || 0) * getJoinedCount(a);
          const earningsB = (b.price || 0) * getJoinedCount(b);
          return sortConfig.direction === 'asc' ? earningsA - earningsB : earningsB - earningsA;
        
        default:
          return 0;
      }
    });
  };

  const handleSort = (key: SortConfig['key']) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const SortHeader = ({ label, sortKey }: { label: string; sortKey: SortConfig['key'] }) => {
    const isActive = sortConfig.key === sortKey;
    
    return (
      <button
        onClick={() => handleSort(sortKey)}
        className={`group inline-flex items-center space-x-1 text-xs font-medium uppercase text-gray-500 hover:text-gray-700`}
      >
        <span>{label}</span>
        <span className="inline-flex flex-col">
          <svg 
            className={`h-3 w-3 ${isActive && sortConfig.direction === 'asc' ? 'text-blue-500' : 'text-gray-400'}`}
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
          >
            <path d="M4 8l4-4" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <svg 
            className={`h-3 w-3 -mt-1.5 ${isActive && sortConfig.direction === 'desc' ? 'text-blue-500' : 'text-gray-400'}`}
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
          >
            <path d="M8 4l-4 4" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </span>
      </button>
    );
  };

  if (!user) {
    return (
      <div className="rounded-lg bg-yellow-50 p-4 text-yellow-800">
        <h3 className="text-lg font-medium">{t('Please Log In')}</h3>
        <p className="mt-2 text-sm">{t('You need to be logged in to view your dashboard.')}</p>
      </div>
    );
  }

  const stats = {
    upcoming: filteredEvents.filter(e => new Date(e.date) > new Date()).length,
    incoming: filteredEvents.filter(e => {
      const eventDate = new Date(e.date);
      const today = new Date();
      const sevenDaysFromNow = new Date();
      sevenDaysFromNow.setDate(today.getDate() + 7);
      return eventDate > today && eventDate <= sevenDaysFromNow;
    }).length,
    past: filteredEvents.filter(e => new Date(e.date) <= new Date()).length,
    totalParticipants: filteredEvents.reduce((acc, event) => 
      acc + (event.attendees?.length || event.participants?.length || 0), 0
    ),
    totalIncome: filteredEvents.reduce((acc, event) => {
      const attendeeCount = event.attendees?.length || event.participants?.length || 0;
      return acc + (event.price * attendeeCount);
    }, 0),
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold">{t('Your Events')}</h1>
          <div className="relative">
            <input
              type="text"
              placeholder={t('Search events...')}
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
        <button
          onClick={handleCreateEvent}
          className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          {t('Create Event')}
        </button>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-5">
        <StatCard
          title={t('Upcoming Events')}
          value={stats.upcoming}
          icon="📅"
          className="bg-blue-50"
        />
        <StatCard
          title={t('Next 7 Days')}
          value={stats.incoming}
          icon="⌛"
          className="bg-yellow-50"
        />
        <StatCard
          title={t('Past Events')}
          value={stats.past}
          icon="📊"
          className="bg-gray-50"
        />
        <StatCard
          title={t('Total Participants')}
          value={stats.totalParticipants}
          icon="👥"
          className="bg-green-50"
        />
        <StatCard
          title={t('Total Income')}
          value={stats.totalIncome}
          icon="💰"
          className="bg-purple-50"
        />
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        </div>
      ) : error ? (
        <div className="rounded-lg bg-red-50 p-4 text-red-800">
          <h3 className="text-lg font-medium">{t('Error Loading Dashboard')}</h3>
          <p className="mt-2 text-sm">{error.message}</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          {/* Table Header */}
          <div className="hidden border-b border-gray-200 bg-gray-50 px-6 py-3 md:flex items-center">
            <div className="flex w-8">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300"
              />
            </div>
            <div className="flex-1">
              <SortHeader label={t('Event Name')} sortKey="title" />
            </div>
            <div className="flex items-center">
              <div className="w-40">
                <SortHeader label={t('Date')} sortKey="date" />
              </div>
              <div className="w-24 text-center">
                <SortHeader label={t('Total')} sortKey="totalPlaces" />
              </div>
              <div className="w-24 text-center">
                <SortHeader label={t('Joined')} sortKey="joinedCount" />
              </div>
              <div className="w-24 text-center">
                <div className="text-xs font-medium uppercase text-gray-500">{t('Free')}</div>
              </div>
              <div className="w-32 text-center">
                <SortHeader label={t('Earnings')} sortKey="earnings" />
              </div>
              <div className="w-28">
                <SortHeader label={t('Status')} sortKey="status" />
              </div>
              <div className="ml-8 w-20 text-right">
                <div className="text-xs font-medium uppercase text-gray-500">{t('Action')}</div>
              </div>
            </div>
          </div>

          {/* Event Rows */}
          {sortEvents(filteredEvents).map((event: EventData) => (
            <DashboardEventRow
              key={event.id}
              event={event}
              onClick={handleEventClick}
              onEdit={handleEditEvent}
              onDelete={handleDeleteEvent}
            />
          ))}
        </div>
      )}

      {filteredEvents.length === 0 && !isLoading && (
        <div className="text-center">
          <p className="text-gray-600">
            {searchTerm 
              ? t('No events found matching your search.')
              : t('You haven\'t created any events yet.')}
          </p>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            {/* Modal panel */}
            <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      {t('Delete Event')}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {t('Are you sure you want to delete this event? This action cannot be undone.')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {t('Delete')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setEventToDelete(null);
                  }}
                  className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  {t('Cancel')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 