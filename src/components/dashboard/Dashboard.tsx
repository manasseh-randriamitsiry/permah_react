import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/auth-store';
import { DashboardHeader } from './header/DashboardHeader';
import { StatsGrid } from './stats/StatsGrid';
import { DeleteEventModal } from './modals/DeleteEventModal';
import { DashboardEventTable } from './events/DashboardEventTable';
import { useDashboard } from './hooks/useDashboard';

export function Dashboard() {
  const { t } = useTranslation();
  const user = useAuthStore(state => state.user);
  const {
    events,
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
    retry,
  } = useDashboard();

  if (!user) {
    return (
      <div className="rounded-lg bg-yellow-50 p-4 text-yellow-800">
        <h3 className="text-lg font-medium">{t('Please Log In')}</h3>
        <p className="mt-2 text-sm">{t('You need to be logged in to view your dashboard.')}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6">
      <DashboardHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onCreateEvent={handleCreateEvent}
      />

      <StatsGrid stats={stats} />

      <DashboardEventTable
        events={events}
        isLoading={isLoading}
        error={error}
        searchTerm={searchTerm}
        sortConfig={sortConfig}
        onSort={handleSort}
        onEventClick={handleEventClick}
        onEventEdit={handleEditEvent}
        onEventDelete={handleDeleteEvent}
        onRetry={retry}
      />

      <DeleteEventModal
        isOpen={showDeleteModal}
        event={eventToDelete}
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowDeleteModal(false);
          setEventToDelete(null);
        }}
      />
    </div>
  );
} 