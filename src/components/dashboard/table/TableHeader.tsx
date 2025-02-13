import React from 'react';
import { useTranslation } from 'react-i18next';
import { SortHeader } from '../events/SortHeader';
import type { SortConfig } from '../types';

interface TableHeaderProps {
  sortConfig: SortConfig;
  onSort: (key: SortConfig['key']) => void;
  onSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
  allSelected: boolean;
  someSelected: boolean;
}

export function TableHeader({ 
  sortConfig, 
  onSort,
  onSelectAll,
  allSelected,
  someSelected,
}: TableHeaderProps) {
  const { t } = useTranslation();

  return (
    <tr className="bg-gray-50">
      <th scope="col" className="w-8 p-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300"
            checked={allSelected}
            ref={input => {
              if (input) {
                input.indeterminate = someSelected && !allSelected;
              }
            }}
            onChange={onSelectAll}
            aria-label={t('dashboard.table.selectAll')}
          />
        </div>
      </th>
      <th scope="col" className="px-6 py-3 text-left">
        <SortHeader 
          label={t('dashboard.table.eventName')} 
          sortKey="title" 
          sortConfig={sortConfig}
          onSort={onSort}
        />
      </th>
      <th scope="col" className="px-6 py-3 text-left">
        <SortHeader 
          label={t('dashboard.table.startDate')} 
          sortKey="startDate" 
          sortConfig={sortConfig}
          onSort={onSort}
        />
      </th>
      <th scope="col" className="px-6 py-3 text-left">
        <SortHeader 
          label={t('dashboard.table.endDate')} 
          sortKey="endDate" 
          sortConfig={sortConfig}
          onSort={onSort}
        />
      </th>
      <th scope="col" className="px-6 py-3 text-center">
        <SortHeader 
          label={t('dashboard.table.total')} 
          sortKey="totalPlaces" 
          sortConfig={sortConfig}
          onSort={onSort}
        />
      </th>
      <th scope="col" className="px-6 py-3 text-center">
        <SortHeader 
          label={t('dashboard.table.joined')} 
          sortKey="joinedCount" 
          sortConfig={sortConfig}
          onSort={onSort}
        />
      </th>
      <th scope="col" className="px-6 py-3 text-center">
        <span className="text-xs font-medium uppercase text-gray-500">
          {t('dashboard.table.free')}
        </span>
      </th>
      <th scope="col" className="px-6 py-3 text-center">
        <SortHeader 
          label={t('dashboard.table.earnings')} 
          sortKey="earnings" 
          sortConfig={sortConfig}
          onSort={onSort}
        />
      </th>
      <th scope="col" className="px-6 py-3 text-center">
        <SortHeader 
          label={t('dashboard.table.status')} 
          sortKey="status" 
          sortConfig={sortConfig}
          onSort={onSort}
        />
      </th>
      <th scope="col" className="px-6 py-3 text-right">
        <span className="text-xs font-medium uppercase text-gray-500">
          {t('dashboard.table.action')}
        </span>
      </th>
    </tr>
  );
} 