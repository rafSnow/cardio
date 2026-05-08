/**
 * Helper functions for date and time calculations
 */

export const getStartOfDay = (date: Date): number => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

export const getEndOfDay = (date: Date): number => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d.getTime();
};

export const getLastNDaysRange = (days: number): { start: number; end: number } => {
  const end = getEndOfDay(new Date());
  const start = getStartOfDay(new Date());
  
  // subtract (days - 1) to include today
  const startDate = new Date(start);
  startDate.setDate(startDate.getDate() - (days - 1));
  
  return {
    start: startDate.getTime(),
    end,
  };
};

export const formatDate = (timestamp: number): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(timestamp));
};

export const formatRelativeDate = (timestamp: number): string => {
  const now = getStartOfDay(new Date());
  const date = getStartOfDay(new Date(timestamp));
  const diff = (now - date) / (1000 * 60 * 60 * 24);

  if (diff === 0) return 'Hoje';
  if (diff === 1) return 'Ontem';
  if (diff < 7) {
    return new Intl.DateTimeFormat('pt-BR', { weekday: 'long' }).format(new Date(timestamp));
  }
  
  return formatDate(timestamp);
};

export const toISODate = (timestamp: number): string => {
  return new Date(timestamp).toISOString().split('T')[0];
};

export const fromISODate = (isoDate: string, endOfDay = false): number => {
  const date = new Date(isoDate + 'T00:00:00');
  return endOfDay ? getEndOfDay(date) : getStartOfDay(date);
};
