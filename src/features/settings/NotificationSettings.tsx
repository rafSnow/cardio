import React, { useState } from 'react';
import { Bell, Clock, Calendar, Trophy, Info, AlertTriangle, Target } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import { useNotifications } from '@/hooks/useNotifications';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export const NotificationSettings: React.FC = () => {
  const { settings, updateSetting } = useSettings();
  const { requestPermission, isSupported, permissionStatus } = useNotifications();
  const [showExplanation, setShowExplanation] = useState(false);

  const handleToggleAll = async () => {
    if (permissionStatus !== 'granted') {
      setShowExplanation(true);
    } else {
      updateSetting('notifications_enabled', !settings.notifications_enabled);
    }
  };

  const handleRequestPermission = async () => {
    await requestPermission();
    setShowExplanation(false);
  };

  if (!isSupported) {
    return (
      <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl flex gap-3 mb-4">
        <AlertTriangle className="text-rose-500 shrink-0" size={20} />
        <p className="text-xs text-rose-600 font-medium">
          Notificações não são suportadas neste navegador ou dispositivo.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between p-4 bg-card rounded-2xl border border-border shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg text-primary">
            <Bell size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold">Ativar Notificações</span>
            <span className="text-xs text-muted-foreground">Alertas e lembretes diários</span>
          </div>
        </div>

        <button
          onClick={handleToggleAll}
          className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${
            settings.notifications_enabled && permissionStatus === 'granted' ? 'bg-accent' : 'bg-secondary'
          }`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
              settings.notifications_enabled && permissionStatus === 'granted' ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {settings.notifications_enabled && permissionStatus === 'granted' && (
        <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
          {/* Lembrete de Registro */}
          <div className="bg-card p-4 rounded-2xl border border-border flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-muted-foreground" />
                <span className="text-xs font-bold uppercase">Lembrete Diário</span>
              </div>
              <button
                onClick={() => updateSetting('notify_register', !settings.notify_register)}
                className={`text-[10px] font-black uppercase px-2 py-1 rounded ${
                  settings.notify_register ? 'bg-accent/10 text-accent' : 'bg-secondary text-muted-foreground'
                }`}
              >
                {settings.notify_register ? 'Ativo' : 'Desativado'}
              </button>
            </div>
            
            {settings.notify_register && (
              <div className="flex items-center gap-3 bg-secondary/50 p-2 rounded-xl">
                <span className="text-xs text-muted-foreground ml-2">Horário:</span>
                <input
                  type="time"
                  value={settings.notification_time || '19:00'}
                  onChange={(e) => updateSetting('notification_time', e.target.value)}
                  className="bg-transparent text-sm font-bold focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Inatividade */}
          <div className="bg-card p-4 rounded-2xl border border-border flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-muted-foreground" />
                <span className="text-xs font-bold uppercase">Alerta de Inatividade</span>
              </div>
              <button
                onClick={() => updateSetting('notify_inactivity', !settings.notify_inactivity)}
                className={`text-[10px] font-black uppercase px-2 py-1 rounded ${
                  settings.notify_inactivity ? 'bg-accent/10 text-accent' : 'bg-secondary text-muted-foreground'
                }`}
              >
                {settings.notify_inactivity ? 'Ativo' : 'Desativado'}
              </button>
            </div>
            
            {settings.notify_inactivity && (
              <div className="flex items-center justify-between bg-secondary/50 p-2 px-4 rounded-xl">
                <span className="text-xs text-muted-foreground">Notificar após:</span>
                <div className="flex items-center gap-2">
                  <select
                    value={settings.inactivity_days || 3}
                    onChange={(e) => updateSetting('inactivity_days', parseInt(e.target.value))}
                    className="bg-transparent text-sm font-bold focus:outline-none"
                  >
                    {[2, 3, 5, 7].map(d => <option key={d} value={d}>{d} dias</option>)}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Outros Toggles */}
          <div className="grid grid-cols-2 gap-3">
            <div 
              onClick={() => updateSetting('notify_goal', !settings.notify_goal)}
              className={`p-4 rounded-2xl border transition-colors flex flex-col gap-2 cursor-pointer ${
                settings.notify_goal ? 'bg-accent/5 border-accent' : 'bg-card border-border'
              }`}
            >
              <Target size={18} className={settings.notify_goal ? 'text-accent' : 'text-muted-foreground'} />
              <span className="text-[10px] font-bold uppercase">Meta Próxima</span>
            </div>

            <div 
              onClick={() => updateSetting('notify_pr', !settings.notify_pr)}
              className={`p-4 rounded-2xl border transition-colors flex flex-col gap-2 cursor-pointer ${
                settings.notify_pr ? 'bg-accent/5 border-accent' : 'bg-card border-border'
              }`}
            >
              <Trophy size={18} className={settings.notify_pr ? 'text-accent' : 'text-muted-foreground'} />
              <span className="text-[10px] font-bold uppercase">Conquista PR</span>
            </div>
          </div>
        </div>
      )}

      {/* Platform Limitations Info */}
      <div className="bg-secondary/30 p-4 rounded-2xl border border-border flex flex-col gap-2 mt-2">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Info size={14} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Limitações da Plataforma</span>
        </div>
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          • No <span className="font-bold">iOS</span>, as notificações requerem que o app esteja instalado na tela de início.<br />
          • O app precisa ser aberto periodicamente para agendar os alertas diários.<br />
          • Algumas economias de bateria podem suspender as notificações.
        </p>
      </div>

      {/* Permission Explanation Modal */}
      {showExplanation && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-card w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-border flex flex-col items-center text-center gap-6 animate-in zoom-in-95 duration-300">
            <div className="bg-accent/10 p-4 rounded-full text-accent">
              <Bell size={40} />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-black">Mantenha o Foco!</h3>
              <p className="text-sm text-muted-foreground">
                Para enviar lembretes de treino e avisar sobre suas metas, precisamos da sua permissão.
              </p>
            </div>
            <div className="flex flex-col w-full gap-2">
              <Button onClick={handleRequestPermission} className="w-full rounded-2xl h-12">
                Permitir Notificações
              </Button>
              <Button variant="ghost" onClick={() => setShowExplanation(false)} className="w-full rounded-2xl">
                Agora não
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
