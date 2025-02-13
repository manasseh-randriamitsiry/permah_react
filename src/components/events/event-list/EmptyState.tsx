import React from 'react';

interface EmptyStateProps {
  searchTerm: string;
}

export function EmptyState({ searchTerm }: EmptyStateProps) {
  return (
    <div className="flex h-[calc(100vh-16rem)] items-center justify-center">
      <p className="text-center text-gray-500">
        {searchTerm 
          ? "No events found matching your search."
          : "No events available."}
      </p>
    </div>
  );
} 