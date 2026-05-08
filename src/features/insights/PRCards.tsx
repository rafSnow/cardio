import React from 'react';
import { Trophy, Zap, Flame } from 'lucide-react';
import { PersonalRecords } from '@/services/insightsService';
import { formatPace } from '@/core/utils/calculations';

interface PRCardsProps {
  records: PersonalRecords;
}

export const PRCards: React.FC<PRCardsProps> = ({ records }) => {
  return (
    <div className="grid grid-cols-1 gap-4 mb-6">
      <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
        Recordes Pessoais (Lifetime)
      </h3>
      
      <div className="grid grid-cols-3 gap-3">
        <PRCard 
          icon={<Trophy size={20} className="text-amber-500" />}
          label="Distância"
          value={`${records.maxDistance.toFixed(2)}`}
          unit="km"
        />
        <PRCard 
          icon={<Zap size={20} className="text-blue-500" />}
          label="Melhor Pace"
          value={formatPace(records.bestPace).replace(' /km', '')}
          unit="/km"
        />
        <PRCard 
          icon={<Flame size={20} className="text-rose-500" />}
          label="Calorias"
          value={`${records.maxCalories}`}
          unit="kcal"
        />
      </div>
    </div>
  );
};

const PRCard = ({ icon, label, value, unit }: { icon: React.ReactNode, label: string, value: string, unit: string }) => (
  <div className="bg-card border border-border rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
    <div className="bg-secondary/50 p-2 rounded-full mb-3">
      {icon}
    </div>
    <span className="text-[10px] uppercase font-bold text-muted-foreground mb-1">
      {label}
    </span>
    <div className="flex items-baseline gap-0.5">
      <span className="text-xl font-black text-foreground">{value}</span>
      <span className="text-[10px] font-bold text-muted-foreground">{unit}</span>
    </div>
  </div>
);
