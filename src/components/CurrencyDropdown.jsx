import { useState, useRef, useEffect } from 'react';
import { useSearchStore } from '../stores/useSearchStore';
import currencies from '../data/currencies.json';

const CurrencyDropdown = ({ className = '', isMobile = false }) => {
  const { searchData, setSelectedCurrency } = useSearchStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Encontrar la moneda seleccionada actual
  const selectedCurrency = currencies.find(currency => currency.iso_code === searchData.selectedCurrency);

  const handleCurrencySelect = (currency) => {
    setSelectedCurrency(currency.iso_code);
    setIsOpen(false);
  };

  // Estilos base para el botón
  const buttonClasses = isMobile 
    ? "flex items-center justify-between w-full px-3 py-2 text-left border border-neutral-light bg-white hover:border-primary transition-colors"
    : "flex items-center justify-between px-3 py-1 border border-neutral-light text-black hover:border-primary transition-colors";
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={buttonClasses}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="flex items-center gap-2">
          <span className={selectedCurrency?.symbol === 'king_bed' ? 'material-symbols-outlined text-xs' : ''}>{selectedCurrency?.symbol || '£'}</span>
          <span>{selectedCurrency?.iso_code || selectedCurrency?.name}</span>
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className={`absolute z-50 mt-1 bg-white border border-neutral-light shadow-lg ${
          isMobile ? 'w-full' : 'min-w-[200px]'
        }`}>
          {currencies.map((currency) => (
            <button
              key={currency.iso_code || currency.symbol}
              onClick={() => handleCurrencySelect(currency)}
              className={`w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors ${
                currency.iso_code === searchData.selectedCurrency ? 'bg-gray-100' : ''
              }`}
            >
              <span className="flex items-center gap-2">
                <span className={currency.symbol === 'king_bed' ? 'material-symbols-outlined text-xs' : ''}>{currency.symbol}</span>
                <span>{currency.name}</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CurrencyDropdown;
