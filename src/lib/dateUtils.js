/**
 * Calcula el número de noches entre dos fechas
 * @param {string|Date} checkInDate - Fecha de check-in
 * @param {string|Date} checkOutDate - Fecha de check-out
 * @returns {number} - Número de noches (mínimo 1)
 */
export const calculateNights = (checkInDate, checkOutDate) => {
  if (!checkInDate || !checkOutDate) return 1
  const checkin = new Date(checkInDate)
  const checkout = new Date(checkOutDate)
  const diffTime = Math.abs(checkout - checkin)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays || 1
}

