import React, { useState, useEffect } from 'react';
import { Session } from '../../core/models/Session';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { DurationInput } from './DurationInput';
import { PacePreview } from './PacePreview';
import { sessionService, ValidationErrors } from '../../services/sessionService';

interface SessionFormProps {
  initialData?: Session;
  onSubmit: (data: Omit<Session, 'id' | 'created_at'> & { id?: number }) => Promise<void>;
  isLoading?: boolean;
}

export const SessionForm: React.FC<SessionFormProps> = ({ initialData, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().slice(0, 16),
    distance_km: '',
    duration_s: 0,
    calories: '',
    notes: '',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        date: new Date(initialData.date).toISOString().slice(0, 16),
        distance_km: initialData.distance_km.toString(),
        duration_s: initialData.duration_s,
        calories: initialData.calories.toString(),
        notes: initialData.notes || '',
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleDurationChange = (seconds: number) => {
    setFormData((prev) => ({ ...prev, duration_s: seconds }));
    if (errors.duration_s) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.duration_s;
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const dataToValidate = {
      date: new Date(formData.date).getTime(),
      distance_km: parseFloat(formData.distance_km),
      duration_s: formData.duration_s,
      calories: parseInt(formData.calories),
      notes: formData.notes,
    };

    const validationErrors = sessionService.validate(dataToValidate);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    await onSubmit({
      ...dataToValidate,
      id: initialData?.id,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <Input
        label="Data e Hora"
        type="datetime-local"
        name="date"
        value={formData.date}
        onChange={handleChange}
        error={errors.date}
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Distância (km)"
          type="number"
          step="0.01"
          name="distance_km"
          placeholder="Ex: 5.0"
          value={formData.distance_km}
          onChange={handleChange}
          error={errors.distance_km}
          required
        />
        <Input
          label="Calorias (kcal)"
          type="number"
          name="calories"
          placeholder="Ex: 350"
          value={formData.calories}
          onChange={handleChange}
          error={errors.calories}
          required
        />
      </div>

      <DurationInput
        value={formData.duration_s}
        onChange={handleDurationChange}
        error={errors.duration_s}
      />

      <PacePreview
        distance_km={parseFloat(formData.distance_km) || 0}
        duration_s={formData.duration_s}
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground ml-1">Observações (opcional)</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          className={`flex w-full rounded-lg border border-input bg-card px-4 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 transition-shadow shadow-sm ${
            errors.notes ? 'border-rose-500' : ''
          }`}
          placeholder="Como foi o treino?"
        />
        {errors.notes && <span className="text-xs font-medium text-rose-500 ml-1">{errors.notes}</span>}
      </div>

      <Button type="submit" isLoading={isLoading} className="w-full h-12 text-lg mt-2">
        {initialData ? 'Atualizar Treino' : 'Salvar Treino'}
      </Button>
    </form>
  );
};
