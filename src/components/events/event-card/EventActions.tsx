import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '../../ui/button';

interface EventActionsProps {
  isOwner: boolean;
  isAttending: boolean;
  isLoading: boolean;
  onJoin: () => void;
  onEdit: () => void;
}

export function EventActions({ 
  isOwner, 
  isAttending, 
  isLoading,
  onJoin,
  onEdit
}: EventActionsProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between p-4 border-t border-gray-200">
      <div className="flex items-center space-x-2">
        {isOwner ? (
          <Button
            variant="outline"
            onClick={onEdit}
          >
            {t('events.actions.edit')}
          </Button>
        ) : (
          <Button
            variant={isAttending ? "destructive" : "primary"}
            onClick={onJoin}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                {t('events.actions.processing')}
              </div>
            ) : isAttending ? (
              t('events.actions.leave')
            ) : (
              t('events.actions.join')
            )}
          </Button>
        )}
      </div>
    </div>
  );
} 