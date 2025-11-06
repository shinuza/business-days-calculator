import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MonthSelectorProps {
  year: number;
  selectedMonth: number | null;
  onMonthSelect: (month: number) => void;
  workableDaysPerMonth: Record<number, number>;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function MonthSelector({
  year,
  selectedMonth,
  onMonthSelect,
  workableDaysPerMonth,
}: MonthSelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {MONTHS.map((month, index) => {
        const isSelected = selectedMonth === index;
        const workableDays = workableDaysPerMonth[index] || 0;

        return (
          <Button
            key={month}
            variant={isSelected ? 'default' : 'outline'}
            className={cn(
              'h-auto py-4 flex flex-col items-center gap-1',
              isSelected && 'ring-2 ring-primary ring-offset-2'
            )}
            onClick={() => onMonthSelect(index)}
          >
            <span className="font-semibold">{month}</span>
            <span className="text-xs opacity-80">
              {workableDays} workable days
            </span>
          </Button>
        );
      })}
    </div>
  );
}
