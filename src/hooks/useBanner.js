import { useState, useCallback } from 'react';

const useBanner = () => {
  const [banners, setBanners] = useState([]);

  const addBanner = useCallback(({ type, message, autoHide = false, duration = 5000 }) => {
    const id = Date.now() + Math.random();
    const newBanner = { id, type, message, autoHide, duration };
    
    setBanners(prev => [...prev, newBanner]);

    // Auto-hide functionality
    if (autoHide) {
      setTimeout(() => {
        removeBanner(id);
      }, duration);
    }

    return id;
  }, []);

  const removeBanner = useCallback((id) => {
    setBanners(prev => prev.filter(banner => banner.id !== id));
  }, []);

  const showSuccess = useCallback((message, options = {}) => {
    return addBanner({ type: 'success', message, ...options });
  }, [addBanner]);

  const showError = useCallback((message, options = {}) => {
    return addBanner({ type: 'error', message, ...options });
  }, [addBanner]);

  const showWarning = useCallback((message, options = {}) => {
    return addBanner({ type: 'warning', message, ...options });
  }, [addBanner]);

  const showInfo = useCallback((message, options = {}) => {
    return addBanner({ type: 'info', message, ...options });
  }, [addBanner]);

  const clearAll = useCallback(() => {
    setBanners([]);
  }, []);

  return {
    banners,
    addBanner,
    removeBanner,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    clearAll
  };
};

export default useBanner;
