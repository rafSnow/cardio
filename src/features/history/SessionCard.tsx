import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Timer, Map, Zap, Flame } from 'lucide-react';
import { Session } from '@/core/models/Session';
import { formatRelativeDate } from '@/core/utils/dateHelpers';
import { formatPace, formatDuration } from '@/core/utils/calculations';

interface SessionCardProps {
  session: Session;
}

export const SessionCard: React.FC<SessionCardProps> = ({ session }) => {
  const navigate = useNavigate();

  const pace = session.duration_s / 60 / session.distance_km;

  return (
    <div 
      onClick={() => navigate(`/historico/${session.id}`)}
      className="bg-card border border-border p-4 rounded-xl shadow-sm active:scale-[0.98] transition-all cursor-pointer mb-3"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar size={14} />
          <span className="text-xs font-medium uppercase tracking-wider">
            {formatRelativeDate(session.date)}
          </span>
        </div>
        <div className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight">
          {session.distance_km.toFixed(2)} km
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-muted-foreground mb-0.5">
            <Timer size={12} />
            <span className="text-[10px] uppercase font-semibold">Tempo</span>
          </div>
          <span className="text-sm font-bold">{formatDuration(session.duration_s)}</span>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-muted-foreground mb-0.5">
            <Zap size={12} />
            <span className="text-[10px] uppercase font-semibold">Pace</span>
          </div>
          <span className="text-sm font-bold">{formatPace(pace)}</span>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-muted-foreground mb-0.5">
            <Flame size={12} />
            <span className="text-[10px] uppercase font-semibold">Cal</span>
          </div>
          <span className="text-sm font-bold">{session.calories}</span>
        </div>
      </div>
    </div>
  );
};
