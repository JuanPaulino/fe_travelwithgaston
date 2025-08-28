import { atom } from 'nanostores';

// Estado inicial del store de banners
export const $banners = atom([]);

// Funciones para manipular banners
export const addBanner = ({ type, message, autoHide = false, duration = 5000 }) => {
  const id = Date.now() + Math.random();
  const newBanner = { id, type, message, autoHide, duration };
  
  $banners.set([...$banners.get(), newBanner]);

  // Auto-hide functionality
  if (autoHide) {
    setTimeout(() => {
      removeBanner(id);
    }, duration);
  }

  return id;
};

export const removeBanner = (id) => {
  $banners.set($banners.get().filter(banner => banner.id !== id));
};

export const clearAllBanners = () => {
  $banners.set([]);
};

// Funciones helper para tipos específicos
export const showSuccess = (message, options = {}) => {
  return addBanner({ type: 'success', message, ...options });
};

export const showError = (message, options = {}) => {
  return addBanner({ type: 'error', message, ...options });
};

export const showWarning = (message, options = {}) => {
  return addBanner({ type: 'warning', message, ...options });
};

export const showInfo = (message, options = {}) => {
  return addBanner({ type: 'info', message, ...options });
};
