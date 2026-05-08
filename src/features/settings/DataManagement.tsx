import React, { useState, useRef } from 'react';
import { Download, Upload, Trash2, FileJson, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { exportService } from '@/services/exportService';
import { useSessions } from '@/hooks/useSessions';
import { useToast } from '@/context/ToastContext';
import { db } from '@/core/db/database';
import { useLiveQuery } from 'dexie-react-hooks';

export const DataManagement: React.FC = () => {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [isDoubleConfirmOpen, setIsDoubleConfirmOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [pendingImportData, setPendingImportData] = useState<any>(null);

  const sessions = useLiveQuery(() => db.sessions.toArray());

  const handleExportJSON = async () => {
    const data = await exportService.generateJSON();
    exportService.downloadFile(
      JSON.stringify(data, null, 2),
      `treadlog-backup-${new Date().toISOString().split('T')[0]}.json`,
      'application/json'
    );
    showToast('Backup JSON gerado com sucesso!');
  };

  const handleExportCSV = async () => {
    if (!sessions || sessions.length === 0) {
      showToast('Nenhum dado para exportar', 'error');
      return;
    }
    const csv = await exportService.generateCSV(sessions);
    exportService.downloadFile(
      csv,
      `treadlog-export-${new Date().toISOString().split('T')[0]}.csv`,
      'text/csv'
    );
    showToast('Exportação CSV concluída!');
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        const validation = exportService.validateImport(json);
        
        if (validation.valid) {
          setPendingImportData(json);
          setIsImportModalOpen(true);
        } else {
          showToast(validation.error || 'Erro ao validar arquivo', 'error');
        }
      } catch (err) {
        showToast('Formato de arquivo inválido', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const confirmImport = async () => {
    try {
      // Clear current data and replace
      await db.sessions.clear();
      await db.settings.clear();
      
      await db.sessions.bulkAdd(pendingImportData.sessions);
      await db.settings.bulkPut(pendingImportData.settings);
      
      showToast('Dados importados com sucesso!');
      setIsImportModalOpen(false);
      window.location.reload(); // Reload to refresh all contexts
    } catch (err) {
      showToast('Erro ao importar dados', 'error');
    }
  };

  const handleClearData = async () => {
    await db.sessions.clear();
    await db.settings.clear();
    showToast('Todos os dados foram apagados', 'info');
    setIsDoubleConfirmOpen(false);
    setIsClearModalOpen(false);
    window.location.reload();
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xs font-bold uppercase text-muted-foreground ml-1">Gerenciamento de Dados</h3>
      
      <div className="grid grid-cols-2 gap-3">
        <Button variant="secondary" className="h-20 flex-col gap-2 rounded-2xl" onClick={handleExportJSON}>
          <FileJson size={20} className="text-blue-500" />
          <span className="text-xs font-bold">Backup JSON</span>
        </Button>
        <Button variant="secondary" className="h-20 flex-col gap-2 rounded-2xl" onClick={handleExportCSV}>
          <FileSpreadsheet size={20} className="text-green-500" />
          <span className="text-xs font-bold">Exportar CSV</span>
        </Button>
      </div>

      <Button variant="secondary" className="h-14 justify-start gap-3 px-4 rounded-2xl" onClick={handleImportClick}>
        <Upload size={20} className="text-amber-500" />
        <div className="flex flex-col items-start">
          <span className="text-sm font-bold">Importar JSON</span>
          <span className="text-[10px] text-muted-foreground">Restaurar de um backup anterior</span>
        </div>
        <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={handleFileChange} />
      </Button>

      <Button variant="ghost" className="h-14 justify-start gap-3 px-4 rounded-2xl text-rose-500 hover:bg-rose-500/10" onClick={() => setIsClearModalOpen(true)}>
        <Trash2 size={20} />
        <div className="flex flex-col items-start">
          <span className="text-sm font-bold">Limpar Dados</span>
          <span className="text-[10px] text-rose-500/70">Apagar todo o histórico e configurações</span>
        </div>
      </Button>

      {/* Import Confirmation Modal */}
      <Modal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Confirmar Importação"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsImportModalOpen(false)}>Cancelar</Button>
            <Button onClick={confirmImport}>Confirmar e Substituir</Button>
          </>
        }
      >
        <div className="flex flex-col gap-3">
          <p className="text-sm text-muted-foreground">
            O arquivo contém <span className="font-bold text-foreground">{pendingImportData?.sessions?.length} sessões</span>.
          </p>
          <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex gap-3">
            <AlertCircle className="text-amber-500 shrink-0" size={20} />
            <p className="text-xs text-amber-600 font-medium">
              Esta ação substituirá permanentemente todos os seus dados atuais. Recomendamos fazer um backup antes.
            </p>
          </div>
        </div>
      </Modal>

      {/* Clear Data Modal 1 */}
      <Modal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        title="Limpar todos os dados?"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsClearModalOpen(false)}>Cancelar</Button>
            <Button variant="danger" onClick={() => setIsDoubleConfirmOpen(true)}>Prosseguir</Button>
          </>
        }
      >
        <p className="text-sm text-muted-foreground">
          Tem certeza que deseja apagar todo o seu histórico e configurações? Esta ação é irreversível.
        </p>
      </Modal>

      {/* Clear Data Modal 2 (Double Confirm) */}
      <Modal
        isOpen={isDoubleConfirmOpen}
        onClose={() => setIsDoubleConfirmOpen(false)}
        title="CERTEZA ABSOLUTA?"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsDoubleConfirmOpen(false)}>Não, cancelar!</Button>
            <Button variant="danger" onClick={handleClearData}>SIM, APAGAR TUDO</Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm font-bold text-rose-500">
            Última chance! Uma vez apagado, não há como recuperar os dados a menos que você tenha um backup JSON.
          </p>
          <p className="text-sm text-muted-foreground">
            Deseja mesmo continuar com a exclusão total?
          </p>
        </div>
      </Modal>
    </div>
  );
};
