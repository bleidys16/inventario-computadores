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
        <Dialog.Overlay className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg bg-white border border-brand-300/60 rounded-2xl shadow-2xl p-0 overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-brand-300/40 bg-stone-50/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-100 border border-brand-300/60 text-brand-600 flex items-center justify-center">
                <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <Dialog.Title className="text-base font-bold text-stone-900">
                  Préstamo de Equipo
                </Dialog.Title>
                <Dialog.Description className="text-xs text-stone-500">
                  Asigna el custodio y la sala destino para este activo
                </Dialog.Description>
              </div>
            </div>

            <Dialog.Close asChild>
              <button
                type="button"
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          {/* Banner con detalles del equipo seleccionado */}
          <div className="mx-6 mt-5 p-3.5 rounded-xl bg-stone-50 border border-brand-300/40 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Laptop className="w-4 h-4 text-brand-600" />
              <div>
                <span className="text-xs font-bold text-stone-900 block">
                  {computer.name} ({computer.model})
                </span>
                <span className="text-[11px] font-mono text-stone-500">
                  ID: {computer.id} • Ubicación actual: {computer.location}
                </span>
              </div>
            </div>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
              Disponible
            </span>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{error}</span>
              </div>
            )}

            {/* Nombre Completo */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Nombre Completo del Solicitante <span className="text-brand-600">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={borrowerName}
                  onChange={(e) => setBorrowerName(e.target.value)}
                  placeholder="Ej: Ing. Laura Serrano Gómez"
                  required
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 text-xs focus:bg-white focus:outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
                />
              </div>
            </div>

            {/* Documento y Rol */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Documento de Identidad <span className="text-brand-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                    <FileText className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={borrowerDocument}
                    onChange={(e) => setBorrowerDocument(e.target.value)}
                    placeholder="CC 1.094.283.910"
                    required
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 text-xs font-mono focus:bg-white focus:outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Rol / Cargo <span className="text-brand-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={borrowerRole}
                    onChange={(e) => setBorrowerRole(e.target.value)}
                    placeholder="Docente, Investigador..."
                    required
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 text-xs focus:bg-white focus:outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
                  />
                </div>
              </div>
            </div>

            {/* Sala Destino y Fecha Estimada */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Ubicación / Sala Destino <span className="text-brand-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <select
                    value={destinationLocation}
                    onChange={(e) => setDestinationLocation(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 text-xs focus:bg-white focus:outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
                  >
                    <option value="Sala de Innovación">Sala de Innovación</option>
                    <option value="Laboratorio de IA">Laboratorio de IA</option>
                    <option value="Sala de Desarrollo">Sala de Desarrollo</option>
                    <option value="Auditorio Principal">Auditorio Principal</option>
                    <option value="Oficina de Finanzas">Oficina de Finanzas</option>
                    <option value="Oficina de Rectoría">Oficina de Rectoría</option>
                    <option value="Bodega Central">Bodega Central</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Fecha Estimada de Devolución
                </label>
                <input
                  type="date"
                  value={expectedReturnDate}
                  onChange={(e) => setExpectedReturnDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 text-xs focus:bg-white focus:outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
                />
              </div>
            </div>

            {/* Observaciones */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Propósito / Notas del Préstamo
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ej: Para sustentación de proyecto y pruebas de software..."
                rows={2}
                className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 text-xs focus:bg-white focus:outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600 resize-none"
              />
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-brand-300/40 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={closeLoanModal}
                className="px-4 py-2 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-medium transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-600/90 text-white font-semibold text-xs transition shadow-sm flex items-center gap-1.5 active:scale-95"
              >
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                <span>Confirmar y Prestar</span>
              </button>
            </div>
          </form>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
