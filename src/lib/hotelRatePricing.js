import { config } from '../config/config.js';
import currencies from '../data/currencies.json';

/**
 * Símbolo desde `currencies.json` cuando el ISO coincide.
 * Si no hay entrada (p. ej. `currency_code` del hotel no listado), se muestra el ISO para que el usuario vea la moneda del API.
 */
export function getCurrencySymbolOrIso(isoCode) {
  if (isoCode == null || String(isoCode).trim() === '') return '';
  const code = String(isoCode).trim();
  const entry = currencies.find((c) => c.iso_code === code);
  return entry ? entry.symbol : code;
}

/**
 * «Hotel currency» en el UI guarda selectedCurrency como cadena vacía.
 * El API de disponibilidad debe recibir siempre un ISO válido (p. ej. USD).
 */
export function resolveAvailabilityCurrency(
  selectedCurrency,
  defaultCurrency = config.search.defaultCurrency
) {
  const trimmed =
    typeof selectedCurrency === 'string' ? selectedCurrency.trim() : '';
  return trimmed || defaultCurrency;
}

export function isHotelNativeCurrencySelection(selectedCurrency) {
  if (selectedCurrency == null) return false;
  return String(selectedCurrency).trim() === '';
}

function pickPricingFields(entity, useHotelNativeFields) {
  if (!entity) {
    return {
      currencyCode: undefined,
      total: undefined,
      nightly: undefined,
      source: 'requested'
    };
  }

  const useNative =
    useHotelNativeFields &&
    entity.currency_code != null &&
    entity.total_to_book != null;

  if (useNative) {
    return {
      currencyCode: entity.currency_code,
      total: entity.total_to_book,
      nightly: entity.rate,
      source: 'hotel_native'
    };
  }

  return {
    currencyCode: entity.requested_currency_code,
    total: entity.total_to_book_in_requested_currency,
    nightly: entity.rate_in_requested_currency,
    source: 'requested'
  };
}

/**
 * @param {object|null} entity lowest_rate o rate con campos locales y requested_*
 * @returns {{ currencyCode: string|undefined, total: *, nightly: *, source: 'hotel_native'|'requested' }}
 */
export function getPricingForDisplay(entity, selectedCurrency) {
  return pickPricingFields(
    entity,
    isHotelNativeCurrencySelection(selectedCurrency)
  );
}

/** Resumen en /booking según cómo eligió precios el usuario al pulsar Book now */
export function getPricingForBookingSummary(entity, ratePricingDisplay) {
  const useNative = ratePricingDisplay === 'hotel_native';
  return pickPricingFields(entity, useNative);
}

export function parseDisplayTotal(entity, selectedCurrency) {
  const { total } = getPricingForDisplay(entity, selectedCurrency);
  if (total == null || total === '') return Infinity;
  const n = Number(total);
  return Number.isFinite(n) ? n : Infinity;
}

export function hasDisplayablePricing(entity, selectedCurrency) {
  const { total } = getPricingForDisplay(entity, selectedCurrency);
  return total != null && total !== '';
}

export function hasDisplayableBookingPricing(entity, ratePricingDisplay) {
  const { total } = getPricingForBookingSummary(entity, ratePricingDisplay);
  return total != null && total !== '';
}
