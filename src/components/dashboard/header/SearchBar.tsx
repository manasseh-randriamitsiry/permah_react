import React from 'react';
import { useTranslation } from 'react-i18next';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function SearchBar({ searchTerm, onSearchChange }: SearchBarProps) {
  const { t } = useTranslation();

  return (
    <div className="relative">
      <input
        type="text"
        placeholder={t('Search events...')}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-64 rounded-lg border border-gray-300 p-2 pl-8 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
      <svg 
        className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth="2" 
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
        />
      </svg>
    </div>
  );
} 