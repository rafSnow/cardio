import React from 'react';
import { WeeklyProgress } from '../../services/goalsService';
import { Calendar, Timer } from 'lucide-react';

interface WeeklySummaryCardProps {
  progress: WeeklyProgress;
}

export const WeeklySummaryCard: React.FC<WeeklySummaryCardProps> = ({ progress }) => {
  return (
    <div className="bg-card p-5 rounded-2xl border border-border shadow-sm flex flex-col gap-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Calendar size={18} />
        <span className="text-sm font-bold uppercase tracking-wider">Esta Semana</span>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <span className="text-3xl font-black text-foreground">
            {progress.sessionsCount} <span className="text-sm font-medium text-muted-foreground">/ {progress.goal}</span>
          </span>
          <span className="text-xs text-muted-foreground">Treinos realizados</span>
        </div>
        
        <div className="flex flex-col items-end">
          <span className="text-3xl font-black text-accent">
            {progress.totalDistance.toFixed(1)} <span className="text-sm font-medium text-muted-foreground">km</span>
          </span>
          <span className="text-xs text-muted-foreground">Distância total</span>
        </div>
      </div>
    </div>
  );
};
