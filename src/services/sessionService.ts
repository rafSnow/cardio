import { Session } from '../core/models/Session';
import { sessionRepository } from '../repositories/sessionRepository';

export interface ValidationErrors {
  [key: string]: string;
}

export const sessionService = {
  validate(session: Partial<Session>): ValidationErrors {
    const errors: ValidationErrors = {};

    if (!session.date) {
      errors.date = 'Data é obrigatória';
    } else if (session.date > Date.now()) {
      errors.date = 'Data não pode ser no futuro';
    }

    if (!session.distance_km || session.distance_km <= 0) {
      errors.distance_km = 'Distância deve ser maior que 0';
    } else if (session.distance_km > 100) {
      errors.distance_km = 'Distância máxima permitida é 100km';
    }

    if (!session.duration_s || session.duration_s <= 0) {
      errors.duration_s = 'Duração deve ser maior que 0';
    }

    if (!session.calories || session.calories <= 0) {
      errors.calories = 'Calorias devem ser maiores que 0';
    }

    if (session.notes && session.notes.length > 300) {
      errors.notes = 'Notas não podem exceder 300 caracteres';
    }

    return errors;
  },

  async saveSession(session: Omit<Session, 'id' | 'created_at'> & { id?: number }): Promise<number> {
    const errors = this.validate(session);
    if (Object.keys(errors).length > 0) {
      throw new Error('Dados da sessão inválidos');
    }

    const now = Date.now();
    if (session.id) {
      await sessionRepository.update(session.id, {
        ...session,
      });
      return session.id;
    } else {
      return sessionRepository.create({
        ...session,
        created_at: now,
      } as Session);
    }
  },

  async deleteSession(id: number): Promise<void> {
    return sessionRepository.delete(id);
  },

  async getSession(id: number): Promise<Session | undefined> {
    return sessionRepository.getById(id);
  },

  async listSessions(): Promise<Session[]> {
    return sessionRepository.getAll();
  }
};
