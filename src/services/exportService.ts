import { Session } from '../core/models/Session';
import { Setting } from '../core/models/Settings';
import { calcPace, calcSpeed, formatDuration, formatPace } from '../core/utils/calculations';
import { db } from '../core/db/database';

export interface ExportData {
  version: number;
  exported_at: string;
  sessions: Session[];
  settings: Setting[];
}

export const exportService = {
  async generateJSON(): Promise<ExportData> {
    const sessions = await db.sessions.toArray();
    const settings = await db.settings.toArray();
    
    return {
      version: 1,
      exported_at: new Date().toISOString(),
      sessions,
      settings,
    };
  },

  async generateCSV(sessions: Session[]): Promise<string> {
    const headers = ['data', 'distancia_km', 'duracao_hms', 'calorias', 'pace_min_km', 'velocidade_kmh', 'observacoes'];
    
    const rows = sessions.map(s => {
      const pace = calcPace(s.duration_s, s.distance_km);
      const speed = calcSpeed(s.duration_s, s.distance_km);
      const date = new Date(s.date).toLocaleString('pt-BR');
      
      return [
        date,
        s.distance_km.toFixed(2),
        formatDuration(s.duration_s),
        s.calories,
        formatPace(pace).replace(' /km', ''),
        speed.toFixed(1),
        `"${(s.notes || '').replace(/"/g, '""')}"`
      ].join(',');
    });

    return [headers.join(','), ...rows].join('\n');
  },

  downloadFile(content: string, fileName: string, contentType: string) {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  },

  validateImport(data: any): { valid: boolean; error?: string } {
    if (!data || typeof data !== 'object') return { valid: false, error: 'Arquivo inválido' };
    if (data.version !== 1) return { valid: false, error: 'Versão do arquivo incompatível' };
    if (!Array.isArray(data.sessions)) return { valid: false, error: 'Dados de sessões ausentes ou inválidos' };
    
    // Basic session validation
    for (const session of data.sessions) {
      if (!session.date || !session.distance_km || !session.duration_s || !session.calories) {
        return { valid: false, error: 'Algumas sessões possuem dados incompletos ou inválidos' };
      }
    }

    return { valid: true };
  }
};
