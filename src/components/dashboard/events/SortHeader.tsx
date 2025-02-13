import React from 'react';
import type { SortConfig } from '../types';

interface SortHeaderProps {
  label: string;
  sortKey: SortConfig['key'];
  sortConfig: SortConfig;
  onSort: (key: SortConfig['key']) => void;
}

export function SortHeader({ label, sortKey, sortConfig, onSort }: SortHeaderProps) {
  const isActive = sortConfig.key === sortKey;
  
  return (
    <button
      onClick={() => onSort(sortKey)}
      className={`group inline-flex items-center space-x-1 text-xs font-medium uppercase text-gray-500 hover:text-gray-700`}
    >
      <span>{label}</span>
      <span className="inline-flex flex-col">
        <svg 
          className={`h-3 w-3 ${isActive && sortConfig.direction === 'asc' ? 'text-blue-500' : 'text-gray-400'}`}
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
        >
          <path d="M4 8l4-4" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <svg 
          className={`h-3 w-3 -mt-1.5 ${isActive && sortConfig.direction === 'desc' ? 'text-blue-500' : 'text-gray-400'}`}
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
        >
          <path d="M8 4l-4 4" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </span>
    </button>
  );
} 