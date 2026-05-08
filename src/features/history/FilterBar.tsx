import React, { useState } from 'react';
import { Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toISODate } from '@/core/utils/dateHelpers';

export type FilterPeriod = '7d' | '30d' | '90d' | 'custom';

interface FilterBarProps {
  activePeriod: FilterPeriod;
  onPeriodChange: (period: FilterPeriod) => void;
  customRange: { start: string; end: string };
  onCustomRangeChange: (range: { start: string; end: string }) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  activePeriod,
  onPeriodChange,
  customRange,
  onCustomRangeChange,
}) => {
  const [showCustom, setShowCustom] = useState(activePeriod === 'custom');

  const handlePeriodClick = (period: FilterPeriod) => {
    onPeriodChange(period);
    if (period !== 'custom') {
      setShowCustom(false);
    } else {
      setShowCustom(!showCustom);
    }
  };

  return (
    <div className="flex flex-col gap-3 mb-6 sticky top-0 z-20 bg-background/95 backdrop-blur py-2">
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: '7d', label: '7 dias' },
          { id: '30d', label: '30 dias' },
          { id: '90d', label: '90 dias' },
          { id: 'custom', label: 'Personalizado' },
        ].map((period) => (
          <Button
            key={period.id}
            variant={activePeriod === period.id ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => handlePeriodClick(period.id as FilterPeriod)}
            className="whitespace-nowrap rounded-full px-4"
          >
            {period.id === 'custom' && <Calendar size={14} className="mr-1.5" />}
            {period.label}
            {period.id === 'custom' && (
              showCustom ? <ChevronUp size={14} className="ml-1.5" /> : <ChevronDown size={14} className="ml-1.5" />
            )}
          </Button>
        ))}
      </div>

      {showCustom && activePeriod === 'custom' && (
        <div className="grid grid-cols-2 gap-3 p-4 bg-secondary/30 rounded-xl border border-border animate-in slide-in-from-top-2 duration-300">
          <Input
            type="date"
            label="Início"
            value={customRange.start}
            onChange={(e) => onCustomRangeChange({ ...customRange, start: e.target.value })}
            className="h-10 text-xs"
          />
          <Input
            type="date"
            label="Fim"
            value={customRange.end}
            onChange={(e) => onCustomRangeChange({ ...customRange, end: e.target.value })}
            className="h-10 text-xs"
          />
        </div>
      )}
    </div>
  );
};
