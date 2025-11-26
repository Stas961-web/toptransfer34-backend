import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Luggage } from 'lucide-react';

const vehicles = [
  {
    image: 'https://i.postimg.cc/h4stH6cY/IMG-1010.jpg',
    nameKey: 'fleet.car.name',
    features: [
      'fleet.features.leather',
      'fleet.features.ac',
      'fleet.features.wifi',
      'fleet.features.water',
      'fleet.features.chargers',
      'fleet.features.passengers'
    ]
  }
];

export function Fleet() {
  const { t } = useLanguage();

  return (
    <section id="fleet" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 font-playfair">{t('fleet.title')}</h2>
          <p className="text-xl text-gray-600">
            {t('fleet.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12">
          {vehicles.map((vehicle, index) => (
            <div key={index} className="bg-gray-50 rounded-lg overflow-hidden shadow-lg">
              <div className="grid md:grid-cols-2 gap-0">
                <div
                  className="h-64 md:h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${vehicle.image})` }}
                />
                <div className="p-8">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6 font-playfair">
                    {t(vehicle.nameKey)}
                  </h3>
                  <ul className="space-y-4">
                    {vehicle.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-gray-600">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3" />
                        {t(feature)}
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-8 p-4 bg-gray-100 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Luggage className="w-6 h-6 text-yellow-500 animate-bounce" />
                      <span className="text-gray-700 font-medium">
                        {t('fleet.features.luggage')}
                      </span>
                    </div>
                    <p className="mt-2 text-gray-600">2 {t('fleet.features.largeSuitcases')} + 2 {t('fleet.features.smallSuitcases')}</p>
                  </div>

                  <div className="mt-8">
                    <a
                      href="#booking"
                      className="inline-block bg-yellow-500 text-black px-6 py-3 rounded-md font-semibold hover:bg-yellow-400 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                    >
                      {t('fleet.book')}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}