import { useState } from 'react';

export default function EventsInquiryForm() {
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
      'eventType': 'Event Type',
      'date': 'Event Date',
      'location': 'Event Location',
      'guests': 'Number of Guests',
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
      form_id: 'events_inquiry',
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
    <form id="events-form" onSubmit={handleSubmit} className="space-y-4">
      {/* Hidden field to identify the form */}
      <input type="hidden" name="form_id" value="events_inquiry" />
      
      {/* Name & Contact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="events-name" className="block text-sm font-medium text-gray-700 mb-1">
            Name & Surname *
          </label>
          <input
            type="text"
            id="events-name"
            name="name"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="events-email" className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            id="events-email"
            name="email"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="events-phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            id="events-phone"
            name="phone"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Type of Event */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Type of Event *
        </label>
        <div className="grid grid-cols-2 gap-2">
          <label className="flex items-center">
            <input type="radio" name="event_type" value="private_dinner" required className="mr-2" />
            <span className="text-sm">Private Dinner</span>
          </label>
          <label className="flex items-center">
            <input type="radio" name="event_type" value="birthday" required className="mr-2" />
            <span className="text-sm">Birthday</span>
          </label>
          <label className="flex items-center">
            <input type="radio" name="event_type" value="anniversary" required className="mr-2" />
            <span className="text-sm">Anniversary</span>
          </label>
          <label className="flex items-center">
            <input type="radio" name="event_type" value="corporate" required className="mr-2" />
            <span className="text-sm">Corporate</span>
          </label>
          <label className="flex items-center col-span-2">
            <input type="radio" name="event_type" value="other" required className="mr-2" />
            <span className="text-sm">Other (please specify in description)</span>
          </label>
        </div>
      </div>

      {/* Destination / City */}
      <div>
        <label htmlFor="events-destination" className="block text-sm font-medium text-gray-700 mb-1">
          Destination / City *
        </label>
        <input
          type="text"
          id="events-destination"
          name="destination"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Preferred Date(s) */}
      <div>
        <label htmlFor="events-dates" className="block text-sm font-medium text-gray-700 mb-1">
          Preferred Date(s) *
        </label>
        <input
          type="text"
          id="events-dates"
          name="dates"
          required
          placeholder="e.g., June 15, 2024 or June 15-20, 2024"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Number of Guests */}
      <div>
        <label htmlFor="events-guests" className="block text-sm font-medium text-gray-700 mb-1">
          Number of Guests
        </label>
        <input
          type="number"
          id="events-guests"
          name="guests"
          min="1"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Special Requests */}
      <div>
        <label htmlFor="events-special" className="block text-sm font-medium text-gray-700 mb-1">
          Special Requests: Cuisine, Venue Style, Entertainment
        </label>
        <textarea
          id="events-special"
          name="special_requests"
          rows="3"
          placeholder="e.g., Italian cuisine, rooftop venue, live music..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Detailed Description */}
      <div>
        <label htmlFor="events-description" className="block text-sm font-medium text-gray-700 mb-1">
          Detailed Description
        </label>
        <textarea
          id="events-description"
          name="description"
          rows="4"
          placeholder="Tell us about your event vision..."
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
          {isSubmitting ? 'Sending...' : 'Start Planning My Event'}
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
