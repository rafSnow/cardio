import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({ children, className }) => {
  return (
    <main className={cn(
      "min-h-screen pb-24 pt-4 px-4 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300", 
      className
    )}>
      {children}
    </main>
  );
};
