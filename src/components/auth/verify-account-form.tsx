import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SecurityService } from '../../services/auth.service';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface LocationState {
    email?: string;
}

export function VerifyAccountForm() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as LocationState;
    
    const [error, setError] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [code, setCode] = React.useState('');
    const [email, setEmail] = React.useState(state?.email || '');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await SecurityService.verifyAccount({ email, code });
            navigate('/login', {
                state: {
                    message: t('auth.verify.success'),
                    email
                }
            });
        } catch (err: any) {
            setError(err.message || t('auth.verify.error'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-md space-y-8">
            <div>
                <h2 className="text-center text-3xl font-bold tracking-tight">
                    {t('auth.verify.title')}
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    {t('auth.verify.subtitle')}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        {t('auth.email')}
                    </label>
                    <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full"
                        placeholder={t('auth.verify.emailPlaceholder')}
                        disabled={isLoading}
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                        {t('auth.verify.code')}
                    </label>
                    <Input
                        id="code"
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        required
                        className="w-full"
                        placeholder={t('auth.verify.codePlaceholder')}
                        disabled={isLoading}
                        maxLength={6}
                        pattern="[0-9]{6}"
                    />
                    <p className="text-sm text-gray-500">
                        {t('auth.verify.codeHint')}
                    </p>
                </div>

                <div>
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading || !email || !code}
                    >
                        {isLoading ? t('auth.verify.loading') : t('auth.verify.submit')}
                    </Button>
                </div>

                <div className="text-center text-sm">
                    <button
                        type="button"
                        onClick={() => navigate('/login')}
                        className="text-indigo-600 hover:text-indigo-500"
                    >
                        {t('auth.verify.backToLogin')}
                    </button>
                </div>
            </form>
        </div>
    );
} 