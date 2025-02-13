import React from 'react';

interface SearchHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function SearchHeader({ searchTerm, onSearchChange }: SearchHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
      <h1 className="text-2xl font-bold">Events</h1>
      <div className="w-full max-w-md">
        <input
          type="search"
          placeholder="Search events..."
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex-1"></div> {/* Spacer */}
    </div>
  );
} 