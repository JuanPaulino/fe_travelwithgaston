import { useState, useEffect } from 'react';
import AuthenticationModal from './AuthenticationModal';

const AuthModalWrapper = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Escuchar el evento personalizado desde Astro
    const handleOpenModal = () => {
      setIsModalOpen(true);
    };

    window.addEventListener('openAuthModal', handleOpenModal);

    return () => {
      window.removeEventListener('openAuthModal', handleOpenModal);
    };
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <AuthenticationModal 
      isOpen={isModalOpen} 
      onClose={handleCloseModal} 
    />
  );
};

export default AuthModalWrapper; 