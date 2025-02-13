import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';
import type { EventData } from '../../types';
import { useEventForm } from './event-form/useEventForm';
import { FormFields } from './event-form/FormFields';

interface EventFormProps {
  event?: EventData;
  onSubmit: (eventData: Partial<Omit<EventData, 'id' | 'creator' | 'created_at' | 'updated_at' | 'user' | 'attendees' | 'participants'>>) => Promise<void>;
}

export function EventForm({ event, onSubmit }: EventFormProps) {
  const { t } = useTranslation();
  const {
    isSubmitting,
    error,
    titleRef,
    descriptionRef,
    startDateRef,
    endDateRef,
    locationRef,
    imageUrlRef,
    availablePlacesRef,
    priceRef,
    getMinDate,
    handleSubmit,
  } = useEventForm({ event, onSubmit });

  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="mb-6 text-2xl font-bold">
        {event ? t('events.form.update') : t('events.form.create')}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <FormFields
          titleRef={titleRef}
          descriptionRef={descriptionRef}
          startDateRef={startDateRef}
          endDateRef={endDateRef}
          locationRef={locationRef}
          imageUrlRef={imageUrlRef}
          availablePlacesRef={availablePlacesRef}
          priceRef={priceRef}
          minDate={getMinDate()}
          isUpdate={!!event}
        />

        <div className="flex justify-end space-x-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            {isSubmitting 
              ? t('events.form.saving')
              : event 
                ? t('events.form.update')
                : t('events.form.create')
            }
          </Button>
        </div>
      </form>
    </div>
  );
}