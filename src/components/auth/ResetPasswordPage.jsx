import { useState, useEffect } from 'react';
import ResetPasswordForm from './ResetPasswordForm';
import PasswordResetSuccess from './PasswordResetSuccess';

const ResetPasswordPage = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [token, setToken] = useState(null);
  useEffect(() => {
    // Get token from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const resetToken = urlParams.get('token');
    setToken(resetToken);
  }, []);

  const handleSuccess = () => {
    setShowSuccess(true);
  };

  const handleBackToSignIn = () => {
    // Redirect to home page
    window.location.href = '/';
  };

  if (showSuccess) {
    return <PasswordResetSuccess onBackToSignIn={handleBackToSignIn} />;
  }

  return (
    <ResetPasswordForm
      token={token}
      onSuccess={handleSuccess}
      onBackToSignIn={handleBackToSignIn}
    />
  );
};

export default ResetPasswordPage;
