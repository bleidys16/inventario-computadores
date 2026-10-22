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
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-[#2B124C] border border-[#522B5B] rounded-xl shadow-2xl p-0 overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-200 text-[#FBE4D8]">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#522B5B] bg-[#190019] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded bg-[#2B124C] border border-[#522B5B] text-amber-400 flex items-center justify-center">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <Dialog.Title className="text-sm font-mono uppercase tracking-wider font-semibold text-[#FBE4D8]">
                  Registrar Devolución
                </Dialog.Title>
                <Dialog.Description className="text-xs text-[#DFB6B2]">
                  Reintegro de equipo al inventario disponible
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

          <form onSubmit={handleReturn} className="p-5 space-y-3.5 text-xs">
            {/* Resumen del equipo */}
            <div className="p-3 rounded bg-[#190019] border border-[#522B5B] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Laptop className="w-4 h-4 text-[#DFB6B2]" />
                <div>
                  <span className="font-semibold text-[#FBE4D8] block">
                    {computer.name} ({computer.brand})
                  </span>
                  <span className="font-mono text-[10px] text-[#DFB6B2]">
                    ID: {computer.id} &bull; Modelo: {computer.model}
                  </span>
                </div>
              </div>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-500/30">
                PRESTADO
              </span>
            </div>

            {/* Ficha del custodio actual */}
            <div className="p-3.5 rounded bg-[#190019] border border-[#522B5B] space-y-2 text-xs text-[#DFB6B2]">
              <div className="flex items-center justify-between pb-2 border-b border-[#522B5B] text-[#FBE4D8] font-semibold">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#DFB6B2]" />
                  <span>{currentLoan.borrowerName}</span>
                </div>
                <span className="text-[11px] font-mono text-[#DFB6B2]">
                  {currentLoan.borrowerDocument}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1 text-[#DFB6B2]">
                  <MapPin className="w-3 h-3 text-[#DFB6B2]" />
                  <span>Ubicación actual:</span>
                </span>
                <span className="font-semibold text-[#FBE4D8]">{computer.location}</span>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1 text-[#DFB6B2]">
                  <Calendar className="w-3 h-3 text-[#DFB6B2]" />
                  <span>Fecha de préstamo:</span>
                </span>
                <span className="font-mono text-[#FBE4D8]">
                  {new Date(currentLoan.loanDate).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Reubicación garantizada */}
            <div className="p-2.5 rounded bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                El equipo pasará a estado <strong>DISPONIBLE</strong> en <strong>Bodega Central</strong>.
              </span>
            </div>

            {/* Notas de inspección */}
            <div>
              <label className="block text-[11px] font-mono uppercase text-[#DFB6B2] mb-1">
                Observaciones de Recepción Técnica
              </label>
              <textarea
                value={returnNotes}
                onChange={(e) => setReturnNotes(e.target.value)}
                placeholder="Verificación de cargador, pantalla, teclado e integridad física..."
                rows={2}
                className="w-full px-2.5 py-1.5 rounded bg-[#190019] border border-[#522B5B] text-[#FBE4D8] text-xs focus:outline-none focus:border-[#DFB6B2] resize-none"
              />
            </div>

            {/* Acciones */}
            <div className="pt-3 border-t border-[#522B5B] flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={closeReturnModal}
                className="px-3.5 py-1.5 rounded border border-[#522B5B] bg-[#190019] hover:bg-[#522B5B] text-[#DFB6B2] text-xs font-mono transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-semibold text-xs transition shadow-sm flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Confirmar Retorno</span>
              </button>
            </div>
          </form>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
