import React from 'react';
import { useTranslation } from 'react-i18next';

export interface SearchFilters {
  q?: string;
  start_date?: string;
  end_date?: string;
  location?: string;
  min_price?: number;
  max_price?: number;
  has_available_places?: boolean;
  timeframe?: 'all' | 'next_week' | 'next_month' | 'custom';
}

interface SearchFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onReset: () => void;
}

export function SearchFilters({ filters, onFiltersChange, onReset }: SearchFiltersProps) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleTimeframeChange = (timeframe: SearchFilters['timeframe']) => {
    const newFilters = { ...filters, timeframe };
    
    // Reset custom dates when switching to preset timeframes
    if (timeframe !== 'custom') {
      delete newFilters.start_date;
      delete newFilters.end_date;
    }

    // Set date range based on timeframe
    const now = new Date();
    if (timeframe === 'next_week') {
      const nextWeek = new Date();
      nextWeek.setDate(now.getDate() + 7);
      newFilters.start_date = now.toISOString().split('T')[0];
      newFilters.end_date = nextWeek.toISOString().split('T')[0];
    } else if (timeframe === 'next_month') {
      const nextMonth = new Date();
      nextMonth.setMonth(now.getMonth() + 1);
      newFilters.start_date = now.toISOString().split('T')[0];
      newFilters.end_date = nextMonth.toISOString().split('T')[0];
    }

    onFiltersChange(newFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
      <button
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="font-medium text-gray-700">{t('events.filters.title')}</span>
        <svg
          className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="p-4 border-t border-gray-200">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Timeframe Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {t('events.filters.timeframe')}
              </label>
              <select
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={filters.timeframe || 'all'}
                onChange={(e) => handleTimeframeChange(e.target.value as SearchFilters['timeframe'])}
              >
                <option value="all">{t('events.filters.timeframes.all')}</option>
                <option value="next_week">{t('events.filters.timeframes.nextWeek')}</option>
                <option value="next_month">{t('events.filters.timeframes.nextMonth')}</option>
                <option value="custom">{t('events.filters.timeframes.custom')}</option>
              </select>
            </div>

            {/* Custom Date Range */}
            {filters.timeframe === 'custom' && (
              <>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('events.filters.startDate')}
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={filters.start_date || ''}
                    onChange={(e) => onFiltersChange({ ...filters, start_date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('events.filters.endDate')}
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={filters.end_date || ''}
                    onChange={(e) => onFiltersChange({ ...filters, end_date: e.target.value })}
                  />
                </div>
              </>
            )}

            {/* Location */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {t('events.filters.location')}
              </label>
              <input
                type="text"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={filters.location || ''}
                onChange={(e) => onFiltersChange({ ...filters, location: e.target.value })}
                placeholder={t('events.filters.locationPlaceholder')}
              />
            </div>

            {/* Price Range */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {t('events.filters.minPrice')}
              </label>
              <input
                type="number"
                min="0"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={filters.min_price || ''}
                onChange={(e) => onFiltersChange({ ...filters, min_price: e.target.valueAsNumber })}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {t('events.filters.maxPrice')}
              </label>
              <input
                type="number"
                min="0"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={filters.max_price || ''}
                onChange={(e) => onFiltersChange({ ...filters, max_price: e.target.valueAsNumber })}
              />
            </div>

            {/* Available Places Toggle */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="has_available_places"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                checked={filters.has_available_places || false}
                onChange={(e) => onFiltersChange({ ...filters, has_available_places: e.target.checked })}
              />
              <label htmlFor="has_available_places" className="text-sm font-medium text-gray-700">
                {t('events.filters.onlyAvailable')}
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex justify-end space-x-3">
            <button
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              onClick={onReset}
            >
              {t('events.filters.reset')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 