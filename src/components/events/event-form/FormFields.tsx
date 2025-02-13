import React from 'react';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';

interface FormFieldsProps {
  titleRef: React.RefObject<HTMLInputElement>;
  descriptionRef: React.RefObject<HTMLTextAreaElement>;
  startDateRef: React.RefObject<HTMLInputElement>;
  endDateRef: React.RefObject<HTMLInputElement>;
  locationRef: React.RefObject<HTMLInputElement>;
  imageUrlRef: React.RefObject<HTMLInputElement>;
  availablePlacesRef: React.RefObject<HTMLInputElement>;
  priceRef: React.RefObject<HTMLInputElement>;
  minDate: string;
  isUpdate?: boolean;
}

export function FormFields({
  titleRef,
  descriptionRef,
  startDateRef,
  endDateRef,
  locationRef,
  imageUrlRef,
  availablePlacesRef,
  priceRef,
  minDate,
  isUpdate = false,
}: FormFieldsProps) {
  return (
    <>
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title {!isUpdate && '*'}
        </label>
        <Input
          id="title"
          name="title"
          ref={titleRef}
          required={!isUpdate}
          className="mt-1"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description {!isUpdate && '*'}
        </label>
        <Textarea
          id="description"
          name="description"
          ref={descriptionRef}
          required={!isUpdate}
          className="mt-1"
          rows={4}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
            Start Date and Time {!isUpdate && '*'}
          </label>
          <Input
            type="datetime-local"
            id="startDate"
            name="startDate"
            ref={startDateRef}
            min={minDate}
            required={!isUpdate}
            className="mt-1"
          />
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
            End Date and Time {!isUpdate && '*'}
          </label>
          <Input
            type="datetime-local"
            id="endDate"
            name="endDate"
            ref={endDateRef}
            min={minDate}
            required={!isUpdate}
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
          Location {!isUpdate && '*'}
        </label>
        <Input
          id="location"
          name="location"
          ref={locationRef}
          required={!isUpdate}
          className="mt-1"
        />
      </div>

      <div>
        <label htmlFor="image_url" className="block text-sm font-medium text-gray-700">
          Image URL {!isUpdate && '*'}
        </label>
        <Input
          type="url"
          id="image_url"
          name="image_url"
          ref={imageUrlRef}
          required={!isUpdate}
          className="mt-1"
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="available_places" className="block text-sm font-medium text-gray-700">
            Available Places {!isUpdate && '*'}
          </label>
          <Input
            type="number"
            id="available_places"
            name="available_places"
            ref={availablePlacesRef}
            min="1"
            required={!isUpdate}
            className="mt-1"
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Price {!isUpdate && '*'}
          </label>
          <Input
            type="number"
            id="price"
            name="price"
            ref={priceRef}
            min="0"
            step="0.01"
            required={!isUpdate}
            className="mt-1"
          />
        </div>
      </div>
    </>
  );
} 