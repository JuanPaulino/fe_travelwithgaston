# Forgot Password Frontend Integration - TravelWithGaston

This document describes the frontend implementation of the "forgot password" functionality for the TravelWithGaston AstroJS + React application.

## 🚀 Features Implemented

### Components Created

1. **ForgotPasswordForm.jsx** - Form to request password reset
2. **ResetPasswordForm.jsx** - Form to reset password with token
3. **PasswordResetSuccess.jsx** - Success confirmation after password reset
4. **ResetPasswordPage.jsx** - Page wrapper for reset password flow
5. **AuthModal.jsx** - Modal container for authentication forms

### Pages Created

1. **reset-password.astro** - Dedicated page for password reset flow

### Updated Components

1. **SignInForm.jsx** - Added "Forgot password?" link
2. **useAuth.js** - Added forgot password actions
3. **authStore.js** - Added forgot password state management
4. **http.js** - Added forgot password API calls

## 📁 File Structure

```
src/
├── components/
│   └── auth/
│       ├── ForgotPasswordForm.jsx      # Request password reset
│       ├── ResetPasswordForm.jsx       # Reset password with token
│       ├── PasswordResetSuccess.jsx    # Success confirmation
│       ├── ResetPasswordPage.jsx       # Page wrapper
│       ├── AuthModal.jsx               # Modal container
│       └── SignInForm.jsx              # Updated with forgot password link
├── lib/
│   ├── useAuth.js                      # Updated with forgot password hooks
│   └── http.js                         # Updated with forgot password API
├── stores/
│   └── authStore.js                    # Updated with forgot password actions
└── pages/
    └── reset-password.astro            # Reset password page
```

## 🔄 User Flow

### 1. User Clicks "Forgot Password?"

- User clicks the "Forgot password?" link in the SignInForm
- AuthModal switches to show ForgotPasswordForm
- User enters their email address

### 2. Email Request

- Form validates email format
- Sends request to `/api/auth/forgot-password`
- Shows success message regardless of email existence (security)
- User can go back to sign in or send another email

### 3. Email Received

- User receives email with reset link
- Link format: `http://localhost:4321/reset-password?token=abc123`
- Email expires in 1 hour

### 4. Password Reset

- User clicks link in email
- Navigates to `/reset-password` page
- ResetPasswordPage validates token
- Shows ResetPasswordForm if token is valid
- Shows error if token is invalid/expired

### 5. New Password

- User enters new password with confirmation
- Form validates password requirements
- Sends request to `/api/auth/reset-password`
- Shows PasswordResetSuccess on success
- User can return to sign in

## 🎨 UI/UX Features

### Design Consistency
- Matches existing TravelWithGaston design system
- Uses same color scheme (black, amber, gray)
- Consistent typography and spacing
- Responsive design for mobile and desktop

### User Experience
- Clear step-by-step flow
- Helpful error messages
- Loading states for all async operations
- Success confirmations
- Easy navigation between steps

### Security Features
- Password requirements clearly displayed
- Token validation before showing form
- Secure error handling
- No sensitive information exposed

## 🔧 API Integration

### Endpoints Used

1. **POST /api/auth/forgot-password**
   - Request password reset
   - Body: `{ email: string }`
   - Response: Success message (same for valid/invalid emails)

2. **GET /api/auth/validate-reset-token/:token**
   - Validate reset token
   - Response: Token validity status

3. **POST /api/auth/reset-password**
   - Reset password with token
   - Body: `{ token: string, newPassword: string }`
   - Response: Success/error message

### Error Handling

- Network errors handled gracefully
- Validation errors shown inline
- Token expiration handled with clear messaging
- Consistent error display across components

## 🚀 Usage Examples

### Using AuthModal with Forgot Password

```jsx
import AuthModal from '../components/auth/AuthModal';

function MyComponent() {
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <>
      <button onClick={() => setShowAuthModal(true)}>
        Sign In
      </button>
      
      {showAuthModal && (
        <AuthModal
          onLoginSuccess={() => setShowAuthModal(false)}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </>
  );
}
```

### Direct Forgot Password Form

