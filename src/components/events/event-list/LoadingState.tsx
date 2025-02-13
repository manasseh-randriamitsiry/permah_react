import React from 'react';

export function LoadingState() {
  return (
    <div className="flex h-[calc(100vh-12rem)] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
    </div>
  );
} 