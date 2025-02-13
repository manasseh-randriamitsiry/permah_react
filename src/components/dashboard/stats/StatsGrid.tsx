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
    <div className="grid gap-4 md:grid-cols-5">
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
  );
} 