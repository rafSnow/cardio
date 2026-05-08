import React from 'react';
import { Award } from 'lucide-react';

interface PRBadgeProps {
  label: string;
}

export const PRBadge: React.FC<PRBadgeProps> = ({ label }) => {
  return (
    <div className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-600 dark:text-amber-500 px-2 py-0.5 rounded-full border border-amber-500/30">
      <Award size={12} fill="currentColor" />
      <span className="text-[10px] font-black uppercase tracking-tighter">{label}</span>
    </div>
  );
};
