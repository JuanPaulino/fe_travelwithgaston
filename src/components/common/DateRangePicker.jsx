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

  // Estado local para las fechas (fuente de verdad)
  const [localStartDate, setLocalStartDate] = useState(null)
  const [localEndDate, setLocalEndDate] = useState(null)

  // Sincronizar con props del padre cuando vienen predefinidas
  useEffect(() => {
    if (startDate) {
      const parsedDate = typeof startDate === 'string' ? new Date(startDate) : startDate
      setLocalStartDate(parsedDate)
    }
    if (endDate) {
      const parsedDate = typeof endDate === 'string' ? new Date(endDate) : endDate
      setLocalEndDate(parsedDate)
    }
  }, [startDate, endDate])

  // Parsear las fechas si son strings - USANDO ESTADO LOCAL
  const parsedStartDate = localStartDate ? (typeof localStartDate === 'string' ? new Date(localStartDate) : localStartDate) : null
  const parsedEndDate = localEndDate ? (typeof localEndDate === 'string' ? new Date(localEndDate) : localEndDate) : null

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
    return format(parsedDate, 'MMM dd')
  }

  // Formatear fecha para input type="date"
  const formatDateForInput = (date) => {
    if (!date) return ''
    const parsedDate = typeof date === 'string' ? new Date(date) : date
    return format(parsedDate, 'yyyy-MM-dd')
  }

  // Manejar selección de fecha - usando onSelect de DayPicker range mode
  const handleRangeSelect = (range) => {
    if (!range) {
      // Si no hay rango, limpiar las fechas - ESTADO LOCAL Y EMITIR AL PADRE
      setLocalStartDate(null)
      setLocalEndDate(null)
      onStartDateChange('')
      onEndDateChange('')
      return
    }

    const { from, to } = range

    if (from) {
      // Actualizar estado local
      const formattedFrom = startOfDay(from)
      setLocalStartDate(formattedFrom)
      // Emitir al padre
      onStartDateChange(formatDateForInput(formattedFrom))
    }

    if (to) {
      // Actualizar estado local
      const formattedTo = startOfDay(to)
      setLocalEndDate(formattedTo)
      // Emitir al padre
      onEndDateChange(formatDateForInput(formattedTo))
      
      // Solo cerrar el calendario si from y to son diferentes
      if (from && to.getTime() !== from.getTime()) {
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
    from: parsedStartDate
  } : undefined

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Desktop Layout - Campo Unificado */}
      <div 
        className={`hidden lg:block px-4 py-6 cursor-pointer transition-colors hover:bg-gray-50 ${isOpen ? 'bg-gray-50' : ''}`}
        onClick={() => handleInputClick('startDate')}
      >
        <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">CHECK IN - CHECK OUT</div>
        <div className="flex items-center gap-2">
          {parsedStartDate && parsedEndDate ? (
            <span className="text-base font-medium text-gray-900">
              {formatDate(parsedStartDate)} - {formatDate(parsedEndDate)}
            </span>
          ) : parsedStartDate ? (
            <span className="text-base font-medium text-gray-900">
              {formatDate(parsedStartDate)} <span className="text-gray-400">- Select checkout</span>
            </span>
          ) : (
            <span className="text-base font-medium text-gray-400">
              Select dates
            </span>
          )}
        </div>
      </div>

      {/* Mobile Layout - Campo Unificado */}
      <div className="w-full lg:hidden">
        <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>CHECK IN - CHECK OUT</span>
        </div>
        <div 
          className={`flex items-center justify-between gap-3 p-3 border border-gray-200 rounded-lg bg-white cursor-pointer transition-colors hover:bg-gray-50 ${isOpen ? 'ring-2 ring-primary' : ''}`}
          onClick={() => handleInputClick('startDate')}
        >
          <div className="flex-1 flex items-center gap-2">
            {parsedStartDate && parsedEndDate ? (
              <span className="text-sm font-medium text-gray-900">
                {formatDate(parsedStartDate)} - {formatDate(parsedEndDate)}
              </span>
            ) : parsedStartDate ? (
              <span className="text-sm font-medium text-gray-900">
                {formatDate(parsedStartDate)} - Select checkout
              </span>
            ) : (
              <span className="text-sm font-medium text-gray-400">
                Select dates
              </span>
            )}
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
              onSelect={handleRangeSelect}
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
                // ESTADO LOCAL
                setLocalStartDate(null)
                setLocalEndDate(null)
                // EMITIR AL PADRE
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

