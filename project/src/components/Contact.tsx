import React from 'react';
import { Phone, Mail, MapPin, Instagram } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function Contact() {
  const { t } = useLanguage();

  // Проверка на наличие функции t
  if (typeof t !== 'function') {
    console.error("Ошибка: функция 't' не определена. Проверьте контекст LanguageContext.");
    return null;
  }

  // Получение переводов с проверками
  const title = t('contact.title') || 'Контакты';
  const subtitle = t('contact.subtitle') || 'Свяжитесь с нами';
  const phone = t('contact.phone') || 'Телефон';
  const email = t('contact.email') || 'Эл. почта';
  const address = t('contact.address') || 'Адрес';
  const location = t('contact.location') || 'Где нас найти';

  return (
    <section id="contact" className="py-20 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">{title}</h2>
          <p className="text-xl text-gray-300">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="text-center">
            <Phone className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">{phone}</h3>
            <a
              href="tel:+33758653728"
              className="text-yellow-500 hover:text-yellow-400 transition-colors"
            >
              +33 7 58 65 37 28
            </a>
          </div>

          <div className="text-center">
            <Mail className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">{email}</h3>
            <a
              href="mailto:toptransfer34@gmail.com"
              className="text-yellow-500 hover:text-yellow-400 transition-colors"
            >
              toptransfer34@gmail.com
            </a>
          </div>

          <div className="text-center">
            <Instagram className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Instagram</h3>
            <a
              href="https://www.instagram.com/toptransfer34"
              target="_blank"
              rel="noopener noreferrer"
              className="text-yellow-500 hover:text-yellow-400 transition-colors"
            >
              @toptransfer34
            </a>
          </div>

          <div className="text-center">
            <MapPin className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">{address}</h3>
            <p className="text-gray-300">{location}</p>
          </div>
        </div>
      </div>
    </section>
  );
}