import React from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  className?: string;
}

export function StatCard({ title, value, icon, className = '' }: StatCardProps) {
  const isCurrency = title.toLowerCase().includes('income');

  return (
    <div className={`rounded-lg p-6 shadow ${className}`}>
      <div className="flex items-center">
        <div className="mr-4 text-2xl">{icon}</div>
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">
            {typeof value === 'number' && isCurrency 
              ? `$${value.toFixed(2)}`
              : value}
          </p>
        </div>
      </div>
    </div>
  );
} 