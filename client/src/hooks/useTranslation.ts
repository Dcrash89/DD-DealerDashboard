import { useState, useCallback } from 'react';
import { locales } from '../constants/locales';

type Language = 'it' | 'en' | 'zh';

export const useTranslation = (): {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string, replacements?: Record<string, string | number>) => string;
} => {
  const [lang, setLang] = useState<Language>('it');

  const setLanguage = useCallback((newLang: Language) => {
    setLang(newLang);
    document.documentElement.lang = newLang;
  }, []);

  const t = useCallback((key: string, replacements: Record<string, string | number> = {}) => {
      let translation = locales[lang]?.[key] || locales['en']?.[key] || key;
      Object.keys(replacements).forEach(placeholder => {
          translation = translation.replace(`{${placeholder}}`, String(replacements[placeholder]));
      });
      return translation;
    }, [lang]);

  return { lang, setLang: setLanguage, t };
};
