import { Session } from '../core/models/Session';
import { calcPace } from '../core/utils/calculations';
import { getStartOfDay, getEndOfDay } from '../core/utils/dateHelpers';

export interface DistanceData {
  date: string;
  distance: number;
  movingAverage: number | null;
}

export interface WeeklyVolumeData {
  week: string;
  distance: number;
}

export interface PaceData {
  date: string;
  pace: number;
  paceFormatted: string;
}

export interface WeekComparisonData {
  name: string;
  current: number;
  previous: number;
}

export interface MonthlyVolumeData {
  month: string;
  distance: number;
}

export interface HeatmapData {
  date: string;
  count: number;
  distance: number;
}

export interface PersonalRecords {
  maxDistance: number;
  bestPace: number;
  maxCalories: number;
}

export const insightsService = {
  getDistanceEvolution(sessions: Session[]): DistanceData[] {
    const sorted = [...sessions].sort((a, b) => a.date - b.date);
    const windowSize = 5;

    return sorted.map((session, index) => {
      const slice = sorted.slice(Math.max(0, index - windowSize + 1), index + 1);
      const avg = slice.reduce((acc, s) => acc + s.distance_km, 0) / slice.length;

      return {
        date: new Date(session.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        distance: session.distance_km,
        movingAverage: index >= windowSize - 1 ? parseFloat(avg.toFixed(2)) : null,
      };
    });
  },

  getWeeklyVolume(sessions: Session[]): WeeklyVolumeData[] {
    const weeks: Record<string, number> = {};

    sessions.forEach((s) => {
      const date = new Date(s.date);
      const firstDayOfWeek = new Date(date);
      const day = date.getDay();
      const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Monday
      firstDayOfWeek.setDate(diff);
      
      const key = firstDayOfWeek.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      weeks[key] = (weeks[key] || 0) + s.distance_km;
    });

    return Object.entries(weeks)
      .map(([week, distance]) => ({ week, distance: parseFloat(distance.toFixed(2)) }))
      .sort((a, b) => {
        const [dayA, monthA] = a.week.split('/').map(Number);
        const [dayB, monthB] = b.week.split('/').map(Number);
        return (monthA * 100 + dayA) - (monthB * 100 + dayB);
      });
  },

  getPaceEvolution(sessions: Session[]): PaceData[] {
    const sorted = [...sessions].sort((a, b) => a.date - b.date);

    return sorted.map((s) => {
      const pace = calcPace(s.duration_s, s.distance_km);
      const min = Math.floor(pace);
      const sec = Math.round((pace - min) * 60);
      
      return {
        date: new Date(s.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        pace: parseFloat(pace.toFixed(2)),
        paceFormatted: `${min}:${sec.toString().padStart(2, '0')}`,
      };
    });
  },

  getWeekComparison(sessions: Session[]): WeekComparisonData[] {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const startCurrentWeek = getStartOfDay(new Date(now.setDate(diff)));
    const startPrevWeek = getStartOfDay(new Date(new Date(startCurrentWeek).setDate(new Date(startCurrentWeek).getDate() - 7)));
    const endPrevWeek = getEndOfDay(new Date(new Date(startCurrentWeek).setDate(new Date(startCurrentWeek).getDate() - 1)));

    const currentSessions = sessions.filter(s => s.date >= startCurrentWeek);
    const prevSessions = sessions.filter(s => s.date >= startPrevWeek && s.date <= endPrevWeek);

    const currentDist = currentSessions.reduce((acc, s) => acc + s.distance_km, 0);
    const prevDist = prevSessions.reduce((acc, s) => acc + s.distance_km, 0);

    const currentCount = currentSessions.length;
    const prevCount = prevSessions.length;

    const currentCal = currentSessions.reduce((acc, s) => acc + s.calories, 0);
    const prevCal = prevSessions.reduce((acc, s) => acc + s.calories, 0);

    return [
      { name: 'Distância (km)', current: parseFloat(currentDist.toFixed(1)), previous: parseFloat(prevDist.toFixed(1)) },
      { name: 'Treinos', current: currentCount, previous: prevCount },
      { name: 'Calorias', current: currentCal, previous: prevCal },
    ];
  },

  getMonthlyVolume(sessions: Session[]): MonthlyVolumeData[] {
    const months: Record<string, number> = {};

    sessions.forEach((s) => {
      const date = new Date(s.date);
      const key = date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
      months[key] = (months[key] || 0) + s.distance_km;
    });

    return Object.entries(months).map(([month, distance]) => ({
      month,
      distance: parseFloat(distance.toFixed(1)),
    }));
  },

  getPersonalRecords(sessions: Session[]): PersonalRecords {
    if (sessions.length === 0) {
      return { maxDistance: 0, bestPace: 0, maxCalories: 0 };
    }

    const maxDistance = Math.max(...sessions.map(s => s.distance_km));
    const maxCalories = Math.max(...sessions.map(s => s.calories));
    
    const paces = sessions
      .map(s => calcPace(s.duration_s, s.distance_km))
      .filter(p => p > 0 && isFinite(p));
    
    const bestPace = paces.length > 0 ? Math.min(...paces) : 0;

    return {
      maxDistance: parseFloat(maxDistance.toFixed(2)),
      bestPace: parseFloat(bestPace.toFixed(2)),
      maxCalories,
    };
  },

  getHeatmapData(sessions: Session[]): HeatmapData[] {
    const data: Record<string, { count: number, distance: number }> = {};
    
    sessions.forEach(s => {
      const key = new Date(s.date).toISOString().split('T')[0];
      if (!data[key]) data[key] = { count: 0, distance: 0 };
      data[key].count += 1;
      data[key].distance += s.distance_km;
    });

    return Object.entries(data).map(([date, val]) => ({
      date,
      count: val.count,
      distance: parseFloat(val.distance.toFixed(1))
    }));
  }
};
