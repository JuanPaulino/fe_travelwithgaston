import { useState } from 'react';

export default function ChauffeurInquiryForm() {
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
      'pickupLocation': 'Pickup Location',
      'destination': 'Destination',
      'date': 'Date',
      'time': 'Time',
      'duration': 'Duration',
      'vehicleType': 'Vehicle Type',
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
      form_id: 'chauffeur_inquiry',
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
    <form id="chauffeur-form" onSubmit={handleSubmit} className="space-y-4">
      {/* Hidden field to identify the form */}
      <input type="hidden" name="form_id" value="chauffeur_inquiry" />
      
      {/* Name & Contact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="chauffeur-name" className="block text-sm font-medium text-gray-700 mb-1">
            Name & Surname *
          </label>
          <input
            type="text"
            id="chauffeur-name"
            name="name"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="chauffeur-email" className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            id="chauffeur-email"
            name="email"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="chauffeur-phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            id="chauffeur-phone"
            name="phone"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* City / Destination */}
      <div>
        <label htmlFor="chauffeur-city" className="block text-sm font-medium text-gray-700 mb-1">
          City / Destination *
        </label>
        <input
          type="text"
          id="chauffeur-city"
          name="city"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Dates of Service */}
      <div>
        <label htmlFor="chauffeur-dates" className="block text-sm font-medium text-gray-700 mb-1">
          Dates of Service *
        </label>
        <input
          type="text"
          id="chauffeur-dates"
          name="dates"
          required
          placeholder="e.g., June 15-20, 2024"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Service Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Service Type *
        </label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input type="radio" name="service_type" value="chauffeur" required className="mr-2" />
            <span className="text-sm">Chauffeur</span>
          </label>
          <label className="flex items-center">
            <input type="radio" name="service_type" value="self_drive" required className="mr-2" />
            <span className="text-sm">Self-Drive Rental</span>
          </label>
        </div>
      </div>

      {/* Vehicle Preference */}
      <div>
        <label htmlFor="chauffeur-vehicle" className="block text-sm font-medium text-gray-700 mb-1">
          Vehicle Preference
        </label>
        <select
          id="chauffeur-vehicle"
          name="vehicle_preference"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select vehicle preference</option>
          <option value="luxury-sedan">Luxury Sedan</option>
          <option value="suv">SUV</option>
          <option value="sports-car">Sports Car</option>
          <option value="limousine">Limousine</option>
          <option value="other">Other (please specify in description)</option>
        </select>
      </div>

      {/* Number of Passengers */}
      <div>
        <label htmlFor="chauffeur-passengers" className="block text-sm font-medium text-gray-700 mb-1">
          Number of Passengers
        </label>
        <input
          type="number"
          id="chauffeur-passengers"
          name="passengers"
          min="1"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Detailed Description */}
      <div>
        <label htmlFor="chauffeur-description" className="block text-sm font-medium text-gray-700 mb-1">
          Detailed Description
        </label>
        <textarea
          id="chauffeur-description"
          name="description"
          rows="4"
          placeholder="Tell us about your transportation needs..."
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
          {isSubmitting ? 'Sending...' : 'Start Planning My Car Service'}
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
