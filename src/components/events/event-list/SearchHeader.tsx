import React from 'react';
import { useTranslation } from 'react-i18next';

interface SearchHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  activeFilters: string[];
  onFiltersChange: (filters: string[]) => void;
}

export function SearchHeader({ 
  searchTerm, 
  onSearchChange,
  activeFilters,
  onFiltersChange
}: SearchHeaderProps) {
  const { t } = useTranslation();

  const filterOptions = [
    { value: 'upcoming', label: t('dashboard.filters.upcoming') },
    { value: 'ongoing', label: t('dashboard.filters.ongoing') },
    { value: 'past', label: t('dashboard.filters.past') },
    { value: 'full', label: t('dashboard.filters.full') },
    { value: 'available', label: t('dashboard.filters.available') }
  ];

  const toggleFilter = (value: string) => {
    const newFilters = activeFilters.includes(value)
      ? activeFilters.filter(f => f !== value)
      : [...activeFilters, value];
    onFiltersChange(newFilters);
  };
  
  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold">{t('events.list.title')}</h1>
        <div className="w-full max-w-md">
          <input
            type="search"
            placeholder={t('events.list.searchPlaceholder')}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {filterOptions.map(option => (
          <label
            key={option.value}
            className="inline-flex items-center px-3 py-1.5 rounded-full border cursor-pointer hover:bg-gray-50"
          >
            <input
              type="checkbox"
              className="sr-only"
              checked={activeFilters.includes(option.value)}
              onChange={() => toggleFilter(option.value)}
            />
            <span className={`text-sm ${activeFilters.includes(option.value) ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>
              {option.label}
            </span>
          </label>
        ))}
        {activeFilters.length > 0 && (
          <span className="text-sm text-gray-500 py-1.5">
            {activeFilters.length} {t('dashboard.filters.applied')}
          </span>
        )}
      </div>
    </div>
  );
} 