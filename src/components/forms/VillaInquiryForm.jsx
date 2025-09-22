import { useState, useEffect } from 'react';

export default function VillaInquiryForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Manejar cambio entre rental/purchase
  useEffect(() => {
    const typeRadios = document.querySelectorAll('input[name="type"]');
    const rentalDates = document.getElementById('rental-dates');
    const purchaseBudget = document.getElementById('purchase-budget');

    const handleTypeChange = (e) => {
      if (e.target.value === 'rental') {
        rentalDates?.classList.remove('hidden');
        purchaseBudget?.classList.add('hidden');
      } else if (e.target.value === 'purchase') {
        purchaseBudget?.classList.remove('hidden');
        rentalDates?.classList.add('hidden');
      }
    };

    typeRadios.forEach(radio => {
      radio.addEventListener('change', handleTypeChange);
    });

    // Cleanup
    return () => {
      typeRadios.forEach(radio => {
        radio.removeEventListener('change', handleTypeChange);
      });
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    setMessageType('');

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/api/send-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('Thank you! We will contact you soon.');
        setMessageType('success');
        e.target.reset();
      } else {
        setMessage(result.error || 'An error occurred. Please try again.');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form id="villa-form" onSubmit={handleSubmit} className="space-y-4">
      {/* Campo oculto para identificar el formulario */}
      <input type="hidden" name="form_id" value="villa_inquiry" />
      
      {/* Name & Contact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="villa-name" className="block text-sm font-medium text-gray-700 mb-1">
            Name & Surname *
          </label>
          <input
            type="text"
            id="villa-name"
            name="name"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="villa-email" className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            id="villa-email"
            name="email"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="villa-phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            id="villa-phone"
            name="phone"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Destination */}
      <div>
        <label htmlFor="villa-destination" className="block text-sm font-medium text-gray-700 mb-1">
          Destination or Region of Interest *
        </label>
        <input
          type="text"
          id="villa-destination"
          name="destination"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Rental or Purchase */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rental or Purchase? *
        </label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input type="radio" name="type" value="rental" required className="mr-2" />
            <span className="text-sm">Rental</span>
          </label>
          <label className="flex items-center">
            <input type="radio" name="type" value="purchase" required className="mr-2" />
            <span className="text-sm">Purchase</span>
          </label>
        </div>
      </div>

      {/* Desired Dates / Budget Range */}
      <div id="rental-dates" className="hidden">
        <label htmlFor="villa-dates" className="block text-sm font-medium text-gray-700 mb-1">
          Desired Dates
        </label>
        <input
          type="text"
          id="villa-dates"
          name="dates"
          placeholder="e.g., June 15-30, 2024"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div id="purchase-budget" className="hidden">
        <label htmlFor="villa-budget" className="block text-sm font-medium text-gray-700 mb-1">
          Budget Range
        </label>
        <select
          id="villa-budget"
          name="budget"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select budget range</option>
          <option value="under-1m">Under $1M</option>
          <option value="1m-2m">$1M - $2M</option>
          <option value="2m-5m">$2M - $5M</option>
          <option value="5m-10m">$5M - $10M</option>
          <option value="over-10m">Over $10M</option>
        </select>
      </div>

      {/* Number of Guests / Bedrooms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="villa-guests" className="block text-sm font-medium text-gray-700 mb-1">
            Number of Guests
          </label>
          <input
            type="number"
            id="villa-guests"
            name="guests"
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="villa-bedrooms" className="block text-sm font-medium text-gray-700 mb-1">
            Number of Bedrooms
          </label>
          <input
            type="number"
            id="villa-bedrooms"
            name="bedrooms"
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Detailed Description */}
      <div>
        <label htmlFor="villa-description" className="block text-sm font-medium text-gray-700 mb-1">
          Detailed Description
        </label>
        <textarea
          id="villa-description"
          name="description"
          rows="4"
          placeholder="Tell us about your dream villa experience..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Marketing Consent */}
      <div className="space-y-2">
        <label className="flex items-start">
          <input type="checkbox" name="newsletter" className="mt-1 mr-2" />
          <span className="text-sm text-gray-700">
            I'd like to receive exclusive travel offers & news from Travel with Gaston.
          </span>
        </label>
        <label className="flex items-start">
          <input type="checkbox" name="privacy" required className="mt-1 mr-2" />
          <span className="text-sm text-gray-700">
            I have read and accept the Privacy Policy and data protection.{' '}
            <span className="text-red-500">*</span>
          </span>
        </label>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary text-white py-3 px-6 rounded-md font-semibold hover:bg-primary-dark transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Sending...' : 'Start Planning My Villa Experience'}
        </button>
      </div>

      {/* Message Display */}
      {message && (
        <div className={`mt-4 text-center text-sm font-medium ${
          messageType === 'success' ? 'text-green-600' : 'text-red-600'
        }`}>
          {message}
        </div>
      )}
    </form>
  );
}
