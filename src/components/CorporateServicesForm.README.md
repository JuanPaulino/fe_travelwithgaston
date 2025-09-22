# CorporateServicesForm.astro

## Description
Corporate services inquiry form for Travel with Gaston. This form allows companies to request corporate travel services with specific business requirements and group management options.

## Features

### Form Fields

#### Company Information
1. **Company Name** - Company name (required)
2. **Contact Person** - Contact person name (required)
3. **Position** - Contact person position (optional)
4. **Email** - Contact email (required)
5. **Phone Number** - Contact phone (required)

#### Service Requirements
6. **Services** - Required services (multiple selection checkboxes)
   - Flight Bookings & Management
   - Hotel Reservations
   - Ground Transportation
   - Meetings & Events Planning
   - Group Activities / Team Building

7. **Destinations** - Travel destinations (cities/countries)

8. **Tentative Dates** - Travel dates
   - Start Date
   - End Date
   - "Dates not confirmed yet" checkbox

9. **Number of Travelers** - Group size (1-5, 6-10, 11-20, 21-50, 50+)

#### Conditional Fields (based on service selection)

10. **Flight Class** - Only shown if "Flight Bookings & Management" is selected
    - Economy, Premium Economy, Business Class, First Class, Mixed

11. **Hotel Category** - Only shown if "Hotel Reservations" is selected
    - 3★, 4★, 5★ / Luxury, Boutique / Lifestyle

12. **Meeting/Event Spaces** - Only shown if "Meetings & Events Planning" is selected
    - Type of space
    - Number of participants
    - Type of event
    - Dates that space will be needed

13. **Ground Transportation** - Only shown if "Ground Transportation" is selected
    - Airport Transfers, Daily Chauffeur Service, Bus/Coach for Groups, Car Rentals

#### Additional Information
14. **Budget** - Estimated budget
    - Currency (USD, EUR, GBP, SGD)
    - Amount (per person or total)

15. **Special Requests** - Additional requirements
    - Free text for dietary needs, accessibility, branding, VIP treatment

16. **How did you hear** - Marketing source
17. **Newsletter** - Marketing consent (optional)
18. **Privacy Policy** - Required acceptance

## Functionality

### Validation
- Required fields: Company Name, Contact Person, Email, Phone, Privacy Policy
- Email validation
- Date validation (end date must be after start date)
- Real-time validation

### Conditional Fields
- **Flight Class**: Shows only if "Flight Bookings & Management" is selected
- **Hotel Category**: Shows only if "Hotel Reservations" is selected
- **Meeting Spaces**: Shows only if "Meetings & Events Planning" is selected
- **Ground Transportation**: Shows only if "Ground Transportation" is selected

### Multiple Selection
- **Services**: Checkboxes that allow multiple service selection
- Dynamic field visibility based on selected services

### Form Submission
- Endpoint: `/api/corporate-services`
- Method: POST
- Format: JSON
- Error handling and status messages

## Dependencies

### Data Files
- `src/data/corporateServicesData.js` - Contains all dropdown options and selections

### Components
- `src/components/form/FormField.astro` - Base form field component

## Styles
- Uses Tailwind CSS
- Responsive design
- Hover and focus states
- Error indicators
- Corporate checkbox styling

## Usage

```astro
---
import CorporateServicesForm from './CorporateServicesForm.astro';
---

<CorporateServicesForm />
```

## Data Structure Sent

```javascript
{
  // Company information
  companyName: "Acme Corporation",
  contactPerson: "John Smith",
  position: "Travel Manager",
  email: "john@acme.com",
  phone: "+1234567890",
  
  // Service requirements
  services: ["flight-bookings", "hotel-reservations", "meetings-events"],
  destinations: "New York, London, Tokyo",
  startDate: "2024-06-15",
  endDate: "2024-06-25",
  datesNotConfirmed: false,
  numberOfTravelers: "11-20",
  
  // Conditional fields (only included if relevant services selected)
  flightClass: "business-class",
  hotelCategory: "5-star-luxury",
  meetingSpaceType: "Conference room",
  numberOfParticipants: "15",
  eventType: "Board meeting",
  spaceDates: "2024-06-18",
  groundTransportation: "daily-chauffeur",
  
  // Budget and additional info
  budgetCurrency: "usd",
  budgetAmount: "50000",
  specialRequests: "Vegetarian meals, wheelchair accessibility",
  howDidYouHear: "referral",
  newsletter: true,
  privacy: true
}
```

## Implementation Notes

1. **API Endpoint**: The form sends data to `/api/corporate-services` - this endpoint must be implemented in the backend.

2. **Validation**: Validation is performed both in the frontend (JavaScript) and should be implemented in the backend.

3. **Conditional Fields**: Conditional fields are shown/hidden dynamically using JavaScript based on service selection.

4. **Multiple Selection**: Service checkboxes maintain their state and are included in the sent data as arrays.

5. **Responsive**: The form is designed to be fully responsive using Tailwind CSS.

6. **Corporate Styling**: Uses specific styling for corporate checkboxes to differentiate from luxury services.

## Test Page

A test page is available at `/corporate-services-form` to preview and test the form functionality.
