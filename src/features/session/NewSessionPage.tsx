import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { PageHeader } from '@/components/layout/PageHeader';
import { PlusCircle } from 'lucide-react';
import { SessionForm } from './SessionForm';
import { useSessions } from '@/hooks/useSessions';

const NewSessionPage: React.FC = () => {
  const navigate = useNavigate();
  const { saveSession, loading } = useSessions();

  const handleSubmit = async (data: any) => {
    try {
      await saveSession(data);
      navigate('/');
    } catch (error) {
      // Error is handled by useSessions toast
    }
  };

  return (
    <PageWrapper>
      <PageHeader title="Nova Sessão" icon={<PlusCircle size={24} />} />
      <SessionForm onSubmit={handleSubmit} isLoading={loading} />
    </PageWrapper>
  );
};

export default NewSessionPage;
