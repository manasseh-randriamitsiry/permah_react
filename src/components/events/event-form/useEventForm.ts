import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/auth-store';
import type { EventData } from '../../../types';

interface UseEventFormProps {
  event?: EventData;
  onSubmit: (eventData: Partial<Omit<EventData, 'id' | 'creator' | 'created_at' | 'updated_at' | 'user' | 'attendees' | 'participants'>>) => Promise<void>;
}

export function useEventForm({ event, onSubmit }: UseEventFormProps) {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState('');

  // Form refs
  const titleRef = React.useRef<HTMLInputElement>(null);
  const descriptionRef = React.useRef<HTMLTextAreaElement>(null);
  const startDateRef = React.useRef<HTMLInputElement>(null);
  const endDateRef = React.useRef<HTMLInputElement>(null);
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
      if (startDateRef.current) startDateRef.current.value = formatDateForInput(new Date(event.startDate));
      if (endDateRef.current) endDateRef.current.value = formatDateForInput(new Date(event.endDate));
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

  const validateForm = (formData: FormData, isUpdate: boolean): boolean => {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const startDateStr = formData.get('startDate') as string;
    const endDateStr = formData.get('endDate') as string;
    const location = formData.get('location') as string;
    const imageUrl = formData.get('image_url') as string;
    const availablePlacesStr = formData.get('available_places') as string;
    const priceStr = formData.get('price') as string;

    // For create, require all fields
    if (!isUpdate && (!title || !description || !startDateStr || !endDateStr || !location || !imageUrl || !availablePlacesStr || !priceStr)) {
      setError('Please fill in all required fields');
      return false;
    }

    // Validate dates if either is provided
    if (startDateStr || endDateStr) {
      const startDate = startDateStr ? new Date(startDateStr) : null;
      const endDate = endDateStr ? new Date(endDateStr) : null;

      if (startDate && startDate <= new Date()) {
        setError('Start date must be in the future');
        return false;
      }

      if (startDate && endDate && endDate <= startDate) {
        setError('End date must be after start date');
        return false;
      }
    }

    // Validate image URL if provided
    if (imageUrl) {
      try {
        new URL(imageUrl);
      } catch {
        setError('Please enter a valid image URL');
        return false;
      }
    }

    // Validate available places if provided
    if (availablePlacesStr) {
      const numberPlace = parseInt(availablePlacesStr);
      if (isNaN(numberPlace) || numberPlace <= 0) {
        setError('Available places must be a positive number');
        return false;
      }
    }

    // Validate price if provided
    if (priceStr) {
      const price = parseFloat(priceStr);
      if (isNaN(price) || price < 0) {
        setError('Price must be a non-negative number');
        return false;
      }
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
    const isUpdate = !!event;
    if (!validateForm(formData, isUpdate)) return;

    setIsSubmitting(true);

    try {
      const eventData: Partial<EventData> = {};

      // Only include fields that have values
      const title = formData.get('title') as string;
      if (title) eventData.title = title;

      const description = formData.get('description') as string;
      if (description) eventData.description = description;

      const startDateStr = formData.get('startDate') as string;
      if (startDateStr) eventData.startDate = new Date(startDateStr).toISOString();

      const endDateStr = formData.get('endDate') as string;
      if (endDateStr) eventData.endDate = new Date(endDateStr).toISOString();

      const location = formData.get('location') as string;
      if (location) eventData.location = location;

      const imageUrl = formData.get('image_url') as string;
      if (imageUrl) eventData.image_url = imageUrl;

      const availablePlacesStr = formData.get('available_places') as string;
      if (availablePlacesStr) eventData.available_places = parseInt(availablePlacesStr);

      const priceStr = formData.get('price') as string;
      if (priceStr) eventData.price = parseFloat(priceStr);

      await onSubmit(eventData);
      navigate('/events');
    } catch (err: any) {
      console.error('Event submission error:', err);
      setError(err.message || 'Failed to save event');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
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
  };
} 