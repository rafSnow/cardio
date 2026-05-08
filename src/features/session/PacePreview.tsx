import React from 'react';
import { calcPace, calcSpeed, formatPace } from '../../core/utils/calculations';
import { Timer, Zap } from 'lucide-react';

interface PacePreviewProps {
  distance_km: number;
  duration_s: number;
}

export const PacePreview: React.FC<PacePreviewProps> = ({ distance_km, duration_s }) => {
  const pace = calcPace(duration_s, distance_km);
  const speed = calcSpeed(duration_s, distance_km);

  const isValid = distance_km > 0 && duration_s > 0;

  return (
    <div className="grid grid-cols-2 gap-4 mt-2">
      <div className="bg-accent/10 border border-accent/20 p-4 rounded-xl flex flex-col items-center justify-center gap-1">
        <div className="flex items-center gap-1.5 text-accent">
          <Timer size={16} />
          <span className="text-[10px] uppercase font-bold">Pace Médio</span>
        </div>
        <span className="text-xl font-black text-accent">
          {isValid ? formatPace(pace) : '--:-- /km'}
        </span>
      </div>
      
      <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex flex-col items-center justify-center gap-1">
        <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-500">
          <Zap size={16} />
          <span className="text-[10px] uppercase font-bold">Velocidade</span>
        </div>
        <span className="text-xl font-black text-amber-600 dark:text-amber-500">
          {isValid ? `${speed.toFixed(1)} km/h` : '0.0 km/h'}
        </span>
      </div>
    </div>
  );
};
