export interface Session {
  id?: number;               // Auto-increment PK
  date: number;              // Timestamp em ms (Date.getTime())
  distance_km: number;       // Ex: 5.2
  duration_s: number;        // Duração em segundos (ex: 1800 = 30min)
  calories: number;          // Ex: 320
  notes?: string;            // Opcional, máx 300 chars
  created_at: number;        // Timestamp de criação do registro
}

export interface SessionDerived extends Session {
  pace_min_per_km: number;   // duration_s / 60 / distance_km
  speed_km_h: number;        // distance_km / (duration_s / 3600)
}
