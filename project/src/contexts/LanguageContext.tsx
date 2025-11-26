import React, { createContext, useContext, useState } from 'react';

type Language = 'fr' | 'en' | 'ru';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.services': 'Services',
    'nav.Notre Flotte': 'Notre Flotte',
    'nav.contact': 'Contact',
    'nav.book': 'Réserver',

    // Hero
    'hero.title1': 'Service VTC Premium à Montpellier',
    'hero.subtitle1': 'Transport haut de gamme pour tous vos déplacements',
    'hero.title2': 'Confort et Élégance',
    'hero.subtitle2': 'Mercedes Classe E à votre service',
    'hero.title3': 'Découvrez Montpellier',
    'hero.subtitle3': 'Transport premium pour vos visites touristiques',
    'hero.title4': 'Excursions Régionales',
    'hero.subtitle4': 'Explorez la région en tout confort',
    'hero.title5': 'Transferts Aéroport',
    'hero.subtitle5': 'Service ponctuel et professionnel 24/7',
    'hero.book': 'Réserver Maintenant',

    // Services
    'services.title': 'Nos Services',
    'services.subtitle': 'Des prestations haut de gamme adaptées à vos besoins',
    'services.airport.title': 'Transferts Aéroport',
    'services.airport.description': 'Service de navette premium vers tous les aéroports de la région',
    'services.private.title': 'Transport Privé',
    'services.private.description': 'Déplacements professionnels et personnels en toute discrétion',
    'services.events.title': 'Événements',
    'services.events.description': 'Transport pour mariages, séminaires et événements spéciaux',
    'services.availability.title': 'Disponibilité 24/7',
    'services.availability.description': 'Service disponible jour et nuit, 7 jours sur 7',

    // Fleet
    'fleet.title': 'Notre flotte',
    'fleet.subtitle': 'Mercedes Classe E pour votre confort optimal',
    'fleet.car.name': 'Mercedes Classe E',
    'fleet.features.leather': 'Intérieur cuir noir',
    'fleet.features.ac': 'Climatisation bi-zone',
    'fleet.features.wifi': 'WiFi gratuit',
    'fleet.features.water': 'Bouteilles d\'eau',
    'fleet.features.chargers': 'Chargeurs de téléphone',
    'fleet.features.passengers': '4 passagers maximum',
    'fleet.features.luggage': 'Capacité de bagages',
    'fleet.features.largeSuitcases': 'grandes valises',
    'fleet.features.smallSuitcases': 'petites valises',
    'fleet.book': 'Réserver',

    // Contact
    'contact.title': 'Contactez-nous',
    'contact.subtitle': 'Disponible 24/7 pour répondre à vos besoins',
    'contact.phone': 'Téléphone',
    'contact.email': 'Email',
    'contact.address': 'Adresse',
    'contact.location': 'Montpellier et sa région',

    // Booking Form
    'booking.title': 'Réserver un Trajet',
    'booking.subtitle': 'Remplissez le formulaire ci-dessous pour réserver votre transport',
    'booking.name': 'Nom Complet',
    'booking.phone': 'Numéro de Téléphone',
    'booking.email': 'Email',
    'booking.pickup': 'Lieu de Départ',
    'booking.dropoff': 'Lieu d\'Arrivée',
    'booking.date': 'Date',
    'booking.time': 'Heure',
    'booking.notes': 'Notes Additionnelles',
    'booking.distance': 'Distance',
    'booking.estimatedPrice': 'Prix estimé',
    'booking.submit': 'Confirmer la Réservation',
    'booking.success': 'Réservation Confirmée !',
    'booking.close': 'Fermer',
    'booking.confirmationMessage': 'Votre demande de réservation a été envoyée. Nous vous contacterons bientôt pour confirmer votre trajet.',
    'booking.emailError': 'Problème lors de l\'envoi de l\'email. Veuillez nous contacter directement.',
    'booking.calculateRoute': 'Calculer l\'itinéraire',

    // Auth translations
    'auth.signIn': 'Connexion',
    'auth.signUp': 'Inscription',
    'auth.email': 'Email',
    'auth.password': 'Mot de passe',
    'auth.haveAccount': 'Déjà un compte ? Connectez-vous',
    'auth.needAccount': 'Pas de compte ? Inscrivez-vous',
    
    // New booking translations
    'booking.bookingType': 'Type de réservation',
    'booking.distanceBased': 'Par distance',
    'booking.hourly': 'Par heure',
    'booking.hours': 'Nombre d\'heures',
    'booking.flightNumber': 'Numéro de vol/train',
    'booking.flightNumberPlaceholder': 'Ex: AF1234 ou TGV6789',
    'booking.error': 'Une erreur est survenue lors de l\'envoi de la réservation',
    'booking.proceedToPayment': 'Procéder au paiement',
    'booking.submitting': 'Traitement en cours...',
    'booking.paid': 'Payé - Réservation confirmée',
    'booking.paymentInfo': 'Le paiement complet est requis pour confirmer votre réservation.',
    'booking.noPrice': 'Veuillez sélectionner un trajet pour calculer le prix',
    
    // Payment translations
    'payment.title': 'Paiement sécurisé',
    'payment.amount': 'Montant à payer',
    'payment.cardDetails': 'Détails de la carte',
    'payment.cardNumber': 'Numéro de carte',
    'payment.expiry': 'Date d\'expiration',
    'payment.cvc': 'CVC',
    'payment.pay': 'Payer maintenant',
    'payment.processing': 'Traitement...',
    'payment.cancel': 'Annuler',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.services': 'Services',
    'nav.fleet': 'Our Fleet',
    'nav.contact': 'Contact',
    'nav.book': 'Book Now',

    // Hero
    'hero.title1': 'Premium Transportation in Montpellier',
    'hero.subtitle1': 'High-end transport for all your travels',
    'hero.title2': 'Comfort and Elegance',
    'hero.subtitle2': 'Mercedes E-Class at your service',
    'hero.title3': 'Discover Montpellier',
    'hero.subtitle3': 'Premium transport for your sightseeing',
    'hero.title4': 'Regional Excursions',
    'hero.subtitle4': 'Explore the region in comfort',
    'hero.title5': 'Airport Transfers',
    'hero.subtitle5': 'Punctual and professional service 24/7',
    'hero.book': 'Book Now',

    // Services
    'services.title': 'Our Services',
    'services.subtitle': 'High-end services tailored to your needs',
    'services.airport.title': 'Airport Transfers',
    'services.airport.description': 'Premium shuttle service to all regional airports',
    'services.private.title': 'Private Transport',
    'services.private.description': 'Professional and personal travel with discretion',
    'services.events.title': 'Events',
    'services.events.description': 'Transportation for weddings, seminars, and special events',
    'services.availability.title': '24/7 Availability',
    'services.availability.description': 'Service available day and night, 7 days a week',

    // Fleet
    'fleet.title': 'Our Fleet',
    'fleet.subtitle': 'Mercedes E-Class for optimal comfort',
    'fleet.car.name': 'Mercedes E-Class',
    'fleet.features.leather': 'Black leather interior',
    'fleet.features.ac': 'Dual-zone climate control',
    'fleet.features.wifi': 'Free WiFi',
    'fleet.features.water': 'Bottled water',
    'fleet.features.chargers': 'Phone chargers',
    'fleet.features.passengers': '4 passengers maximum',
    'fleet.features.luggage': 'Luggage Capacity',
    'fleet.features.largeSuitcases': 'large suitcases',
    'fleet.features.smallSuitcases': 'small suitcases',
    'fleet.book': 'Book Now',

    // Contact
    'contact.title': 'Contact Us',
    'contact.subtitle': 'Available 24/7 to meet your needs',
    'contact.phone': 'Phone',
    'contact.email': 'Email',
    'contact.address': 'Address',
    'contact.location': 'Montpellier and surrounding area',

    // Booking Form
    'booking.title': 'Book a Ride',
    'booking.subtitle': 'Fill out the form below to book your transport',
    'booking.name': 'Full Name',
    'booking.phone': 'Phone Number',
    'booking.email': 'Email',
    'booking.pickup': 'Pickup Location',
    'booking.dropoff': 'Drop-off Location',
    'booking.date': 'Date',
    'booking.time': 'Time',
    'booking.notes': 'Additional Notes',
    'booking.distance': 'Distance',
    'booking.estimatedPrice': 'Estimated Price',
    'booking.submit': 'Confirm Booking',
    'booking.success': 'Booking Confirmed!',
    'booking.close': 'Close',
    'booking.confirmationMessage': 'Your booking request has been sent. We will contact you soon to confirm your trip.',
    'booking.emailError': 'Problem sending the email. Please contact us directly.',
    'booking.calculateRoute': 'Calculate the route',

    // Auth translations
    'auth.signIn': 'Sign In',
    'auth.signUp': 'Sign Up',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.haveAccount': 'Already have an account? Sign in',
    'auth.needAccount': 'Need an account? Sign up',
    
    // New booking translations
    'booking.bookingType': 'Booking Type',
    'booking.distanceBased': 'Distance-based',
    'booking.hourly': 'Hourly',
    'booking.hours': 'Number of hours',
    'booking.flightNumber': 'Flight/Train Number',
    'booking.flightNumberPlaceholder': 'E.g., AF1234 or TGV6789',
    'booking.error': 'An error occurred while sending the booking',
    'booking.proceedToPayment': 'Proceed to Payment',
    'booking.submitting': 'Processing...',
    'booking.paid': 'Paid - Booking Confirmed',
    'booking.paymentInfo': 'Full payment is required to confirm your booking.',
    'booking.noPrice': 'Please select a route to calculate the price',
    
    // Payment translations
    'payment.title': 'Secure Payment',
    'payment.amount': 'Amount to pay',
    'payment.cardDetails': 'Card Details',
    'payment.cardNumber': 'Card Number',
    'payment.expiry': 'Expiry Date',
    'payment.cvc': 'CVC',
    'payment.pay': 'Pay Now',
    'payment.processing': 'Processing...',
    'payment.cancel': 'Cancel',
  },
  ru: {
    // Navigation
    'nav.home': 'Главная',
    'nav.services': 'Услуги',
    'nav.fleet': 'Наш Автопарк',
    'nav.contact': 'Контакты',
    'nav.book': 'Забронировать',

    // Hero
    'hero.title1': 'Премиум Трансфер в Монпелье',
    'hero.subtitle1': 'Премиальные перевозки для любых поездок',
    'hero.title2': 'Комфорт и Элегантность',
    'hero.subtitle2': 'Mercedes E-Class к вашим услугам',
    'hero.title3': 'Откройте для себя Монпелье',
    'hero.subtitle3': 'Премиум транспорт для ваших экскурсий',
    'hero.title4': 'Региональные Экскурсии',
    'hero.subtitle4': 'Исследуйте регион с комфортом',
    'hero.title5': 'Трансфер в Аэропорт',
    'hero.subtitle5': 'Пунктуальный и профессиональный сервис 24/7',
    'hero.book': 'Забронировать',

    // Services
    'services.title': 'Наши Услуги',
    'services.subtitle': 'Премиальный сервис для ваших потребностей',
    'services.airport.title': 'Трансфер в Аэропорт',
    'services.airport.description': 'Премиум трансфер во все аэропорты региона',
    'services.private.title': 'Частные Перевозки',
    'services.private.description': 'Деловые и личные поездки с полной конфиденциальностью',
    'services.events.title': 'Мероприятия',
    'services.events.description': 'Транспорт для свадеб, семинаров и особых событий',
    'services.availability.title': 'Доступность 24/7',
    'services.availability.description': 'Сервис доступен днем и ночью, 7 дней в неделю',

    // Fleet
    'fleet.title': 'Наш Автопарк',
    'fleet.subtitle': 'Mercedes E-Class для максимального комфорта',
    'fleet.car.name': 'Mercedes E-Class',
    'fleet.features.leather': 'Черный кожаный салон',
    'fleet.features.ac': 'Двухзонный климат-контроль',
    'fleet.features.wifi': 'Бесплатный WiFi',
    'fleet.features.water': 'Бутилированная вода',
    'fleet.features.chargers': 'Зарядные устройства',
    'fleet.features.passengers': 'Максимум 4 пассажира',
    'fleet.features.luggage': 'Вместимость багажа',
    'fleet.features.largeSuitcases': 'больших чемодана',
    'fleet.features.smallSuitcases': 'маленьких чемодана',
    'fleet.book': 'Забронировать',

    // Contact
    'contact.title': 'Свяжитесь с Нами',
    'contact.subtitle': 'Доступны 24/7 для ваших потребностей',
    'contact.phone': 'Телефон',
    'contact.email': 'Email',
    'contact.address': 'Адрес',
    'contact.location': 'Монпелье и окрестности',

    // Booking Form
    'booking.title': 'Заказать Поездку',
    'booking.subtitle': 'Заполните форму ниже для бронирования трансфера',
    'booking.name': 'Полное Имя',
    'booking.phone': 'Номер Телефона',
    'booking.email': 'Email',
    'booking.pickup': 'Место Отправления',
    'booking.dropoff': 'Место Назначения',
    'booking.date': 'Дата',
    'booking.time': 'Время',
    'booking.notes': 'Дополнительные Заметки',
    'booking.distance': 'Расстояние',
    'booking.estimatedPrice': 'Расчетная стоимость',
    'booking.submit': 'Подтвердить Бронирование',
    'booking.success': 'Бронирование Подтверждено!',
    'booking.close': 'Закрыть',
    'booking.confirmationMessage': 'Ваш запрос на бронирование отправлен. Мы свяжемся с вами в ближайшее время для подтверждения поездки.',
    'booking.emailError': 'Проблема при отправке электронной почты. Пожалуйста, свяжитесь с нами напрямую.',
    'booking.calculateRoute': 'Рассчитать маршрут',

    // Auth translations
    'auth.signIn': 'Вход',
    'auth.signUp': 'Регистрация',
    'auth.email': 'Email',
    'auth.password': 'Пароль',
    'auth.haveAccount': 'Уже есть аккаунт? Войти',
    'auth.needAccount': 'Нужен аккаунт? Зарегистрироваться',
    
    // New booking translations
    'booking.bookingType': 'Тип бронирования',
    'booking.distanceBased': 'По расстоянию',
    'booking.hourly': 'Почасовой',
    'booking.hours': 'Количество часов',
    'booking.flightNumber': 'Номер рейса/поезда',
    'booking.flightNumberPlaceholder': 'Например: AF1234 или TGV6789',
    'booking.error': 'Произошла ошибка при отправке бронирования',
    'booking.proceedToPayment': 'Перейти к оплате',
    'booking.submitting': 'Обработка...',
    'booking.paid': 'Оплачено - Бронирование подтверждено',
    'booking.paymentInfo': 'Для подтверждения бронирования требуется полная оплата.',
    'booking.noPrice': 'Пожалуйста, выберите маршрут для расчета цены',
    
    // Payment translations
    'payment.title': 'Безопасная оплата',
    'payment.amount': 'Сумма к оплате',
    'payment.cardDetails': 'Данные карты',
    'payment.cardNumber': 'Номер карты',
    'payment.expiry': 'Срок действия',
    'payment.cvc': 'CVC',
    'payment.pay': 'Оплатить',
    'payment.processing': 'Обработка...',
    'payment.cancel': 'Отмена',
  }
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'fr',
  setLanguage: () => {},
  t: () => ''
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('fr');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);