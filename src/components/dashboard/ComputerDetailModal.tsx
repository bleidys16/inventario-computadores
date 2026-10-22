import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useInventoryStore } from '../../store/useInventoryStore';
import { useAuthStore } from '../../store/useAuthStore';
import { StatusBadge } from '../common/StatusBadge';
import { formatTimeAgo } from '../../utils/timeAgo';
import { 
  X, 
  Cpu, 
  HardDrive, 
  MemoryStick, 
  MapPin, 
  UserCheck, 
  ShieldAlert, 
  Clock, 
  Wrench, 
  ArrowUpRight, 
  RotateCcw, 
  FileText,
  Layers,
  Sparkles
} from 'lucide-react';

export const ComputerDetailModal: React.FC = () => {
  const { 
    isDetailModalOpen, 
    closeDetailModal, 
    selectedDetailComputerId, 
    computers, 
    openLoanModal, 
    openReturnModal, 
    setActiveTab 
  } = useInventoryStore();

  const { currentUser } = useAuthStore();
  const isAdmin = currentUser?.role === 'admin';

  const computer = computers.find((c) => c.id === selectedDetailComputerId);
  if (!computer) return null;

  const isAvailable = computer.status === 'Disponible';
  const isLoaned = computer.status === 'Prestado';
  const latestMaintenance = computer.maintenanceHistory?.[0];
  const timeAgoMaintenance = formatTimeAgo(latestMaintenance?.date);

  const handleLoanClick = () => {
    closeDetailModal();
    openLoanModal(computer.id);
  };

  const handleReturnClick = () => {
    closeDetailModal();
    openReturnModal(computer.id);
  };

  const handleGoToQuotes = () => {
    closeDetailModal();
    setActiveTab('quotes');
  };

  return (
    <Dialog.Root open={isDetailModalOpen} onOpenChange={(open) => !open && closeDetailModal()}>
      <Dialog.Portal>
        {/* Overlay desenfocado */}
        <Dialog.Overlay className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        {/* Modal Centrado */}
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl bg-white border border-brand-300/60 rounded-2xl shadow-2xl p-0 overflow-hidden max-h-[90vh] flex flex-col data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="p-5 border-b border-brand-300/40 bg-stone-50/90 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-100 border border-brand-300/60 flex items-center justify-center text-brand-600">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Dialog.Title className="text-base font-bold text-stone-900">
                    Ficha Técnica y Hoja de Vida (HV)
                  </Dialog.Title>
                  <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-semibold border ${
                    isAdmin 
                      ? 'bg-brand-100 text-brand-600 border-brand-300/60' 
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}>
                    {isAdmin ? 'Vista Administrador' : 'Vista Usuario'}
                  </span>
                </div>
                <Dialog.Description className="text-xs text-stone-500 font-mono">
                  ID: {computer.id} • Serial: {computer.barcode}
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

          {/* Contenido con scroll */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs text-stone-700">
            
            {/* 1. Imagen y Encabezado Principal del Equipo */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center bg-stone-50/70 p-4 rounded-2xl border border-brand-300/40">
              <div className="sm:col-span-5 h-44 w-full rounded-xl overflow-hidden bg-white border border-stone-200 flex items-center justify-center shadow-inner relative group">
                {computer.imageUrl ? (
                  <img 
                    src={computer.imageUrl} 
                    alt={computer.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="text-stone-400 text-center font-mono text-[11px] p-2">
                    Sin imagen asignada
                  </div>
                )}
                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-mono">
                  {computer.brand}
                </span>
              </div>

              <div className="sm:col-span-7 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono text-brand-600 uppercase font-semibold">
                    {computer.brand} • {computer.model}
                  </span>
                  <StatusBadge status={computer.status} />
                </div>

                <h3 className="text-lg font-bold text-stone-900 leading-snug">
                  {computer.name}
                </h3>

                {/* Resumen rápido de mantenimiento (Visible para Usuario y Admin) */}
                <div className="bg-white p-3 rounded-xl border border-brand-300/40 space-y-1 text-[11px]">
                  <div className="flex items-center justify-between text-stone-600">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Clock className="w-3.5 h-3.5 text-brand-600" />
                      Último Mantenimiento:
                    </span>
                    <span className="font-semibold text-stone-900">
                      {timeAgoMaintenance}
                    </span>
                  </div>
                  {latestMaintenance && (
                    <p className="text-stone-500 text-[10px] line-clamp-1 italic">
                      &quot;{latestMaintenance.description}&quot;
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* 2. Especificaciones de Hardware (Visible para Usuario y Admin) */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-brand-600" />
                <span>Especificaciones Técnicas</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white p-3 rounded-xl border border-brand-300/40">
                  <span className="text-[10px] text-stone-500 uppercase font-mono block">Procesador (CPU)</span>
                  <div className="flex items-center gap-1.5 font-semibold text-stone-800 text-xs mt-1">
                    <Cpu className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                    <span className="truncate">{computer.processor}</span>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-brand-300/40">
                  <span className="text-[10px] text-stone-500 uppercase font-mono block">Memoria RAM</span>
                  <div className="flex items-center gap-1.5 font-semibold text-stone-800 text-xs mt-1">
                    <MemoryStick className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                    <span>{computer.ram}</span>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-brand-300/40">
                  <span className="text-[10px] text-stone-500 uppercase font-mono block">Almacenamiento</span>
                  <div className="flex items-center gap-1.5 font-semibold text-stone-800 text-xs mt-1">
                    <HardDrive className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                    <span>{computer.storage}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. SECCIÓN EXCLUSIVA DE ADMINISTRADOR (HV Completa: Custodio, Ubicación Física, Historial) */}
            {isAdmin ? (
              <div className="space-y-4 pt-3 border-t border-brand-300/40">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-brand-600 uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Información de Control Administrativo (Solo Admin)</span>
                  </h4>
                  <span className="text-[10px] font-mono text-stone-400">Acceso Nivel 1</span>
                </div>

                {/* Ubicación y Ficha de Préstamo */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Ubicación Física */}
                  <div className="bg-white p-4 rounded-xl border border-brand-300/40 space-y-2">
                    <span className="text-[10px] font-mono uppercase text-stone-500 block">
                      Ubicación Física & Nodo
                    </span>
                    <div className="flex items-center gap-1.5 text-stone-900 font-semibold text-xs">
                      <MapPin className="w-4 h-4 text-brand-600 shrink-0" />
                      <span>{computer.location}</span>
                    </div>
                    {computer.nodeId && (
                      <p className="text-[11px] font-mono text-stone-500">
                        Asignado a Nodo TI: <strong className="text-stone-800">{computer.nodeId}</strong>
                      </p>
                    )}
                  </div>

                  {/* Custodio / Préstamo Actual */}
                  <div className="bg-white p-4 rounded-xl border border-brand-300/40 space-y-1.5">
                    <span className="text-[10px] font-mono uppercase text-stone-500 block">
                      Custodia / Responsable Actual
                    </span>
                    {isLoaned && computer.currentLoan ? (
                      <div>
                        <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs">
                          <UserCheck className="w-4 h-4 text-amber-600" />
                          <span>{computer.currentLoan.borrowerName}</span>
                        </div>
                        <div className="text-[11px] text-stone-600 font-mono mt-1 space-y-0.5">
                          <p>Doc: {computer.currentLoan.borrowerDocument} • Rol: {computer.currentLoan.borrowerRole}</p>
                          <p>Fecha préstamo: {new Date(computer.currentLoan.loanDate).toLocaleDateString()}</p>
                          {computer.currentLoan.expectedReturnDate && (
                            <p className="text-amber-700">Retorno estimado: {computer.currentLoan.expectedReturnDate}</p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-stone-500 text-[11px] italic">
                        El equipo se encuentra bajo resguardo en Bodega Central sin custodio activo.
                      </p>
                    )}
                  </div>
                </div>

                {/* Historial Detallado de Mantenimientos (Admin) */}
                <div className="bg-white p-4 rounded-xl border border-brand-300/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-900 uppercase font-mono flex items-center gap-1.5">
                      <Wrench className="w-3.5 h-3.5 text-brand-600" />
                      Historial Técnico Completo ({computer.maintenanceHistory?.length || 0})
                    </span>
                  </div>

                  {(!computer.maintenanceHistory || computer.maintenanceHistory.length === 0) ? (
                    <p className="text-stone-400 text-xs italic">
                      No hay registros históricos de mantenimiento para este activo.
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {computer.maintenanceHistory.map((rec) => (
                        <div 
                          key={rec.id} 
                          className="p-2.5 rounded-lg bg-stone-50 border border-stone-200 text-[11px] space-y-1"
                        >
                          <div className="flex items-center justify-between font-mono text-stone-600">
                            <span>{rec.date} • Técnico: <strong className="text-stone-800">{rec.technician}</strong></span>
                            <span className="px-1.5 py-0.2 rounded bg-stone-200 text-stone-700 text-[10px]">
                              {rec.type}
                            </span>
                          </div>
                          <p className="text-stone-700 text-xs leading-relaxed">
                            {rec.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Notas internas del Admin */}
                {computer.notes && (
                  <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/70 text-amber-900 text-xs">
                    <span className="font-semibold block text-[10px] uppercase font-mono mb-0.5">Notas del Equipo:</span>
                    <span>{computer.notes}</span>
                  </div>
                )}
              </div>
            ) : (
              /* MENSAJE INFORMATIVO PARA EL ROL USUARIO */
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-500 text-[11px] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-600 shrink-0" />
                <span>
                  Vista protegida para usuarios. Si requieres piezas o mejoras, consulta el catálogo de cotizaciones mayoristas.
                </span>
              </div>
            )}

          </div>

          {/* Footer del Modal */}
          <div className="p-4 sm:p-5 border-t border-brand-300/40 bg-stone-50/90 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              onClick={handleGoToQuotes}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-brand-100/60 border border-brand-300/60 text-brand-600 text-xs font-semibold transition"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Cotizar Repuestos / Partes</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={closeDetailModal}
                className="px-4 py-2 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-medium transition"
              >
                Cerrar Ficha
              </button>

              {/* Botón de Préstamo (Visible tanto para Usuario como para Admin si está disponible) */}
              {isAvailable && (
                <button
                  type="button"
                  onClick={handleLoanClick}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-600/90 text-white font-semibold text-xs shadow-sm transition active:scale-95"
                >
                  <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                  <span>Prestar este Computador</span>
                </button>
              )}

              {/* Botón de Devolución (Visible para Admin si está prestado) */}
              {isLoaned && isAdmin && (
                <button
                  type="button"
                  onClick={handleReturnClick}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-semibold text-xs shadow-sm transition active:scale-95"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Registrar Devolución</span>
                </button>
              )}
            </div>
          </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
