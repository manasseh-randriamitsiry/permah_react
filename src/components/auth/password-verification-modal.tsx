import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useModal } from '../../contexts/modal-context';

interface PasswordVerificationModalProps {
    isOpen: boolean;
    onVerify: (password: string) => Promise<void>;
    onClose: () => void;
    error?: string;
    isVerifying?: boolean;
}

export function PasswordVerificationModal({ 
    isOpen, 
    onVerify, 
    onClose,
    error,
    isVerifying = false
}: PasswordVerificationModalProps) {
    const { t } = useTranslation();
    const [password, setPassword] = React.useState('');
    const [localError, setLocalError] = React.useState('');
    const { openModal, closeModal } = useModal();

    React.useEffect(() => {
        if (isOpen) {
            openModal();
        } else {
            closeModal();
        }
    }, [isOpen, openModal, closeModal]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError('');
        
        try {
            await onVerify(password);
            setPassword(''); // Clear password on success
        } catch (err: any) {
            setLocalError(err.message);
        }
    };

    // Reset error when password changes
    React.useEffect(() => {
        setLocalError('');
    }, [password]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div 
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            ></div>
            <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                <h2 className="mb-4 text-xl font-bold">{t('auth.profile.verifyIdentity')}</h2>
                <p className="mb-4 text-gray-600">
                    {t('auth.profile.verifyMessage')}
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    {(error || localError) && (
                        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
                            {error || localError}
                        </div>
                    )}
                    
                    <div className="space-y-2">
                        <label 
                            htmlFor="current-password" 
                            className="block text-sm font-medium text-gray-700"
                        >
                            {t('auth.profile.currentPassword')}
                        </label>
                        <Input
                            id="current-password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isVerifying}
                            required
                            autoFocus
                            className="w-full"
                        />
                    </div>
                    
                    <div className="flex justify-end space-x-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isVerifying}
                        >
                            {t('common.cancel')}
                        </Button>
                        <Button
                            type="submit"
                            disabled={isVerifying || !password}
                        >
                            {isVerifying ? t('auth.profile.loading') : t('auth.profile.continue')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
