import React from 'react';
import { EventForm } from './event-form';
import { useEditEvent } from './edit-event/useEditEvent';
import { LoadingState } from './edit-event/LoadingState';
import { ErrorState } from './edit-event/ErrorState';

export function EditEvent() {
  const { event, loading, error, handleSubmit } = useEditEvent();

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (!event) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <EventForm event={event} onSubmit={handleSubmit} />
    </div>
  );
}