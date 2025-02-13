import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../ui/button';
import type { EventData } from '../../../types';

interface EventActionsProps {
  event: EventData;
  isOwner: boolean;
  isAttending: boolean;
  isLoading: boolean;
  user: any;
  onJoin: () => void;
  onEdit: () => void;
}

export function EventActions({ 
  event, 
  isOwner, 
  isAttending, 
  isLoading, 
  user, 
  onJoin, 
  onEdit 
}: EventActionsProps) {
  return (
    <div className="mt-auto pt-4">
      {isOwner && (
        <Button
          onClick={onEdit}
          variant="outline"
          size="sm"
          className="mt-2 flex items-center gap-1 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={1.5} 
            stroke="currentColor" 
            className="w-6 h-4"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" 
            />
          </svg>
          Edit
        </Button>
      )}
      {user && !isOwner && (
        <Button 
          onClick={onJoin}
          variant="outline"
          disabled={isLoading || (!isAttending && (event.available_places <= (event.attendees?.length || event.participants?.length || 0)))}
          className={`w-full font-medium ${
            isAttending
              ? "bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
              : event.available_places > (event.attendees?.length || event.participants?.length || 0)
                ? "bg-green-50 text-green-600 hover:bg-green-100 border-green-200"
                : "bg-gray-50 text-gray-400 cursor-not-allowed"
          }`}
        >
          {isLoading 
            ? 'Processing...' 
            : isAttending 
              ? 'Leave Event' 
              : event.available_places > (event.attendees?.length || event.participants?.length || 0)
                ? 'Join Event' 
                : 'Event Full'
          }
        </Button>
      )}

      {!user && (
        <Link to="/login" className="block">
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            Login to Join
          </Button>
        </Link>
      )}
    </div>
  );
} 