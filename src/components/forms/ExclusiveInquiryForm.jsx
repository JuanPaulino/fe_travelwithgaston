import { useState } from 'react';

export default function ExclusiveInquiryForm() {
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
      'budget': 'Budget Range',
      'interests': 'Interests',
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
      form_id: 'exclusive_inquiry',
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
    <form id="exclusive-form" onSubmit={handleSubmit} className="space-y-4">
      {/* Hidden field to identify the form */}
      <input type="hidden" name="form_id" value="exclusive_inquiry" />
      
      {/* Name & Contact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="exclusive-name" className="block text-sm font-medium text-gray-700 mb-1">
            Name & Surname *
          </label>
          <input
            type="text"
            id="exclusive-name"
            name="name"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="exclusive-email" className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            id="exclusive-email"
            name="email"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="exclusive-phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            id="exclusive-phone"
            name="phone"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Event Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Event Type *
        </label>
        <div className="grid grid-cols-2 gap-2">
          <label className="flex items-center">
            <input type="radio" name="event_type" value="f1" required className="mr-2" />
            <span className="text-sm">F1</span>
          </label>
          <label className="flex items-center">
            <input type="radio" name="event_type" value="fashion_week" required className="mr-2" />
            <span className="text-sm">Fashion Week</span>
          </label>
          <label className="flex items-center">
            <input type="radio" name="event_type" value="concert" required className="mr-2" />
            <span className="text-sm">Concert</span>
          </label>
          <label className="flex items-center">
            <input type="radio" name="event_type" value="theatre" required className="mr-2" />
            <span className="text-sm">Theatre</span>
          </label>
          <label className="flex items-center">
            <input type="radio" name="event_type" value="sports" required className="mr-2" />
            <span className="text-sm">Sports</span>
          </label>
          <label className="flex items-center col-span-2">
            <input type="radio" name="event_type" value="other" required className="mr-2" />
            <span className="text-sm">Other (Please specify in description)</span>
          </label>
        </div>
      </div>

      {/* Location / City */}
      <div>
        <label htmlFor="exclusive-location" className="block text-sm font-medium text-gray-700 mb-1">
          Location / City *
        </label>
        <input
          type="text"
          id="exclusive-location"
          name="location"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Preferred Date(s) */}
      <div>
        <label htmlFor="exclusive-dates" className="block text-sm font-medium text-gray-700 mb-1">
          Preferred Date(s) *
        </label>
        <input
          type="text"
          id="exclusive-dates"
          name="dates"
          required
          placeholder="e.g., June 15, 2024 or June 15-20, 2024"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Number of Tickets Needed */}
      <div>
        <label htmlFor="exclusive-tickets" className="block text-sm font-medium text-gray-700 mb-1">
          Number of Tickets Needed
        </label>
        <input
          type="number"
          id="exclusive-tickets"
          name="tickets"
          min="1"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* VIP / Hospitality Preferences */}
      <div>
        <label htmlFor="exclusive-vip" className="block text-sm font-medium text-gray-700 mb-1">
          VIP / Hospitality Preferences
        </label>
        <textarea
          id="exclusive-vip"
          name="vip_preferences"
          rows="3"
          placeholder="e.g., VIP access, hospitality packages, meet & greet..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Detailed Description */}
      <div>
        <label htmlFor="exclusive-description" className="block text-sm font-medium text-gray-700 mb-1">
          Detailed Description
        </label>
        <textarea
          id="exclusive-description"
          name="description"
          rows="4"
          placeholder="Tell us about your exclusive event access needs..."
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
          {isSubmitting ? 'Sending...' : 'Start Planning My Event Access'}
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
