export const calcPace = (duration_s: number, distance_km: number): number => {
  if (distance_km === 0) return 0;
  return duration_s / 60 / distance_km; // resultado em min/km
};

export const calcSpeed = (duration_s: number, distance_km: number): number => {
  if (duration_s === 0) return 0;
  return distance_km / (duration_s / 3600); // resultado em km/h
};

export const formatPace = (pace: number): string => {
  if (pace === 0 || isNaN(pace) || !isFinite(pace)) return '0:00 /km';
  const min = Math.floor(pace);
  const sec = Math.round((pace - min) * 60);
  return `${min}:${sec.toString().padStart(2, '0')} /km`;
};

export const formatDuration = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
};

export const formatDistance = (km: number): string => {
  return km.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' km';
};
