import React from 'react';
import { Calendar } from 'lucide-react';

interface EventImageProps {
  imageUrl?: string;
  title?: string;
}

export function EventImage({ imageUrl, title }: EventImageProps) {
  if (imageUrl) {
    return (
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-t-xl">
        <img 
          src={imageUrl} 
          alt={title} 
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>
    );
  }

  return (
    <div className="relative aspect-[16/9] w-full rounded-t-xl bg-gray-100">
      <div className="absolute inset-0 flex items-center justify-center">
        <Calendar className="h-12 w-12 text-gray-400" />
      </div>
    </div>
  );
} 