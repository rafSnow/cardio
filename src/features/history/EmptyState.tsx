import React from 'react';
import { Ghost, Search } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: 'ghost' | 'search';
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, icon = 'ghost' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center animate-in fade-in zoom-in duration-500">
      <div className="bg-secondary p-6 rounded-full text-muted-foreground mb-6">
        {icon === 'search' ? <Search size={48} /> : <Ghost size={48} />}
      </div>
      <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-[260px] text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
};
