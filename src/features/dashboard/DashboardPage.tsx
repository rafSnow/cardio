import React from 'react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { PageHeader } from '@/components/layout/PageHeader';
import { LayoutDashboard, PlusCircle, Rocket } from 'lucide-react';
import { useSessions } from '@/hooks/useSessions';
import { useStreak } from '@/hooks/useStreak';
import { useGoals } from '@/hooks/useGoals';
import { WeeklySummaryCard } from './WeeklySummaryCard';
import { GoalProgressCard } from './GoalProgressCard';
import { StreakCard } from './StreakCard';
import { LastSessionCard } from './LastSessionCard';
import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';

import { DashboardSkeleton } from '@/components/ui/Skeleton';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { sessions } = useSessions();
  const { currentStreak, longestStreak } = useStreak(sessions || []);
  const { weeklyProgress } = useGoals(sessions || []);

  const lastSession = sessions && sessions.length > 0 ? sessions[0] : null;
  const previousSessions = sessions && sessions.length > 1 ? sessions.slice(1) : [];

  if (sessions === undefined) {
    return (
      <PageWrapper>
        <PageHeader title="Dashboard" icon={<LayoutDashboard size={24} />} />
        <DashboardSkeleton />
      </PageWrapper>
    );
  }

  const isEmpty = sessions.length === 0;

  return (
    <PageWrapper>
      <PageHeader title="Dashboard" icon={<LayoutDashboard size={24} />} />
      
      {isEmpty ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 gap-6 animate-in fade-in zoom-in duration-500">
          <div className="bg-accent/10 p-6 rounded-full text-accent">
            <Rocket size={64} />
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-black text-foreground">Bem-vindo ao TreadLog!</h2>
            <p className="text-muted-foreground max-w-[280px]">
              Ainda não temos treinos registrados. Que tal começar seu primeiro cardio hoje?
            </p>
          </div>
          <Button 
            className="w-full h-14 text-lg gap-2" 
            onClick={() => navigate('/novo')}
          >
            <PlusCircle size={20} />
            Registrar Primeiro Treino
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <StreakCard 
            currentStreak={currentStreak} 
            longestStreak={longestStreak} 
          />
          
          <WeeklySummaryCard 
            progress={weeklyProgress} 
          />
          
          <GoalProgressCard 
            percent={weeklyProgress.percent} 
            sessionsCount={weeklyProgress.sessionsCount} 
            goal={weeklyProgress.goal} 
          />
          
          {lastSession && (
            <LastSessionCard 
              session={lastSession} 
              previousSessions={previousSessions} 
            />
          )}
        </div>
      )}
    </PageWrapper>
  );
};

export default DashboardPage;
