import { useMemo } from 'react';
import { Session } from '../core/models/Session';
import { goalsService, WeeklyProgress, PersonalRecords } from '../services/goalsService';
import { useSettings } from '../context/SettingsContext';

export const useGoals = (sessions: Session[] | undefined) => {
  const { settings } = useSettings();
  const weeklyGoal = settings.weekly_goal_sessions || 3;

  return useMemo(() => {
    if (!sessions) return { 
      weeklyProgress: { sessionsCount: 0, totalDistance: 0, goal: weeklyGoal, percent: 0 },
      personalRecords: { maxDistance: 0, bestPace: 0, maxCalories: 0 }
    };

    return {
      weeklyProgress: goalsService.getWeeklyProgress(sessions, weeklyGoal),
      personalRecords: goalsService.getPersonalRecords(sessions)
    };
  }, [sessions, weeklyGoal]);
};
