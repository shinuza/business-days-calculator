import { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { AppOptions, CURRENCIES, Currency } from '@/types';

interface OptionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  options: AppOptions;
  onOptionsChange: (options: AppOptions) => void;
}

export function OptionsDialog({
  open,
  onOpenChange,
  options,
  onOptionsChange,
}: OptionsDialogProps) {
  const [localOptions, setLocalOptions] = useState<AppOptions>(options);

  useEffect(() => {
    setLocalOptions(options);
  }, [options]);

  const handleSave = () => {
    onOptionsChange(localOptions);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogClose onClose={() => onOpenChange(false)} />
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Application Settings
          </DialogTitle>
          <DialogDescription>
            Configure your preferences for the calculator
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select
              id="currency"
              value={localOptions.currency}
              onChange={(e) =>
                setLocalOptions({
                  ...localOptions,
                  currency: e.target.value as Currency,
                })
              }
            >
              {Object.values(CURRENCIES).map((curr) => (
                <option key={curr.code} value={curr.code}>
                  {curr.name} ({curr.symbol})
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="defaultCountry">Default Country</Label>
            <Select
              id="defaultCountry"
              value={localOptions.defaultCountry}
              onChange={(e) =>
                setLocalOptions({
                  ...localOptions,
                  defaultCountry: e.target.value,
                })
              }
            >
              <option value="us">United States</option>
              <option value="france">France</option>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="firstDayOfWeek">First Day of Week</Label>
            <Select
              id="firstDayOfWeek"
              value={localOptions.firstDayOfWeek}
              onChange={(e) =>
                setLocalOptions({
                  ...localOptions,
                  firstDayOfWeek: e.target.value as 'monday' | 'sunday',
                })
              }
            >
              <option value="sunday">Sunday</option>
              <option value="monday">Monday</option>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface OptionsButtonProps {
  onClick: () => void;
}

export function OptionsButton({ onClick }: OptionsButtonProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onClick}
      className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg"
      title="Settings"
    >
      <Settings className="h-5 w-5" />
    </Button>
  );
}
