import { useState } from 'react';

export default function AirportInquiryForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Function to collect form data as questions and answers array
  const collectFormData = (formData) => {
    const questionsAndAnswers = [];
    
    // Define question mappings for each field
    const questionMappings = {
      'name': 'Name & Surname',
      'email': 'Email',
      'phone': 'Phone',
      'airport': 'Airport',
      'date': 'Date',
      'time': 'Time',
      'destination': 'Destination',
      'passengers': 'Number of Passengers',
      'specialRequests': 'Special Requests',
      'newsletter': 'Subscribe to newsletter',
      'privacy': 'Privacy Policy acceptance'
    };
    
    // Process form data
    Object.entries(formData).forEach(([fieldName, value]) => {
      const question = questionMappings[fieldName];
      if (question && value) {
        let answer = value;
        
        // Handle special cases
        if (fieldName === 'newsletter' || fieldName === 'privacy') {
          answer = value === 'on' ? 'Yes' : 'No';
        }
        
        questionsAndAnswers.push({
          question: question,
          answer: answer
        });
      }
    });
    
    return {
      form_id: 'airport_inquiry',
      questions: questionsAndAnswers
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    setMessageType('');

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // Convert to questions and answers format
    const formattedData = collectFormData(data);

    try {
      const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/forms/send-form`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setMessage(result.message || 'Thank you! We will contact you soon.');
        setMessageType('success');
        e.target.reset();
      } else {
        setMessage(result.error || 'An error occurred. Please try again.');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Connection error. Please try again.');
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form id="airport-form" onSubmit={handleSubmit} className="space-y-4">
      {/* Hidden field to identify the form */}
      <input type="hidden" name="form_id" value="airport_inquiry" />
      
      {/* Name & Contact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="airport-name" className="block text-sm font-medium text-gray-700 mb-1">
            Name & Surname *
          </label>
          <input
            type="text"
            id="airport-name"
            name="name"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="airport-email" className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            id="airport-email"
            name="email"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="airport-phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            id="airport-phone"
            name="phone"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Arrival / Departure Airport */}
      <div>
        <label htmlFor="airport-airport" className="block text-sm font-medium text-gray-700 mb-1">
          Arrival / Departure Airport *
        </label>
        <input
          type="text"
          id="airport-airport"
          name="airport"
          required
          placeholder="e.g., JFK, LAX, Heathrow"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Flight Number & Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="airport-flight" className="block text-sm font-medium text-gray-700 mb-1">
            Flight Number
          </label>
          <input
            type="text"
            id="airport-flight"
            name="flight_number"
            placeholder="e.g., AA123"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="airport-date" className="block text-sm font-medium text-gray-700 mb-1">
            Date *
          </label>
          <input
            type="text"
            id="airport-date"
            name="date"
            required
            placeholder="e.g., June 15, 2024"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Number of Passengers */}
      <div>
        <label htmlFor="airport-passengers" className="block text-sm font-medium text-gray-700 mb-1">
          Number of Passengers
        </label>
        <input
          type="number"
          id="airport-passengers"
          name="passengers"
          min="1"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Service Needed */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Service Needed *
        </label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input type="radio" name="service_needed" value="arrival" required className="mr-2" />
            <span className="text-sm">Arrival</span>
          </label>
          <label className="flex items-center">
            <input type="radio" name="service_needed" value="departure" required className="mr-2" />
            <span className="text-sm">Departure</span>
          </label>
          <label className="flex items-center">
            <input type="radio" name="service_needed" value="both" required className="mr-2" />
            <span className="text-sm">Both</span>
          </label>
        </div>
      </div>

      {/* Extras */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Extras
        </label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input type="checkbox" name="extras" value="fast_track" className="mr-2" />
            <span className="text-sm">Fast-track</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" name="extras" value="vip_lounge" className="mr-2" />
            <span className="text-sm">VIP lounge access</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" name="extras" value="luggage_assistance" className="mr-2" />
            <span className="text-sm">Luggage assistance</span>
          </label>
        </div>
      </div>

      {/* Detailed Description */}
      <div>
        <label htmlFor="airport-description" className="block text-sm font-medium text-gray-700 mb-1">
          Detailed Description
        </label>
        <textarea
          id="airport-description"
          name="description"
          rows="4"
          placeholder="Tell us about your airport service needs..."
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
            I have read and accept the <a href="/privacy-policy" target="_blank" className="text-primary hover:underline">Privacy Policy</a> and data protection.{' '}
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
          {isSubmitting ? 'Sending...' : 'Start Planning My Airport Service'}
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
