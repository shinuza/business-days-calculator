import { format, getDay } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { DayInfo } from '@/utils/workdaysCalculator';
import { Trash2 } from 'lucide-react';

interface MonthAgendaProps {
  year: number;
  month: number;
  days: DayInfo[];
  onDayToggle: (date: Date) => void;
  onClearMonth: () => void;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function MonthAgenda({ year, month, days, onDayToggle, onClearMonth }: MonthAgendaProps) {
  const monthName = format(new Date(year, month), 'MMMM yyyy');
  const firstDayOfWeek = getDay(days[0].date);

  // Create empty cells for days before the first day of the month
  const emptyCells = Array(firstDayOfWeek).fill(null);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{monthName}</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={onClearMonth}
            className="gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Clear Exclusions
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {/* Weekday headers */}
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="text-center text-sm font-semibold text-muted-foreground py-2"
            >
              {day}
            </div>
          ))}

          {/* Empty cells before first day */}
          {emptyCells.map((_, index) => (
            <div key={`empty-${index}`} />
          ))}

          {/* Calendar days */}
          {days.map((dayInfo) => {
            const dayNumber = format(dayInfo.date, 'd');
            
            return (
              <button
                key={dayInfo.date.toISOString()}
                onClick={() => onDayToggle(dayInfo.date)}
                className={cn(
                  'relative p-2 rounded-md border text-center min-h-[60px] flex flex-col items-center justify-center cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all',
                  dayInfo.isWorkday && !dayInfo.isManuallyIncluded && 'bg-green-50 border-green-200',
                  dayInfo.isWeekend && !dayInfo.isManuallyIncluded && 'bg-gray-50 border-gray-200',
                  dayInfo.isHoliday && !dayInfo.isManuallyIncluded && 'bg-red-50 border-red-200',
                  dayInfo.isManuallyExcluded && 'bg-orange-100 border-orange-400 ring-2 ring-orange-300',
                  dayInfo.isManuallyIncluded && 'bg-blue-100 border-blue-400 ring-2 ring-blue-300',
                  dayInfo.isInRange && 'ring-2 ring-blue-400'
                )}
              >
                <span className={cn(
                  'text-sm font-medium',
                  dayInfo.isWeekend && !dayInfo.isManuallyIncluded && 'text-gray-500',
                  dayInfo.isHoliday && !dayInfo.isManuallyIncluded && 'text-red-600',
                  dayInfo.isWorkday && !dayInfo.isManuallyExcluded && 'text-green-700',
                  dayInfo.isManuallyExcluded && 'text-orange-700',
                  dayInfo.isManuallyIncluded && 'text-blue-700'
                )}>
                  {dayNumber}
                </span>
                
                {dayInfo.isHoliday && dayInfo.holidayName && !dayInfo.isManuallyIncluded && (
                  <Badge
                    variant="destructive"
                    className="text-[8px] px-1 py-0 mt-1 leading-tight"
                  >
                    {dayInfo.holidayName.length > 12
                      ? dayInfo.holidayName.substring(0, 12) + '...'
                      : dayInfo.holidayName}
                  </Badge>
                )}
                
                {dayInfo.isWeekend && !dayInfo.isHoliday && !dayInfo.isManuallyIncluded && (
                  <span className="text-[8px] text-gray-500 mt-1">Weekend</span>
                )}
                
                {dayInfo.isManuallyExcluded && (
                  <span className="text-[8px] text-orange-700 mt-1 font-semibold">Excluded</span>
                )}
                
                {dayInfo.isManuallyIncluded && (
                  <span className="text-[8px] text-blue-700 mt-1 font-semibold">Included</span>
                )}
              </button>
            );
          })}
        </div>
        
        <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-50 border border-green-200 rounded"></div>
            <span>Workday</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-50 border border-gray-200 rounded"></div>
            <span>Weekend</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-50 border border-red-200 rounded"></div>
            <span>Holiday</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-100 border-2 border-orange-400 rounded"></div>
            <span>Manually Excluded</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-100 border-2 border-blue-400 rounded"></div>
            <span>Manually Included</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
