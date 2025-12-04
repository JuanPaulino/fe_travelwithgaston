import { useState, useRef, useEffect } from 'react'
import { DayPicker } from 'react-day-picker'
import { format, addDays, isAfter, isBefore, startOfDay } from 'date-fns'
import 'react-day-picker/style.css'
import '../../styles/datepicker.css'

function DateRangePicker({ 
  startDate, 
  endDate, 
  onStartDateChange, 
  onEndDateChange,
  disabled = false,
  minDate = addDays(new Date(), 1),
  className = ""
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [focusedInput, setFocusedInput] = useState('startDate') // 'startDate' o 'endDate'
  const containerRef = useRef(null)

  // Parsear las fechas si son strings
  const parsedStartDate = startDate ? (typeof startDate === 'string' ? new Date(startDate) : startDate) : null
  const parsedEndDate = endDate ? (typeof endDate === 'string' ? new Date(endDate) : endDate) : null

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Formatear fecha para mostrar
  const formatDate = (date) => {
    if (!date) return ''
    const parsedDate = typeof date === 'string' ? new Date(date) : date
    return format(parsedDate, 'MMM dd, yyyy')
  }

  // Formatear fecha para input type="date"
  const formatDateForInput = (date) => {
    if (!date) return ''
    const parsedDate = typeof date === 'string' ? new Date(date) : date
    return format(parsedDate, 'yyyy-MM-dd')
  }

  // Manejar selección de fecha
  const handleDayClick = (date) => {
    if (!date) return

    const clickedDate = startOfDay(date)

    if (focusedInput === 'startDate') {
      // Si estamos seleccionando check-in
      onStartDateChange(formatDateForInput(clickedDate))
      
      // Si ya hay un check-out y es anterior al nuevo check-in, lo actualizamos
      if (parsedEndDate && isBefore(parsedEndDate, clickedDate)) {
        onEndDateChange(formatDateForInput(addDays(clickedDate, 1)))
      }
      
      // Cambiar el foco a check-out
      setFocusedInput('endDate')
    } else {
      // Si estamos seleccionando check-out
      if (parsedStartDate && isBefore(clickedDate, parsedStartDate)) {
        // Si la fecha seleccionada es anterior al check-in, establecerla como check-in
        onStartDateChange(formatDateForInput(clickedDate))
        setFocusedInput('endDate')
      } else {
        onEndDateChange(formatDateForInput(clickedDate))
        // Cerrar el calendario después de seleccionar check-out
        setTimeout(() => setIsOpen(false), 200)
      }
    }
  }

  // Manejar el clic en los inputs
  const handleInputClick = (inputType) => {
    setFocusedInput(inputType)
    setIsOpen(true)
  }

  // Determinar qué fechas están deshabilitadas
  const disabledDays = [
    { before: minDate }
  ]
  
  // Crear el rango seleccionado para DayPicker
  const selectedRange = parsedStartDate && parsedEndDate ? {
    from: parsedStartDate,
    to: parsedEndDate
  } : parsedStartDate ? {
    from: parsedStartDate,
    to: parsedStartDate
  } : undefined

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Desktop Layout */}
      <div className="hidden lg:flex items-stretch divide-x divide-gray-200">
        {/* Check In */}
        <div 
          className={`p-6 cursor-pointer transition-colors hover:bg-gray-50 ${focusedInput === 'startDate' && isOpen ? 'bg-gray-50' : ''}`}
          onClick={() => handleInputClick('startDate')}
        >
          <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">CHECK IN</div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-base font-medium text-gray-900">
              {parsedStartDate ? formatDate(parsedStartDate) : 'Select date'}
            </span>
          </div>
        </div>

        {/* Check Out */}
        <div 
          className={`p-6 cursor-pointer transition-colors hover:bg-gray-50 ${focusedInput === 'endDate' && isOpen ? 'bg-gray-50' : ''}`}
          onClick={() => handleInputClick('endDate')}
        >
          <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">CHECK OUT</div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-base font-medium text-gray-900">
              {parsedEndDate ? formatDate(parsedEndDate) : 'Select date'}
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="grid grid-cols-2 gap-4 lg:hidden">
        {/* Check In Mobile */}
        <div className="w-full">
          <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>CHECK IN</span>
          </div>
          <div 
            className={`flex items-center gap-2 p-3 border border-gray-200 rounded-lg bg-white cursor-pointer transition-colors hover:bg-gray-50 ${focusedInput === 'startDate' && isOpen ? 'ring-2 ring-primary' : ''}`}
            onClick={() => handleInputClick('startDate')}
          >
            <span className="text-sm font-medium text-gray-900 flex-1">
              {parsedStartDate ? formatDate(parsedStartDate) : 'Select date'}
            </span>
          </div>
        </div>

        {/* Check Out Mobile */}
        <div className="w-full">
          <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>CHECK OUT</span>
          </div>
          <div 
            className={`flex items-center gap-2 p-3 border border-gray-200 rounded-lg bg-white cursor-pointer transition-colors hover:bg-gray-50 ${focusedInput === 'endDate' && isOpen ? 'ring-2 ring-primary' : ''}`}
            onClick={() => handleInputClick('endDate')}
          >
            <span className="text-sm font-medium text-gray-900 flex-1">
              {parsedEndDate ? formatDate(parsedEndDate) : 'Select date'}
            </span>
          </div>
        </div>
      </div>

      {/* Calendar Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white rounded-lg date-picker-dropdown z-[9999] overflow-hidden date-range-picker-popup">
          {/* Header Info */}
          <div className="bg-primary hover:bg-primary-dark text-white font-medium p-4 rounded-t-lg transition-colors">
            {focusedInput === 'startDate' ? (
              <div className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                </svg>
                <span>Select your check-in date</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                </svg>
                <span>Select your check-out date</span>
              </div>
            )}
          </div>
          
          {/* Calendar */}
          <div className="date-range-picker-container">
            <DayPicker
              mode="range"
              selected={selectedRange}
              onDayClick={handleDayClick}
              disabled={disabledDays}
              numberOfMonths={typeof window !== 'undefined' && window.innerWidth >= 1024 ? 2 : 1}
              defaultMonth={parsedStartDate || minDate}
              showOutsideDays
              navLayout="around" 
            />
          </div>
          
          {/* Footer con botones */}
          <div className="date-picker-footer p-4 flex gap-3 justify-between items-center">
            <button
              type="button"
              onClick={() => {
                onStartDateChange('')
                onEndDateChange('')
                setFocusedInput('startDate')
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
            >
              Clear dates
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-6 py-2.5 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary-dark transition-all shadow-sm hover:shadow-md"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default DateRangePicker

