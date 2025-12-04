import { useState, useEffect } from 'react';
import { DateRangePicker } from 'rsuite';
import '../../styles/rsuite-scoped.css';

const DateRangeSelector = ({ 
  checkInDate, 
  checkOutDate, 
  onDateChange, 
  disabled = false,
  minDate 
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState([null, null]);

  // Detectar si estamos en móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Convertir strings ISO a Date objects
  useEffect(() => {
    if (checkInDate && checkOutDate) {
      setDateRange([
        new Date(checkInDate),
        new Date(checkOutDate)
      ]);
    } else {
      setDateRange([null, null]);
    }
  }, [checkInDate, checkOutDate]);

  // Manejar cambio de fechas
  const handleDateChange = (value) => {
    if (value && value[0] && value[1]) {
      const startDate = value[0].toISOString().split('T')[0];
      const endDate = value[1].toISOString().split('T')[0];
      onDateChange(startDate, endDate);
      setDateRange(value);
      
      if (isMobile) {
        setIsModalOpen(false);
      }
    }
  };

  // Formatear fecha para mostrar
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}`;
  };

  // Renderizar vista móvil con modal
  if (isMobile) {
    return (
      <>
        <div className="grid grid-cols-2 gap-4">
          {/* Check In Button */}
          <button
            type="button"
            onClick={() => !disabled && setIsModalOpen(true)}
            disabled={disabled}
            className="w-full text-left"
          >
            <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>CHECK IN</span>
            </div>
            <div className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg bg-white">
              <span className="text-sm font-medium text-gray-900">
                {checkInDate ? formatDateForDisplay(checkInDate) : 'Select date'}
              </span>
            </div>
          </button>

          {/* Check Out Button */}
          <button
            type="button"
            onClick={() => !disabled && setIsModalOpen(true)}
            disabled={disabled}
            className="w-full text-left"
          >
            <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>CHECK OUT</span>
            </div>
            <div className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg bg-white">
              <span className="text-sm font-medium text-gray-900">
                {checkOutDate ? formatDateForDisplay(checkOutDate) : 'Select date'}
              </span>
            </div>
          </button>
        </div>

        {/* Modal para móvil */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50">
            <div className="w-full bg-white rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto animate-slide-up">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Select Dates</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <DateRangePicker
                value={dateRange}
                onChange={handleDateChange}
                disabled={disabled}
                shouldDisableDate={(date) => minDate && date < minDate}
                format="MMM dd, yyyy"
                character=" – "
                placeholder="Select date range"
                block
                showOneCalendar
                ranges={[]}
                cleanable={false}
              />
            </div>
          </div>
        )}

        <style jsx global>{`
          @keyframes slide-up {
            from {
              transform: translateY(100%);
            }
            to {
              transform: translateY(0);
            }
          }
          .animate-slide-up {
            animation: slide-up 0.3s ease-out;
          }

          /* Estilos rsuite para el modal móvil */
          .rs-picker-daterange-menu {
            border: none;
            box-shadow: none;
          }

          .rs-picker-toolbar {
            padding: 1rem 0;
            border-top: 1px solid #e5e7eb;
            margin-top: 1rem;
          }

          .rs-picker-toggle-wrapper {
            width: 100%;
          }

          .rs-picker-default .rs-picker-toggle {
            width: 100%;
            padding: 12px;
            border: 1px solid #e5e7eb;
            border-radius: 0.5rem;
            background-color: white;
          }

          /* Calendario en modal */
          .rs-calendar-month-dropdown,
          .rs-calendar-view {
            width: 100%;
          }

          .rs-calendar-table-cell-content {
            width: 2.5rem;
            height: 2.5rem;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 0.5rem;
            font-size: 0.875rem;
          }

          .rs-calendar-table-cell-selected .rs-calendar-table-cell-content {
            background-color: #3b82f6;
            color: white;
          }

          .rs-calendar-table-cell-in-range .rs-calendar-table-cell-content {
            background-color: #dbeafe;
            color: #1e40af;
          }

          .rs-calendar-table-cell-disabled .rs-calendar-table-cell-content {
            color: #d1d5db;
            cursor: not-allowed;
          }

          .rs-calendar-header-title-date {
            font-weight: 600;
            color: #111827;
          }

          .rs-calendar-header-backward,
          .rs-calendar-header-forward {
            color: #6b7280;
            padding: 0.5rem;
            border-radius: 0.375rem;
          }

          .rs-calendar-header-backward:hover,
          .rs-calendar-header-forward:hover {
            background-color: #f3f4f6;
          }
        `}</style>
      </>
    );
  }

  // Renderizar vista desktop
  return (
    <div className="w-full rsuite-date-picker-wrapper">
      <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide flex items-center gap-2">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span>CHECK IN — CHECK OUT</span>
      </div>
      
      <DateRangePicker
        value={dateRange}
        onChange={handleDateChange}
        disabled={disabled}
        shouldDisableDate={(date) => minDate && date < minDate}
        format="MMM dd, yyyy"
        character=" - "
        placeholder="Select date range"
        block
        showOneCalendar
        ranges={[]}
        cleanable={false}
        className="custom-date-range-picker"
        placement="bottomStart"
        preventOverflow
        container={() => document.body}
      />

      <style jsx global>{`
        /* Estilos específicos para rsuite DateRangePicker - solo afectan componentes rs-* */
        
        /* Toggle button del picker */
        .custom-date-range-picker .rs-picker-toggle {
          padding: 12px;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          background-color: white;
          font-size: 0.875rem;
          font-weight: 500;
          color: #111827;
          display: flex;
          align-items: center;
        }

        .custom-date-range-picker .rs-picker-toggle:hover {
          border-color: #d1d5db;
        }

        .custom-date-range-picker .rs-picker-toggle:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .custom-date-range-picker .rs-picker-toggle-placeholder {
          color: #9ca3af;
        }

        .custom-date-range-picker .rs-picker-toggle-caret {
          color: #6b7280;
        }

        /* Menu dropdown del picker */
        .rs-picker-menu {
          border-radius: 0.75rem;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
          background-color: white;
          z-index: 1050;
        }

        .rs-picker-daterange-menu {
          padding: 1rem;
        }

        /* Calendario */
        .rs-calendar {
          font-family: inherit;
        }

        .rs-calendar-header {
          padding: 0.5rem 1rem;
          border-bottom: 1px solid #f3f4f6;
        }

        .rs-calendar-header-title {
          font-weight: 600;
          color: #111827;
          font-size: 0.875rem;
        }

        .rs-calendar-header-backward,
        .rs-calendar-header-forward {
          color: #6b7280;
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 0.25rem;
        }

        .rs-calendar-header-backward:hover,
        .rs-calendar-header-forward:hover {
          background-color: #f3f4f6;
          color: #111827;
        }

        /* Tabla del calendario */
        .rs-calendar-table {
          width: 100%;
          border-collapse: collapse;
        }

        .rs-calendar-table-header-row {
          border-bottom: 1px solid #f3f4f6;
        }

        .rs-calendar-table-header-cell {
          padding: 0.5rem;
          text-align: center;
          font-size: 0.75rem;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
        }

        .rs-calendar-table-cell {
          padding: 0.25rem;
          text-align: center;
        }

        .rs-calendar-table-cell-content {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 0.5rem;
          cursor: pointer;
          font-size: 0.875rem;
          color: #374151;
          transition: all 0.2s;
        }

        .rs-calendar-table-cell-content:hover {
          background-color: #f3f4f6;
        }

        /* Celdas seleccionadas */
        .rs-calendar-table-cell-selected .rs-calendar-table-cell-content {
          background-color: #3b82f6 !important;
          color: white !important;
          font-weight: 600;
        }

        /* Rango de fechas */
        .rs-calendar-table-cell-in-range .rs-calendar-table-cell-content {
          background-color: #dbeafe;
          color: #1e40af;
        }

        .rs-calendar-table-cell-in-range:first-child .rs-calendar-table-cell-content {
          border-top-left-radius: 0.5rem;
          border-bottom-left-radius: 0.5rem;
        }

        .rs-calendar-table-cell-in-range:last-child .rs-calendar-table-cell-content {
          border-top-right-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
        }

        /* Celdas deshabilitadas */
        .rs-calendar-table-cell-disabled .rs-calendar-table-cell-content {
          color: #d1d5db;
          cursor: not-allowed;
          background-color: transparent;
        }

        .rs-calendar-table-cell-disabled .rs-calendar-table-cell-content:hover {
          background-color: transparent;
        }

        /* Mes/año actual */
        .rs-calendar-table-cell-is-today .rs-calendar-table-cell-content {
          border: 1px solid #3b82f6;
        }

        /* Celdas fuera del mes actual */
        .rs-calendar-table-cell-un-same-month .rs-calendar-table-cell-content {
          color: #d1d5db;
        }

        /* Animaciones */
        .rs-picker-toggle-active,
        .rs-picker-toggle-open {
          border-color: #3b82f6;
        }

        /* Asegurar que el z-index del picker sea apropiado */
        .rs-picker-has-value .rs-btn .rs-picker-toggle-clean {
          display: none;
        }

        /* Responsive */
        @media (max-width: 640px) {
          .rs-calendar-table-cell-content {
            width: 2rem;
            height: 2rem;
            font-size: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
};

export default DateRangeSelector;

