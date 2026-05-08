import React from 'react';

interface ProgressBarProps {
  value: number; // 0 to 100
  className?: string;
  colorClassName?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ value, className = "", colorClassName = "bg-accent" }) => {
  return (
    <div className={`w-full h-3 bg-secondary rounded-full overflow-hidden ${className}`}>
      <div 
        className={`h-full transition-all duration-500 ease-out ${colorClassName}`} 
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
};
