import React from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface PasswordVerificationModalProps {
    isOpen: boolean;
    onVerify: (password: string) => Promise<void>;
    onClose: () => void;
    error?: string;
}

export function PasswordVerificationModal({ 
    isOpen, 
    onVerify, 
    onClose,
    error 
}: PasswordVerificationModalProps) {
    const [password, setPassword] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [localError, setLocalError] = React.useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setLocalError('');
        
        try {
            await onVerify(password);
            setPassword(''); // Clear password on success
        } catch (err: any) {
            setLocalError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Reset error when password changes
    React.useEffect(() => {
        setLocalError('');
    }, [password]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                <h2 className="mb-4 text-xl font-bold">Verify Your Identity</h2>
                <p className="mb-4 text-gray-600">
                    Please enter your current password to access profile settings
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
                            Current Password
                        </label>
                        <Input
                            id="current-password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
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
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading || !password}
                        >
                            {isLoading ? 'Verifying...' : 'Continue'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
