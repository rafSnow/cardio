import { useEffect, useCallback } from 'react';
import { useSettings } from '@/context/SettingsContext';
import { notificationService } from '@/services/notificationService';
import { sessionRepository } from '@/repositories/sessionRepository';
import { goalsService } from '@/services/goalsService';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/core/db/database';

export const useNotifications = () => {
  const { settings, updateSetting } = useSettings();
  const sessions = useLiveQuery(() => db.sessions.toArray());

  const requestPermission = useCallback(async () => {
    const permission = await notificationService.requestPermission();
    if (permission === 'granted') {
      updateSetting('notifications_enabled', true);
    } else {
      updateSetting('notifications_enabled', false);
    }
    return permission;
  }, [updateSetting]);

  // Schedule daily reminder
  useEffect(() => {
    if (!settings.notifications_enabled || !settings.notify_register || !settings.notification_time) return;

    const timeUntil = notificationService.getTimeUntilNext(settings.notification_time);
    
    const timeoutId = setTimeout(() => {
      notificationService.showNotification('Hora do Cardio! 🏃', {
        body: 'Não esqueça de registrar seu treino de hoje no TreadLog.',
      });
      // Re-schedule for next day is handled by the fact that effect runs again on mount or when time changes
    }, timeUntil);

    return () => clearTimeout(timeoutId);
  }, [settings.notifications_enabled, settings.notify_register, settings.notification_time]);

  // Check for inactivity
  useEffect(() => {
    if (!settings.notifications_enabled || !settings.notify_inactivity || !sessions || sessions.length === 0) return;

    const inactivityDays = settings.inactivity_days || 3;
    const latestSession = [...sessions].sort((a, b) => b.date - a.date)[0];
    
    if (latestSession) {
      const diffMs = Date.now() - latestSession.date;
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      if (diffDays >= inactivityDays) {
        // We only show this once per session/day to not be annoying
        const lastAlertKey = 'last_inactivity_alert';
        const lastAlert = localStorage.getItem(lastAlertKey);
        const today = new Date().toISOString().split('T')[0];
        
        if (lastAlert !== today) {
          notificationService.showNotification('Sentimos sua falta! 👋', {
            body: `Você não registra um treino há ${diffDays} dias. Vamos voltar à ativa?`,
          });
          localStorage.setItem(lastAlertKey, today);
        }
      }
    }
  }, [settings.notifications_enabled, settings.notify_inactivity, settings.inactivity_days, sessions]);

  // Check if goal is close
  useEffect(() => {
    if (!settings.notifications_enabled || !settings.notify_goal || !sessions) return;

    const weeklyGoal = settings.weekly_goal_sessions || 3;
    const progress = goalsService.getWeeklyProgress(sessions, weeklyGoal);
    
    if (progress.sessionsCount === weeklyGoal - 1) {
      const lastGoalAlertKey = 'last_goal_alert_week';
      const currentWeek = goalsService.getStartOfWeek(new Date()).toISOString();
      const lastAlert = localStorage.getItem(lastGoalAlertKey);

      if (lastAlert !== currentWeek) {
        notificationService.showNotification('Quase lá! 🔥', {
          body: 'Falta apenas 1 treino para você bater sua meta semanal!',
        });
        localStorage.setItem(lastGoalAlertKey, currentWeek);
      }
    }
  }, [settings.notifications_enabled, settings.notify_goal, settings.weekly_goal_sessions, sessions]);

  return {
    requestPermission,
    isSupported: notificationService.isSupported(),
    permissionStatus: notificationService.getPermissionStatus(),
  };
};
