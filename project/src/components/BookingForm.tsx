import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import emailjs from '@emailjs/browser';
import { MapPin, AlertCircle } from 'lucide-react';
import { PaymentForm } from './PaymentForm';



interface BookingFormData {
  name: string;
  phone: string;
  email: string;
  pickup: string;
  dropoff: string;
  date: string;
  time: string;
  notes: string;
  distance?: number;
  price?: number;
  bookingType: 'distance' | 'hourly';
  hours: number;
  flightNumber?: string;
}

interface FormErrors {
  email: string | null;
  geocoding: string | null;
  maps: string | null;
}

export function BookingForm() {
  const { t } = useLanguage();

  const [formData, setFormData] = useState<BookingFormData>({
    name: '',
    phone: '',
    email: '',
    pickup: '',
    dropoff: '',
    date: '',
    time: '',
    notes: '',
    bookingType: 'distance',
    hours: 1,
    flightNumber: '',
  });

  const [errors, setErrors] = useState<FormErrors>({
    email: null,
    geocoding: null,
    maps: null,
  });

  const [showModal, setShowModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);

  // Google Maps refs
  const mapRef = useRef<google.maps.Map | null>(null);
  const pickupAutocompleteRef =
    useRef<google.maps.places.Autocomplete | null>(null);
  const dropoffAutocompleteRef =
    useRef<google.maps.places.Autocomplete | null>(null);
  const directionsServiceRef =
    useRef<google.maps.DirectionsService | null>(null);
  const directionsRendererRef =
    useRef<google.maps.DirectionsRenderer | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  const geolocationTimeoutRef = useRef<number | undefined>(undefined);

  // Базовый URL API (берём из .env фронта)
  const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000';

  // Email validation
  const validateEmail = useCallback((email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, []);

  // Clean up function for maps
  const cleanupMaps = useCallback(() => {
    try {
      if (directionsRendererRef.current) {
        directionsRendererRef.current.setMap(null);
      }
      if (pickupAutocompleteRef.current) {
        google.maps.event.clearInstanceListeners(
          pickupAutocompleteRef.current
        );
      }
      if (dropoffAutocompleteRef.current) {
        google.maps.event.clearInstanceListeners(
          dropoffAutocompleteRef.current
        );
      }
      if (mapRef.current) {
        google.maps.event.clearInstanceListeners(mapRef.current);
      }

      directionsRendererRef.current = null;
      mapRef.current = null;
      pickupAutocompleteRef.current = null;
      dropoffAutocompleteRef.current = null;
      geocoderRef.current = null;
      directionsServiceRef.current = null;
    } catch (error) {
      console.error('Error cleaning up maps:', error);
    }
  }, []);

  // Initialize Google Maps
  const initializeMap = useCallback(async () => {
    if (!mapContainerRef.current || isInitializing) return;

    setIsInitializing(true);
    setErrors(prev => ({ ...prev, maps: null }));

    try {
      // Подгружаем Google Maps через функцию из index.html
      if (!window.google?.maps && window.loadGoogleMaps) {
        await window.loadGoogleMaps();
      }

      if (!mapContainerRef.current) return;

      const mapOptions: google.maps.MapOptions = {
        center: { lat: 43.6108, lng: 3.8767 }, // Montpellier
        zoom: 13,
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
      };

      mapRef.current = new google.maps.Map(mapContainerRef.current, mapOptions);
      geocoderRef.current = new google.maps.Geocoder();

      directionsServiceRef.current = new google.maps.DirectionsService();
      directionsRendererRef.current = new google.maps.DirectionsRenderer({
        map: mapRef.current!,
        suppressMarkers: false,
        polylineOptions: { strokeColor: '#FFD700', strokeWeight: 5 },
      });

      const pickupInput = document.getElementById(
        'pickup'
      ) as HTMLInputElement | null;
      const dropoffInput = document.getElementById(
        'dropoff'
      ) as HTMLInputElement | null;

      if (pickupInput) {
        pickupAutocompleteRef.current =
          new google.maps.places.Autocomplete(pickupInput, {
            fields: ['formatted_address', 'geometry'],
            componentRestrictions: { country: ['fr'] },
          });

        pickupAutocompleteRef.current.addListener('place_changed', () => {
          const place = pickupAutocompleteRef.current?.getPlace();
          if (place?.formatted_address) {
            setFormData(prev => ({ ...prev, pickup: place.formatted_address! }));
          }
        });
      }

      if (dropoffInput) {
        dropoffAutocompleteRef.current =
          new google.maps.places.Autocomplete(dropoffInput, {
            fields: ['formatted_address', 'geometry'],
            componentRestrictions: { country: ['fr'] },
          });

        dropoffAutocompleteRef.current.addListener('place_changed', () => {
          const place = dropoffAutocompleteRef.current?.getPlace();
          if (place?.formatted_address) {
            setFormData(prev => ({ ...prev, dropoff: place.formatted_address! }));
          }
        });
      }

      setMapsLoaded(true);
    } catch (error) {
      console.error('Error initializing Google Maps:', error);
      setErrors(prev => ({
        ...prev,
        maps:
          'Failed to load Google Maps. Please check your internet connection and try again.',
      }));
    } finally {
      setIsInitializing(false);
    }
  }, [isInitializing]);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        await initializeMap();
        if (mounted) setMapsLoaded(true);
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    init();

    return () => {
      mounted = false;
      try {
        cleanupMaps();
      } catch (error) {
        console.error('Error cleaning up map:', error);
      }
      if (geolocationTimeoutRef.current !== undefined) {
        clearTimeout(geolocationTimeoutRef.current);
      }
    };
  }, [initializeMap, cleanupMaps]);

  const getCurrentLocation = useCallback(async () => {
    setIsGettingLocation(true);
    setErrors(prev => ({ ...prev, geocoding: null }));

    if (!navigator.geolocation) {
      setErrors(prev => ({
        ...prev,
        geocoding: "La géolocalisation n'est pas supportée par votre navigateur.",
      }));
      setIsGettingLocation(false);
      return;
    }

    const timeoutPromise = new Promise<never>((_, reject) => {
      geolocationTimeoutRef.current = window.setTimeout(() => {
        reject(new Error('Geolocation request timed out'));
      }, 10000);
    });

    try {
      const positionPromise = new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
          });
        }
      );

      const position = (await Promise.race([
        positionPromise,
        timeoutPromise,
      ])) as GeolocationPosition;

      const { latitude, longitude } = position.coords;

      if (!geocoderRef.current) {
        geocoderRef.current = new google.maps.Geocoder();
      }

      const response = await geocoderRef.current.geocode({
        location: { lat: latitude, lng: longitude },
      });

      if (response.results[0]) {
        setFormData(prev => ({
          ...prev,
          pickup: response.results[0].formatted_address!,
        }));

        if (mapRef.current) {
          mapRef.current.setCenter({ lat: latitude, lng: longitude });
          mapRef.current.setZoom(15);

          new google.maps.Marker({
            position: { lat: latitude, lng: longitude },
            map: mapRef.current,
            title: 'Your Location',
            animation: google.maps.Animation.DROP,
          });
        }
      } else {
        setErrors(prev => ({
          ...prev,
          geocoding: 'Aucune adresse trouvée pour votre position.',
        }));
      }
    } catch (error) {
      console.error('Geolocation error:', error);
      setErrors(prev => ({
        ...prev,
        geocoding: `Erreur de géolocalisation : ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      }));
    } finally {
      setIsGettingLocation(false);
      if (geolocationTimeoutRef.current !== undefined) {
        clearTimeout(geolocationTimeoutRef.current);
      }
    }
  }, []);

  const calculateRoute = useCallback(() => {
    if (!directionsServiceRef.current || !directionsRendererRef.current || !mapRef.current) {
      directionsServiceRef.current = new google.maps.DirectionsService();
      directionsRendererRef.current = new google.maps.DirectionsRenderer({
        map: mapRef.current!,
        suppressMarkers: false,
        polylineOptions: { strokeColor: '#FFD700', strokeWeight: 5 },
      });
    }

    if (formData.pickup && formData.dropoff) {
      setErrors(prev => ({ ...prev, geocoding: null }));

      const pickupPlace = pickupAutocompleteRef.current?.getPlace();
      const dropoffPlace = dropoffAutocompleteRef.current?.getPlace();

      if (!pickupPlace?.geometry || !dropoffPlace?.geometry) {
        setErrors(prev => ({
          ...prev,
          geocoding: 'Please select addresses from the suggestions',
        }));
        return;
      }

      const request: google.maps.DirectionsRequest = {
        origin: formData.pickup,
        destination: formData.dropoff,
        travelMode: google.maps.TravelMode.DRIVING,
      };

      directionsServiceRef.current!.route(request, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          directionsRendererRef.current!.setDirections(result);

          const route = result.routes[0];
          let totalDistance = 0;

          route.legs.forEach(leg => {
            totalDistance += leg.distance?.value || 0;
          });

          const distanceInKm = totalDistance / 1000;
          const price =
            formData.bookingType === 'distance'
              ? 20 + distanceInKm * 2.5
              : formData.hours * 70;

          setFormData(prev => ({
            ...prev,
            distance: distanceInKm,
            price: Math.round(price * 100) / 100,
          }));
        } else {
          setErrors(prev => ({
            ...prev,
            geocoding:
              "Impossible de calculer l'itinéraire. Veuillez vérifier les adresses.",
          }));
        }
      });
    }
  }, [formData.pickup, formData.dropoff, formData.bookingType, formData.hours]);

  // Submit → создаём PaymentIntent на сервере
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateEmail(formData.email)) {
        setErrors(prev => ({
          ...prev,
          email: 'Please enter a valid email address',
        }));
        return;
      }

      if (!formData.price) {
        alert(t('booking.noPrice'));
        return;
      }

      try {
        setIsSubmitting(true);
        setErrors(prev => ({ ...prev, email: null }));

        const response = await fetch(
          `${API_BASE}/api/create-payment-intent`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: formData.price }),
          }
        );

        if (!response.ok) throw new Error('Failed to create payment intent');

        const data = await response.json();
        if (!data.clientSecret)
          throw new Error('No clientSecret returned from server');

        setClientSecret(data.clientSecret);
        setShowPaymentModal(true);
      } catch (err) {
        console.error('Payment init error:', err);
        alert(
          "Erreur lors de l'initialisation du paiement. Veuillez réessayer."
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [API_BASE, formData.email, formData.price, t, validateEmail]
  );

  // Отправка письма
  const sendBookingEmail = useCallback(async () => {
    setErrors(prev => ({ ...prev, email: null }));
    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID ?? 'service_ew0f6ae',
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID ?? 'template_wrd97hj',
        {
          to_name: 'TopTransfer',
          to_email: 'toptransfer34@gmail.com',
          from_name: formData.name,
          from_email: formData.email,
          booking_type:
            formData.bookingType === 'distance'
              ? 'Distance-based'
              : 'Hourly',
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          pickup: formData.pickup,
          dropoff: formData.dropoff,
          date: formData.date,
          time: formData.time,
          flight_number: formData.flightNumber || 'Not provided',
          distance:
            formData.bookingType === 'distance'
              ? `${formData.distance?.toFixed(2)} km`
              : 'N/A',
          hours:
            formData.bookingType === 'hourly' ? formData.hours : 'N/A',
          estimated_price: `€${formData.price?.toFixed(2)}`,
          notes: formData.notes || 'No additional notes',
          payment_status: 'Paid (100%)',
          message: `New booking from ${formData.name}. Pickup: ${formData.pickup}, Dropoff: ${formData.dropoff}, Date: ${formData.date}, Time: ${formData.time}`,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY ?? 'DmcnbmVtpIY40XKhg'
      );
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      setErrors(prev => ({
        ...prev,
        email:
          error instanceof Error
            ? error.message
            : 'An error occurred sending the email',
      }));
      return false;
    }
  }, [formData]);

  const handlePaymentSuccess = useCallback(async () => {
    setIsSubmitting(true);
    setShowPaymentModal(false);

    const emailSent = await sendBookingEmail();

    if (emailSent) {
      setPaymentCompleted(true);
      setShowModal(true);
    } else {
      alert(t('booking.emailError'));
    }

    setIsSubmitting(false);
  }, [sendBookingEmail, t]);

  const handlePaymentCancel = useCallback(() => {
    setShowPaymentModal(false);
  }, []);

  const handleInputChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value } = e.target;
      setFormData(prev => {
        const newData: BookingFormData = { ...prev, [name]: value } as any;

        if (name === 'hours') {
          newData.hours = Math.max(1, Number(value));
        }

        if (name === 'bookingType') {
          if (value === 'hourly') {
            newData.price = newData.hours * 70;
          } else if (value === 'distance' && newData.distance) {
            newData.price = 20 + newData.distance * 2.5;
          }
        }

        return newData;
      });
    },
    []
  );

  const formSections = useMemo(
    () => ({
      bookingTypeSection: (
        <div className="space-y-2">
          <label className="block font-semibold text-gray-700">
            {t('booking.bookingType')}
          </label>
          <select
            name="bookingType"
            value={formData.bookingType}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          >
            <option value="distance">
              {t('booking.distanceBased')}
            </option>
            <option value="hourly">{t('booking.hourly')}</option>
          </select>
        </div>
      ),

      locationSection: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label
              htmlFor="pickup"
              className="block font-semibold text-gray-700"
            >
              {t('booking.pickup')}*
            </label>
            <div className="relative">
              <input
                type="text"
                id="pickup"
                name="pickup"
                value={formData.pickup}
                onChange={handleInputChange}
                required
                className="w-full pl-4 pr-12 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={getCurrentLocation}
                disabled={isGettingLocation}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-yellow-500 transition-colors"
                title="Use current location"
              >
                <MapPin
                  className={`w-6 h-6 ${
                    isGettingLocation ? 'animate-pulse' : ''
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="dropoff"
              className="block font-semibold text-gray-700"
            >
              {t('booking.dropoff')}*
            </label>
            <input
              type="text"
              id="dropoff"
              name="dropoff"
              value={formData.dropoff}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
        </div>
      ),
    }),
    [
      formData.bookingType,
      formData.pickup,
      formData.dropoff,
      handleInputChange,
      getCurrentLocation,
      isGettingLocation,
      t,
    ]
  );

  return (
    <>
      <div className="max-w-4xl mx-auto mb-8">
        {errors.maps ? (
          <div className="bg-red-50 p-6 rounded-lg border border-red-200 text-red-700 mb-6 flex items-center">
            <AlertCircle className="w-6 h-6 mr-2 flex-shrink-0" />
            <p>{errors.maps}</p>
          </div>
        ) : (
          <div
            className="w-full h-[400px] rounded-lg shadow-lg mb-8"
            ref={mapContainerRef}
          >
            {!mapsLoaded && (
              <div className="h-full flex items-center justify-center bg-gray-100 rounded-lg">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-500 border-t-transparent"></div>
              </div>
            )}
          </div>
        )}

        {errors.geocoding && (
          <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-red-700 mb-6 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            <p>{errors.geocoding}</p>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
        {formSections.bookingTypeSection}

        {formData.bookingType === 'hourly' && (
          <div className="space-y-2">
            <label
              htmlFor="hours"
              className="block font-semibold text-gray-700"
            >
              {t('booking.hours')}*
            </label>
            <input
              type="number"
              id="hours"
              name="hours"
              min={1}
              value={formData.hours}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
        )}

        <div className="space-y-2">
          <label
            htmlFor="name"
            className="block font-semibold text-gray-700"
          >
            {t('booking.name')}*
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="phone"
            className="block font-semibold text-gray-700"
          >
            {t('booking.phone')}*
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block font-semibold text-gray-700"
          >
            {t('booking.email')}*
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="flightNumber"
            className="block font-semibold text-gray-700"
          >
            {t('booking.flightNumber')}
          </label>
          <input
            type="text"
            id="flightNumber"
            name="flightNumber"
            value={formData.flightNumber}
            onChange={handleInputChange}
            placeholder={t('booking.flightNumberPlaceholder')}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
        </div>

        {formSections.locationSection}

        <div className="flex justify-center">
          <button
            type="button"
            onClick={calculateRoute}
            className="bg-yellow-500 text-black font-semibold py-2 px-6 rounded-md hover:bg-yellow-600 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
          >
            {t('booking.calculateRoute')}
          </button>
        </div>

        {formData.distance && formData.price && (
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            {formData.bookingType === 'distance' && (
              <p className="text-gray-700">
                {t('booking.distance')}:{' '}
                {formData.distance.toFixed(2)} km
              </p>
            )}
            <p className="text-gray-700 font-semibold">
              {t('booking.estimatedPrice')}:{' '}
              €{formData.price.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Le paiement complet est requis pour confirmer votre
              réservation.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label
              htmlFor="date"
              className="block font-semibold text-gray-700"
            >
              {t('booking.date')}*
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="time"
              className="block font-semibold text-gray-700"
            >
              {t('booking.time')}*
            </label>
            <input
              type="time"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="notes"
            className="block font-semibold text-gray-700"
          >
            {t('booking.notes')}
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-transparent h-32"
          />
        </div>

        {errors.email && (
          <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-red-700">
            {errors.email}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !formData.price}
          className={`w-full bg-yellow-500 text-black font-semibold py-3 px-6 rounded-md hover:bg-yellow-600 transform transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
            isSubmitting || !formData.price
              ? 'opacity-50 cursor-not-allowed'
              : ''
          }`}
        >
          {isSubmitting
            ? t('booking.submitting')
            : paymentCompleted
            ? t('booking.paid')
            : t('booking.proceedToPayment')}
        </button>
      </form>

      {showPaymentModal && formData.price && clientSecret && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="max-w-md w-full mx-4">
            <PaymentForm
              amount={formData.price}
              clientSecret={clientSecret}
              onSuccess={handlePaymentSuccess}
              onCancel={handlePaymentCancel}
            />
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">
              {t('booking.success')}
            </h3>
            <p className="text-gray-600">
              {t('booking.confirmationMessage')}
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="mt-6 w-full bg-yellow-500 text-black font-semibold py-2 px-4 rounded-md hover:bg-yellow-600"
            >
              {t('booking.close')}
            </button>
          </div>
        </div>
      )}
    </>
  );
}