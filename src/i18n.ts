import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { TranslationService } from './services/translation.service';

// Import translations
import enTranslations from './locales/en/translation.json';
import frTranslations from './locales/fr/translation.json';
import mgTranslations from './locales/mg/translation.json';

// Debug translations loading
console.log('Loading translations:', {
  en: enTranslations,
  fr: frTranslations,
  mg: mgTranslations
});

const resources = {
  en: {
    translation: enTranslations
  },
  fr: {
    translation: frTranslations
  },
  mg: {
    translation: mgTranslations
  }
};

// Language-specific date formats
const dateFormats = {
  en: {
    short: { year: 'numeric' as const, month: 'short' as const, day: 'numeric' as const },
    long: { 
      year: 'numeric' as const, 
      month: 'long' as const, 
      day: 'numeric' as const, 
      hour: '2-digit' as const, 
      minute: '2-digit' as const 
    },
    time: { hour: '2-digit' as const, minute: '2-digit' as const }
  },
  fr: {
    short: { year: 'numeric' as const, month: 'short' as const, day: 'numeric' as const },
    long: { 
      year: 'numeric' as const, 
      month: 'long' as const, 
      day: 'numeric' as const, 
      hour: '2-digit' as const, 
      minute: '2-digit' as const 
    },
    time: { hour: '2-digit' as const, minute: '2-digit' as const }
  },
  mg: {
    short: { 
      year: 'numeric' as const, 
      month: 'long' as const, 
      day: 'numeric' as const,
      hour12: false as const
    },
    long: { 
      year: 'numeric' as const, 
      month: 'long' as const, 
      day: 'numeric' as const, 
      hour: '2-digit' as const, 
      minute: '2-digit' as const,
      hour12: false as const
    },
    time: { 
      hour: '2-digit' as const, 
      minute: '2-digit' as const,
      hour12: false as const
    }
  }
} as const;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: true, // Enable debug
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'preferredLanguage'
    },
    react: {
      useSuspense: false, // Disable suspense
      bindI18n: 'languageChanged loaded', // Trigger re-render on language change and loading
      transEmptyNodeValue: '', // Return empty string for empty nodes
      transSupportBasicHtmlNodes: true, // Support basic HTML nodes
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p'], // Keep these HTML nodes
      skipTranslationOnMissingKey: false // Don't skip translation on missing key
    },
    returnNull: false, // Return key instead of null on missing translation
    returnEmptyString: false, // Return key instead of empty string on missing translation
    returnObjects: true, // Return objects for nested translations
    saveMissing: true, // Save missing translations
    missingKeyHandler: (lng, ns, key) => {
      console.warn(`Missing translation key: ${key} for language: ${lng} in namespace: ${ns}`);
    }
  });

// Log current language and available languages
console.log('i18n initialized:', {
  currentLanguage: i18n.language,
  availableLanguages: i18n.languages,
  loadedResources: i18n.services.resourceStore.data
});

// Enhanced formatting functions
i18n.services.formatter?.add('date', (value, lng, options) => {
  const language = lng || 'en';
  const format = options?.format || 'short';
  const date = value instanceof Date ? value : new Date(value);
  
  try {
    if (language === 'mg') {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      
      switch (format) {
        case 'short':
          return `${day}-${month}-${year}`;
        case 'long':
          return `${day}-${month}-${year} ${hours}:${minutes}`;
        case 'time':
          return `${hours}:${minutes}`;
        default:
          return `${day}-${month}-${year}`;
      }
    }
    
    return new Intl.DateTimeFormat(
      language, 
      dateFormats[language as keyof typeof dateFormats][format as keyof typeof dateFormats['en']]
    ).format(date);
  } catch (error) {
    console.warn(`Date formatting failed for language ${language}, falling back to English`, error);
    return new Intl.DateTimeFormat(
      'en',
      dateFormats.en[format as keyof typeof dateFormats['en']]
    ).format(date);
  }
});

i18n.services.formatter?.add('number', (value, lng, options) => {
  const language = lng || 'en';
  
  try {
    if (options?.style === 'currency') {
      return TranslationService.getCurrencyFormatter(language, options.currency).format(value);
    }
    return TranslationService.getNumberFormatter(language).format(value);
  } catch (error) {
    console.warn(`Number formatting failed for language ${language}, falling back to English`, error);
    return options?.style === 'currency'
      ? TranslationService.getCurrencyFormatter('en', options.currency).format(value)
      : TranslationService.getNumberFormatter('en').format(value);
  }
});

// Handle language direction and HTML attributes
const handleLanguageChange = (lng: string) => {
  const dir = TranslationService.getLanguageDirection(lng);
  document.documentElement.dir = dir;
  document.documentElement.lang = lng;
  
  // Update meta description language
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('lang', lng);
  }

  // Log language change
  console.log('Language changed:', {
    language: lng,
    direction: dir,
    translations: i18n.getResourceBundle(lng, 'translation')
  });
};

i18n.on('languageChanged', handleLanguageChange);

// Initialize with preferred or detected language
const preferredLanguage = localStorage.getItem('preferredLanguage');
if (preferredLanguage && resources[preferredLanguage as keyof typeof resources]) {
  console.log('Using preferred language:', preferredLanguage);
  i18n.changeLanguage(preferredLanguage);
} else {
  console.log('No preferred language found, using:', i18n.language);
  handleLanguageChange(i18n.language);
}

export default i18n; 