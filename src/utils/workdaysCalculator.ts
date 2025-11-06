import {
  eachDayOfInterval,
  isWeekend,
  format,
  startOfMonth,
  endOfMonth,
} from 'date-fns';
import { HolidayCalendar, DayExclusion } from '@/types';

export function calculateWorkableDays(
  startDate: Date,
  endDate: Date,
  holidays: HolidayCalendar | null,
  exclusions: Record<string, DayExclusion> = {}
): number {
  if (!startDate || !endDate) return 0;

  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const holidayDates = new Set(
    holidays?.holidays.map((h) => h.date) || []
  );

  return days.filter((day) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const exclusion = exclusions[dateStr];
    
    // If manually excluded, don't count it
    if (exclusion?.excluded) return false;
    
    // If manually included (overriding weekend/holiday), count it
    if (exclusion && !exclusion.excluded) return true;
    
    // Normal logic: exclude weekends and holidays
    if (isWeekend(day)) return false;
    return !holidayDates.has(dateStr);
  }).length;
}

export function getMonthWorkableDays(
  year: number,
  month: number,
  holidays: HolidayCalendar | null,
  exclusions: Record<string, DayExclusion> = {}
): number {
  const start = startOfMonth(new Date(year, month));
  const end = endOfMonth(new Date(year, month));
  return calculateWorkableDays(start, end, holidays, exclusions);
}

export function isHoliday(date: Date, holidays: HolidayCalendar | null): boolean {
  if (!holidays) return false;
  const dateStr = format(date, 'yyyy-MM-dd');
  return holidays.holidays.some((h) => h.date === dateStr);
}

export function getHolidayName(date: Date, holidays: HolidayCalendar | null): string | null {
  if (!holidays) return null;
  const dateStr = format(date, 'yyyy-MM-dd');
  const holiday = holidays.holidays.find((h) => h.date === dateStr);
  return holiday?.name || null;
}

export interface DayInfo {
  date: Date;
  isWorkday: boolean;
  isWeekend: boolean;
  isHoliday: boolean;
  holidayName?: string;
  isInRange: boolean;
  isManuallyExcluded?: boolean;
  isManuallyIncluded?: boolean;
}

export function getMonthDays(
  year: number,
  month: number,
  holidays: HolidayCalendar | null,
  rangeStart: Date | null,
  rangeEnd: Date | null,
  exclusions: Record<string, DayExclusion> = {}
): DayInfo[] {
  const start = startOfMonth(new Date(year, month));
  const end = endOfMonth(new Date(year, month));
  const days = eachDayOfInterval({ start, end });

  return days.map((date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const exclusion = exclusions[dateStr];
    const weekend = isWeekend(date);
    const holiday = isHoliday(date, holidays);
    const holidayName = getHolidayName(date, holidays);
    
    let isWorkday = !weekend && !holiday;
    let isManuallyExcluded = false;
    let isManuallyIncluded = false;
    
    // Apply manual exclusions/inclusions
    if (exclusion) {
      if (exclusion.excluded) {
        isWorkday = false;
        isManuallyExcluded = true;
      } else {
        isWorkday = true;
        isManuallyIncluded = true;
      }
    }
    
    let isInRange = false;
    if (rangeStart && rangeEnd) {
      isInRange = date >= rangeStart && date <= rangeEnd;
    }

    return {
      date,
      isWorkday,
      isWeekend: weekend,
      isHoliday: holiday,
      holidayName: holidayName || undefined,
      isInRange,
      isManuallyExcluded,
      isManuallyIncluded,
    };
  });
}
