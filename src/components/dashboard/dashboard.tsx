import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth-store';
import { eventApi } from '../../services/api';
import type { EventWithUser } from '../../types';
import { PlusIcon } from '@heroicons/react/24/solid';

export function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const [events, setEvents] = React.useState<EventWithUser[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const response = await eventApi.getAll();
        setEvents(response.data || []);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch events'));
        console.error('Error fetching events:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-800">
        <h3 className="text-lg font-medium">Error Loading Dashboard</h3>
        <p className="mt-2 text-sm">Unable to load event data. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Language Switcher and Create Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-3xl font-bold text-gray-900">
            {t('dashboard.title', 'Dashboard')}
          </h1>
          <button
            onClick={() => navigate('/events/new')}
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <PlusIcon className="mr-2 h-5 w-5" />
            {t('dashboard.createEvent', 'Create New Event')}
          </button>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white shadow-lg">
        <h2 className="text-3xl font-bold">
          {t('dashboard.welcome', { name: user?.name || t('common.user') })}
        </h2>
        <p className="mt-2 text-blue-100">
          {t('dashboard.overview')}
        </p>
        
        {/* Quick Action Button */}
        <div className="mt-6">
          <button
            onClick={() => navigate('/events/new')}
            className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-blue-600 shadow-sm hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <PlusIcon className="mr-2 h-5 w-5" />
            {t('dashboard.createEvent', 'Create New Event')}
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Events"
          value={events.length}
          icon="🎉"
          className="bg-blue-50"
        />
        <StatCard
          title="Upcoming Events"
          value={events.filter(e => new Date(e.date) > new Date()).length}
          icon="📅"
          className="bg-green-50"
        />
        <StatCard
          title="Past Events"
          value={events.filter(e => new Date(e.date) <= new Date()).length}
          icon="✓"
          className="bg-yellow-50"
        />
        <StatCard
          title="Total Participants"
          value={events.reduce((acc, event) => acc + (event.number_place || 0), 0)}
          icon="👥"
          className="bg-purple-50"
        />
      </div>

      {/* Recent Activity */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold">Recent Activity</h2>
        <div className="space-y-4">
          {events.slice(0, 5).map((event) => (
            <div
              key={event.id}
              className="flex items-center justify-between rounded-lg border p-4 hover:bg-gray-50"
            >
              <div>
                <h3 className="font-medium">{event.title}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(event.date).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">
                  {event.title}
                </span>
                <span className="text-sm text-gray-500">
                  {event.number_place || 0} participants
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  icon: string;
  className?: string;
}

function StatCard({ title, value, icon, className = '' }: StatCardProps) {
  return (
    <div className={`rounded-lg p-6 shadow ${className}`}>
      <div className="flex items-center">
        <div className="mr-4 text-2xl">{icon}</div>
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
} 