import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { History } from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { PageHeader } from '@/components/layout/PageHeader';
import { SessionCard } from './SessionCard';
import { FilterBar, FilterPeriod } from './FilterBar';
import { EmptyState } from './EmptyState';
import { sessionRepository } from '@/repositories/sessionRepository';
import { db } from '@/core/db/database';
import { 
  getLastNDaysRange, 
  fromISODate, 
  toISODate
} from '@/core/utils/dateHelpers';
import { formatPace } from '@/core/utils/calculations';

const ITEMS_PER_PAGE = 20;

import { HistorySkeleton } from '@/components/ui/Skeleton';

const HistoryPage: React.FC = () => {
  const [period, setPeriod] = useState<FilterPeriod>('30d');
  const [customRange, setCustomRange] = useState({
    start: toISODate(new Date().setDate(new Date().getDate() - 7)),
    end: toISODate(new Date().getTime()),
  });
  const [limit, setLimit] = useState(ITEMS_PER_PAGE);
  const observerTarget = useRef<HTMLDivElement>(null);

  const range = useMemo(() => {
    if (period === 'custom') {
      return {
        start: fromISODate(customRange.start),
        end: fromISODate(customRange.end, true),
      };
    }
    const days = parseInt(period.replace('d', ''));
    return getLastNDaysRange(days);
  }, [period, customRange]);

  // Query for paginated sessions
  const sessions = useLiveQuery(
    () => sessionRepository.getByDateRange(range.start, range.end, 0, limit),
    [range, limit]
  );

  // Query for all filtered sessions to calculate totals
  const allFilteredSessions = useLiveQuery(
    () => db.sessions.where('date').between(range.start, range.end, true, true).toArray(),
    [range]
  );

  const totals = useMemo(() => {
    if (!allFilteredSessions) return { distance: 0, count: 0, avgPace: 0 };
    const count = allFilteredSessions.length;
    const distance = allFilteredSessions.reduce((acc, s) => acc + s.distance_km, 0);
    const totalSeconds = allFilteredSessions.reduce((acc, s) => acc + s.duration_s, 0);
    const avgPace = distance > 0 ? (totalSeconds / 60) / distance : 0;
    return { distance, count, avgPace };
  }, [allFilteredSessions]);

  const hasMore = useMemo(() => {
    if (!allFilteredSessions || !sessions) return false;
    return allFilteredSessions.length > sessions.length;
  }, [allFilteredSessions, sessions]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setLimit((prev) => prev + ITEMS_PER_PAGE);
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore]);

  // Reset limit when period changes
  useEffect(() => {
    setLimit(ITEMS_PER_PAGE);
  }, [period]);

  const isLoading = sessions === undefined;

  return (
    <PageWrapper>
      <PageHeader title="Histórico" icon={<History size={24} />} />
      
      <div className="flex flex-col flex-1 px-4">
        {/* Sticky Header with Totals and Filters */}
        <div className="sticky top-0 z-30 bg-background pt-2 pb-1">
          {/* Totals Card */}
          <div className="bg-secondary/20 border border-border rounded-2xl p-4 mb-4 grid grid-cols-3 gap-2 backdrop-blur-sm">
            <div className="flex flex-col items-center justify-center text-center">
              <span className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Distância</span>
              <div className="flex items-baseline gap-0.5">
                <span className="text-xl font-black text-primary">{totals.distance.toFixed(1)}</span>
                <span className="text-[10px] font-bold text-muted-foreground">km</span>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center text-center border-x border-border/50 px-2">
              <span className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Treinos</span>
              <span className="text-xl font-black">{totals.count}</span>
            </div>
            <div className="flex flex-col items-center justify-center text-center">
              <span className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Pace Médio</span>
              <span className="text-xl font-black">{formatPace(totals.avgPace)}</span>
            </div>
          </div>

          <FilterBar
            activePeriod={period}
            onPeriodChange={setPeriod}
            customRange={customRange}
            onCustomRangeChange={setCustomRange}
          />
        </div>

        {/* Sessions List */}
        <div className="flex-1 pb-10">
          {isLoading ? (
            <HistorySkeleton />
          ) : sessions.length === 0 ? (
            <EmptyState 
              title="Nenhuma sessão encontrada" 
              description={period === 'custom' ? 'Tente mudar o intervalo de datas.' : 'Tente um período mais longo.'}
              icon="search"
            />
          ) : (
            <>
              {sessions?.map((session) => (
                <SessionCard key={session.id} session={session} />
              ))}
              
              {/* Pagination loader target */}
              <div ref={observerTarget} className="h-10 flex items-center justify-center">
                {hasMore && (
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default HistoryPage;
