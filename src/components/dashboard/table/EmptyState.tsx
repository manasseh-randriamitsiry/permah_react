import React from 'react';
import { useTranslation } from 'react-i18next';

interface EmptyStateProps {
  searchTerm: string;
}

export function EmptyState({ searchTerm }: EmptyStateProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col h-full min-h-[600px] bg-white rounded-lg border border-gray-200">
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">
            {searchTerm 
              ? "No events found matching your search."
              : "You haven't created any events yet."}
          </p>
          {!searchTerm && (
            <button 
              onClick={() => window.location.href = '/events/new'}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Create your first event
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 