import React from 'react'
import ChildrenAgeSelector from './ChildrenAgeSelector.jsx'

const GuestSelector = ({ 
  adults = 2, 
  children = 0, 
  rooms = 1,
  childrenAges = [],
  onAdultsChange, 
  onChildrenChange, 
  onRoomsChange,
  onChildrenAgesChange,
  disabled = false,
  className = "",
  forceSingleRoom = false
}) => {
  // Convertir valores a números para evitar concatenación de strings
  const numAdults = Number(adults);
  const numChildren = Number(children);
  const numRooms = Number(rooms);
  const handleAdultsChange = (newValue) => {
    if (newValue >= 1 && newValue <= 6 && onAdultsChange) {
      onAdultsChange(newValue)
    }
  }

  const handleChildrenChange = (newValue) => {
    if (newValue >= 0 && newValue <= 10 && onChildrenChange) {
      onChildrenChange(newValue)
    }
  }

  const handleRoomsChange = (newValue) => {
    // Si forceSingleRoom es true, solo permitir 1 habitación
    if (forceSingleRoom && newValue > 1) {
      return
    }
    
    if (newValue >= 1 && newValue <= 8 && onRoomsChange) {
      onRoomsChange(newValue)
    }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {/* adults */}
      <div className="flex items-center justify-between">
        <span className="text-neutral-darker font-medium font-body">Adults</span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleAdultsChange(numAdults - 1)}
            disabled={disabled || numAdults <= 1}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-lg font-medium transition-all duration-200 ${
              numAdults > 1 
                ? 'bg-primary text-white hover:bg-primary-dark active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary-lighter' 
                : 'bg-neutral-lighter text-neutral-light cursor-not-allowed'
            }`}
          >
            -
          </button>
          <span className="text-neutral-darker font-medium min-w-[2rem] text-center font-body">
            {numAdults}
          </span>
          <button
            type="button"
            onClick={() => handleAdultsChange(numAdults + 1)}
            disabled={disabled || numAdults >= 6}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-lg font-medium transition-all duration-200 ${
              numAdults < 6 
                ? 'bg-primary text-white hover:bg-primary-dark active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary-lighter' 
                : 'bg-neutral-lighter text-neutral-light cursor-not-allowed'
            }`}
          >
            +
          </button>
        </div>
      </div>

      {/* Niños */}
      <div className="flex items-center justify-between">
        <span className="text-neutral-darker font-medium font-body">Children</span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleChildrenChange(numChildren - 1)}
            disabled={disabled || numChildren <= 0}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-lg font-medium transition-all duration-200 ${
              numChildren > 0 
                ? 'bg-primary text-white hover:bg-primary-dark active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary-lighter' 
                : 'bg-neutral-lighter text-neutral-light cursor-not-allowed'
            }`}
          >
            -
          </button>
          <span className="text-neutral-darker font-medium min-w-[2rem] text-center font-body">
            {numChildren}
          </span>
          <button
            type="button"
            onClick={() => handleChildrenChange(numChildren + 1)}
            disabled={disabled || numChildren >= 10}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-lg font-medium transition-all duration-200 ${
              numChildren < 10 
                ? 'bg-primary text-white hover:bg-primary-dark active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary-lighter' 
                : 'bg-neutral-lighter text-neutral-light cursor-not-allowed'
            }`}
          >
            +
          </button>
        </div>
      </div>

      {/* Habitaciones */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-neutral-darker font-medium font-body">Rooms</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleRoomsChange(numRooms - 1)}
            disabled={disabled || numRooms <= 1}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-lg font-medium transition-all duration-200 ${
              numRooms > 1 
                ? 'bg-primary text-white hover:bg-primary-dark active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary-lighter' 
                : 'bg-neutral-lighter text-neutral-light cursor-not-allowed'
            }`}
          >
            -
          </button>
          <span className="text-neutral-darker font-medium min-w-[2rem] text-center font-body">
            {numRooms}
          </span>
          <button
            type="button"
            onClick={() => handleRoomsChange(numRooms + 1)}
            disabled={disabled || numRooms >= 8 || forceSingleRoom}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-lg font-medium transition-all duration-200 ${
              (numRooms < 8 && !forceSingleRoom)
                ? 'bg-primary text-white hover:bg-primary-dark active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary-lighter' 
                : 'bg-neutral-lighter text-neutral-light cursor-not-allowed'
            }`}
          >
            +
          </button>
        </div>
      </div>
      {forceSingleRoom && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-secondary-dark bg-secondary-lightest px-2 py-1 rounded-full font-body mb-4">
            Only 1 room
          </span>
        </div>
      )}
      {/* Selector de edades de niños */}
      {numChildren > 0 && onChildrenAgesChange && (
        <ChildrenAgeSelector
          children={numChildren}
          childrenAges={childrenAges}
          onChildrenAgesChange={onChildrenAgesChange}
        />
      )}
    </div>
  )
}

export default GuestSelector
