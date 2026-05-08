import { db } from '../core/db/database';
import { Session } from '../core/models/Session';

export const sessionRepository = {
  async getAll(): Promise<Session[]> {
    return db.sessions.orderBy('date').reverse().toArray();
  },

  async getById(id: number): Promise<Session | undefined> {
    return db.sessions.get(id);
  },

  async create(session: Session): Promise<number> {
    return db.sessions.add(session);
  },

  async update(id: number, session: Partial<Session>): Promise<number> {
    return db.sessions.update(id, session);
  },

  async delete(id: number): Promise<void> {
    return db.sessions.delete(id);
  },

  async getByDateRange(start: number, end: number, offset = 0, limit = 20): Promise<Session[]> {
    return db.sessions
      .where('date')
      .between(start, end, true, true)
      .reverse()
      .offset(offset)
      .limit(limit)
      .toArray();
  },

  async countByDateRange(start: number, end: number): Promise<number> {
    return db.sessions
      .where('date')
      .between(start, end, true, true)
      .count();
  },

  async getLatest(): Promise<Session | undefined> {
    return db.sessions.orderBy('date').reverse().first();
  }
};
