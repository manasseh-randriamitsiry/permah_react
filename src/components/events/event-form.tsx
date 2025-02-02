import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import type { Event } from '../../types';
import { useAuthStore } from '../../store/auth-store';
import { eventApi } from '../../services/api';
import { CalendarIcon, MapPinIcon, CurrencyDollarIcon, PhotoIcon, UserGroupIcon } from '@heroicons/react/24/outline';

interface EventFormProps {
  event?: Event;
  onSubmit: (eventData: {
    title: string;
    description: string;
    date: string;
    location: string;
    image_url: string;
    available_places: number;
    price: number;
  }) => Promise<void>;
}

export function EventForm({ event, onSubmit }: EventFormProps) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState('');
  const { user, isAuthenticated } = useAuthStore();

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/events/create' } });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!isAuthenticated || !user?.id) {
      setError('You must be logged in to create an event');
      navigate('/login', { state: { from: '/events/create' } });
      return;
    }
    
    setIsSubmitting(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const date = new Date(formData.get('date') as string);
    
    // Validate date is in the future
    if (date <= new Date()) {
      setError('Event date must be in the future');
      setIsSubmitting(false);
      return;
    }

    // Validate image URL
    const imageUrl = formData.get('image_url') as string;
    try {
      new URL(imageUrl);
    } catch {
      setError('Please enter a valid image URL (e.g., https://example.com/image.jpg)');
      setIsSubmitting(false);
      return;
    }

    // Validate required fields
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const location = formData.get('location') as string;
    const numberPlace = parseInt(formData.get('number_place') as string);
    const price = parseFloat(formData.get('price') as string);

    if (!title || !description || !location || isNaN(numberPlace) || isNaN(price)) {
      setError('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }

    const eventData = {
      title,
      description,
      date: date.toISOString(),
      location,
      image_url: imageUrl,
      available_places: numberPlace,
      price
    };

    try {
      console.log('Submitting event data:', eventData); // Debug log
      await onSubmit(eventData);
      navigate('/events');
    } catch (err: any) {
      console.error('Event creation error:', err);
      console.error('Response data:', err.response?.data); // Debug log
      console.error('Status:', err.response?.status); // Debug log
      console.error('Headers:', err.response?.headers); // Debug log
      
      if (err.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to save event';
        setError(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get minimum date for the datetime-local input (current time)
  const getMinDate = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          {event ? 'Update Event' : 'Create New Event'}
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Fill in the details below to {event ? 'update your' : 'create a new'} event
        </p>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow">
        <form onSubmit={handleSubmit} className="space-y-8 p-8">
          {error && (
            <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
              <div className="flex">
                <div className="flex-shrink-0">
                  {/* Error icon */}
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">{error}</div>
                </div>
              </div>
            </div>
          )}

          {/* Basic Information Section */}
          <div className="border-b border-gray-200 pb-8">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-6">Basic Information</h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="col-span-2">
                <Input
                  label="Event Title"
                  name="title"
                  defaultValue={event?.title}
                  required
                  placeholder="Enter a catchy title for your event"
                  className="text-lg"
                />
              </div>
              
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={4}
                  className="
                    block w-full rounded-md
                    border-gray-200
                    bg-white
                    px-4 py-2
                    text-gray-700
                    shadow-sm
                    transition-colors
                    duration-200
                    placeholder:text-gray-400
                    focus:border-blue-300
                    focus:outline-none
                    focus:ring-2
                    focus:ring-blue-100
                    focus:ring-offset-0
                    disabled:cursor-not-allowed
                    disabled:bg-gray-50
                    disabled:text-gray-500
                  "
                  placeholder="Describe your event in detail..."
                  defaultValue={event?.description}
                  required
                />
              </div>
            </div>
          </div>

          {/* Date and Location Section */}
          <div className="border-b border-gray-200 pb-8">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-6">Date & Location</h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
                <Input
                  label="Date and Time"
                  name="date"
                  type="datetime-local"
                  min={getMinDate()}
                  defaultValue={event?.date ? new Date(event.date).toISOString().slice(0, 16) : undefined}
                  required
                  className="pl-10"
                />
              </div>

              <div className="relative">
                <MapPinIcon className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
                <Input
                  label="Location"
                  name="location"
                  defaultValue={event?.location}
                  required
                  placeholder="Enter venue or address"
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Capacity and Price Section */}
          <div className="border-b border-gray-200 pb-8">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-6">Capacity & Price</h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="relative">
                <UserGroupIcon className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
                <Input
                  label="Available Places"
                  name="number_place"
                  type="number"
                  min="1"
                  defaultValue={event?.number_place ?? ''}
                  required
                  placeholder="e.g., 50"
                  className="pl-10"
                />
              </div>

              <div className="relative">
                <CurrencyDollarIcon className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
                <Input
                  label="Price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  defaultValue={event?.price ?? '0'}
                  required
                  placeholder="e.g., 99.99"
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Image Section */}
          <div>
            <div className="relative">
              <PhotoIcon className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
              <Input
                label="Event Image URL"
                name="image_url"
                type="url"
                pattern="https?://.*"
                defaultValue={event?.image_url}
                required
                placeholder="https://example.com/image.jpg"
                className="pl-10"
              />
            </div>
            {/* Image Preview */}
            <div className="mt-2">
              <img
                src={event?.image_url || 'https://via.placeholder.com/400x200?text=Event+Image'}
                alt="Event preview"
                className="mt-2 h-48 w-full rounded-lg object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=Invalid+Image+URL';
                }}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/events')}
              className="px-6"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="px-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </div>
              ) : (
                event ? 'Update Event' : 'Create Event'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}