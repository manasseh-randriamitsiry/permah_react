import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { useAuthStore } from '../../store/auth-store';
import type { EventData } from '../../types';


interface EventFormProps {
  event?: EventData;
  onSubmit: (eventData: Omit<EventData, 'id' | 'creator' | 'created_at' | 'updated_at' | 'user' | 'attendees' | 'participants'>) => Promise<void>;
}

export function EventForm({ event, onSubmit }: EventFormProps) {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState('');

  // Form refs
  const titleRef = React.useRef<HTMLInputElement>(null);
  const descriptionRef = React.useRef<HTMLTextAreaElement>(null);
  const dateRef = React.useRef<HTMLInputElement>(null);
  const locationRef = React.useRef<HTMLInputElement>(null);
  const imageUrlRef = React.useRef<HTMLInputElement>(null);
  const availablePlacesRef = React.useRef<HTMLInputElement>(null);
  const priceRef = React.useRef<HTMLInputElement>(null);

  // Check authentication
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: event ? `/events/${event.id}/edit` : '/events/create' } });
    }
  }, [isAuthenticated, navigate, event]);

  // Pre-fill form if editing
  React.useEffect(() => {
    if (event) {
      if (titleRef.current) titleRef.current.value = event.title;
      if (descriptionRef.current) descriptionRef.current.value = event.description;
      if (dateRef.current) dateRef.current.value = formatDateForInput(new Date(event.date));
      if (locationRef.current) locationRef.current.value = event.location;
      if (imageUrlRef.current) imageUrlRef.current.value = event.image_url || '';
      if (availablePlacesRef.current) availablePlacesRef.current.value = event.available_places.toString();
      if (priceRef.current) priceRef.current.value = event.price.toString();
    }
  }, [event]);

  const formatDateForInput = (date: Date) => {
    return date.toISOString().slice(0, 16);
  };

  const getMinDate = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  const validateForm = (formData: FormData): boolean => {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const date = new Date(formData.get('date') as string);
    const location = formData.get('location') as string;
    const imageUrl = formData.get('image_url') as string;
    const numberPlace = parseInt(formData.get('available_places') as string);
    const price = parseFloat(formData.get('price') as string);

    if (!title || !description || !location) {
      setError('Please fill in all required fields');
      return false;
    }

    if (date <= new Date()) {
      setError('Event date must be in the future');
      return false;
    }

    try {
      new URL(imageUrl);
    } catch {
      setError('Please enter a valid image URL');
      return false;
    }

    if (isNaN(numberPlace) || numberPlace <= 0) {
      setError('Available places must be a positive number');
      return false;
    }

    if (isNaN(price) || price < 0) {
      setError('Price must be a non-negative number');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!isAuthenticated || !user?.id) {
      setError('You must be logged in to manage events');
      navigate('/login');
      return;
    }

    const formData = new FormData(e.currentTarget);
    if (!validateForm(formData)) return;

    setIsSubmitting(true);

    try {
      const eventData = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        date: new Date(formData.get('date') as string).toISOString(),
        location: formData.get('location') as string,
        image_url: formData.get('image_url') as string,
        available_places: parseInt(formData.get('available_places') as string),
        price: parseFloat(formData.get('price') as string)
      };

      await onSubmit(eventData);
      navigate('/events');
    } catch (err: any) {
      console.error('Event submission error:', err);
      setError(err.message || 'Failed to save event');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="mb-6 text-2xl font-bold">
        {event ? 'Edit Event' : 'Create New Event'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title *
          </label>
          <Input
            id="title"
            name="title"
            ref={titleRef}
            required
            className="mt-1"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description *
          </label>
          <Textarea
            id="description"
            name="description"
            ref={descriptionRef}
            required
            className="mt-1"
            rows={4}
          />
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Date and Time *
          </label>
          <Input
            type="datetime-local"
            id="date"
            name="date"
            ref={dateRef}
            min={getMinDate()}
            required
            className="mt-1"
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location *
          </label>
          <Input
            id="location"
            name="location"
            ref={locationRef}
            required
            className="mt-1"
          />
        </div>

        <div>
          <label htmlFor="image_url" className="block text-sm font-medium text-gray-700">
            Image URL *
          </label>
          <Input
            type="url"
            id="image_url"
            name="image_url"
            ref={imageUrlRef}
            required
            className="mt-1"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="available_places" className="block text-sm font-medium text-gray-700">
              Available Places *
            </label>
            <Input
              type="number"
              id="available_places"
              name="available_places"
              ref={availablePlacesRef}
              min="1"
              required
              className="mt-1"
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Price *
            </label>
            <Input
              type="number"
              id="price"
              name="price"
              ref={priceRef}
              min="0"
              step="0.01"
              required
              className="mt-1"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/events')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : event ? 'Update Event' : 'Create Event'}
          </Button>
        </div>
      </form>
    </div>
  );
}