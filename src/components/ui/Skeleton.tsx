import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted/50", className)}
      {...props}
    />
  );
};

export const DashboardSkeleton = () => (
  <div className="flex flex-col gap-4">
    <Skeleton className="h-32 w-full rounded-2xl" />
    <Skeleton className="h-40 w-full rounded-2xl" />
    <Skeleton className="h-24 w-full rounded-2xl" />
    <Skeleton className="h-48 w-full rounded-2xl" />
  </div>
);

export const HistorySkeleton = () => (
  <div className="flex flex-col gap-3">
    {[1, 2, 3, 4, 5].map((i) => (
      <Skeleton key={i} className="h-28 w-full rounded-2xl" />
    ))}
  </div>
);

export const InsightsSkeleton = () => (
  <div className="flex flex-col gap-6">
    <div className="grid grid-cols-3 gap-3">
      <Skeleton className="h-24 w-full rounded-2xl" />
      <Skeleton className="h-24 w-full rounded-2xl" />
      <Skeleton className="h-24 w-full rounded-2xl" />
    </div>
    <Skeleton className="h-40 w-full rounded-2xl" />
    <Skeleton className="h-64 w-full rounded-2xl" />
    <Skeleton className="h-64 w-full rounded-2xl" />
  </div>
);
