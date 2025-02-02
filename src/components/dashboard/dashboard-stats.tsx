import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAuthStore } from '../../store/auth-store';
import type { Event } from '../../types';

interface DashboardStats {
  totalEvents: number;
  upcomingEvents: number;
  pastEvents: number;
  participantsCount: number;
  eventsByCategory: { name: string; value: number }[];
  eventsByMonth: { month: string; count: number }[];
  popularEvents: Event[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export function DashboardStats({ events }: { events: Event[] }) {
  const user = useAuthStore(state => state.user);

  const calculateStats = (): DashboardStats => {
    const now = new Date();
    const stats: DashboardStats = {
      totalEvents: events.length,
      upcomingEvents: events.filter(e => new Date(e.date) > now).length,
      pastEvents: events.filter(e => new Date(e.date) <= now).length,
      participantsCount: events.reduce((acc, event) => acc + (event.number_place || 0), 0),
      eventsByCategory: [],
      eventsByMonth: [],
      popularEvents: [...events].sort((a, b) => 
        (b.number_place || 0) - (a.number_place || 0)
      ).slice(0, 5)
    };

    // Calculate events by category
    const categoryCount = events.reduce((acc, event) => {
      acc[event.title] = (acc[event.title] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    stats.eventsByCategory = Object.entries(categoryCount).map(([name, value]) => ({
      name,
      value
    }));

    // Calculate events by month
    const monthCount = events.reduce((acc, event) => {
      const month = new Date(event.date).toLocaleString('default', { month: 'short' });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    stats.eventsByMonth = Object.entries(monthCount).map(([month, count]) => ({
      month,
      count
    }));

    return stats;
  };

  const stats = calculateStats();

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Events"
          value={stats.totalEvents}
          icon="🎉"
          className="bg-blue-50"
        />
        <StatCard
          title="Upcoming Events"
          value={stats.upcomingEvents}
          icon="📅"
          className="bg-green-50"
        />
        <StatCard
          title="Past Events"
          value={stats.pastEvents}
          icon="✓"
          className="bg-yellow-50"
        />
        <StatCard
          title="Total Participants"
          value={stats.participantsCount}
          icon="👥"
          className="bg-purple-50"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Events by Month */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="mb-4 text-lg font-semibold">Events by Month</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.eventsByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" name="Events" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Events by Category */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="mb-4 text-lg font-semibold">Events by Category</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.eventsByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stats.eventsByCategory.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Popular Events Table */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h3 className="mb-4 text-lg font-semibold">Most Popular Events</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Event Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Participants
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {stats.popularEvents.map((event) => (
                <tr key={event.id}>
                  <td className="whitespace-nowrap px-6 py-4">{event.title}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {new Date(event.date).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">{event.title}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {event.number_place || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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