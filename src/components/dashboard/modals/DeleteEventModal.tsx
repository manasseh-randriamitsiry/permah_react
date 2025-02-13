import React from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle } from 'lucide-react';
import type { EventData } from '../../../types';
import { Button } from '../../ui/button';

interface DeleteEventModalProps {
  isOpen: boolean;
  event: EventData | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteEventModal({ 
  isOpen, 
  event, 
  onConfirm, 
  onCancel 
}: DeleteEventModalProps) {
  const { t } = useTranslation();

  if (!isOpen || !event) return null;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-labelledby="delete-modal-title"
      aria-describedby="delete-modal-description"
    >
      <div className="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
          onClick={onCancel}
        />

        {/* Modal */}
        <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
              </div>
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 
                  id="delete-modal-title"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  {t('dashboard.deleteModal.title')}
                </h3>
                <div className="mt-2">
                  <p 
                    id="delete-modal-description"
                    className="text-sm text-gray-500"
                  >
                    {t('dashboard.deleteModal.message')}
                  </p>
                  <p className="mt-2 text-sm font-medium text-gray-900">
                    {event.title}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <Button
              type="button"
              variant="destructive"
              onClick={onConfirm}
              className="w-full sm:ml-3 sm:w-auto"
              aria-label={t('dashboard.deleteModal.confirmAriaLabel', { title: event.title })}
            >
              {t('dashboard.deleteModal.confirm')}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="mt-3 w-full sm:mt-0 sm:w-auto"
              aria-label={t('dashboard.deleteModal.cancelAriaLabel')}
            >
              {t('dashboard.deleteModal.cancel')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 