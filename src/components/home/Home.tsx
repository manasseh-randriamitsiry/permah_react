import React from 'react';

export function Home() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
        Manage Your Events with Ease
      </h1>
      <p className="mt-6 text-lg leading-8 text-gray-600">
        Create, manage, and join events seamlessly with our platform. Perfect for organizers and attendees alike.
      </p>
      <div className="mt-10 flex items-center justify-center gap-x-6">
        <a
          href="/events"
          className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Browse Events
        </a>
        <a href="/events/new" className="text-sm font-semibold leading-6 text-gray-900">
          Create Event <span aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  );
} 