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
    <div className={`space-y-4 ${className}`} style={{ pointerEvents: 'auto' }}>
      {/* Adultos */}
      <div className="flex items-center justify-between">
        <span className="text-gray-900 font-medium">Adults</span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleAdultsChange(adults - 1)}
            disabled={disabled || adults <= 1}
            style={{ pointerEvents: 'auto', position: 'relative', zIndex: 10 }}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-lg font-medium transition-colors ${
              adults > 1 
                ? 'bg-blue-500 text-white hover:bg-blue-600' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            -
          </button>
          <span className="text-gray-900 font-medium min-w-[2rem] text-center">
            {adults}
          </span>
          <button
            type="button"
            onClick={() => handleAdultsChange(adults + 1)}
            disabled={disabled || adults >= 6}
            style={{ pointerEvents: 'auto', position: 'relative', zIndex: 10 }}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-lg font-medium transition-colors ${
              adults < 6 
                ? 'bg-blue-500 text-white hover:bg-blue-600' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            +
          </button>
        </div>
      </div>

      {/* Niños */}
      <div className="flex items-center justify-between">
        <span className="text-gray-900 font-medium">Children</span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleChildrenChange(children - 1)}
            disabled={disabled || children <= 0}
            style={{ pointerEvents: 'auto', position: 'relative', zIndex: 10 }}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-lg font-medium transition-colors ${
              children > 0 
                ? 'bg-blue-500 text-white hover:bg-blue-600' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            -
          </button>
          <span className="text-gray-900 font-medium min-w-[2rem] text-center">
            {children}
          </span>
          <button
            type="button"
            onClick={() => handleChildrenChange(children + 1)}
            disabled={disabled || children >= 10}
            style={{ pointerEvents: 'auto', position: 'relative', zIndex: 10 }}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-lg font-medium transition-colors ${
              children < 10 
                ? 'bg-blue-500 text-white hover:bg-blue-600' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            +
          </button>
        </div>
      </div>

      {/* Habitaciones */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-gray-900 font-medium">Rooms</span>
          {forceSingleRoom && (
            <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
              Only 1 room
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleRoomsChange(rooms - 1)}
            disabled={disabled || rooms <= 1}
            style={{ pointerEvents: 'auto', position: 'relative', zIndex: 10 }}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-lg font-medium transition-colors ${
              rooms > 1 
                ? 'bg-blue-500 text-white hover:bg-blue-600' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            -
          </button>
          <span className="text-gray-900 font-medium min-w-[2rem] text-center">
            {rooms}
          </span>
          <button
            type="button"
            onClick={() => handleRoomsChange(rooms + 1)}
            disabled={disabled || rooms >= 8 || forceSingleRoom}
            style={{ pointerEvents: 'auto', position: 'relative', zIndex: 10 }}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-lg font-medium transition-colors ${
              (rooms < 8 && !forceSingleRoom)
                ? 'bg-blue-500 text-white hover:bg-blue-600' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            +
          </button>
        </div>
      </div>
      
      {/* Selector de edades de niños */}
      {children > 0 && onChildrenAgesChange && (
        <ChildrenAgeSelector
          children={children}
          childrenAges={childrenAges}
          onChildrenAgesChange={onChildrenAgesChange}
        />
      )}
    </div>
  )
}

export default GuestSelector
