import React, { useState } from 'react';
import { TrendingUp, BarChart2 } from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { DistanceChart } from './DistanceChart';
import { WeeklyVolumeChart } from './WeeklyVolumeChart';
import { PaceChart } from './PaceChart';
import { WeekComparisonChart } from './WeekComparisonChart';
import { MonthlyVolumeChart } from './MonthlyVolumeChart';
import { StreakHeatmap } from './StreakHeatmap';
import { PRCards } from './PRCards';
import { EmptyState } from '../history/EmptyState';
import { useInsights, InsightsPeriod } from '@/hooks/useInsights';

import { InsightsSkeleton, Skeleton } from '@/components/ui/Skeleton';

const InsightsPage: React.FC = () => {
  const [period, setPeriod] = useState<InsightsPeriod>('30d');
  const insights = useInsights(period);

  const periods: { id: InsightsPeriod; label: string }[] = [
    { id: '30d', label: '30 dias' },
    { id: '90d', label: '90 dias' },
    { id: '12m', label: '12 meses' },
    { id: 'all', label: 'Tudo' },
  ];

  if (insights === undefined || insights === null) {
    return (
      <PageWrapper>
        <PageHeader title="Insights" icon={<TrendingUp size={24} />} />
        <div className="flex flex-col flex-1 px-4">
          <div className="py-4 mb-2">
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {periods.map((p) => (
                <Skeleton key={p.id} className="h-8 w-20 rounded-full" />
              ))}
            </div>
          </div>
          <InsightsSkeleton />
        </div>
      </PageWrapper>
    );
  }

  if (insights.sessionCount < 2) {
    return (
      <PageWrapper>
        <PageHeader title="Insights" icon={<TrendingUp size={24} />} />
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <EmptyState 
            title="Dados insuficientes" 
            description="Registre pelo menos 2 sessões para visualizar os gráficos e análises de desempenho." 
            icon="ghost"
          />
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <PageHeader title="Insights" icon={<TrendingUp size={24} />} />
      
      <div className="flex flex-col flex-1 px-4 pb-24">
        {/* Period Selector */}
        <div className="sticky top-0 z-20 bg-background/95 backdrop-blur py-4 mb-2">
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {periods.map((p) => (
              <Button
                key={p.id}
                variant={period === p.id ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setPeriod(p.id)}
                className="whitespace-nowrap rounded-full px-5"
              >
                {p.label}
              </Button>
            ))}
          </div>
        </div>

        {!insights ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
            <PRCards records={insights.personalRecords} />
            
            <StreakHeatmap data={insights.heatmapData} />

            <div className="grid grid-cols-1 gap-6">
              <WeekComparisonChart data={insights.weekComparison} />
              
              <DistanceChart data={insights.distanceEvolution} />
              
              <PaceChart data={insights.paceEvolution} />
              
              <WeeklyVolumeChart data={insights.weeklyVolume} />
              
              <MonthlyVolumeChart data={insights.monthlyVolume} />
            </div>

            <div className="mt-8 p-6 bg-secondary/30 rounded-2xl border border-dashed border-border flex flex-col items-center text-center">
              <BarChart2 className="text-muted-foreground mb-3" size={32} />
              <p className="text-sm text-muted-foreground leading-relaxed">
                Continue treinando para gerar mais dados e insights sobre sua evolução!
              </p>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default InsightsPage;
