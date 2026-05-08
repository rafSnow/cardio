import React from 'react';
import { Target } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

export const GoalSettings: React.FC = () => {
  const { settings, updateSetting } = useSettings();
  const currentGoal = settings.weekly_goal_sessions || 3;

  const handleGoalChange = (val: number) => {
    updateSetting('weekly_goal_sessions', val);
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-card rounded-2xl border border-border shadow-sm">
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 p-2 rounded-lg text-primary">
          <Target size={20} />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold">Meta Semanal</span>
          <span className="text-xs text-muted-foreground">Número de treinos por semana</span>
        </div>
      </div>

      <div className="flex justify-between items-center gap-2 mt-2">
        {[1, 2, 3, 4, 5, 6, 7].map((val) => (
          <button
            key={val}
            onClick={() => handleGoalChange(val)}
            className={`w-10 h-10 rounded-xl font-bold transition-all ${
              currentGoal === val
                ? 'bg-primary text-primary-foreground scale-110 shadow-md'
                : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
            }`}
          >
            {val}
          </button>
        ))}
      </div>
    </div>
  );
};
