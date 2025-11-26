import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useLanguage } from '../contexts/LanguageContext';

const slides = [
  {
    image: ' https://images.unsplash.com/photo-1449965408869-eaa3f722e40d',
    titleKey: 'hero.title1',
    subtitleKey: 'hero.subtitle1'
  },
  {
    image: 'https://i.postimg.cc/gjj98wCv/3-C5-CCFC5-CF23-4773-BA8-B-08-D6-C16-D8904.jpg',
    titleKey: 'hero.title2',
    subtitleKey: 'hero.subtitle2'
  },
  {
    image: 'https://i.postimg.cc/1z1v8xWj/IMG-9867.jpg',
    titleKey: 'hero.title3',
    subtitleKey: 'hero.subtitle3'
  },
  {
    image: ' https://i.postimg.cc/rmT9gSxy/1024x.jpg',
    titleKey: 'hero.title4',
    subtitleKey: 'hero.subtitle4'
  },
  {
    image: 'https://i.postimg.cc/Prqjf7NH/image.jpg',
    titleKey: 'hero.title5',
    subtitleKey: 'hero.subtitle5'
  }
];

export function Hero() {
  const { t } = useLanguage();
  
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true
  };

  return (
    <section className="relative h-screen">
      <Slider {...settings} className="h-full">
        {slides.map((slide, index) => (
          <div key={index} className="h-screen">
            <div
              className="h-full bg-cover bg-center"
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${slide.image})`
              }}
            >
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-white px-4">
                  <h2 className="text-4xl md:text-6xl font-bold mb-4">{t(slide.titleKey)}</h2>
                  <p className="text-xl md:text-2xl mb-8">{t(slide.subtitleKey)}</p>
                  <a
                    href="#booking"
                    className="inline-block bg-yellow-500 text-black px-8 py-3 rounded-md font-semibold hover:bg-yellow-400 transition-colors"
                  >
                    {t('hero.book')}
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
}