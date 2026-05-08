import React from 'react';
import { Flame, Trophy } from 'lucide-react';

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
}

export const StreakCard: React.FC<StreakCardProps> = ({ currentStreak, longestStreak }) => {
  return (
    <div className="bg-orange-500/10 border border-orange-500/20 p-5 rounded-2xl shadow-sm flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="bg-orange-500 text-white p-3 rounded-xl shadow-lg shadow-orange-500/30">
          <Flame size={24} fill="currentColor" />
        </div>
        <div className="flex flex-col">
          <span className="text-3xl font-black text-orange-600 dark:text-orange-500">
            {currentStreak} <span className="text-sm font-medium">dias</span>
          </span>
          <span className="text-xs font-bold uppercase text-orange-700/70 dark:text-orange-400/70 tracking-wider">
            Streak Atual
          </span>
        </div>
      </div>
      
      <div className="flex flex-col items-end gap-1">
        <div className="flex items-center gap-1 text-orange-800/50 dark:text-orange-300/50">
          <Trophy size={14} />
          <span className="text-[10px] font-bold uppercase">Recorde</span>
        </div>
        <span className="text-lg font-bold text-orange-700 dark:text-orange-400">
          {longestStreak}
        </span>
      </div>
    </div>
  );
};
