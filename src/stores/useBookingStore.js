import { atom } from 'nanostores';
import { useState, useEffect } from 'react';

// Estado inicial del booking
const initialBookingData = {
  hotel_name: '',
  session_id: '',
  hotel_id: '',
  selected_room: null,
  start_date: '',
  end_date: '',
  guest_name: '',
  guest_email: ''
};

// Store de booking
export const bookingStore = atom(initialBookingData);

// Acciones para manipular el booking
export const bookingActions = {
  // Establecer información del hotel
  setHotelInfo: (hotelInfo) => {
    bookingStore.set({
      ...bookingStore.get(),
      hotel_name: hotelInfo.hotel_name || '',
      session_id: hotelInfo.session_id || '',
      hotel_id: hotelInfo.hotel_id || ''
    });
  },

  // Establecer habitación seleccionada
  setSelectedRoom: (room) => {
    bookingStore.set({
      ...bookingStore.get(),
      // Asegurar que selected_room se serialice correctamente
      selected_room: room ? JSON.parse(JSON.stringify(room)) : null
    });
  },

  // Establecer toda la información de booking
  setBookingData: (bookingData) => {
    bookingStore.set({
      ...bookingStore.get(),
      ...bookingData,
      // Asegurar que selected_room se serialice correctamente
      selected_room: bookingData.selected_room ? JSON.parse(JSON.stringify(bookingData.selected_room)) : null
    });
  },

  // Limpiar datos de booking
  clearBooking: () => {
    bookingStore.set(initialBookingData);
  },

  // Obtener datos de booking actuales
  getBookingData: () => {
    return bookingStore.get();
  },

  // Función para procesar reserva completa
  processBooking: (hotel, room, searchData, userData) => {
    const bookingData = {
      hotel_name: hotel.name,
      session_id: hotel.session_id,
      hotel_id: hotel.hotel_id,
      selected_room: room ? JSON.parse(JSON.stringify(room)) : null,
      start_date: searchData.checkInDate,
      end_date: searchData.checkOutDate,
      guest_name: userData?.name || '',
      guest_email: userData?.email || ''
    };
    
    bookingStore.set(bookingData);
    return bookingData;
  }
};

// Hook personalizado para usar el store en componentes React
export const useBookingStore = () => {
  const [bookingData, setBookingData] = useState(bookingStore.get());

  useEffect(() => {
    const unsubscribe = bookingStore.subscribe((newBookingData) => {
      setBookingData(newBookingData);
    });
    
    return () => {
      unsubscribe();
    };
  }, []);

  return {
    bookingData,
    ...bookingActions
  };
};

// Exportar el store y las acciones para uso directo
export default bookingStore;
