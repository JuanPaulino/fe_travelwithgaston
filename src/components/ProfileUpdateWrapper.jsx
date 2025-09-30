import { useEffect } from 'react';
import useProfileUpdate from '../hooks/useProfileUpdate.js';
import { isAuthenticated } from '../stores/authStore.js';

/**
 * Wrapper component that updates the user's profile when mounted
 * Useful for pages where we want to ensure the profile is up to date
 */
const ProfileUpdateWrapper = ({ children }) => {
  const { updateProfile, isUpdating, error } = useProfileUpdate({
    autoUpdate: false,
    autoUpdateOnAuth: false
  });

  useEffect(() => {
    const updateUserProfile = async () => {
      if (isAuthenticated()) {
        try {
          await updateProfile();
        } catch (err) {
          console.error('Error updating profile in search:', err);
        }
      }
    };

    updateUserProfile();
  }, []);

  return children;
};

export default ProfileUpdateWrapper;
