import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { BaseChart } from '@/components/charts/BaseChart';
import { PaceData } from '@/services/insightsService';

interface PaceChartProps {
  data: PaceData[];
}

export const PaceChart: React.FC<PaceChartProps> = ({ data }) => {
  const formatPaceTick = (value: number) => {
    const min = Math.floor(value);
    const sec = Math.round((value - min) * 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <BaseChart title="Evolução de Pace (min/km)" className="mb-6">
      <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
        <XAxis 
          dataKey="date" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} 
        />
        <YAxis 
          domain={['auto', 'auto']}
          reversed // Lower pace is better
          axisLine={false} 
          tickLine={false} 
          tickFormatter={formatPaceTick}
          tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} 
        />
        <Tooltip 
          contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px', fontSize: '12px' }}
          formatter={(value: any) => [formatPaceTick(Number(value)), 'Pace']}
          itemStyle={{ fontWeight: 'bold' }}
        />
        <Line 
          type="monotone" 
          dataKey="pace" 
          stroke="var(--accent)" 
          strokeWidth={3}
          dot={{ fill: 'var(--accent)', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, strokeWidth: 0 }}
        />
      </LineChart>
    </BaseChart>
  );
};
