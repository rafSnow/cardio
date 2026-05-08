import { useMemo } from 'react';
import { Session } from '../core/models/Session';
import { streakService } from '../services/streakService';

export const useStreak = (sessions: Session[] | undefined) => {
  return useMemo(() => {
    if (!sessions) return { currentStreak: 0, longestStreak: 0 };
    
    return {
      currentStreak: streakService.calculateCurrentStreak(sessions),
      longestStreak: streakService.calculateLongestStreak(sessions),
    };
  }, [sessions]);
};
