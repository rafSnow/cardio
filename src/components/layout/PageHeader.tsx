import React from 'react';

interface PageHeaderProps {
  title: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, icon, action }) => {
  return (
    <header className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        {icon && <div className="text-primary">{icon}</div>}
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
      </div>
      {action && <div>{action}</div>}
    </header>
  );
};
