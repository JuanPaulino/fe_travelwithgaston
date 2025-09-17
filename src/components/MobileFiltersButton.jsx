import { useState } from 'react';
import { useFiltersStore } from '../stores/useFiltersStore.js';

const MobileFiltersButton = ({ onClick }) => {
  const { getTotalFilterCount } = useFiltersStore();
  const totalFilters = getTotalFilterCount();
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    setIsPressed(true);
    onClick();
    // Reset después de un breve momento
    setTimeout(() => setIsPressed(false), 150);
  };

  return (
    <button
      onClick={handleClick}
      className={`md:hidden w-full flex items-center justify-center gap-2 bg-white border border-gray-300 px-4 py-3 rounded-lg shadow-sm hover:bg-gray-50 transition-all duration-150 relative ${
        isPressed ? 'scale-98 bg-gray-50' : 'scale-100'
      }`}
    >
      <svg 
        className="w-5 h-5 text-gray-600" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" 
        />
      </svg>
      <span className="text-gray-700 font-medium">Filtros</span>
      {totalFilters > 0 && (
        <div className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
          {totalFilters}
        </div>
      )}
    </button>
  );
};

export default MobileFiltersButton;
