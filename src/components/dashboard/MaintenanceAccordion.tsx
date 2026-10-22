import React, { useState } from 'react';
import { useInventoryStore } from '../../store/useInventoryStore';
import type { Computer, ComputerStatus } from '../../types/inventory';
import { 
  Wrench, 
  Calendar, 
  User, 
  PlusCircle, 
  Check, 
  Clock 
} from 'lucide-react';

interface MaintenanceAccordionProps {
  computer: Computer;
}

export const MaintenanceAccordion: React.FC<MaintenanceAccordionProps> = ({ computer }) => {
  const { addMaintenance } = useInventoryStore();

  const [technician, setTechnician] = useState('Ing. Técnico TI');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('Preventivo');
  const [newStatus, setNewStatus] = useState<ComputerStatus | ''>('');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    addMaintenance(
      computer.id,
      {
        technician: technician.trim(),
        description: description.trim(),
        type,
      },
      (newStatus as ComputerStatus) || null
    );

    setDescription('');
    setFeedbackMsg('Mantenimiento registrado y sincronizado en LocalStorage');
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const history = computer.maintenanceHistory || [];

  return (
    <div className="bg-[#190019] border-t border-b border-[#522B5B] p-4 text-xs text-[#FBE4D8]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Section: Historial Cronológico de Mantenimientos */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#522B5B]">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#DFB6B2]" />
              <h3 className="font-mono text-xs uppercase tracking-wider text-[#FBE4D8] font-semibold">
                Historial de Intervenciones ({history.length})
              </h3>
            </div>
            <span className="font-mono text-[10px] text-[#DFB6B2]">
              ID: {computer.id} | Código: {computer.barcode}
            </span>
          </div>

          {history.length === 0 ? (
            <div className="py-6 text-center text-[#DFB6B2]/60 font-mono text-xs">
              No se registran intervenciones de mantenimiento para este equipo.
            </div>
          ) : (
            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {history.map((record) => (
                <div
                  key={record.id}
                  className="bg-[#2B124C] border border-[#522B5B] rounded p-2.5 flex flex-col gap-1.5 transition-colors hover:border-[#854F6C]"
                >
                  <div className="flex flex-wrap items-center justify-between gap-1 text-[11px]">
                    <div className="flex items-center gap-2 font-mono text-[#DFB6B2]">
                      <span className="flex items-center gap-1 text-[#DFB6B2]">
                        <Calendar className="w-3 h-3 text-[#DFB6B2]" />
                        {record.date}
                      </span>
                      <span className="text-[#522B5B]">&bull;</span>
                      <span className="flex items-center gap-1 text-[#FBE4D8] font-medium">
                        <User className="w-3 h-3 text-[#DFB6B2]" />
                        {record.technician}
                      </span>
                    </div>

                    <span
                      className={`font-mono text-[10px] uppercase px-1.5 py-0.5 rounded border ${
                        record.type === 'Correctivo'
                          ? 'bg-rose-950/40 text-rose-300 border-rose-500/30'
                          : record.type === 'Actualización'
                          ? 'bg-blue-950/40 text-blue-300 border-blue-500/30'
                          : 'bg-[#522B5B]/50 text-[#DFB6B2] border-[#854F6C]/40'
                      }`}
                    >
                      {record.type || 'Preventivo'}
                    </span>
                  </div>

                  <p className="text-[#DFB6B2] text-xs leading-relaxed font-sans pl-1">
                    {record.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Section: Formulario Rápido y Compacto de Registro */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-[#2B124C] border border-[#522B5B] rounded p-3.5">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#522B5B]">
              <div className="flex items-center gap-2">
                <Wrench className="w-3.5 h-3.5 text-[#DFB6B2]" />
                <h4 className="font-mono text-xs uppercase tracking-wider text-[#FBE4D8] font-semibold">
                  Registrar Mantenimiento
                </h4>
              </div>
              <span className="text-[10px] text-[#DFB6B2] font-mono">Persistencia Zustand</span>
            </div>

            {feedbackMsg && (
              <div className="flex items-center gap-1.5 bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 px-2.5 py-1.5 rounded text-[11px] font-mono">
                <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>{feedbackMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-mono uppercase text-[#DFB6B2] mb-1">
                  Técnico Responsable
                </label>
                <input
                  type="text"
                  required
                  value={technician}
                  onChange={(e) => setTechnician(e.target.value)}
                  placeholder="Nombre del técnico"
                  className="w-full bg-[#190019] text-[#FBE4D8] border border-[#522B5B] focus:border-[#DFB6B2] rounded px-2 py-1 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-[#DFB6B2] mb-1">
                  Tipo Intervención
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full bg-[#190019] text-[#FBE4D8] border border-[#522B5B] focus:border-[#DFB6B2] rounded px-2 py-1 text-xs outline-none font-mono"
                >
                  <option value="Preventivo">Preventivo</option>
                  <option value="Correctivo">Correctivo</option>
                  <option value="Actualización">Actualización Hardware</option>
                  <option value="Diagnóstico">Diagnóstico / Pruebas</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-[#DFB6B2] mb-1">
                Descripción Técnica de la Intervención
              </label>
              <textarea
                required
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ej: Cambio de pasta térmica, limpieza por ultrasonido, diagnóstico MemTest..."
                className="w-full bg-[#190019] text-[#FBE4D8] border border-[#522B5B] focus:border-[#DFB6B2] rounded px-2.5 py-1.5 text-xs outline-none resize-none placeholder-[#DFB6B2]/40"
              />
            </div>

            <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#522B5B]">
              <div className="flex-1">
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as ComputerStatus | '')}
                  className="w-full bg-[#190019] text-[#DFB6B2] border border-[#522B5B] focus:border-[#DFB6B2] rounded px-2 py-1 text-[11px] outline-none font-mono"
                >
                  <option value="">Mantener estado ({computer.status})</option>
                  <option value="Disponible">&rarr; Marcar como DISPONIBLE</option>
                  <option value="En Mantenimiento">&rarr; Poner EN MANTENIMIENTO</option>
                  <option value="De Baja">&rarr; Dictaminar DE BAJA</option>
                </select>
              </div>

              <button
                type="submit"
                className="px-3 py-1.5 bg-[#FBE4D8] text-[#190019] hover:bg-[#DFB6B2] font-mono text-xs font-semibold rounded transition-colors flex items-center gap-1.5 shrink-0"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Guardar Registro</span>
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};
