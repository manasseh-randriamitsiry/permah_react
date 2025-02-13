import React from 'react';
import { useNavigate } from 'react-router-dom';
import { EventService } from '../../services/event.service';
import { EventForm } from './event-form';
import type { EventData } from '../../types';

type CreateEventData = Required<Omit<EventData, 'id' | 'creator' | 'created_at' | 'updated_at' | 'user' | 'attendees' | 'participants'>>;

export function CreateEvent() {
  const navigate = useNavigate();
  
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
    } catch (error: any) {
      console.error('Error creating event:', error);
      // Log the actual error response if available
      if (error.response) {
        try {
          const errorData = await error.response.json();
          console.error('Server error details:', errorData);
        } catch (parseError) {
          console.error('Error parsing error response:', parseError);
          console.error('Raw error response:', await error.response.text());
        }
      }
      throw error;
    }
  };

  return <EventForm onSubmit={handleSubmit} />;
} 