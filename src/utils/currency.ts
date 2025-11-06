import { Currency, CURRENCIES } from '@/types';

/**
 * Get the currency symbol for a given currency code
 */
export function getCurrencySymbol(currency: Currency): string {
  return CURRENCIES[currency].symbol;
}

/**
 * Get the full currency information for a given currency code
 */
export function getCurrencyInfo(currency: Currency) {
  return CURRENCIES[currency];
}

/**
 * Format a number with the appropriate currency symbol
 */
export function formatCurrency(amount: number, currency: Currency): string {
  const symbol = getCurrencySymbol(currency);
  return `${symbol}${amount.toLocaleString('en-US', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  })}`;
}
