import React, { useMemo } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { Fleet } from './components/Fleet';
import { Contact } from './components/Contact';
import { BookingForm } from './components/BookingForm';
import { LanguageProvider } from './contexts/LanguageContext';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { ErrorBoundary } from './components/ErrorBoundary';

const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

function App() {
  // Инициализация Stripe только один раз
  const stripePromise: Promise<Stripe | null> | null = useMemo(
    () => (stripePublicKey ? loadStripe(stripePublicKey) : null),
    [stripePublicKey]
  );

  return (
    <ErrorBoundary>
      <LanguageProvider>
        <div className="min-h-screen">
          <Header />
          <main>
            <Hero />
            <Services />
            <Fleet />
            <section id="booking" className="py-20 bg-gray-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold text-gray-900 mb-4 font-playfair">
                    Réserver un Trajet
                  </h2>
                  <p className="text-xl text-gray-600">
                    Remplissez le formulaire ci-dessous pour réserver votre transport
                  </p>
                </div>
                {stripePromise ? (
                  // Добавляем ключ, чтобы принудительно перерисовать при изменении ключа Stripe
                  <Elements stripe={stripePromise} key={stripePublicKey}>
                    <BookingForm />
                  </Elements>
                ) : (
                  <p className="text-red-600 text-center">
                    Erreur de configuration de paiement. Veuillez contacter le support.
                  </p>
                )}
              </div>
            </section>
            <Contact />
          </main>
        </div>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;