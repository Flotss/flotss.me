import { formatMonthYear, parseDateToValue } from '@/utils/DateUtils';
import React, { useMemo } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';

interface MonthYearPickerProps {
  value: string;
  onChange: (formattedValue: string) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
}

const MONTHS = [
  { value: 1, label: '01 - January' },
  { value: 2, label: '02 - February' },
  { value: 3, label: '03 - March' },
  { value: 4, label: '04 - April' },
  { value: 5, label: '05 - May' },
  { value: 6, label: '06 - June' },
  { value: 7, label: '07 - July' },
  { value: 8, label: '08 - August' },
  { value: 9, label: '09 - September' },
  { value: 10, label: '10 - October' },
  { value: 11, label: '11 - November' },
  { value: 12, label: '12 - December' },
];

export default function MonthYearPicker({
  value,
  onChange,
  disabled = false,
  label,
  className = '',
}: MonthYearPickerProps) {
  // Parse current value
  const parsed = useMemo(() => {
    if (!value || value.toLowerCase() === 'present') {
      const now = new Date();
      return { month: now.getMonth() + 1, year: now.getFullYear() };
    }
    const valNum = parseDateToValue(value);
    if (valNum > 0 && valNum < 900000) {
      const year = Math.floor(valNum / 100);
      const month = valNum % 100;
      return { month, year };
    }
    const currentYear = new Date().getFullYear();
    return { month: 1, year: currentYear };
  }, [value]);

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const minYear = Math.min(parsed.year, currentYear - 10, 2015);
    const maxYear = Math.max(parsed.year, currentYear + 8, 2032);
    return Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i);
  }, [parsed.year]);

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = parseInt(e.target.value, 10);
    onChange(formatMonthYear(newMonth, parsed.year));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = parseInt(e.target.value, 10);
    onChange(formatMonthYear(parsed.month, newYear));
  };

  const isPresent = value?.toLowerCase() === 'present';

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && <label className="block text-[11px] font-medium text-zinc-400">{label}</label>}

      {disabled || isPresent ? (
        <div className="flex h-[38px] items-center gap-2 rounded-xl border border-white/10 bg-zinc-950/50 px-3 text-xs text-zinc-500">
          <FaCalendarAlt className="h-3 w-3 text-zinc-600" />
          <span>{isPresent ? 'Present (Active Position)' : 'Disabled'}</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          {/* Month Selector */}
          <div className="relative flex-1">
            <select
              value={parsed.month}
              onChange={handleMonthChange}
              disabled={disabled}
              aria-label="Month selection"
              className="w-full appearance-none rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 pr-7 text-xs text-zinc-200 transition-colors focus:border-emerald-500/50 focus:outline-none"
            >
              {MONTHS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500">
              <FaCalendarAlt className="h-2.5 w-2.5" />
            </div>
          </div>

          {/* Year Selector */}
          <div className="relative w-28 flex-shrink-0">
            <select
              value={parsed.year}
              onChange={handleYearChange}
              disabled={disabled}
              aria-label="Year selection"
              className="w-full appearance-none rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 pr-6 text-xs font-medium text-zinc-200 transition-colors focus:border-emerald-500/50 focus:outline-none"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-zinc-500">
              ▼
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
