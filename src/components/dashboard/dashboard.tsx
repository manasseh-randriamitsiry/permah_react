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

function DashboardEventRow({ event, onClick }: { event: EventData; onClick: (eventId: number) => void }) {
  const { t } = useTranslation();
  
  const isUpcoming = new Date(event.date) > new Date();
  const attendeeCount = event.attendees?.length || event.participants?.length || 0;
  const availableSpots = event.available_places - attendeeCount;

  return (
    <div 
      onClick={() => onClick(event.id)}
      className="cursor-pointer border-b border-gray-200 bg-white p-4 transition-all hover:bg-gray-50"
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-4">
          {event.image_url && (
            <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded">
              <img 
                src={event.image_url} 
                alt={event.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}
          
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-lg font-semibold text-gray-900">{event.title}</h3>
            <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(event.date).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                {event.location}
              </div>
              <div className="flex items-center">
                <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {attendeeCount} {t('attendees')}
              </div>
            </div>
          </div>
        </div>
        
        <div className="ml-4 flex items-center space-x-4">
          <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            isUpcoming ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {isUpcoming ? t('Upcoming') : t('Past')}
          </span>
          {event.price > 0 && (
            <span className="text-sm font-medium text-gray-900">
              {new Intl.NumberFormat(undefined, {
                style: 'currency',
                currency: 'USD'
              }).format(event.price)}
            </span>
          )}
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

  const handleCreateEvent = () => {
    navigate('/events/create');
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
          {filteredEvents.map((event: EventData) => (
            <DashboardEventRow
              key={event.id}
              event={event}
              onClick={handleEventClick}
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
    </div>
  );
} 