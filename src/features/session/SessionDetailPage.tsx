import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { SessionForm } from './SessionForm';
import { useSessions } from '@/hooks/useSessions';
import { Session } from '@/core/models/Session';
import { ArrowLeft, Trash2, Edit2, Calendar, Clock, Flame, Zap, Timer, Activity } from 'lucide-react';
import { formatDuration, formatPace, calcPace, calcSpeed } from '@/core/utils/calculations';

const SessionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getSession, saveSession, deleteSession, loading } = useSessions();
  
  const [session, setSession] = useState<Session | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (id) {
      getSession(parseInt(id)).then((data) => {
        if (data) setSession(data);
        else navigate('/historico');
      });
    }
  }, [id, getSession, navigate]);

  if (!session) return null;

  const handleUpdate = async (data: any) => {
    await saveSession(data);
    setSession({ ...session, ...data });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    await deleteSession(session.id!);
    navigate('/historico');
  };

  const pace = calcPace(session.duration_s, session.distance_km);
  const speed = calcSpeed(session.duration_s, session.distance_km);

  return (
    <PageWrapper>
      <PageHeader 
        title={isEditing ? "Editar Sessão" : "Detalhes da Sessão"} 
        icon={
          <Button variant="ghost" size="icon" onClick={() => isEditing ? setIsEditing(false) : navigate(-1)}>
            <ArrowLeft size={24} />
          </Button>
        }
        action={
          !isEditing && (
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
                <Edit2 size={20} />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setIsDeleteDialogOpen(true)} className="text-rose-500">
                <Trash2 size={20} />
              </Button>
            </div>
          )
        }
      />

      {isEditing ? (
        <SessionForm initialData={session} onSubmit={handleUpdate} isLoading={loading} />
      ) : (
        <div className="flex flex-col gap-6">
          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm flex flex-col gap-6">
            <div className="flex items-center gap-3 text-muted-foreground border-b border-border pb-4">
              <Calendar size={20} />
              <span className="font-medium">
                {new Date(session.date).toLocaleString('pt-BR', {
                  dateStyle: 'full',
                  timeStyle: 'short'
                })}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-y-8 gap-x-4">
              <DetailItem 
                icon={<Timer className="text-accent" />} 
                label="Distância" 
                value={`${session.distance_km.toFixed(2)} km`} 
              />
              <DetailItem 
                icon={<Clock className="text-accent" />} 
                label="Duração" 
                value={formatDuration(session.duration_s)} 
              />
              <DetailItem 
                icon={<Zap className="text-amber-500" />} 
                label="Pace" 
                value={formatPace(pace)} 
              />
              <DetailItem 
                icon={<Flame className="text-rose-500" />} 
                label="Calorias" 
                value={`${session.calories} kcal`} 
              />
              <div className="col-span-2">
                <DetailItem 
                  icon={<Zap className="text-blue-500" />} 
                  label="Velocidade Média" 
                  value={`${speed.toFixed(1)} km/h`} 
                />
              </div>
            </div>

            {session.notes && (
              <div className="mt-4 pt-6 border-t border-border">
                <span className="text-xs font-bold uppercase text-muted-foreground block mb-2">Observações</span>
                <p className="text-foreground bg-secondary/50 p-4 rounded-xl italic">
                  "{session.notes}"
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <Modal
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        title="Excluir Sessão"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</Button>
            <Button variant="danger" onClick={handleDelete} isLoading={loading}>Excluir</Button>
          </>
        }
      >
        <p className="text-muted-foreground">Tem certeza que deseja excluir esta sessão? Esta ação não pode ser desfeita.</p>
      </Modal>
    </PageWrapper>
  );
};

const DetailItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex flex-col gap-1">
    <div className="flex items-center gap-2 text-muted-foreground">
      {icon}
      <span className="text-[10px] uppercase font-bold tracking-wider">{label}</span>
    </div>
    <span className="text-xl font-black text-foreground">{value}</span>
  </div>
);

export default SessionDetailPage;
