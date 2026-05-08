import { Session } from '../core/models/Session';
import { calcPace } from '../core/utils/calculations';

export interface WeeklyProgress {
  sessionsCount: number;
  totalDistance: number;
  goal: number;
  percent: number;
}

export interface PersonalRecords {
  maxDistance: number;
  bestPace: number; // lowest is best
  maxCalories: number;
}

export const goalsService = {
  getStartOfWeek(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when Sunday
    const monday = new Date(d.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday;
  },

  getWeeklyProgress(sessions: Session[], weeklyGoal: number): WeeklyProgress {
    const startOfWeek = this.getStartOfWeek(new Date());
    const weekSessions = sessions.filter(s => s.date >= startOfWeek.getTime());

    const sessionsCount = weekSessions.length;
    const totalDistance = weekSessions.reduce((acc, s) => acc + s.distance_km, 0);
    
    return {
      sessionsCount,
      totalDistance,
      goal: weeklyGoal,
      percent: Math.min(100, (sessionsCount / weeklyGoal) * 100)
    };
  },

  getPersonalRecords(sessions: Session[]): PersonalRecords {
    if (sessions.length === 0) {
      return { maxDistance: 0, bestPace: 0, maxCalories: 0 };
    }

    return sessions.reduce((acc, s) => {
      const pace = calcPace(s.duration_s, s.distance_km);
      
      return {
        maxDistance: Math.max(acc.maxDistance, s.distance_km),
        bestPace: acc.bestPace === 0 ? pace : Math.min(acc.bestPace, pace),
        maxCalories: Math.max(acc.maxCalories, s.calories)
      };
    }, { maxDistance: 0, bestPace: 0, maxCalories: 0 });
  },

  checkIfSessionIsPR(session: Session, previousSessions: Session[]): { distance: boolean, pace: boolean, calories: boolean } {
    if (previousSessions.length === 0) {
      return { distance: true, pace: true, calories: true };
    }

    const records = this.getPersonalRecords(previousSessions);
    const sessionPace = calcPace(session.duration_s, session.distance_km);

    return {
      distance: session.distance_km > records.maxDistance,
      pace: records.bestPace === 0 || sessionPace < records.bestPace,
      calories: session.calories > records.maxCalories
    };
  },

  getGoalHistory(sessions: Session[], weeklyGoal: number, weeksCount = 4) {
    const history = [];
    const now = new Date();
    
    for (let i = 0; i < weeksCount; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() - (i * 7));
      const startOfWeek = this.getStartOfWeek(d);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);

      const weekSessions = sessions.filter(s => s.date >= startOfWeek.getTime() && s.date <= endOfWeek.getTime());
      
      history.push({
        start: startOfWeek,
        end: endOfWeek,
        count: weekSessions.length,
        goal: weeklyGoal,
        met: weekSessions.length >= weeklyGoal
      });
    }

    return history;
  }
};
