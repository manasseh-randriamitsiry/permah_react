import React from 'react';

export function LoadingState() {
  return (
    <div className="flex flex-col h-full min-h-[600px] bg-white rounded-lg border border-gray-200">
      <div className="flex-1 flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    </div>
  );
} 