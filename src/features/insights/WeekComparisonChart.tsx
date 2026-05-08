import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { BaseChart } from '@/components/charts/BaseChart';
import { WeekComparisonData } from '@/services/insightsService';

interface WeekComparisonChartProps {
  data: WeekComparisonData[];
}

export const WeekComparisonChart: React.FC<WeekComparisonChartProps> = ({ data }) => {
  return (
    <BaseChart title="Semana Atual vs Anterior" className="mb-6">
      <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }} barGap={8}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
        <XAxis 
          dataKey="name" 
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
        <Legend 
          verticalAlign="top" 
          align="right" 
          iconType="circle"
          wrapperStyle={{ fontSize: '10px', paddingBottom: '20px' }}
        />
        <Bar 
          name="Semana Atual"
          dataKey="current" 
          fill="var(--accent)" 
          radius={[4, 4, 0, 0]} 
        />
        <Bar 
          name="Semana Anterior"
          dataKey="previous" 
          fill="var(--muted-foreground)" 
          radius={[4, 4, 0, 0]} 
        />
      </BarChart>
    </BaseChart>
  );
};
