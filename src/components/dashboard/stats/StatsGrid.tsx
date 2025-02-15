import React from 'react';
import { useTranslation } from 'react-i18next';
import { StatCard } from './StatCard';
import type { DashboardStats } from '../types';

interface StatsGridProps {
  stats: DashboardStats;
}

export function StatsGrid({ stats }: StatsGridProps) {
  const { t } = useTranslation();

  return (
    <div className="grid gap-4 md:grid-cols-7">
      <StatCard
        title={t('dashboard.stats.upcomingEvents')}
        value={stats.upcoming}
        icon="📅"
        className="bg-blue-50"
      />
      <StatCard
        title={t('dashboard.stats.next7Days')}
        value={stats.incoming}
        icon="⌛"
        className="bg-yellow-50"
      />
      <StatCard
        title={t('dashboard.stats.pastEvents')}
        value={stats.past}
        icon="📊"
        className="bg-gray-50"
      />
      <StatCard
        title={t('dashboard.stats.totalParticipants')}
        value={stats.totalParticipants}
        icon="👥"
        className="bg-green-50"
      />
      <StatCard
        title={t('dashboard.stats.totalIncome')}
        value={`$${stats.totalIncome.toFixed(2)}`}
        icon="💰"
        className="bg-purple-50"
      />
      <StatCard
        title={t('dashboard.stats.availablePlaces')}
        value={stats.totalAvailablePlaces}
        icon="🎟️"
        className="bg-indigo-50"
      />
      <StatCard
        title={t('dashboard.stats.averageOccupancy')}
        value={`${stats.averageOccupancyRate.toFixed(1)}%`}
        icon="📈"
        className="bg-pink-50"
      />
    </div>
  );
} 