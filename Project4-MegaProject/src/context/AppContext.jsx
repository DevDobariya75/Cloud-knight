import { createContext, useContext, useMemo, useState } from 'react';
import { translations } from '../i18n/translations';

const AppContext = createContext(null);
const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'ur', label: 'اردو' },
  { code: 'gu', label: 'ગુજરાતી' }
];

export function AppProvider({ children }) {
  const [language, setLanguage] = useState('en');
  const [prediction, setPrediction] = useState(null);

  const changeLanguage = (nextLanguage) => {
    setLanguage(translations[nextLanguage] ? nextLanguage : 'en');
  };

  const value = useMemo(
    () => ({
      language,
      text: translations[language] || translations.en,
      prediction,
      setPrediction,
      changeLanguage,
      languages: SUPPORTED_LANGUAGES
    }),
    [language, prediction]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}