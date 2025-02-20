import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SecurityService } from '../../services/auth.service';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

export function ForgotPasswordForm() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [error, setError] = React.useState('');
    const [success, setSuccess] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [email, setEmail] = React.useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        try {
            const response = await SecurityService.requestPasswordReset(email);
            setSuccess(response.message);
            // Navigate to reset code verification after a short delay
            setTimeout(() => {
                navigate('/reset-password/verify', { state: { email } });
            }, 2000);
        } catch (err: any) {
            setError(err.message || t('auth.forgotPassword.error'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-md space-y-8">
            <div>
                <h2 className="text-center text-3xl font-bold tracking-tight">
                    {t('auth.forgotPassword.title')}
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    {t('auth.forgotPassword.subtitle')}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="rounded-md bg-green-50 p-4 text-sm text-green-700">
                        {success}
                    </div>
                )}

                <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        {t('auth.forgotPassword.email')}
                    </label>
                    <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full"
                        placeholder={t('auth.forgotPassword.emailPlaceholder')}
                        disabled={isLoading}
                    />
                </div>

                <div>
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading || !email}
                    >
                        {isLoading ? t('auth.forgotPassword.loading') : t('auth.forgotPassword.submit')}
                    </Button>
                </div>

                <div className="text-center text-sm">
                    <button
                        type="button"
                        onClick={() => navigate('/login')}
                        className="text-indigo-600 hover:text-indigo-500"
                    >
                        {t('auth.forgotPassword.backToLogin')}
                    </button>
                </div>
            </form>
        </div>
    );
} 