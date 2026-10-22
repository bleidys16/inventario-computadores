import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useInventoryStore } from '../../store/useInventoryStore';
import { RotateCcw, X, User, MapPin, Calendar, CheckCircle2, Laptop } from 'lucide-react';

export const ReturnModal: React.FC = () => {
  const { 
    isReturnModalOpen, 
    closeReturnModal, 
    selectedComputerId, 
    computers, 
    returnComputer 
  } = useInventoryStore();

  const [returnNotes, setReturnNotes] = useState('Equipo devuelto en óptimas condiciones.');

  const computer = computers.find((c) => c.id === selectedComputerId);
  if (!computer || !computer.currentLoan) return null;

  const { currentLoan } = computer;

  const handleReturn = (e: React.FormEvent) => {
    e.preventDefault();
    returnComputer(computer.id, returnNotes);
  };

  return (
    <Dialog.Root open={isReturnModalOpen} onOpenChange={(open) => !open && closeReturnModal()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-white border border-brand-300/60 rounded-2xl shadow-2xl p-0 overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="p-5 border-b border-brand-300/40 bg-stone-50/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <Dialog.Title className="text-base font-bold text-stone-900">
                  Registrar Devolución
                </Dialog.Title>
                <Dialog.Description className="text-xs text-stone-500">
                  Reintegro de equipo al inventario disponible
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

          <form onSubmit={handleReturn} className="p-6 space-y-4">
            {/* Resumen del equipo */}
            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Laptop className="w-4 h-4 text-brand-600" />
                <div>
                  <span className="text-xs font-bold text-stone-900 block">
                    {computer.name} ({computer.brand})
                  </span>
                  <span className="text-[11px] font-mono text-stone-500">
                    ID: {computer.id} • Mod: {computer.model}
                  </span>
                </div>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
                Prestado
              </span>
            </div>

            {/* Ficha del custodio actual */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2.5 text-xs text-stone-600">
              <div className="flex items-center justify-between pb-2 border-b border-stone-200 text-stone-900 font-semibold">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-brand-600" />
                  <span>{currentLoan.borrowerName}</span>
                </div>
                <span className="text-[11px] text-stone-500 font-mono">
                  {currentLoan.borrowerDocument}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1 text-stone-500">
                  <MapPin className="w-3 h-3 text-brand-600" />
                  <span>Ubicación actual:</span>
                </span>
                <span className="font-semibold text-stone-800">{computer.location}</span>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1 text-stone-500">
                  <Calendar className="w-3 h-3 text-brand-600" />
                  <span>Fecha de préstamo:</span>
                </span>
                <span className="font-mono text-stone-800 font-medium">
                  {new Date(currentLoan.loanDate).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Destino de retorno garantizado: Bodega Central */}
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                El equipo cambiará a estado <strong>Disponible</strong> y se reubicará en <strong>Bodega Central</strong>.
              </span>
            </div>

            {/* Notas de inspección física */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Observaciones de Recepción / Inspección Física
              </label>
              <textarea
                value={returnNotes}
                onChange={(e) => setReturnNotes(e.target.value)}
                placeholder="Verificación de cargador, pantalla, teclado e integridad física..."
                rows={2}
                className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 text-xs focus:bg-white focus:outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600 resize-none"
              />
            </div>

            {/* Acciones */}
            <div className="pt-4 border-t border-brand-300/40 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={closeReturnModal}
                className="px-4 py-2 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-medium transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-600/90 text-white font-semibold text-xs transition shadow-sm flex items-center gap-1.5 active:scale-95"
              >
                <RotateCcw className="w-4 h-4 stroke-[2.5]" />
                <span>Registrar Devolución</span>
              </button>
            </div>
          </form>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
