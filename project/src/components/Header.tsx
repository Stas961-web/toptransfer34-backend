import React, { useState } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useLanguage();

  // ✅ НОВЫЙ правильный логотип
  const LOGO_URL = 'https://i.imgur.com/4tFA7E1.png';

  return (
    <header className="fixed w-full bg-black/90 text-white z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ⬇️ УВЕЛИЧИЛИ высоту хедера */}
        <div className="flex justify-between items-center h-28">
          
          {/* LOGO */}
          <div className="flex-shrink-0">
            <a href="#home" className="flex items-center">
              <img
                src={LOGO_URL}
                alt="TopTransfer – Private Driver"
                className="
                  h-[90px] 
                  md:h-[110px] 
                  w-auto 
                  max-w-none 
                  object-contain
                  transition-transform 
                  duration-300 
                  hover:scale-110
                "
                loading="eager"
              />
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="#home" className="hover:text-yellow-400">
              {t('nav.home')}
            </a>
            <a href="#services" className="hover:text-yellow-400">
              {t('nav.services')}
            </a>
            <a href="#fleet" className="hover:text-yellow-400">
              Notre Flotte
            </a>
            <a href="#contact" className="hover:text-yellow-400">
              {t('nav.contact')}
            </a>
          </nav>

          {/* Language + Phone */}
          <div className="hidden md:flex items-center space-x-6">
            <LanguageSwitcher />
            <a
              href="tel:+33758653728"
              className="flex items-center gap-2 text-yellow-400 font-semibold"
            >
              <Phone size={20} />
              +33 7 58 65 37 28
            </a>
          </div>

          {/* Mobile button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-black/95">
          <div className="px-4 py-4 space-y-2">
            <a href="#home" onClick={() => setIsMenuOpen(false)}>Accueil</a>
            <a href="#services" onClick={() => setIsMenuOpen(false)}>Services</a>
            <a href="#fleet" onClick={() => setIsMenuOpen(false)}>Notre Flotte</a>
            <a href="#contact" onClick={() => setIsMenuOpen(false)}>Contact</a>

            <LanguageSwitcher />

            <a
              href="tel:+33758653728"
              className="flex items-center gap-2 text-yellow-400 font-semibold pt-2"
            >
              <Phone size={18} />
              +33 7 58 65 37 28
            </a>
          </div>
        </div>
      )}
    </header>
  );
}