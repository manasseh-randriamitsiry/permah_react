import React from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Filter, X } from 'lucide-react';
import type { SortConfig } from '../types';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortConfig: SortConfig;
  onSort: (key: SortConfig['key']) => void;
  onFiltersChange: (filters: string[]) => void;
  activeFilters: string[];
}

export function SearchBar({ 
  searchTerm, 
  onSearchChange, 
  sortConfig, 
  onSort,
  onFiltersChange,
  activeFilters
}: SearchBarProps) {
  const { t } = useTranslation();
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const filterRef = React.useRef<HTMLDivElement>(null);

  const filterOptions = [
    { label: t('dashboard.filters.upcoming'), value: 'upcoming' },
    { label: t('dashboard.filters.ongoing'), value: 'ongoing' },
    { label: t('dashboard.filters.past'), value: 'past' },
    { label: t('dashboard.filters.full'), value: 'full' },
    { label: t('dashboard.filters.available'), value: 'available' },
  ];

  const sortOptions = [
    { label: t('dashboard.sort.startDate'), value: 'startDate' },
    { label: t('dashboard.sort.endDate'), value: 'endDate' },
    { label: t('dashboard.sort.title'), value: 'title' },
    { label: t('dashboard.sort.totalPlaces'), value: 'totalPlaces' },
    { label: t('dashboard.sort.earnings'), value: 'earnings' },
    { label: t('dashboard.sort.status'), value: 'status' },
  ];

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleFilter = (value: string) => {
    const newFilters = activeFilters.includes(value)
      ? activeFilters.filter(f => f !== value)
      : [...activeFilters, value];
    onFiltersChange(newFilters);
  };

  const handleSort = (key: SortConfig['key']) => {
    onSort(key);
    setIsFilterOpen(false);
  };

  return (
    <div className="relative" ref={filterRef}>
      <div className="flex items-center gap-2">
        <div className="relative">
          <input
            type="text"
            placeholder={t('dashboard.search')}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-64 rounded-lg border border-gray-300 p-2 pl-9 pr-4 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium ${
            isFilterOpen || activeFilters.length > 0
              ? 'border-blue-500 bg-blue-50 text-blue-600'
              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Filter className="h-4 w-4" />
          <span>
            {activeFilters.length > 0
              ? `${activeFilters.length} ${t('dashboard.filters.applied')}`
              : t('dashboard.filters.filter')}
          </span>
        </button>
      </div>

      {isFilterOpen && (
        <div className="absolute right-0 top-12 z-10 w-72 rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
          <div className="space-y-4">
            {/* Filters Section */}
            <div>
              <h3 className="mb-2 text-sm font-medium text-gray-900">{t('dashboard.filters.status')}</h3>
              <div className="space-y-2">
                {filterOptions.map(option => (
                  <label key={option.value} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={activeFilters.includes(option.value)}
                      onChange={() => toggleFilter(option.value)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sort Section */}
            <div>
              <h3 className="mb-2 text-sm font-medium text-gray-900">{t('dashboard.filters.sortBy')}</h3>
              <div className="space-y-2">
                {sortOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => handleSort(option.value as SortConfig['key'])}
                    className={`flex w-full items-center rounded-md px-2 py-1 text-left text-sm ${
                      sortConfig.key === option.value
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {option.label}
                    {sortConfig.key === option.value && (
                      <span className="ml-2 text-xs">
                        ({sortConfig.direction === 'asc' ? '↑' : '↓'})
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 