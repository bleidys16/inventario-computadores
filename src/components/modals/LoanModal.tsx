import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useInventoryStore } from '../../store/useInventoryStore';
import { ArrowUpRight, X, User, FileText, Briefcase, MapPin, AlertCircle, Laptop } from 'lucide-react';

export const LoanModal: React.FC = () => {
  const { 
    isLoanModalOpen, 
    closeLoanModal, 
    selectedComputerId, 
    computers, 
    loanComputer 
  } = useInventoryStore();

  const computer = computers.find((c) => c.id === selectedComputerId);

  const [borrowerName, setBorrowerName] = useState('');
  const [borrowerDocument, setBorrowerDocument] = useState('');
  const [borrowerRole, setBorrowerRole] = useState('Desarrollador');
  const [destinationLocation, setDestinationLocation] = useState('Sala de Innovación');
  const [expectedReturnDate, setExpectedReturnDate] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoanModalOpen) {
      setBorrowerName('');
      setBorrowerDocument('');
      setBorrowerRole('Desarrollador');
      setDestinationLocation('Sala de Innovación');
      setExpectedReturnDate('');
      setNotes('');
      setError(null);
    }
  }, [isLoanModalOpen]);

  if (!computer) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!borrowerName.trim()) {
      setError('El nombre completo del solicitante es obligatorio.');
      return;
    }
    if (!borrowerDocument.trim()) {
      setError('El documento o número de identificación es obligatorio.');
      return;
    }
    if (!destinationLocation.trim()) {
      setError('La sala o ubicación de destino es obligatoria.');
      return;
    }

    loanComputer(computer.id, {
      borrowerName: borrowerName.trim(),
      borrowerDocument: borrowerDocument.trim(),
      borrowerRole: borrowerRole.trim(),
      destinationLocation: destinationLocation.trim(),
      expectedReturnDate: expectedReturnDate || undefined,
      notes: notes.trim() || undefined,
    });
  };

  return (
    <Dialog.Root open={isLoanModalOpen} onOpenChange={(open) => !open && closeLoanModal()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg bg-[#2B124C] border border-[#522B5B] rounded-xl shadow-2xl p-0 overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-200 text-[#FBE4D8]">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#522B5B] bg-[#190019] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded bg-[#2B124C] border border-[#522B5B] text-[#DFB6B2] flex items-center justify-center">
                <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <Dialog.Title className="text-sm font-mono uppercase tracking-wider font-semibold text-[#FBE4D8]">
                  Préstamo de Equipo
                </Dialog.Title>
                <Dialog.Description className="text-xs text-[#DFB6B2]">
                  Asignar responsable y sala de destino para este activo
                </Dialog.Description>
              </div>
            </div>

            <Dialog.Close asChild>
              <button
                type="button"
                className="p-1.5 rounded text-[#DFB6B2] hover:text-[#FBE4D8] hover:bg-[#522B5B] transition"
              >
                <X className="w-4 h-4" />
              </button>
            </Dialog.Close>
          </div>

          {/* Banner con detalles del equipo */}
          <div className="mx-5 mt-4 p-3 rounded bg-[#190019] border border-[#522B5B] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <Laptop className="w-4 h-4 text-[#DFB6B2]" />
              <div>
                <span className="font-semibold text-[#FBE4D8] block">
                  {computer.name} ({computer.model})
                </span>
                <span className="font-mono text-[10px] text-[#DFB6B2]">
                  ID: {computer.id} &bull; Serial: {computer.barcode}
                </span>
              </div>
            </div>
            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
              DISPONIBLE
            </span>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
            {error && (
              <div className="p-2.5 rounded bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Nombre Completo */}
            <div>
              <label className="block text-[11px] font-mono uppercase text-[#DFB6B2] mb-1">
                Nombre del Solicitante *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#DFB6B2]">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={borrowerName}
                  onChange={(e) => setBorrowerName(e.target.value)}
                  placeholder="Ej: Ing. Laura Serrano Gómez"
                  required
                  className="w-full pl-9 pr-3 py-1.5 rounded bg-[#190019] border border-[#522B5B] text-[#FBE4D8] text-xs focus:outline-none focus:border-[#DFB6B2]"
                />
              </div>
            </div>

            {/* Documento y Rol */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono uppercase text-[#DFB6B2] mb-1">
                  Documento de Identidad *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#DFB6B2]">
                    <FileText className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={borrowerDocument}
                    onChange={(e) => setBorrowerDocument(e.target.value)}
                    placeholder="CC 1.094.283.910"
                    required
                    className="w-full pl-9 pr-3 py-1.5 rounded bg-[#190019] border border-[#522B5B] text-[#FBE4D8] text-xs font-mono focus:outline-none focus:border-[#DFB6B2]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-[#DFB6B2] mb-1">
                  Rol / Cargo *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#DFB6B2]">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={borrowerRole}
                    onChange={(e) => setBorrowerRole(e.target.value)}
                    placeholder="Docente, Investigador..."
                    required
                    className="w-full pl-9 pr-3 py-1.5 rounded bg-[#190019] border border-[#522B5B] text-[#FBE4D8] text-xs focus:outline-none focus:border-[#DFB6B2]"
                  />
                </div>
              </div>
            </div>

            {/* Sala Destino y Fecha Estimada */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono uppercase text-[#DFB6B2] mb-1">
                  Ubicación / Sala Destino *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#DFB6B2]">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <select
                    value={destinationLocation}
                    onChange={(e) => setDestinationLocation(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 rounded bg-[#190019] border border-[#522B5B] text-[#FBE4D8] text-xs focus:outline-none focus:border-[#DFB6B2]"
                  >
                    <option value="Sala de Innovación">Sala de Innovación</option>
                    <option value="Laboratorio de IA">Laboratorio de IA</option>
                    <option value="Sala de Desarrollo">Sala de Desarrollo</option>
                    <option value="Auditorio Principal">Auditorio Principal</option>
                    <option value="Oficina de Finanzas">Oficina de Finanzas</option>
                    <option value="Oficina de Rectoría">Oficina de Rectoría</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-[#DFB6B2] mb-1">
                  Fecha Estimada de Retorno
                </label>
                <input
                  type="date"
                  value={expectedReturnDate}
                  onChange={(e) => setExpectedReturnDate(e.target.value)}
                  className="w-full px-3 py-1.5 rounded bg-[#190019] border border-[#522B5B] text-[#FBE4D8] text-xs focus:outline-none focus:border-[#DFB6B2]"
                />
              </div>
            </div>

            {/* Observaciones */}
            <div>
              <label className="block text-[11px] font-mono uppercase text-[#DFB6B2] mb-1">
                Notas / Propósito del Préstamo
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ej: Para sustentación de proyecto y pruebas de software..."
                rows={2}
                className="w-full px-3 py-1.5 rounded bg-[#190019] border border-[#522B5B] text-[#FBE4D8] text-xs focus:outline-none focus:border-[#DFB6B2] resize-none placeholder-[#DFB6B2]/40"
              />
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-[#522B5B] flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={closeLoanModal}
                className="px-3.5 py-1.5 rounded border border-[#522B5B] bg-[#190019] hover:bg-[#522B5B] text-[#DFB6B2] text-xs font-mono transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded bg-[#FBE4D8] hover:bg-[#DFB6B2] text-[#190019] font-mono font-semibold text-xs transition shadow-sm flex items-center gap-1.5"
              >
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Confirmar y Prestar</span>
              </button>
            </div>
          </form>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
