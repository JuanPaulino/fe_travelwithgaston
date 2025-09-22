# API Endpoints Documentation

This document describes the API endpoints for the Travel with Gaston forms.

## Available Endpoints

### 1. Trip Inquiry Form
- **Endpoint**: `/api/trip-inquiry`
- **Method**: `POST`
- **Description**: Handles trip inquiry form submissions
- **File**: `src/pages/api/trip-inquiry.js`

### 2. Custom Journeys Form
- **Endpoint**: `/api/custom-journeys`
- **Method**: `POST`
- **Description**: Handles custom journey form submissions
- **File**: `src/pages/api/custom-journeys.js`

### 3. Corporate Services Form
- **Endpoint**: `/api/corporate-services`
- **Method**: `POST`
- **Description**: Handles corporate services form submissions
- **File**: `src/pages/api/corporate-services.js`

## Common Features

All endpoints share the following characteristics:

### CORS Support
- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: POST, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type`

### Error Handling
- Centralized error handling
- Detailed error logging
- Consistent error response format

### Validation
- Required field validation
- Email format validation
- Date validation (where applicable)
- Custom validation per form type

### Webhook Integration
- All forms send data to Travel with Gaston webhook
- Webhook URL: `https://travelwithgaston.com/cms/flows/trigger/3b6d0ed7-cf6a-487c-b2b0-a0f74bef4c1b`
- Form type identification in webhook data

## Request Format

All endpoints expect JSON data in the request body:

```javascript
{
  // Form-specific fields...
  "formType": "trip-inquiry|custom-journeys|corporate-services",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Response Format

### Success Response
```javascript
{
  "success": true,
  "message": "Form submitted successfully",
  "data": {
    // Webhook response data
  }
}
```

### Error Response
```javascript
{
  "success": false,
  "error": "Error description",
  "details": [
    // Array of specific validation errors
  ]
}
```

## Validation Rules

### Trip Inquiry Form
**Required Fields:**
- `name`
- `surname`
- `email`
- `city`
- `country`
- `destination`

**Validation:**
- Email format validation
- Date validation (return date must be after start date)

### Custom Journeys Form
**Required Fields:**
- `name`
- `email`
- `destination`

**Validation:**
- Email format validation
- Date validation (return date must be after start date)
- Optional: Trip types and holiday experiences validation

### Corporate Services Form
**Required Fields:**
- `companyName`
- `contactPerson`
- `email`
- `phone`

**Validation:**
- Email format validation
- Date validation (end date must be after start date)
- Conditional field validation based on selected services

## Webhook Data Structure

Each form sends data to the webhook with the following structure:

```javascript
{
  "formType": "form-type-identifier",
  "timestamp": "ISO-8601-timestamp",
  // ... all form fields
}
```

## Error Codes

- `400`: Bad Request - Invalid form data
- `500`: Internal Server Error - Server or webhook error

## Testing

You can test the endpoints using the following test pages:

- Trip Inquiry: `/trip-inquiry-form`
- Custom Journeys: `/custom-journeys-form`
- Corporate Services: `/corporate-services-form`

## Logging

All endpoints include comprehensive logging:

- Request data logging
- Webhook response logging
- Error logging with context
- Validation error logging

## Security Considerations

- CORS is configured for all origins (consider restricting in production)
- Input validation prevents malicious data
- Error messages don't expose sensitive information
- Webhook communication is secure (HTTPS)

## Future Enhancements

- Rate limiting
- Request size limits
- Enhanced validation rules
- Separate webhook URLs per form type
- Database logging for audit trails