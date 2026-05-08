import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { BaseChart } from '@/components/charts/BaseChart';
import { DistanceData } from '@/services/insightsService';

interface DistanceChartProps {
  data: DistanceData[];
}

export const DistanceChart: React.FC<DistanceChartProps> = ({ data }) => {
  return (
    <BaseChart title="Distância por Sessão" className="mb-6">
      <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
        <XAxis 
          dataKey="date" 
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
          contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px', fontSize: '12px' }}
          itemStyle={{ fontWeight: 'bold' }}
        />
        <Line 
          name="Distância (km)"
          type="monotone" 
          dataKey="distance" 
          stroke="var(--accent)" 
          strokeWidth={3}
          dot={{ fill: 'var(--accent)', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, strokeWidth: 0 }}
        />
        <Line 
          name="Média Móvel (5)"
          type="monotone" 
          dataKey="movingAverage" 
          stroke="var(--muted-foreground)" 
          strokeDasharray="5 5"
          dot={false}
          strokeWidth={2}
          connectNulls
        />
        <Legend 
          verticalAlign="top" 
          align="right" 
          iconType="circle"
          wrapperStyle={{ fontSize: '10px', paddingBottom: '20px' }}
        />
      </LineChart>
    </BaseChart>
  );
};
