import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => setLanguage('fr')}
        className={`px-2 py-1 rounded ${
          language === 'fr' ? 'text-yellow-400' : 'text-white hover:text-yellow-200'
        }`}
      >
        FR
      </button>
      <span className="text-gray-400">|</span>
      <button
        onClick={() => setLanguage('en')}
        className={`px-2 py-1 rounded ${
          language === 'en' ? 'text-yellow-400' : 'text-white hover:text-yellow-200'
        }`}
      >
        EN
      </button>
      <span className="text-gray-400">|</span>
      <button
        onClick={() => setLanguage('ru')}
        className={`px-2 py-1 rounded ${
          language === 'ru' ? 'text-yellow-400' : 'text-white hover:text-yellow-200'
        }`}
      >
        RU
      </button>
    </div>
  );
}