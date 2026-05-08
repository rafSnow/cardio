import { useState, useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Session } from '../core/models/Session';
import { sessionService } from '../services/sessionService';
import { useToast } from '../context/ToastContext';
import { goalsService } from '../services/goalsService';
import { notificationService } from '../services/notificationService';
import { useSettings } from '../context/SettingsContext';

export const useSessions = () => {
  const { showToast } = useToast();
  const { settings } = useSettings();
  const [loading, setLoading] = useState(false);

  const sessions = useLiveQuery(() => sessionService.listSessions(), []);

  const getSession = useCallback(async (id: number) => {
    return sessionService.getSession(id);
  }, []);

  const saveSession = useCallback(async (sessionData: Omit<Session, 'id' | 'created_at'> & { id?: number }) => {
    setLoading(true);
    try {
      // Check for PRs before saving (if it's a new session or updated one)
      const allSessions = await sessionService.listSessions();
      const currentSession = sessionData as Session;
      
      const prStatus = goalsService.checkIfSessionIsPR(currentSession, allSessions.filter(s => s.id !== sessionData.id));
      const isPR = prStatus.distance || prStatus.pace || prStatus.calories;

      const id = await sessionService.saveSession(sessionData);
      showToast(sessionData.id ? 'Sessão atualizada!' : 'Sessão salva com sucesso!');

      // Notify if PR and enabled
      if (isPR && settings.notifications_enabled && settings.notify_pr) {
        let body = 'Você bateu um novo recorde!';
        if (prStatus.distance) body = 'Maior distância percorrida! 🔥';
        else if (prStatus.pace) body = 'Seu melhor pace até agora! ⚡';
        else if (prStatus.calories) body = 'Máximo de calorias queimadas! 🏆';

        notificationService.showNotification('Parabéns! 🎉', {
          body,
          tag: 'pr-celebration'
        });
      }

      return id;
    } catch (error: any) {
      showToast(error.message || 'Erro ao salvar sessão', 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [showToast, settings]);

  const deleteSession = useCallback(async (id: number) => {
    setLoading(true);
    try {
      await sessionService.deleteSession(id);
      showToast('Sessão excluída', 'info');
    } catch (error: any) {
      showToast('Erro ao excluir sessão', 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  return {
    sessions,
    loading,
    saveSession,
    deleteSession,
    getSession
  };
};
