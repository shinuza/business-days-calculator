export interface Holiday {
  date: string;
  name: string;
}

export interface HolidayCalendar {
  year: number;
  country: string;
  holidays: Holiday[];
}

export interface RateConfig {
  type: 'daily' | 'hourly';
  dailyRate?: number;
  hourlyRate?: number;
  hoursPerDay?: number;
}

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export type Country = 'US' | 'France';

export type Currency = 'USD' | 'EUR' | 'JPY' | 'GBP';

export interface CurrencyInfo {
  code: Currency;
  symbol: string;
  name: string;
}

export const CURRENCIES: Record<Currency, CurrencyInfo> = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro' },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound' },
};

export type FirstDayOfWeek = 'monday' | 'sunday';

export interface AppOptions {
  currency: Currency;
  defaultCountry: string;
  firstDayOfWeek: FirstDayOfWeek;
}

export interface DayExclusion {
  date: string; // format: YYYY-MM-DD
  excluded: boolean; // true = excluded from count, false = included in count
}
