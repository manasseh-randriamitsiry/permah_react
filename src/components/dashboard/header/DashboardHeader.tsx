import React from 'react';
import { useTranslation } from 'react-i18next';
import { SearchBar } from './SearchBar';
import type { SortConfig } from '../types';

interface DashboardHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onCreateEvent: () => void;
  sortConfig: SortConfig;
  onSort: (key: SortConfig['key']) => void;
  activeFilters: string[];
  onFiltersChange: (filters: string[]) => void;
}

export function DashboardHeader({ 
  searchTerm, 
  onSearchChange, 
  onCreateEvent,
  sortConfig,
  onSort,
  activeFilters,
  onFiltersChange
}: DashboardHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-bold">{t('dashboard.title')}</h1>
        <SearchBar 
          searchTerm={searchTerm} 
          onSearchChange={onSearchChange}
          sortConfig={sortConfig}
          onSort={onSort}
          activeFilters={activeFilters}
          onFiltersChange={onFiltersChange}
        />
      </div>
      <button
        onClick={onCreateEvent}
        className="inline-flex justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        {t('dashboard.createEvent')}
      </button>
    </div>
  );
} 