import React from 'react';
import { ResponsiveContainer } from 'recharts';

interface BaseChartProps {
  children: React.ReactNode;
  height?: number | string;
  className?: string;
  title?: string;
}

export const BaseChart: React.FC<BaseChartProps> = ({ 
  children, 
  height = 300, 
  className = "",
  title
}) => {
  return (
    <div className={`bg-card border border-border rounded-2xl p-4 shadow-sm ${className}`}>
      {title && (
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-6">
          {title}
        </h3>
      )}
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          {children as any}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
