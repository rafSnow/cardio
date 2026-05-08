import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, PlusCircle, History, BarChart3, Settings } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const BottomNav: React.FC = () => {
  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/historico', icon: History, label: 'Histórico' },
    { to: '/novo', icon: PlusCircle, label: 'Novo', primary: true },
    { to: '/insights', icon: BarChart3, label: 'Insights' },
    { to: '/configuracoes', icon: Settings, label: 'Config' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 py-2 pb-safe-area-inset-bottom z-50">
      <div className="max-w-md mx-auto flex justify-between items-end">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            aria-label={item.label}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-1 min-w-[64px] transition-colors",
                item.primary ? "mb-2" : "mb-1",
                isActive ? "text-accent" : "text-muted-foreground"
              )
            }
          >
            {item.primary ? (
              <div className="bg-primary text-primary-foreground p-3 rounded-full shadow-lg active:scale-95 transition-transform">
                <item.icon size={28} />
              </div>
            ) : (
              <item.icon size={24} />
            )}
            <span className="text-[10px] font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
