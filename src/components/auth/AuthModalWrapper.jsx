import { useState, useEffect } from 'react';
import AuthenticationModal from './AuthenticationModal';

const AuthModalWrapper = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialTab, setInitialTab] = useState('signin');

  useEffect(() => {
    // Escuchar el evento personalizado desde Astro
    const handleOpenModal = (event) => {
      const buttonTab = event.detail?.initialTab || 'signin';
      // Mapear los valores de los botones a los nombres de tabs del modal
      const modalTab = buttonTab === 'join' ? 'joinus' : 'signin';
      setInitialTab(modalTab);
      setIsModalOpen(true);
    };

    window.addEventListener('openAuthModal', handleOpenModal);

    return () => {
      window.removeEventListener('openAuthModal', handleOpenModal);
    };
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    window.location.reload();
  };

  return (
    <AuthenticationModal 
      isOpen={isModalOpen} 
      onClose={handleCloseModal}
      initialTab={initialTab}
    />
  );
};

export default AuthModalWrapper; 