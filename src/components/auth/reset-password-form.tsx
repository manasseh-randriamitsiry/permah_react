import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SecurityService } from '../../services/auth.service';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface LocationState {
    email?: string;
}

export function ResetPasswordForm() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as LocationState;
    
    const [error, setError] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [isCodeVerified, setIsCodeVerified] = React.useState(false);
    const [email, setEmail] = React.useState(state?.email || '');
    const [code, setCode] = React.useState('');
    const [newPassword, setNewPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');

    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await SecurityService.verifyResetCode({ email, code });
            setIsCodeVerified(true);
        } catch (err: any) {
            setError(err.message || t('auth.resetPassword.verifyError'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (newPassword !== confirmPassword) {
            setError(t('auth.validation.passwordConfirmation.mismatch'));
            setIsLoading(false);
            return;
        }

        try {
            await SecurityService.resetPassword({
                email,
                code,
                new_password: newPassword
            });
            navigate('/login', {
                state: {
                    message: t('auth.resetPassword.success'),
                    email
                }
            });
        } catch (err: any) {
            setError(err.message || t('auth.resetPassword.error'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-md space-y-8">
            <div>
                <h2 className="text-center text-3xl font-bold tracking-tight">
                    {t('auth.resetPassword.title')}
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    {t('auth.resetPassword.subtitle')}
                </p>
            </div>

            {!isCodeVerified ? (
                <form onSubmit={handleVerifyCode} className="space-y-6">
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
                            placeholder={t('auth.resetPassword.emailPlaceholder')}
                            disabled={isLoading}
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                            {t('auth.resetPassword.code')}
                        </label>
                        <Input
                            id="code"
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            required
                            className="w-full"
                            placeholder={t('auth.resetPassword.codePlaceholder')}
                            disabled={isLoading}
                            maxLength={6}
                            pattern="[0-9]{6}"
                        />
                        <p className="text-sm text-gray-500">
                            {t('auth.resetPassword.codeHint')}
                        </p>
                    </div>

                    <div>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading || !email || !code}
                        >
                            {isLoading ? t('auth.resetPassword.verifying') : t('auth.resetPassword.verify')}
                        </Button>
                    </div>
                </form>
            ) : (
                <form onSubmit={handleResetPassword} className="space-y-6">
                    {error && (
                        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                            {t('auth.resetPassword.newPassword')}
                        </label>
                        <Input
                            id="new-password"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="w-full"
                            placeholder={t('auth.resetPassword.newPasswordPlaceholder')}
                            disabled={isLoading}
                            minLength={8}
                        />
                        <p className="text-sm text-gray-500">
                            {t('auth.validation.password.hint')}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                            {t('auth.resetPassword.confirmPassword')}
                        </label>
                        <Input
                            id="confirm-password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full"
                            placeholder={t('auth.resetPassword.confirmPasswordPlaceholder')}
                            disabled={isLoading}
                            minLength={8}
                        />
                    </div>

                    <div>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading || !newPassword || !confirmPassword}
                        >
                            {isLoading ? t('auth.resetPassword.resetting') : t('auth.resetPassword.submit')}
                        </Button>
                    </div>
                </form>
            )}

            <div className="text-center text-sm">
                <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="text-indigo-600 hover:text-indigo-500"
                >
                    {t('auth.resetPassword.backToLogin')}
                </button>
            </div>
        </div>
    );
} 