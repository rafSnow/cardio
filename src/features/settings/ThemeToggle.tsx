import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center justify-between p-4 bg-card rounded-2xl border border-border shadow-sm">
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-bold">Modo Escuro</span>
        <span className="text-xs text-muted-foreground">Alternar visual do aplicativo</span>
      </div>
      
      <button
        onClick={toggleTheme}
        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none ${
          theme === 'dark' ? 'bg-accent' : 'bg-secondary'
        }`}
      >
        <span
          className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform duration-300 flex items-center justify-center ${
            theme === 'dark' ? 'translate-x-7' : 'translate-x-1'
          }`}
        >
          {theme === 'dark' ? (
            <Moon size={14} className="text-accent" />
          ) : (
            <Sun size={14} className="text-amber-500" />
          )}
        </span>
      </button>
    </div>
  );
};
