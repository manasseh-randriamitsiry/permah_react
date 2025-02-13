import React from 'react';
import { Calendar } from 'lucide-react';

export function BrandSection() {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Calendar className="h-6 w-6 text-blue-600" />
        <span className="text-xl font-bold">EventManager</span>
      </div>
      <p className="text-sm text-gray-600">
        Making event management simple and delightful. Create, manage, and join events seamlessly.
      </p>
    </div>
  );
} 