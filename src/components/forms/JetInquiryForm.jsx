import { useState } from 'react';

export default function JetInquiryForm() {
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
      'departure': 'Departure Location',
      'destination': 'Destination',
      'departureDate': 'Departure Date',
      'returnDate': 'Return Date',
      'passengers': 'Number of Passengers',
      'aircraftType': 'Preferred Aircraft Type',
      'budget': 'Budget Range',
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
      form_id: 'jet_inquiry',
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
    <form id="jet-form" onSubmit={handleSubmit} className="space-y-4">
      {/* Hidden field to identify the form */}
      <input type="hidden" name="form_id" value="jet_inquiry" />
      
      {/* Name & Contact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="jet-name" className="block text-sm font-medium text-gray-700 mb-1">
            Name & Surname *
          </label>
          <input
            type="text"
            id="jet-name"
            name="name"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="jet-email" className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            id="jet-email"
            name="email"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="jet-phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            id="jet-phone"
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

      {/* Departure City & Destination */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="jet-departure" className="block text-sm font-medium text-gray-700 mb-1">
            Departure City *
          </label>
          <input
            type="text"
            id="jet-departure"
            name="departure"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="jet-destination" className="block text-sm font-medium text-gray-700 mb-1">
            Destination *
          </label>
          <input
            type="text"
            id="jet-destination"
            name="destination"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Preferred Dates & Times */}
      <div>
        <label htmlFor="jet-dates" className="block text-sm font-medium text-gray-700 mb-1">
          Preferred Dates & Times *
        </label>
        <input
          type="text"
          id="jet-dates"
          name="dates"
          required
          placeholder="e.g., December 15, 2024 at 10:00 AM"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Number of Passengers */}
      <div>
        <label htmlFor="jet-passengers" className="block text-sm font-medium text-gray-700 mb-1">
          Number of Passengers *
        </label>
        <input
          type="number"
          id="jet-passengers"
          name="passengers"
          min="1"
          max="20"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Preferred Aircraft Type */}
      <div>
        <label htmlFor="jet-aircraft" className="block text-sm font-medium text-gray-700 mb-1">
          Preferred Aircraft Type (if known)
        </label>
        <select
          id="jet-aircraft"
          name="aircraft"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select aircraft type (optional)</option>
          <option value="light-jet">Light Jet (4-8 passengers)</option>
          <option value="midsize-jet">Midsize Jet (6-9 passengers)</option>
          <option value="heavy-jet">Heavy Jet (8-16 passengers)</option>
          <option value="ultra-long-range">Ultra Long Range (12-16 passengers)</option>
          <option value="helicopter">Helicopter (2-6 passengers)</option>
          <option value="turboprop">Turboprop (6-9 passengers)</option>
          <option value="airliner">Airliner (20+ passengers)</option>
          <option value="other">Other (please specify in description)</option>
        </select>
      </div>

      {/* Detailed Description */}
      <div>
        <label htmlFor="jet-description" className="block text-sm font-medium text-gray-700 mb-1">
          Detailed Description
        </label>
        <textarea
          id="jet-description"
          name="description"
          rows="4"
          placeholder="Tell us about your flight requirements, special requests, or any additional details..."
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
          {isSubmitting ? 'Sending...' : 'Start Planning My Private Flight'}
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
