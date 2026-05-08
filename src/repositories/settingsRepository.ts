import { db } from '../core/db/database';
import { Setting, SettingKey } from '../core/models/Settings';

export const settingsRepository = {
  async get<T>(key: SettingKey): Promise<T | undefined> {
    const setting = await db.settings.get(key);
    return setting ? (setting.value as T) : undefined;
  },

  async set(key: SettingKey, value: any): Promise<void> {
    await db.settings.put({ key, value });
  },

  async getAll(): Promise<Record<string, any>> {
    const all = await db.settings.toArray();
    return all.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, any>);
  }
};
