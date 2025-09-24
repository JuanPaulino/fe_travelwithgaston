import { useState } from 'react';

export default function ShoppingInquiryForm() {
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
    <form id="shopping-form" onSubmit={handleSubmit} className="space-y-4">
      {/* Hidden field to identify the form */}
      <input type="hidden" name="form_id" value="shopping_inquiry" />
      
      {/* Name & Contact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="shopping-name" className="block text-sm font-medium text-gray-700 mb-1">
            Name & Surname *
          </label>
          <input
            type="text"
            id="shopping-name"
            name="name"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="shopping-email" className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            id="shopping-email"
            name="email"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="shopping-phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            id="shopping-phone"
            name="phone"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Destination / City */}
      <div>
        <label htmlFor="shopping-destination" className="block text-sm font-medium text-gray-700 mb-1">
          Destination / City *
        </label>
        <input
          type="text"
          id="shopping-destination"
          name="destination"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Preferred Date(s) */}
      <div>
        <label htmlFor="shopping-dates" className="block text-sm font-medium text-gray-700 mb-1">
          Preferred Date(s) *
        </label>
        <input
          type="text"
          id="shopping-dates"
          name="dates"
          required
          placeholder="e.g., June 15, 2024 or June 15-20, 2024"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Style Focus */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Style Focus
        </label>
        <div className="grid grid-cols-2 gap-2">
          <label className="flex items-center">
            <input type="checkbox" name="style_focus" value="luxury_fashion" className="mr-2" />
            <span className="text-sm">Luxury Fashion</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" name="style_focus" value="jewelry" className="mr-2" />
            <span className="text-sm">Jewelry</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" name="style_focus" value="watches" className="mr-2" />
            <span className="text-sm">Watches</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" name="style_focus" value="lifestyle" className="mr-2" />
            <span className="text-sm">Lifestyle</span>
          </label>
          <label className="flex items-center col-span-2">
            <input type="checkbox" name="style_focus" value="other" className="mr-2" />
            <span className="text-sm">Other (please specify in description)</span>
          </label>
        </div>
      </div>

      {/* Service Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Service Type *
        </label>
        <div className="grid grid-cols-2 gap-2">
          <label className="flex items-center">
            <input type="radio" name="service_type" value="personal_shopping" required className="mr-2" />
            <span className="text-sm">Personal Shopping</span>
          </label>
          <label className="flex items-center">
            <input type="radio" name="service_type" value="wardrobe_styling" required className="mr-2" />
            <span className="text-sm">Wardrobe Styling</span>
          </label>
          <label className="flex items-center">
            <input type="radio" name="service_type" value="image_consulting" required className="mr-2" />
            <span className="text-sm">Image Consulting</span>
          </label>
          <label className="flex items-center col-span-2">
            <input type="radio" name="service_type" value="other" required className="mr-2" />
            <span className="text-sm">Other (please specify in description)</span>
          </label>
        </div>
      </div>

      {/* Budget Range */}
      <div>
        <label htmlFor="shopping-budget" className="block text-sm font-medium text-gray-700 mb-1">
          Budget Range (optional)
        </label>
        <select
          id="shopping-budget"
          name="budget_range"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select budget range (optional)</option>
          <option value="under-5k">Under $5,000</option>
          <option value="5k-10k">$5,000 - $10,000</option>
          <option value="10k-25k">$10,000 - $25,000</option>
          <option value="25k-50k">$25,000 - $50,000</option>
          <option value="50k-100k">$50,000 - $100,000</option>
          <option value="over-100k">Over $100,000</option>
        </select>
      </div>

      {/* Detailed Description */}
      <div>
        <label htmlFor="shopping-description" className="block text-sm font-medium text-gray-700 mb-1">
          Detailed Description
        </label>
        <textarea
          id="shopping-description"
          name="description"
          rows="4"
          placeholder="Tell us about your personal shopping and styling needs..."
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
          {isSubmitting ? 'Sending...' : 'Start Planning My Styling Experience'}
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