```jsx
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm';

function ForgotPasswordPage() {
  const handleEmailSent = (email) => {
    console.log(`Reset email sent to ${email}`);
  };

  const handleBackToSignIn = () => {
    // Navigate back to sign in
  };

  return (
    <ForgotPasswordForm
      onEmailSent={handleEmailSent}
      onBackToSignIn={handleBackToSignIn}
    />
  );
}
```

### Using Reset Password Page

The reset password page automatically handles:
- Token extraction from URL
- Token validation
- Form display
- Success handling

Users navigate to: `/reset-password?token=abc123`

## 🎯 Component Props

### ForgotPasswordForm
- `onEmailSent(email)` - Called when email is sent successfully
- `onBackToSignIn()` - Called when user wants to go back to sign in

### ResetPasswordForm
- `token` - Reset token from URL
- `onSuccess()` - Called when password is reset successfully
- `onBackToSignIn()` - Called when user wants to go back to sign in

### PasswordResetSuccess
- `onBackToSignIn()` - Called when user wants to go back to sign in

### AuthModal
- `onLoginSuccess()` - Called when login is successful
- `onClose()` - Called when modal should be closed

## 🔒 Security Considerations

### Frontend Security
- No sensitive data stored in localStorage
- Tokens only used for API calls
- Clear error messages without exposing system details
- Client-side validation for better UX

### Token Handling
- Tokens extracted from URL parameters
- Automatic validation before form display
- No token storage in browser
- Clear messaging for expired/invalid tokens

## 🧪 Testing

### Manual Testing Flow

1. **Test Forgot Password Request**
   ```bash
   # Navigate to sign in form
   # Click "Forgot password?"
   # Enter valid email
   # Verify success message
   ```

2. **Test Email Link**
   ```bash
   # Check email for reset link
   # Click link
   # Verify token validation
   ```

3. **Test Password Reset**
   ```bash
   # Enter new password
   # Confirm password
   # Submit form
   # Verify success message
   ```

### Component Testing

Each component can be tested independently:
- Form validation
- API integration
- Error handling
- Success flows

## 🚀 Deployment Considerations

### Environment Variables

Ensure these are set in production:
- `FRONTEND_URL` - Base URL for reset links
- `MAILTRAP_TOKEN` - Email service token
- `MAILTRAP_FROM_EMAIL` - Sender email

### Build Process

The components are built with the standard Astro build process:
```bash
npm run build
```

### Static Generation

The reset-password page is statically generated but uses client-side JavaScript for interactivity.

## 🔧 Customization

### Styling

All components use Tailwind CSS classes that can be customized:
- Color scheme: `bg-black`, `text-amber-400`
- Spacing: `space-y-6`, `p-4`, `mb-6`
- Typography: `font-body`, `text-lg`

### Validation Rules

Password requirements can be updated in `ResetPasswordForm.jsx`:
```jsx
// Current requirements
- At least 8 characters
- One uppercase letter
- One lowercase letter
- One number
```

### Email Templates

Email templates are handled by the backend (Mailtrap service) but can be customized in the backend email service.

## 📱 Mobile Responsiveness

All components are fully responsive:
- Mobile-first design
- Touch-friendly buttons
- Readable text sizes
- Proper spacing on small screens

## 🐛 Troubleshooting

### Common Issues

1. **Token not found in URL**
   - Check URL format: `/reset-password?token=abc123`
   - Ensure token is not URL encoded

2. **Form not submitting**
   - Check network requests in browser dev tools
   - Verify API endpoints are accessible

3. **Styling issues**
   - Ensure Tailwind CSS is properly configured
   - Check for CSS conflicts

### Debug Mode

Enable debug logging by adding to components:
```jsx
console.log('Debug info:', { token, formData, errors });
```

## 📞 Support

For issues or questions about the forgot password implementation:
1. Check browser console for errors
2. Verify API endpoints are working
3. Test with valid email addresses
4. Check network requests in dev tools

---

**Implemented by:** Juan Francisco Paulino Veras  
**Date:** $(date)  
**Version:** 1.0.0  
**Framework:** AstroJS + React
