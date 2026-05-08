import React from 'react';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Target } from 'lucide-react';

interface GoalProgressCardProps {
  percent: number;
  sessionsCount: number;
  goal: number;
}

export const GoalProgressCard: React.FC<GoalProgressCardProps> = ({ percent, sessionsCount, goal }) => {
  const isCompleted = sessionsCount >= goal;

  return (
    <div className="bg-card p-5 rounded-2xl border border-border shadow-sm flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Target size={18} />
          <span className="text-sm font-bold uppercase tracking-wider">Meta Semanal</span>
        </div>
        <span className={`text-sm font-bold ${isCompleted ? 'text-emerald-500' : 'text-foreground'}`}>
          {isCompleted ? 'Meta batida! 🎉' : `${percent.toFixed(0)}%`}
        </span>
      </div>
      
      <ProgressBar value={percent} colorClassName={isCompleted ? 'bg-emerald-500' : 'bg-accent'} />
      
      <p className="text-xs text-muted-foreground mt-1">
        {isCompleted 
          ? `Você superou sua meta de ${goal} treinos!` 
          : `Faltam ${goal - sessionsCount} treinos para atingir sua meta.`}
      </p>
    </div>
  );
};
