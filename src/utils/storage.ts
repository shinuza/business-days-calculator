import { RateConfig, AppOptions, DayExclusion } from '@/types';

const RATE_CONFIG_KEY = 'workdays-rate-config';
const COUNTRY_KEY = 'workdays-country';
const YEAR_KEY = 'workdays-year';
const OPTIONS_KEY = 'workdays-options';
const DAY_EXCLUSIONS_KEY = 'workdays-day-exclusions';
const CONTRIBUTION_PERCENTAGE_KEY = 'workdays-contribution-percentage';
const MANUAL_DAYS_OVERRIDE_KEY = 'workdays-manual-days-override';
const MANUAL_DAYS_VALUE_KEY = 'workdays-manual-days-value';

export function saveRateConfig(config: RateConfig): void {
  try {
    localStorage.setItem(RATE_CONFIG_KEY, JSON.stringify(config));
  } catch (error) {
    console.error('Failed to save rate config:', error);
  }
}

export function loadRateConfig(): RateConfig | null {
  try {
    const stored = localStorage.getItem(RATE_CONFIG_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Failed to load rate config:', error);
    return null;
  }
}

export function saveCountry(country: string): void {
  try {
    localStorage.setItem(COUNTRY_KEY, country);
  } catch (error) {
    console.error('Failed to save country:', error);
  }
}

export function loadCountry(): string | null {
  try {
    return localStorage.getItem(COUNTRY_KEY);
  } catch (error) {
    console.error('Failed to load country:', error);
    return null;
  }
}

export function saveYear(year: number): void {
  try {
    localStorage.setItem(YEAR_KEY, year.toString());
  } catch (error) {
    console.error('Failed to save year:', error);
  }
}

export function loadYear(): number | null {
  try {
    const stored = localStorage.getItem(YEAR_KEY);
    return stored ? parseInt(stored, 10) : null;
  } catch (error) {
    console.error('Failed to load year:', error);
    return null;
  }
}

export function saveOptions(options: AppOptions): void {
  try {
    localStorage.setItem(OPTIONS_KEY, JSON.stringify(options));
  } catch (error) {
    console.error('Failed to save options:', error);
  }
}

export function loadOptions(): AppOptions | null {
  try {
    const stored = localStorage.getItem(OPTIONS_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Failed to load options:', error);
    return null;
  }
}

export function saveDayExclusions(exclusions: Record<string, DayExclusion>): void {
  try {
    localStorage.setItem(DAY_EXCLUSIONS_KEY, JSON.stringify(exclusions));
  } catch (error) {
    console.error('Failed to save day exclusions:', error);
  }
}

export function loadDayExclusions(): Record<string, DayExclusion> {
  try {
    const stored = localStorage.getItem(DAY_EXCLUSIONS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Failed to load day exclusions:', error);
    return {};
  }
}

export function clearMonthExclusions(year: number, month: number): void {
  try {
    const exclusions = loadDayExclusions();
    const prefix = `${year}-${String(month + 1).padStart(2, '0')}`;
    
    Object.keys(exclusions).forEach(key => {
      if (key.startsWith(prefix)) {
        delete exclusions[key];
      }
    });
    
    saveDayExclusions(exclusions);
  } catch (error) {
    console.error('Failed to clear month exclusions:', error);
  }
}

export function saveContributionPercentage(percentage: number | null): void {
  try {
    if (percentage === null || percentage === 0) {
      localStorage.removeItem(CONTRIBUTION_PERCENTAGE_KEY);
    } else {
      localStorage.setItem(CONTRIBUTION_PERCENTAGE_KEY, percentage.toString());
    }
  } catch (error) {
    console.error('Failed to save contribution percentage:', error);
  }
}

export function loadContributionPercentage(): number | null {
  try {
    const stored = localStorage.getItem(CONTRIBUTION_PERCENTAGE_KEY);
    return stored ? parseFloat(stored) : null;
  } catch (error) {
    console.error('Failed to load contribution percentage:', error);
    return null;
  }
}

export function saveManualDaysOverride(enabled: boolean): void {
  try {
    localStorage.setItem(MANUAL_DAYS_OVERRIDE_KEY, enabled.toString());
  } catch (error) {
    console.error('Failed to save manual days override:', error);
  }
}

export function loadManualDaysOverride(): boolean {
  try {
    const stored = localStorage.getItem(MANUAL_DAYS_OVERRIDE_KEY);
    return stored === 'true';
  } catch (error) {
    console.error('Failed to load manual days override:', error);
    return false;
  }
}

export function saveManualDaysValue(days: number | null): void {
  try {
    if (days === null) {
      localStorage.removeItem(MANUAL_DAYS_VALUE_KEY);
    } else {
      localStorage.setItem(MANUAL_DAYS_VALUE_KEY, days.toString());
    }
  } catch (error) {
    console.error('Failed to save manual days value:', error);
  }
}

export function loadManualDaysValue(): number | null {
  try {
    const stored = localStorage.getItem(MANUAL_DAYS_VALUE_KEY);
    return stored ? parseInt(stored, 10) : null;
  } catch (error) {
    console.error('Failed to load manual days value:', error);
    return null;
  }
}
