import Dexie, { Table } from 'dexie';
import { Session } from '../models/Session';
import { Setting } from '../models/Settings';

export class TreadLogDB extends Dexie {
  sessions!: Table<Session>;
  settings!: Table<Setting>;

  constructor() {
    super('TreadLogDB');

    this.version(1).stores({
      sessions: '++id, date, created_at',
      settings: 'key',
    });
  }
}

export const db = new TreadLogDB();
