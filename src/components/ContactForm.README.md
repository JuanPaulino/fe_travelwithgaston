# ContactForm.astro

## Description
Basic contact form for Travel with Gaston. This form allows users to send general inquiries, ask questions, or get in touch with the company.

## Features

### Form Fields

#### Contact Information
1. **Full Name** - Contact person name (required)
2. **Email Address** - Contact email (required)
3. **Phone Number** - Contact phone (optional)
4. **Company** - Company name (optional)

#### Inquiry Details
5. **How can we help you?** - Contact reason (optional)
   - General Inquiry, Booking Question, Travel Planning, etc.
6. **Message** - Detailed message (required)

#### Additional Information
7. **Newsletter** - Marketing consent (optional)
8. **Privacy Policy** - Required acceptance

## Functionality

### Validation
- Required fields: Name, Email, Message, Privacy Policy
- Email format validation
- Message length validation (minimum 10 characters)
- Real-time validation

### Form Submission
- Endpoint: `/api/contact`
- Method: POST
- Format: JSON
- Error handling and status messages

## Dependencies

### Data Files
- `src/data/contactFormData.js` - Contains dropdown options and selections

### Components
- `src/components/form/FormField.astro` - Base form field component

## Styles
- Uses Tailwind CSS
- Responsive design
- Hover and focus states
- Error indicators
- Clean, professional appearance

## Usage

```astro
---
import ContactForm from './ContactForm.astro';
---

<ContactForm />
```

## Data Structure Sent

```javascript
{
  // Contact information
  name: "John Doe",
  email: "john@example.com",
  phone: "+1234567890",
  company: "Acme Corporation",
  
  // Inquiry details
  contactReason: "general-inquiry",
  message: "I would like to know more about your travel packages...",
  
  // Additional info
  newsletter: true,
  privacy: true
}
```

## Validation Rules

### Required Fields
- **name**: Must not be empty
- **email**: Must be valid email format
- **message**: Must be at least 10 characters
- **privacy**: Must be checked

### Optional Fields
- **phone**: No validation if empty
- **company**: No validation if empty
- **contactReason**: No validation if empty
- **newsletter**: No validation if unchecked

## API Endpoint

The form sends data to `/api/contact` which:
- Validates the form data
- Sends data to Travel with Gaston webhook
- Returns success/error response
- Includes comprehensive logging

## Implementation Notes

1. **API Endpoint**: The form sends data to `/api/contact` - this endpoint must be implemented in the backend.

2. **Validation**: Validation is performed both in the frontend (JavaScript) and should be implemented in the backend.

3. **Responsive**: The form is designed to be fully responsive using Tailwind CSS.

4. **Accessibility**: Includes proper ARIA attributes and error handling for screen readers.

5. **User Experience**: Real-time validation provides immediate feedback to users.

## Test Page

A test page is available at `/contact-form` to preview and test the form functionality. The test page includes:
- Hero section with form introduction
- Contact form component
- Additional contact information section
- Professional styling and layout

## Error Handling

The form includes comprehensive error handling:
- Field-level validation errors
- Form submission errors
- Network error handling
- User-friendly error messages
- Visual error indicators

## Success Flow

When the form is submitted successfully:
1. Form data is validated
2. Data is sent to the API endpoint
3. API processes and forwards to webhook
4. Success message is displayed
5. Form can be reset (TODO: implement form reset)

## Future Enhancements

- Form reset functionality
- File upload capability
- Rich text editor for message field
- Auto-save draft functionality
- CAPTCHA integration
- Rate limiting protection
