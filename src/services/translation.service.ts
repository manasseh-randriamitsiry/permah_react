import axios from 'axios';

const GOOGLE_TRANSLATE_API_KEY = import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY;
const GOOGLE_TRANSLATE_API_URL = 'https://translation.googleapis.com/language/translate/v2';

interface TranslateResponse {
  data: {
    translations: Array<{
      translatedText: string;
    }>;
  };
}

export class TranslationService {
  static async translateObject(obj: any, targetLang: string): Promise<any> {
    const result: any = {};

    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'object' && value !== null) {
        result[key] = await this.translateObject(value, targetLang);
      } else if (typeof value === 'string') {
        try {
          const translatedText = await this.translateText(value, targetLang);
          result[key] = translatedText;
        } catch (error) {
          console.error(`Error translating key ${key}:`, error);
          result[key] = value; // Fallback to original text
        }
      } else {
        result[key] = value;
      }
    }

    return result;
  }

  private static async translateText(text: string, targetLang: string): Promise<string> {
    try {
      const response = await axios.post<TranslateResponse>(
        `${GOOGLE_TRANSLATE_API_URL}?key=${GOOGLE_TRANSLATE_API_KEY}`,
        {
          q: text,
          target: targetLang,
          format: 'text'
        }
      );

      return response.data.data.translations[0].translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      throw error;
    }
  }

  static getSupportedLanguages() {
    return [
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'fr', name: 'French', nativeName: 'Français' },
      { code: 'mg', name: 'Malagasy', nativeName: 'Malagasy' }
    ];
  }

  static getDateFormatter(locale: string) {
    return {
      short: new Intl.DateTimeFormat(locale, {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
      long: new Intl.DateTimeFormat(locale, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      time: new Intl.DateTimeFormat(locale, {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  }

  static getCurrencyFormatter(locale: string, currency: string = 'MGA') {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency
    });
  }

  static getNumberFormatter(locale: string) {
    return new Intl.NumberFormat(locale);
  }

  static getLanguageDirection(languageCode: string): 'ltr' | 'rtl' {
    // Add RTL languages here if needed in the future
    const rtlLanguages = ['ar', 'he', 'fa'];
    return rtlLanguages.includes(languageCode) ? 'rtl' : 'ltr';
  }
} 