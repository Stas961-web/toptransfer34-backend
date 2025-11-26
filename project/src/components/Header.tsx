import React, { useState } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <header className="fixed w-full bg-black/90 text-white z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold">TopTransfer</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="#home" className="text-white hover:text-yellow-400 transition-colors">
              {t('nav.home')}
            </a>
            <a href="#services" className="text-white hover:text-yellow-400 transition-colors">
              {t('nav.services')}
            </a>
            <a href="#fleet" className="text-white hover:text-yellow-400 transition-colors">
              Notre Flotte
            </a>
            <a href="#contact" className="text-white hover:text-yellow-400 transition-colors">
              {t('nav.contact')}
            </a>
          </nav>

          {/* Language Switcher */}
          <div className="hidden md:flex items-center space-x-6">
            <LanguageSwitcher />
            <div className="flex items-center space-x-2">
              <Phone size={20} className="text-yellow-400" />
              <a href="tel:+33758653728" className="text-yellow-400 font-semibold">
                +33 7 58 65 37 28
              </a>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white p-2"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a
              href="#home"
              className="block px-3 py-2 text-white hover:text-yellow-400"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('nav.home')}
            </a>
            <a
              href="#services"
              className="block px-3 py-2 text-white hover:text-yellow-400"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('nav.services')}
            </a>
            <a
              href="#fleet"
              className="block px-3 py-2 text-white hover:text-yellow-400"
              onClick={() => setIsMenuOpen(false)}
            >
              Notre Flotte
            </a>
            <a
              href="#contact"
              className="block px-3 py-2 text-white hover:text-yellow-400"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('nav.contact')}
            </a>
            <div className="px-3 py-2">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}