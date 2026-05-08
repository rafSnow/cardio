import React, { useMemo } from 'react';
import { CheckCircle2, XCircle, Calendar } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/core/db/database';
import { goalsService } from '@/services/goalsService';
import { useSettings } from '@/context/SettingsContext';

export const GoalHistory: React.FC = () => {
  const { settings } = useSettings();
  const sessions = useLiveQuery(() => db.sessions.toArray());
  const weeklyGoal = settings.weekly_goal_sessions || 3;

  const history = useMemo(() => {
    if (!sessions) return [];
    return goalsService.getGoalHistory(sessions, weeklyGoal, 4);
  }, [sessions, weeklyGoal]);

  if (history.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xs font-bold uppercase text-muted-foreground ml-1">Histórico de Metas</h3>
      
      <div className="flex flex-col gap-2">
        {history.map((week, idx) => (
          <div 
            key={idx}
            className="flex items-center justify-between p-4 bg-card border border-border rounded-2xl shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${week.met ? 'bg-green-500/10 text-green-500' : 'bg-rose-500/10 text-rose-500'}`}>
                {week.met ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold">
                  {idx === 0 ? 'Esta Semana' : idx === 1 ? 'Semana Passada' : `Semana de ${week.start.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}`}
                </span>
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                  {week.count} de {week.goal} treinos
                </span>
              </div>
            </div>
            
            <div className="flex flex-col items-end">
              <span className={`text-xs font-black uppercase ${week.met ? 'text-green-500' : 'text-rose-500'}`}>
                {week.met ? 'Batida' : 'Não batida'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
