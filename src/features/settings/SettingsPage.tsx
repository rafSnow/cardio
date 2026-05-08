import React from 'react';
import { Settings, Info, Download, CheckCircle2 } from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { PageHeader } from '@/components/layout/PageHeader';
import { GoalSettings } from './GoalSettings';
import { ThemeToggle } from './ThemeToggle';
import { NotificationSettings } from './NotificationSettings';
import { DataManagement } from './DataManagement';
import { GoalHistory } from './GoalHistory';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { Button } from '@/components/ui/Button';

const SettingsPage: React.FC = () => {
  const { isInstallable, isInstalled, install } = usePWAInstall();

  return (
    <PageWrapper>
      <PageHeader title="Configurações" icon={<Settings size={24} />} />
      
      <div className="flex flex-col gap-8 px-4 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* PWA Install Section */}
        {(isInstallable || isInstalled) && (
          <section className="flex flex-col gap-4">
            <h3 className="text-xs font-bold uppercase text-muted-foreground ml-1">Aplicativo</h3>
            <div className="bg-accent/10 border border-accent/20 rounded-2xl p-5 flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-accent/20 p-3 rounded-2xl text-accent">
                  {isInstalled ? <CheckCircle2 size={24} /> : <Download size={24} />}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold">
                    {isInstalled ? 'App Instalado' : 'Instalar TreadLog'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {isInstalled 
                      ? 'Você já está usando a versão nativa!' 
                      : 'Acesse mais rápido pela sua tela de início.'}
                  </span>
                </div>
              </div>
              
              {!isInstalled && isInstallable && (
                <Button onClick={install} className="w-full gap-2 rounded-xl">
                  <Download size={18} />
                  Adicionar à Tela de Início
                </Button>
              )}
            </div>
          </section>
        )}

        <section className="flex flex-col gap-4">
          <h3 className="text-xs font-bold uppercase text-muted-foreground ml-1">Preferências</h3>
          <GoalSettings />
          <ThemeToggle />
          <NotificationSettings />
        </section>

        <section>
          <GoalHistory />
        </section>

        <section>
          <DataManagement />
        </section>

        <section className="bg-secondary/30 rounded-2xl p-6 border border-border flex flex-col items-center text-center gap-3">
          <div className="bg-secondary p-3 rounded-full text-muted-foreground">
            <Info size={24} />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-bold">TreadLog v1.0.0</span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Desenvolvido para ajudar você a conquistar suas metas de cardio.
              Seus dados são armazenados localmente no seu dispositivo.
            </p>
          </div>
        </section>
      </div>
    </PageWrapper>
  );
};

export default SettingsPage;
