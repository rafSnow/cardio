import { useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../core/db/database';
import { insightsService } from '../services/insightsService';
import { getLastNDaysRange } from '../core/utils/dateHelpers';

export type InsightsPeriod = '30d' | '90d' | '12m' | 'all';

export const useInsights = (period: InsightsPeriod) => {
  const range = useMemo(() => {
    if (period === 'all') return { start: 0, end: Date.now() };
    const days = period === '12m' ? 365 : parseInt(period.replace('d', ''));
    return getLastNDaysRange(days);
  }, [period]);

  const sessions = useLiveQuery(
    () => db.sessions.where('date').between(range.start, range.end, true, true).toArray(),
    [range]
  );

  const allSessions = useLiveQuery(() => db.sessions.toArray());

  return useMemo(() => {
    if (!sessions || !allSessions) return null;

    return {
      distanceEvolution: insightsService.getDistanceEvolution(sessions),
      weeklyVolume: insightsService.getWeeklyVolume(sessions),
      paceEvolution: insightsService.getPaceEvolution(sessions),
      weekComparison: insightsService.getWeekComparison(allSessions), // Always compare last 2 weeks regardless of filter
      monthlyVolume: insightsService.getMonthlyVolume(sessions),
      personalRecords: insightsService.getPersonalRecords(allSessions), // PRs are lifetime
      heatmapData: insightsService.getHeatmapData(allSessions), // Heatmap is lifetime
      sessionCount: sessions.length,
      isLoading: false
    };
  }, [sessions, allSessions]);
};
