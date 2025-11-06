import { useState, useEffect, useMemo } from 'react';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { MonthSelector } from '@/components/MonthSelector';
import { MonthAgenda } from '@/components/MonthAgenda';
import { RateConfig } from '@/components/RateConfig';
import { OptionsDialog, OptionsButton } from '@/components/OptionsDialog';
import { loadHolidayCalendar, getAvailableYears, getAvailableCountries } from '@/utils/holidayLoader';
import { calculateWorkableDays, getMonthWorkableDays, getMonthDays } from '@/utils/workdaysCalculator';
import { saveRateConfig, loadRateConfig, saveCountry, loadCountry, saveYear, loadYear, saveOptions, loadOptions, saveDayExclusions, loadDayExclusions, clearMonthExclusions, saveContributionPercentage, loadContributionPercentage, saveManualDaysOverride, loadManualDaysOverride, saveManualDaysValue, loadManualDaysValue } from '@/utils/storage';
import { HolidayCalendar, RateConfig as RateConfigType, AppOptions, DayExclusion, CURRENCIES } from '@/types';

function App() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState<number>(loadYear() || currentYear);
  const [country, setCountry] = useState<string>(loadCountry() || 'us');
  const [holidays, setHolidays] = useState<HolidayCalendar | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [rateConfig, setRateConfig] = useState<RateConfigType>(
    loadRateConfig() || { type: 'daily', dailyRate: 0 }
  );
  const [options, setOptions] = useState<AppOptions>(
    loadOptions() || { currency: 'USD', defaultCountry: 'us', firstDayOfWeek: 'sunday' }
  );
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [dayExclusions, setDayExclusions] = useState<Record<string, DayExclusion>>(loadDayExclusions());
  const [contributionPercentage, setContributionPercentage] = useState<number | null>(loadContributionPercentage());
  const [manualDaysOverride, setManualDaysOverride] = useState<boolean>(loadManualDaysOverride());
  const [manualDaysValue, setManualDaysValue] = useState<number | null>(loadManualDaysValue());

  const availableYears = getAvailableYears();
  const availableCountries = getAvailableCountries();

  // Load holiday calendar when country or year changes
  useEffect(() => {
    loadHolidayCalendar(country, year).then(setHolidays);
    saveCountry(country);
    saveYear(year);
  }, [country, year]);

  // Update selected month when year changes
  useEffect(() => {
    if (selectedMonth !== null) {
      // Refresh the month dates for the new year
      const start = startOfMonth(new Date(year, selectedMonth));
      const end = endOfMonth(new Date(year, selectedMonth));
      setStartDate(format(start, 'yyyy-MM-dd'));
      setEndDate(format(end, 'yyyy-MM-dd'));
    }
  }, [year, selectedMonth]);

  // Calculate workable days per month
  const workableDaysPerMonth = useMemo(() => {
    const result: Record<number, number> = {};
    for (let month = 0; month < 12; month++) {
      result[month] = getMonthWorkableDays(year, month, holidays, dayExclusions);
    }
    return result;
  }, [year, holidays, dayExclusions]);

  // Calculate workable days for selected range
  const calculatedWorkableDays = useMemo(() => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    return calculateWorkableDays(start, end, holidays, dayExclusions);
  }, [startDate, endDate, holidays, dayExclusions]);

  // Use manual override if enabled, otherwise use calculated days
  const workableDays = manualDaysOverride && manualDaysValue !== null ? manualDaysValue : calculatedWorkableDays;

  // Calculate expected revenue
  const expectedRevenue = useMemo(() => {
    if (workableDays === 0) return 0;
    
    if (rateConfig.type === 'daily' && rateConfig.dailyRate) {
      return workableDays * rateConfig.dailyRate;
    } else if (
      rateConfig.type === 'hourly' &&
      rateConfig.hourlyRate &&
      rateConfig.hoursPerDay
    ) {
      return workableDays * rateConfig.hourlyRate * rateConfig.hoursPerDay;
    }
    return 0;
  }, [workableDays, rateConfig]);

  // Get currency symbol
  const currencySymbol = CURRENCIES[options.currency].symbol;

  // Handle month selection
  const handleMonthSelect = (month: number) => {
    setSelectedMonth(month);
    const start = startOfMonth(new Date(year, month));
    const end = endOfMonth(new Date(year, month));
    setStartDate(format(start, 'yyyy-MM-dd'));
    setEndDate(format(end, 'yyyy-MM-dd'));
  };

  // Handle rate config change
  const handleRateConfigChange = (config: RateConfigType) => {
    setRateConfig(config);
    saveRateConfig(config);
  };

  // Get month days for agenda view
  const monthDays = useMemo(() => {
    if (selectedMonth === null) return [];
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    return getMonthDays(year, selectedMonth, holidays, start, end, dayExclusions);
  }, [selectedMonth, year, holidays, startDate, endDate, dayExclusions]);

  // Handle options change
  const handleOptionsChange = (newOptions: AppOptions) => {
    setOptions(newOptions);
    saveOptions(newOptions);
    // Update country if default country changed
    if (newOptions.defaultCountry !== country) {
      setCountry(newOptions.defaultCountry);
    }
  };

  // Handle contribution percentage change
  const handleContributionPercentageChange = (value: string) => {
    const numValue = parseFloat(value);
    if (value === '' || isNaN(numValue)) {
      setContributionPercentage(null);
      saveContributionPercentage(null);
    } else {
      const clamped = Math.max(0, Math.min(100, numValue));
      setContributionPercentage(clamped);
      saveContributionPercentage(clamped);
    }
  };

  // Handle manual days override toggle
  const handleManualDaysOverrideChange = (checked: boolean) => {
    setManualDaysOverride(checked);
    saveManualDaysOverride(checked);
    if (!checked) {
      // Reset to calculated value when disabling override
      setManualDaysValue(null);
      saveManualDaysValue(null);
    } else if (manualDaysValue === null) {
      // Initialize with calculated value when enabling
      setManualDaysValue(calculatedWorkableDays);
      saveManualDaysValue(calculatedWorkableDays);
    }
  };

  // Handle manual days value change
  const handleManualDaysValueChange = (value: string) => {
    const numValue = parseInt(value, 10);
    if (value === '' || isNaN(numValue)) {
      setManualDaysValue(null);
      saveManualDaysValue(null);
    } else {
      const clamped = Math.max(0, numValue);
      setManualDaysValue(clamped);
      saveManualDaysValue(clamped);
    }
  };

  // Handle day toggle (exclude/include)
  const handleDayToggle = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const newExclusions = { ...dayExclusions };
    
    if (newExclusions[dateStr]) {
      // If already has an exclusion, toggle it or remove it
      if (newExclusions[dateStr].excluded) {
        // Was excluded, now include it
        newExclusions[dateStr] = { date: dateStr, excluded: false };
      } else {
        // Was included, remove the override
        delete newExclusions[dateStr];
      }
    } else {
      // No exclusion yet, check if it's a workday and exclude it, or if it's weekend/holiday and include it
      const dayInfo = monthDays.find(d => format(d.date, 'yyyy-MM-dd') === dateStr);
      if (dayInfo) {
        if (dayInfo.isWorkday) {
          // It's a workday, exclude it
          newExclusions[dateStr] = { date: dateStr, excluded: true };
        } else {
          // It's a weekend/holiday, include it
          newExclusions[dateStr] = { date: dateStr, excluded: false };
        }
      }
    }
    
    setDayExclusions(newExclusions);
    saveDayExclusions(newExclusions);
  };

  // Handle clear month exclusions
  const handleClearMonth = () => {
    if (selectedMonth === null) return;
    clearMonthExclusions(year, selectedMonth);
    setDayExclusions(loadDayExclusions());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Calendar className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-gray-900">
              Business Days Calculator
            </h1>
          </div>
          <p className="text-gray-600">
            Calculate workable days and expected revenue for any period
          </p>
        </div>

        {/* Country and Year Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Calendar Settings</CardTitle>
            <CardDescription>Select country and year for holiday calendar</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                {availableCountries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Select
                id="year"
                value={year.toString()}
                onChange={(e) => setYear(parseInt(e.target.value))}
              >
                {availableYears.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Month Selector */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Month Selection - {year}</CardTitle>
            <CardDescription>Click a month to see its workable days</CardDescription>
          </CardHeader>
          <CardContent>
            <MonthSelector
              selectedMonth={selectedMonth}
              onMonthSelect={handleMonthSelect}
              workableDaysPerMonth={workableDaysPerMonth}
              currentYear={currentYear}
              selectedYear={year}
            />
          </CardContent>
        </Card>

        {/* Date Range Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Custom Date Range</CardTitle>
            <CardDescription>Select start and end dates for custom period</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setSelectedMonth(null);
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setSelectedMonth(null);
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Rate Configuration */}
        <RateConfig config={rateConfig} onChange={handleRateConfigChange} currency={options.currency} />

        {/* Results */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200">
          <CardHeader>
            <CardTitle>Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-lg">Workable Days</Label>
                  <Checkbox
                    id="manualOverride"
                    checked={manualDaysOverride}
                    onChange={(e) => handleManualDaysOverrideChange(e.target.checked)}
                    label="Manual"
                  />
                </div>
                {manualDaysOverride ? (
                  <div className="space-y-2">
                    <Input
                      type="number"
                      min="0"
                      step="1"
                      value={manualDaysValue ?? ''}
                      onChange={(e) => handleManualDaysValueChange(e.target.value)}
                      className="text-3xl font-bold text-green-700 h-auto py-2 bg-white border-2 border-green-400"
                      placeholder="Enter days"
                    />
                    <p className="text-xs text-gray-600">
                      Calculated: {calculatedWorkableDays} days
                    </p>
                  </div>
                ) : (
                  <div className="text-4xl font-bold text-green-700">
                    {workableDays}
                  </div>
                )}
                {startDate && endDate && (
                  <p className="text-sm text-gray-600">
                    From {format(new Date(startDate), 'MMM d, yyyy')} to{' '}
                    {format(new Date(endDate), 'MMM d, yyyy')}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-lg">Expected Revenue</Label>
                <div className="text-4xl font-bold text-green-700">
                  {currencySymbol}{expectedRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                {rateConfig.type === 'daily' && rateConfig.dailyRate && (
                  <p className="text-sm text-gray-600">
                    {workableDays} days × {currencySymbol}{rateConfig.dailyRate}/day
                  </p>
                )}
                {rateConfig.type === 'hourly' && rateConfig.hourlyRate && rateConfig.hoursPerDay && (
                  <p className="text-sm text-gray-600">
                    {workableDays} days × {rateConfig.hoursPerDay} hrs × {currencySymbol}{rateConfig.hourlyRate}/hr
                  </p>
                )}
              </div>
            </div>

            {/* Contribution Section */}
            <div className="border-t border-green-300 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="contribution">Contribution % (optional)</Label>
                  <Input
                    id="contribution"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    placeholder="0"
                    value={contributionPercentage ?? ''}
                    onChange={(e) => handleContributionPercentageChange(e.target.value)}
                    className="bg-white"
                  />
                  <p className="text-xs text-gray-600">
                    Percentage deducted from revenue
                  </p>
                </div>
                {contributionPercentage !== null && contributionPercentage > 0 && (
                  <>
                    <div className="space-y-2">
                      <Label className="text-lg">Contribution Amount</Label>
                      <div className="text-3xl font-bold text-orange-600">
                        {currencySymbol}{(expectedRevenue * contributionPercentage / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <p className="text-sm text-gray-600">
                        {contributionPercentage}% of revenue
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-lg">Net Remaining</Label>
                      <div className="text-3xl font-bold text-blue-600">
                        {currencySymbol}{(expectedRevenue * (1 - contributionPercentage / 100)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <p className="text-sm text-gray-600">
                        After {contributionPercentage}% contribution
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Month Agenda View */}
        {selectedMonth !== null && monthDays.length > 0 && (
          <MonthAgenda 
            year={year} 
            month={selectedMonth} 
            days={monthDays}
            onDayToggle={handleDayToggle}
            onClearMonth={handleClearMonth}
          />
        )}
      </div>

      {/* Options Dialog */}
      <OptionsDialog
        open={optionsOpen}
        onOpenChange={setOptionsOpen}
        options={options}
        onOptionsChange={handleOptionsChange}
      />

      {/* Options Button */}
      <OptionsButton onClick={() => setOptionsOpen(true)} />
    </div>
  );
}

export default App;
