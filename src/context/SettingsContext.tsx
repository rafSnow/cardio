import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { settingsRepository } from '../repositories/settingsRepository';
import { SettingKey } from '../core/models/Settings';

interface SettingsContextType {
  settings: Record<string, any>;
  updateSetting: (key: SettingKey, value: any) => Promise<void>;
  isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Record<string, any>>({
    weekly_goal_sessions: 3,
    dark_mode: false,
    notifications_enabled: false,
    notification_time: '19:00',
    inactivity_days: 3,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const all = await settingsRepository.getAll();
        setSettings(prev => ({ ...prev, ...all }));
      } catch (error) {
        console.error('Failed to load settings', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadSettings();
  }, []);

  const updateSetting = useCallback(async (key: SettingKey, value: any) => {
    try {
      await settingsRepository.set(key, value);
      setSettings(prev => ({ ...prev, [key]: value }));
    } catch (error) {
      console.error(`Failed to update setting ${key}`, error);
      throw error;
    }
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, updateSetting, isLoading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
