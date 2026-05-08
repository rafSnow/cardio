import React from 'react';
import { Session } from '../../core/models/Session';
import { PRBadge } from './PRBadge';
import { goalsService } from '../../services/goalsService';
import { formatDuration, formatPace, calcPace } from '../../core/utils/calculations';
import { History, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LastSessionCardProps {
  session: Session;
  previousSessions: Session[];
}

export const LastSessionCard: React.FC<LastSessionCardProps> = ({ session, previousSessions }) => {
  const prs = goalsService.checkIfSessionIsPR(session, previousSessions);
  const pace = calcPace(session.duration_s, session.distance_km);

  return (
    <Link 
      to={`/historico/${session.id}`}
      className="bg-card p-5 rounded-2xl border border-border shadow-sm flex flex-col gap-4 hover:border-accent/50 transition-colors active:scale-[0.98]"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-muted-foreground">
          <History size={18} />
          <span className="text-sm font-bold uppercase tracking-wider">Último Treino</span>
        </div>
        <ChevronRight size={18} className="text-muted-foreground" />
      </div>
      
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-black text-foreground">
            {session.distance_km.toFixed(2)} <span className="text-sm font-medium text-muted-foreground">km</span>
          </span>
          <span className="text-sm font-medium text-muted-foreground">
            {new Date(session.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
          </span>
        </div>
        
        <div className="flex items-center gap-4 text-sm font-bold text-muted-foreground">
          <span>{formatDuration(session.duration_s)}</span>
          <span>{formatPace(pace)}</span>
          <span>{session.calories} kcal</span>
        </div>
      </div>

      {(prs.distance || prs.pace || prs.calories) && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
          {prs.distance && <PRBadge label="Recorde Distância" />}
          {prs.pace && <PRBadge label="Melhor Pace" />}
          {prs.calories && <PRBadge label="Recorde Calorias" />}
        </div>
      )}
    </Link>
  );
};
