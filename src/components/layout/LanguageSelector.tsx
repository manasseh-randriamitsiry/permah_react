import React from 'react';
import { useTranslation } from 'react-i18next';
import { TranslationService } from '../../services/translation.service';

export function LanguageSelector() {
  const { i18n, t } = useTranslation();
  const languages = TranslationService.getSupportedLanguages();
  const currentLanguage = languages.find(lang => lang.code === i18n.language);

  const handleLanguageChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    try {
      await i18n.changeLanguage(newLang);
      localStorage.setItem('preferredLanguage', newLang);
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  // Debug information
  React.useEffect(() => {
    console.log('Current i18n state:', {
      language: i18n.language,
      languages: i18n.languages,
      isInitialized: i18n.isInitialized,
      availableLanguages: languages.map(l => l.code),
      currentTranslations: i18n.store.data[i18n.language]?.translation
    });
  }, [i18n.language]);

  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="language-select" className="text-sm text-gray-500">
        {currentLanguage?.nativeName || t('common.language')}
      </label>
      <select
        id="language-select"
        value={i18n.language}
        onChange={handleLanguageChange}
        className="rounded-md border-gray-300 py-1 pl-2 pr-8 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        aria-label={t('common.language.select')}
      >
        {languages.map(lang => (
          <option 
            key={lang.code} 
            value={lang.code}
            aria-label={t('common.language.option', { 
              native: lang.nativeName, 
              english: lang.name 
            })}
          >
            {lang.nativeName} ({lang.name})
          </option>
        ))}
      </select>
    </div>
  );
} 