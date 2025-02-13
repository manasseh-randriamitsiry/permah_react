import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { EventService } from '../../services/event.service';
import { EventForm } from './event-form';
import type { EventData } from '../../types';

type CreateEventData = Required<Omit<EventData, 'id' | 'creator' | 'created_at' | 'updated_at' | 'user' | 'attendees' | 'participants'>>;

export function CreateEvent() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [error, setError] = React.useState('');

  const handleSubmit = async (eventData: Partial<CreateEventData>) => {
    try {
      // Log the raw form data
      console.log('Form data received:', JSON.stringify(eventData, null, 2));
      
      // Validate required fields for creation
      const requiredFields: (keyof CreateEventData)[] = [
        'title',
        'description',
        'startDate',
        'endDate',
        'location',
        'available_places',
        'price',
        'image_url'
      ];

      const missingFields = requiredFields.filter(field => !eventData[field]);
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // For creation, we need all fields, so we can cast as Required
      const response = await EventService.createEvent(eventData as CreateEventData);
      console.log('Event created successfully:', response);
      navigate('/events');
    } catch (err: any) {
      console.error('Create event error:', err);
      setError(err.message || t('events.form.errors.createFailed'));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}
      <EventForm onSubmit={handleSubmit} />
    </div>
  );
} 