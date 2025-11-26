import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Глобальные переменные для загрузки Google Maps API
let mapsLoadPromise: Promise<void> | null = null;
let mapsScript: HTMLScriptElement | null = null;

// Функция загрузки Google Maps API
window.loadGoogleMaps = () => {
  // Если Google Maps уже загружен — сразу выходим
  if (window.google?.maps) {
    console.log('Google Maps уже загружен.');
    return Promise.resolve();
  }

  // Если уже есть активный промис загрузки — возвращаем его
  if (mapsLoadPromise) {
    console.log('Google Maps уже загружается.');
    return mapsLoadPromise;
  }

  // Создаём новый промис загрузки
  mapsLoadPromise = new Promise<void>((resolve, reject) => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      console.error('Google Maps API key не задан.');
      reject(new Error('Google Maps API key не определён'));
      return;
    }

    // Проверяем, есть ли уже скрипт
    if (!mapsScript) {
      mapsScript = document.createElement('script');
      mapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      mapsScript.async = true;
      mapsScript.defer = true;

      mapsScript.addEventListener('load', () => {
        console.log('Google Maps загружен успешно.');
        resolve();
      });

      mapsScript.addEventListener('error', (error) => {
        console.error('Ошибка загрузки Google Maps:', error);
        mapsLoadPromise = null;
        mapsScript = null;
        reject(new Error('Ошибка загрузки Google Maps'));
      });

      document.head.appendChild(mapsScript);
    } else {
      console.warn('Попытка повторной загрузки Google Maps.');
      resolve();
    }
  });

  return mapsLoadPromise;
};

// Функция очистки Google Maps API
window.cleanupGoogleMaps = () => {
  console.log('Очистка Google Maps...');

  if (mapsScript) {
    if (document.contains(mapsScript)) {
      console.log('Удаляем Google Maps script...');
      mapsScript.remove();
    } else {
      console.warn('Google Maps script уже был удалён.');
    }
    mapsScript = null;
  }

  mapsLoadPromise = null;
  delete window.google;

  console.log('Google Maps успешно очищен.');
};

// Рендеринг React-приложения
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
); 