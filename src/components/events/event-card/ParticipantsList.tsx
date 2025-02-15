import React from 'react';
import { useTranslation } from 'react-i18next';
import type { User } from '../../../types';
import { EventService } from '../../../services/event.service';

interface ParticipantsListProps {
  eventId: number;
  isOpen: boolean;
  onClose: () => void;
}

export function ParticipantsList({ eventId, isOpen, onClose }: ParticipantsListProps) {
  const { t } = useTranslation();
  const [participants, setParticipants] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    if (isOpen) {
      loadParticipants();
    }
  }, [isOpen, eventId]);

  const loadParticipants = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await EventService.getEventParticipants(eventId);
      setParticipants(response.participants);
    } catch (err: any) {
      console.error('Error loading participants:', err);
      setError(err.message || 'Failed to load participants');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{t('events.participants.title')}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label={t('common.close')}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
            </div>
          ) : error ? (
            <div className="text-red-600 text-center py-4">{error}</div>
          ) : participants.length === 0 ? (
            <div className="text-gray-500 text-center py-4">
              {t('events.participants.empty')}
            </div>
          ) : (
            <ul className="divide-y">
              {participants.map(participant => (
                <li key={participant.id} className="py-3 flex items-center">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-medium">
                      {participant.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{participant.name}</p>
                    <p className="text-sm text-gray-500">{participant.email}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
} 