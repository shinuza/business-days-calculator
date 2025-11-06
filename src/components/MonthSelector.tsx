import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MonthSelectorProps {
  selectedMonth: number | null;
  onMonthSelect: (month: number) => void;
  workableDaysPerMonth: Record<number, number>;
  currentYear: number;
  selectedYear: number;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function MonthSelector({
  selectedMonth,
  onMonthSelect,
  workableDaysPerMonth,
  currentYear,
  selectedYear,
}: MonthSelectorProps) {
  const currentMonth = new Date().getMonth();
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {MONTHS.map((month, index) => {
        const isSelected = selectedMonth === index;
        const isCurrentMonth = currentYear === selectedYear && currentMonth === index;
        const workableDays = workableDaysPerMonth[index] || 0;

        return (
          <Button
            key={month}
            variant={isSelected ? 'default' : 'outline'}
            className={cn(
              'h-[88px] py-3 flex flex-col items-center justify-center gap-0.5',
              isSelected && 'ring-2 ring-primary ring-offset-2',
              isCurrentMonth && !isSelected && 'border-primary'
            )}
            onClick={() => onMonthSelect(index)}
          >
            <span className="font-semibold">{month}</span>
            <span className="text-xs opacity-80">
              {workableDays} workable days
            </span>
            <span className="text-[10px] opacity-60 italic h-3">
              {isCurrentMonth ? 'current month' : ''}
            </span>
          </Button>
        );
      })}
    </div>
  );
}
