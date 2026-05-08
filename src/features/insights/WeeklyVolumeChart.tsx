import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { BaseChart } from '@/components/charts/BaseChart';
import { WeeklyVolumeData } from '@/services/insightsService';

interface WeeklyVolumeChartProps {
  data: WeeklyVolumeData[];
}

export const WeeklyVolumeChart: React.FC<WeeklyVolumeChartProps> = ({ data }) => {
  return (
    <BaseChart title="Volume Semanal (km)" className="mb-6">
      <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
        <XAxis 
          dataKey="week" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} 
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} 
        />
        <Tooltip 
          cursor={{ fill: 'var(--secondary)', opacity: 0.4 }}
          contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px', fontSize: '12px' }}
          itemStyle={{ fontWeight: 'bold' }}
        />
        <Bar 
          dataKey="distance" 
          fill="var(--accent)" 
          radius={[4, 4, 0, 0]} 
          barSize={30}
        />
      </BarChart>
    </BaseChart>
  );
};
