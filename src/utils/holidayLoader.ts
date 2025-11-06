import { HolidayCalendar } from '@/types';

const holidayCache: Record<string, HolidayCalendar> = {};

export async function loadHolidayCalendar(
  country: string,
  year: number
): Promise<HolidayCalendar | null> {
  const key = `${country}-${year}`;
  
  if (holidayCache[key]) {
    return holidayCache[key];
  }

  try {
    const countryPath = country.toLowerCase();
    const calendar = await import(
      `../data/holidays/${countryPath}/${year}.json`
    );
    holidayCache[key] = calendar.default || calendar;
    return holidayCache[key];
  } catch (error) {
    console.warn(`Holiday calendar not found for ${country} ${year}`);
    return null;
  }
}

export function getAvailableYears(): number[] {
  return [2025, 2026, 2027];
}

export function getAvailableCountries(): Array<{ code: string; name: string }> {
  return [
    { code: 'us', name: 'United States' },
    { code: 'france', name: 'France' },
  ];
}
