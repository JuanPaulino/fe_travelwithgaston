import { useState } from 'react';
import SearchFilters from './SearchFilters.jsx';
import MobileFiltersModal from './MobileFiltersModal.jsx';
import MobileFiltersButton from './MobileFiltersButton.jsx';

const SearchFiltersWrapper = () => {
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);

  const openMobileModal = () => setIsMobileModalOpen(true);
  const closeMobileModal = () => setIsMobileModalOpen(false);

  return (
    <>
      {/* Botón para móvil - se muestra solo en mobile */}
      <div className="md:hidden mb-4">
        <MobileFiltersButton onClick={openMobileModal} />
      </div>

      {/* Sidebar para desktop - se muestra solo en desktop */}
      <aside className="hidden md:block w-52 flex-shrink-0">
        <SearchFilters />
      </aside>

      {/* Modal para móvil */}
      <MobileFiltersModal 
        isOpen={isMobileModalOpen} 
        onClose={closeMobileModal} 
      />
    </>
  );
};

export default SearchFiltersWrapper;
