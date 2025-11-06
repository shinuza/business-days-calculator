import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RateConfig as RateConfigType, Currency, CURRENCIES } from '@/types';

interface RateConfigProps {
  config: RateConfigType;
  onChange: (config: RateConfigType) => void;
  currency: Currency;
}

export function RateConfig({ config, onChange, currency }: RateConfigProps) {
  const [localConfig, setLocalConfig] = useState<RateConfigType>(config);
  const currencySymbol = CURRENCIES[currency].symbol;

  useEffect(() => {
    setLocalConfig(config);
  }, [config]);

  const handleTypeChange = (type: 'daily' | 'hourly') => {
    const newConfig: RateConfigType = {
      type,
      dailyRate: type === 'daily' ? localConfig.dailyRate || 0 : undefined,
      hourlyRate: type === 'hourly' ? localConfig.hourlyRate || 0 : undefined,
      hoursPerDay: type === 'hourly' ? localConfig.hoursPerDay || 8 : undefined,
    };
    setLocalConfig(newConfig);
    onChange(newConfig);
  };

  const handleDailyRateChange = (value: string) => {
    const dailyRate = parseFloat(value) || 0;
    const newConfig = { ...localConfig, dailyRate };
    setLocalConfig(newConfig);
    onChange(newConfig);
  };

  const handleHourlyRateChange = (value: string) => {
    const hourlyRate = parseFloat(value) || 0;
    const newConfig = { ...localConfig, hourlyRate };
    setLocalConfig(newConfig);
    onChange(newConfig);
  };

  const handleHoursPerDayChange = (value: string) => {
    const hoursPerDay = parseFloat(value) || 8;
    const newConfig = { ...localConfig, hoursPerDay };
    setLocalConfig(newConfig);
    onChange(newConfig);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rate Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button
            variant={localConfig.type === 'daily' ? 'default' : 'outline'}
            onClick={() => handleTypeChange('daily')}
            className="flex-1"
          >
            Daily Rate
          </Button>
          <Button
            variant={localConfig.type === 'hourly' ? 'default' : 'outline'}
            onClick={() => handleTypeChange('hourly')}
            className="flex-1"
          >
            Hourly Rate
          </Button>
        </div>

        {localConfig.type === 'daily' && (
          <div className="space-y-2">
            <Label htmlFor="dailyRate">Daily Rate ({currencySymbol})</Label>
            <Input
              id="dailyRate"
              type="number"
              min="0"
              step="0.01"
              value={localConfig.dailyRate || ''}
              onChange={(e) => handleDailyRateChange(e.target.value)}
              placeholder="Enter daily rate"
            />
          </div>
        )}

        {localConfig.type === 'hourly' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="hourlyRate">Hourly Rate ({currencySymbol})</Label>
              <Input
                id="hourlyRate"
                type="number"
                min="0"
                step="0.01"
                value={localConfig.hourlyRate || ''}
                onChange={(e) => handleHourlyRateChange(e.target.value)}
                placeholder="Enter hourly rate"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hoursPerDay">Hours per Day</Label>
              <Input
                id="hoursPerDay"
                type="number"
                min="1"
                max="24"
                step="0.5"
                value={localConfig.hoursPerDay || 8}
                onChange={(e) => handleHoursPerDayChange(e.target.value)}
                placeholder="8"
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
