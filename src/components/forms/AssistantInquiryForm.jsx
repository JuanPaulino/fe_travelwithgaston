import { useState } from 'react';

export default function AssistantInquiryForm() {
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
      'destination': 'Destination',
      'date': 'Travel Date',
      'duration': 'Duration',
      'services': 'Required Services',
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
      form_id: 'assistant_inquiry',
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
    <form id="assistant-form" onSubmit={handleSubmit} className="space-y-4">
      {/* Hidden field to identify the form */}
      <input type="hidden" name="form_id" value="assistant_inquiry" />
      
      {/* Name & Contact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="assistant-name" className="block text-sm font-medium text-gray-700 mb-1">
            Name & Surname *
          </label>
          <input
            type="text"
            id="assistant-name"
            name="name"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="assistant-email" className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            id="assistant-email"
            name="email"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="assistant-phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            id="assistant-phone"
            name="phone"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Destination / City */}
      <div>
        <label htmlFor="assistant-destination" className="block text-sm font-medium text-gray-700 mb-1">
          Destination / City *
        </label>
        <input
          type="text"
          id="assistant-destination"
          name="destination"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Dates Needed */}
      <div>
        <label htmlFor="assistant-dates" className="block text-sm font-medium text-gray-700 mb-1">
          Dates Needed *
        </label>
        <input
          type="text"
          id="assistant-dates"
          name="dates"
          required
          placeholder="e.g., June 15-30, 2024"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Hours per Day / Full-time */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Hours per Day / Full-time *
        </label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input type="radio" name="hours_type" value="hours_per_day" required className="mr-2" />
            <span className="text-sm">Hours per Day</span>
          </label>
          <label className="flex items-center">
            <input type="radio" name="hours_type" value="full_time" required className="mr-2" />
            <span className="text-sm">Full-time</span>
          </label>
        </div>
        <div className="mt-2">
          <input
            type="number"
            name="hours_per_day"
            min="1"
            max="24"
            placeholder="Number of hours per day"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Main Tasks */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Main Tasks
        </label>
        <div className="space-y-2">
          <label className="flex items-start">
            <input type="checkbox" name="main_tasks" value="itinerary_management" className="mt-1 mr-2" />
            <span className="text-sm">Itinerary Management (flights, hotels, transfers)</span>
          </label>
          <label className="flex items-start">
            <input type="checkbox" name="main_tasks" value="airport_assistance" className="mt-1 mr-2" />
            <span className="text-sm">Airport Assistance & Check-in Support</span>
          </label>
          <label className="flex items-start">
            <input type="checkbox" name="main_tasks" value="reservations" className="mt-1 mr-2" />
            <span className="text-sm">Reservations (restaurants, spas, experiences)</span>
          </label>
          <label className="flex items-start">
            <input type="checkbox" name="main_tasks" value="coordination" className="mt-1 mr-2" />
            <span className="text-sm">On-the-ground Coordination (drivers, guides, activities)</span>
          </label>
          <label className="flex items-start">
            <input type="checkbox" name="main_tasks" value="luggage_handling" className="mt-1 mr-2" />
            <span className="text-sm">Luggage Handling & Travel Logistics</span>
          </label>
          <label className="flex items-start">
            <input type="checkbox" name="main_tasks" value="other" className="mt-1 mr-2" />
            <span className="text-sm">Other (please specify in description)</span>
          </label>
        </div>
      </div>

      {/* Detailed Description */}
      <div>
        <label htmlFor="assistant-description" className="block text-sm font-medium text-gray-700 mb-1">
          Detailed Description
        </label>
        <textarea
          id="assistant-description"
          name="description"
          rows="4"
          placeholder="Tell us about your personal assistant needs..."
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
          {isSubmitting ? 'Sending...' : 'Start Planning My Personal Assistant'}
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
