import React from 'react';
import { Link } from 'react-router-dom';

export function QuickLinks() {
  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold uppercase text-gray-900">Quick Links</h3>
      <ul className="space-y-3 text-sm">
        <li>
          <Link to="/events" className="text-gray-600 hover:text-blue-600">
            Browse Events
          </Link>
        </li>
        <li>
          <Link to="/events/new" className="text-gray-600 hover:text-blue-600">
            Create Event
          </Link>
        </li>
        <li>
          <Link to="/dashboard" className="text-gray-600 hover:text-blue-600">
            Dashboard
          </Link>
        </li>
      </ul>
    </div>
  );
} 