import { Session } from '../core/models/Session';

export const streakService = {
  calculateCurrentStreak(sessions: Session[]): number {
    if (sessions.length === 0) return 0;

    // Get unique days with sessions (formatted as YYYY-MM-DD for easy comparison)
    const sessionDays = new Set(
      sessions.map(s => new Date(s.date).toISOString().split('T')[0])
    );

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    // If no session today AND no session yesterday, streak is broken
    if (!sessionDays.has(todayStr) && !sessionDays.has(yesterdayStr)) {
      return 0;
    }

    let streak = 0;
    const current = new Date();
    
    // If today has no session but yesterday did, we start counting from yesterday
    if (!sessionDays.has(todayStr) && sessionDays.has(yesterdayStr)) {
      current.setDate(current.getDate() - 1);
    }

    while (true) {
      const dateStr = current.toISOString().split('T')[0];
      if (sessionDays.has(dateStr)) {
        streak++;
        current.setDate(current.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  },

  calculateLongestStreak(sessions: Session[]): number {
    if (sessions.length === 0) return 0;

    const sessionDays = Array.from(new Set(
      sessions.map(s => new Date(s.date).toISOString().split('T')[0])
    )).sort();

    if (sessionDays.length === 0) return 0;

    let longest = 0;
    let current = 1;

    for (let i = 1; i < sessionDays.length; i++) {
      const prevDate = new Date(sessionDays[i - 1]);
      const currDate = new Date(sessionDays[i]);
      
      // Check if dates are consecutive
      const diffTime = Math.abs(currDate.getTime() - prevDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        current++;
      } else {
        longest = Math.max(longest, current);
        current = 1;
      }
    }

    return Math.max(longest, current);
  }
};
