import React from 'react';
import { Car, Plane, Users, Clock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const services = [
  {
    icon: <Plane className="w-12 h-12 text-yellow-500" />,
    titleKey: 'services.airport.title',
    descriptionKey: 'services.airport.description'
  },
  {
    icon: <Car className="w-12 h-12 text-yellow-500" />,
    titleKey: 'services.private.title',
    descriptionKey: 'services.private.description'
  },
  {
    icon: <Users className="w-12 h-12 text-yellow-500" />,
    titleKey: 'services.events.title',
    descriptionKey: 'services.events.description'
  },
  {
    icon: <Clock className="w-12 h-12 text-yellow-500" />,
    titleKey: 'services.availability.title',
    descriptionKey: 'services.availability.description'
  }
];

export function Services() {
  const { t } = useLanguage();

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('services.title')}</h2>
          <p className="text-xl text-gray-600">
            {t('services.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex justify-center mb-6">{service.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                {t(service.titleKey)}
              </h3>
              <p className="text-gray-600 text-center">{t(service.descriptionKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}