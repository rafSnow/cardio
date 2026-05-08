import React, { useMemo } from 'react';
import { HeatmapData } from '@/services/insightsService';

interface StreakHeatmapProps {
  data: HeatmapData[];
}

export const StreakHeatmap: React.FC<StreakHeatmapProps> = ({ data }) => {
  const weeks = 12; // Show last 12 weeks
  const days = 7;
  
  const grid = useMemo(() => {
    const today = new Date();
    const result = [];
    
    // Fill from today backwards
    for (let i = 0; i < weeks * days; i++) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const iso = d.toISOString().split('T')[0];
      const session = data.find(s => s.date === iso);
      
      result.unshift({
        date: iso,
        count: session?.count || 0,
        distance: session?.distance || 0
      });
    }
    return result;
  }, [data]);

  const getColor = (count: number) => {
    if (count === 0) return 'bg-secondary';
    if (count === 1) return 'bg-accent/40';
    if (count === 2) return 'bg-accent/70';
    return 'bg-accent';
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-4 shadow-sm mb-6 overflow-x-auto">
      <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">
        Consistência (Últimos 3 meses)
      </h3>
      <div className="flex flex-col gap-1 min-w-[320px]">
        <div className="grid grid-flow-col grid-rows-7 gap-1">
          {grid.map((day, i) => (
            <div
              key={day.date}
              title={`${day.date}: ${day.count} treinos, ${day.distance}km`}
              className={`w-3 h-3 rounded-sm transition-colors ${getColor(day.count)}`}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2 text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">
          <span>Mais antigo</span>
          <span>Hoje</span>
        </div>
      </div>
    </div>
  );
};
