import { useState } from 'react';

export default function YachtInquiryForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

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
    <form id="yacht-form" onSubmit={handleSubmit} className="space-y-4">
      {/* Hidden field to identify the form */}
      <input type="hidden" name="form_id" value="yacht_inquiry" />
      
      {/* Name & Contact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="yacht-name" className="block text-sm font-medium text-gray-700 mb-1">
            Name & Surname *
          </label>
          <input
            type="text"
            id="yacht-name"
            name="name"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="yacht-email" className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            id="yacht-email"
            name="email"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="yacht-phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            id="yacht-phone"
            name="phone"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Charter or Purchase */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Charter or Purchase? *
        </label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input type="radio" name="type" value="charter" required className="mr-2" />
            <span className="text-sm">Charter</span>
          </label>
          <label className="flex items-center">
            <input type="radio" name="type" value="purchase" required className="mr-2" />
            <span className="text-sm">Purchase</span>
          </label>
        </div>
      </div>

      {/* Destination / Cruising Area */}
      <div>
        <label htmlFor="yacht-destination" className="block text-sm font-medium text-gray-700 mb-1">
          Destination / Cruising Area *
        </label>
        <input
          type="text"
          id="yacht-destination"
          name="destination"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Charter Dates */}
      <div>
        <label htmlFor="yacht-dates" className="block text-sm font-medium text-gray-700 mb-1">
          Charter Dates (if applicable)
        </label>
        <input
          type="text"
          id="yacht-dates"
          name="dates"
          placeholder="e.g., June 15-30, 2024"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Number of Guests / Cabins */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="yacht-guests" className="block text-sm font-medium text-gray-700 mb-1">
            Number of Guests
          </label>
          <input
            type="number"
            id="yacht-guests"
            name="guests"
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="yacht-cabins" className="block text-sm font-medium text-gray-700 mb-1">
            Cabins Needed
          </label>
          <input
            type="number"
            id="yacht-cabins"
            name="cabins"
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Special Requests */}
      <div>
        <label htmlFor="yacht-special" className="block text-sm font-medium text-gray-700 mb-1">
          Special Requests (crew, chef, events on board)
        </label>
        <textarea
          id="yacht-special"
          name="special_requests"
          rows="3"
          placeholder="e.g., Private chef, crew requirements, special events..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Detailed Description */}
      <div>
        <label htmlFor="yacht-description" className="block text-sm font-medium text-gray-700 mb-1">
          Detailed Description
        </label>
        <textarea
          id="yacht-description"
          name="description"
          rows="4"
          placeholder="Tell us about your dream yacht experience..."
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
          {isSubmitting ? 'Sending...' : 'Start Planning My Yacht Experience'}
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
