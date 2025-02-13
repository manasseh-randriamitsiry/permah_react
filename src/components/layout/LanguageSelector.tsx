import React from 'react';
import { useTranslation } from 'react-i18next';
import { TranslationService } from '../../services/translation.service';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

export function LanguageSelector() {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = React.useState(false);
  const languages = TranslationService.getSupportedLanguages();
  const currentLanguage = languages.find(lang => lang.code === i18n.language);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const handleLanguageChange = async (code: string) => {
    try {
      await i18n.changeLanguage(code);
      localStorage.setItem('preferredLanguage', code);
      setIsOpen(false);
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getFlagEmoji = (code: string) => {
    const flags: Record<string, string> = {
      'en': '🇬🇧',
      'fr': '🇫🇷',
      'mg': '🇲🇬'
    };
    return flags[code] || '🌐';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 rounded-md border border-gray-200 px-2 py-1.5 text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
        aria-label={t('common.language.select')}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="text-base" role="img" aria-label={currentLanguage?.name}>
          {getFlagEmoji(currentLanguage?.code || 'en')}
        </span>
        <span className="text-gray-700">{currentLanguage?.nativeName}</span>
        <ChevronDown className="h-4 w-4 text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-40 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
          <ul
            className="py-1"
            role="listbox"
            aria-label={t('common.language.select')}
          >
            {languages.map(lang => (
              <li key={lang.code}>
                <button
                  className={cn(
                    'flex w-full items-center px-3 py-2 text-sm',
                    'hover:bg-gray-50 focus:bg-gray-50 focus:outline-none',
                    lang.code === currentLanguage?.code ? 'text-blue-600' : 'text-gray-700'
                  )}
                  onClick={() => handleLanguageChange(lang.code)}
                  role="option"
                  aria-selected={lang.code === currentLanguage?.code}
                >
                  <span className="text-base mr-2" role="img" aria-label={lang.name}>
                    {getFlagEmoji(lang.code)}
                  </span>
                  <span className="flex-1 text-left">{lang.nativeName}</span>
                  {lang.code === currentLanguage?.code && (
                    <Check className="h-4 w-4 text-blue-600" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 