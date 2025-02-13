import { useTranslation } from 'react-i18next';

export function ProfileHeader() {
  const { t } = useTranslation();
  
  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold">{t('auth.profile.title')}</h2>
      <p className="mt-2 text-gray-600">{t('auth.profile.subtitle')}</p>
    </div>
  );
} 