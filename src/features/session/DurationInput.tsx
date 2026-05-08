import React, { useState, useEffect } from 'react';
import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface DurationInputProps {
  value: number; // seconds
  onChange: (value: number) => void;
  error?: string;
}

export const DurationInput: React.FC<DurationInputProps> = ({ value, onChange, error }) => {
  const [h, setH] = useState(Math.floor(value / 3600));
  const [m, setM] = useState(Math.floor((value % 3600) / 60));
  const [s, setS] = useState(value % 60);

  useEffect(() => {
    setH(Math.floor(value / 3600));
    setM(Math.floor((value % 3600) / 60));
    setS(value % 60);
  }, [value]);

  const update = (newH: number, newM: number, newS: number) => {
    const total = newH * 3600 + newM * 60 + newS;
    onChange(total);
  };

  const adjust = (type: 'h' | 'm' | 's', amount: number) => {
    if (type === 'h') {
      const next = Math.max(0, h + amount);
      update(next, m, s);
    } else if (type === 'm') {
      let next = m + amount;
      let nextH = h;
      if (next >= 60) {
        next = 0;
        nextH++;
      } else if (next < 0) {
        if (nextH > 0) {
          next = 59;
          nextH--;
        } else {
          next = 0;
        }
      }
      update(nextH, next, s);
    } else {
      let next = s + amount;
      let nextM = m;
      let nextH = h;
      if (next >= 60) {
        next = 0;
        nextM++;
        if (nextM >= 60) {
          nextM = 0;
          nextH++;
        }
      } else if (next < 0) {
        if (nextM > 0 || nextH > 0) {
          next = 59;
          nextM--;
          if (nextM < 0) {
            nextM = 59;
            nextH--;
          }
        } else {
          next = 0;
        }
      }
      update(nextH, nextM, next);
    }
  };

  const handleInputChange = (type: 'h' | 'm' | 's', val: string) => {
    const num = parseInt(val.replace(/\D/g, '')) || 0;
    if (type === 'h') update(Math.min(99, num), m, s);
    if (type === 'm') update(h, Math.min(59, num), s);
    if (type === 's') update(h, m, Math.min(59, num));
  };

  const InputField = ({ label, val, type }: { label: string; val: number; type: 'h' | 'm' | 's' }) => (
    <div className="flex flex-col items-center gap-2">
      <span className="text-[10px] uppercase font-bold text-muted-foreground">{label}</span>
      <div className="flex flex-col items-center gap-1">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="h-8 w-10 p-0"
          onClick={() => adjust(type, 1)}
        >
          <Plus size={14} />
        </Button>
        <input
          type="text"
          inputMode="numeric"
          value={val.toString().padStart(2, '0')}
          onChange={(e) => handleInputChange(type, e.target.value)}
          className="w-12 h-10 text-center text-xl font-bold bg-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="h-8 w-10 p-0"
          onClick={() => adjust(type, -1)}
        >
          <Minus size={14} />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-foreground ml-1">Duração</label>
      <div className={`flex items-center justify-center gap-4 p-4 bg-card border rounded-xl shadow-sm ${error ? 'border-rose-500' : 'border-input'}`}>
        <InputField label="Hrs" val={h} type="h" />
        <span className="text-2xl font-bold mt-6">:</span>
        <InputField label="Min" val={m} type="m" />
        <span className="text-2xl font-bold mt-6">:</span>
        <InputField label="Seg" val={s} type="s" />
      </div>
      {error && <span className="text-xs font-medium text-rose-500 ml-1">{error}</span>}
    </div>
  );
};
