import { persistentMap } from '@nanostores/persistent'
import { useState, useEffect } from 'react';

// Estado inicial del booking
const initialBookingData = {
  hotel_name: '',
  session_id: '',
  hotel_id: '',
  selected_room: null, // Se almacenará como string JSON
  start_date: '',
  end_date: '',
  adults: 2,
  children: 0,
  guest_name: '',
  guest_email: '',
  credit_card: null // Se almacenará como string JSON
};

// Store de booking
export const bookingStore = persistentMap('bookingStore', initialBookingData);

// Acciones para manipular el booking
export const bookingActions = {
  // Función para procesar reserva completa
  processBooking: (hotel, room, searchData, userData) => {
    const bookingData = {
      hotel_name: hotel.hotel_name,
      session_id: hotel.session_id,
      hotel_id: hotel.hotel_id,
      selected_room: room ? JSON.stringify(room) : null, // Almacenar como string JSON
      start_date: searchData.checkInDate,
      end_date: searchData.checkOutDate,
      adults: searchData.adults || 2,
      children: searchData.children || 0,
      guest_name: userData?.name || '',
      guest_email: userData?.email || '',
      credit_card: null
    };
    bookingStore.set(bookingData);
    return bookingData;
  },

  // Función para actualizar datos de tarjeta de crédito
  updateCreditCard: (creditCardData) => {
    const currentData = bookingStore.get();
    const updatedData = {
      ...currentData,
      credit_card: creditCardData ? JSON.stringify(creditCardData) : null
    };
    bookingStore.set(updatedData);
    return updatedData;
  }
};

// Hook personalizado para usar el store en componentes React
export const useBookingStore = () => {
  // Función para parsear selected_room y credit_card si son strings
  const parseBookingData = (data) => {
    if (!data) return data;
    
    return {
      ...data,
      selected_room: data.selected_room && typeof data.selected_room === 'string' 
        ? JSON.parse(data.selected_room) 
        : data.selected_room,
      credit_card: data.credit_card && typeof data.credit_card === 'string' 
        ? JSON.parse(data.credit_card) 
        : data.credit_card
    };
  };

  const [bookingData, setBookingData] = useState(parseBookingData(bookingStore.get()));

  useEffect(() => {
    const unsubscribe = bookingStore.subscribe((newBookingData) => {
      setBookingData(parseBookingData(newBookingData));
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
