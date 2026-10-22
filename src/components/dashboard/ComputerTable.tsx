import React from 'react';
import { useInventoryStore } from '../../store/useInventoryStore';
import type { ComputerStatus } from '../../types/inventory';
import { StatusBadge } from '../common/StatusBadge';
import { MaintenanceAccordion } from './MaintenanceAccordion';
import { 
  Cpu, 
  HardDrive, 
  MapPin, 
  UserCheck, 
  ArrowUpRight, 
  RotateCcw, 
  Barcode, 
  Wrench,
  Trash2,
  Plus,
  Laptop,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { cn } from '../../utils/cn';

export const ComputerTable: React.FC = () => {
  const { 
    getFilteredComputers, 
    statusFilter, 
    setStatusFilter, 
    searchQuery,
    openLoanModal, 
    openReturnModal,
    openRegisterDrawer,
    deleteComputer,
    computers,
    expandedAccordions,
    toggleAccordion
  } = useInventoryStore();

  const filteredComputers = getFilteredComputers();

  const statusTabs: (ComputerStatus | 'Todos')[] = [
    'Todos',
    'Disponible',
    'Prestado',
    'En Mantenimiento',
    'De Baja',
  ];

  return (
    <div className="bg-[#2B124C] rounded-xl border border-[#522B5B] shadow-sm overflow-hidden">
      {/* Header de controles de la tabla: Tabs de filtrado y contador */}
      <div className="p-4 border-b border-[#522B5B] flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#190019]">
        
        {/* Tabs de estado */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
          {statusTabs.map((tab) => {
            const isActive = statusFilter === tab;
            const count = tab === 'Todos' 
              ? computers.length 
              : computers.filter((c) => c.status === tab).length;

            return (
              <button
                key={tab}
                type="button"
                onClick={() => setStatusFilter(tab)}
                className={cn(
                  'px-3 py-1.5 rounded text-xs font-mono uppercase transition-all whitespace-nowrap flex items-center gap-1.5 border',
                  isActive
                    ? 'bg-[#854F6C] text-[#FBE4D8] border-[#DFB6B2] shadow-sm font-semibold'
                    : 'bg-[#2B124C] text-[#DFB6B2] border-[#522B5B] hover:bg-[#522B5B] hover:text-[#FBE4D8]'
                )}
              >
                <span>{tab}</span>
                <span
                  className={cn(
                    'px-1.5 py-0.2 rounded text-[10px]',
                    isActive
                      ? 'bg-black/30 text-[#FBE4D8]'
                      : 'bg-[#190019] text-[#DFB6B2]'
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Resumen de resultados */}
        <div className="text-xs text-[#DFB6B2] flex items-center justify-between md:justify-end gap-3 font-mono">
          {searchQuery && (
            <span>
              Filtrando por &quot;<span className="text-[#FBE4D8] font-semibold">{searchQuery}</span>&quot;:
            </span>
          )}
          <span>
            <strong className="text-[#FBE4D8]">{filteredComputers.length}</strong> {filteredComputers.length === 1 ? 'equipo' : 'equipos'}
          </span>
        </div>
      </div>

      {/* Tabla Densa Técnica */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#522B5B] bg-[#190019] text-[11px] font-mono uppercase tracking-wider text-[#DFB6B2]">
              <th scope="col" className="py-3 px-4">Código / Serial</th>
              <th scope="col" className="py-3 px-4">Equipo & Modelo</th>
              <th scope="col" className="py-3 px-4">Especificaciones</th>
              <th scope="col" className="py-3 px-4">Ubicación Actual</th>
              <th scope="col" className="py-3 px-4">Estado</th>
              <th scope="col" className="py-3 px-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#522B5B] text-[#FBE4D8]">
            {filteredComputers.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-14 text-center">
                  <div className="max-w-sm mx-auto flex flex-col items-center">
                    <div className="w-12 h-12 rounded bg-[#190019] border border-[#522B5B] flex items-center justify-center text-[#DFB6B2] mb-3">
                      <Laptop className="w-6 h-6" />
                    </div>
                    <p className="font-semibold text-[#FBE4D8] text-sm">
                      {computers.length === 0 
                        ? 'Inventario sin equipos registrados' 
                        : 'No se encontraron coincidencias'}
                    </p>
                    <p className="text-xs text-[#DFB6B2]/70 mt-1 mb-4 text-center">
                      {computers.length === 0
                        ? 'Comienza registrando tu primer computador con el botón superior.'
                        : 'Verifica los términos de búsqueda o el filtro de estado seleccionado.'}
                    </p>
                    {computers.length === 0 && (
                      <button
                        type="button"
                        onClick={openRegisterDrawer}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#FBE4D8] hover:bg-[#DFB6B2] text-[#190019] font-mono text-xs font-semibold shadow-sm transition"
                      >
                        <Plus className="w-4 h-4 stroke-[2.5]" />
                        <span>Registrar primer equipo</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              filteredComputers.map((computer) => {
                const isAvailable = computer.status === 'Disponible';
                const isLoaned = computer.status === 'Prestado';
                const isExpanded = !!expandedAccordions[computer.id];
                const mntCount = computer.maintenanceHistory?.length || 0;

                return (
                  <React.Fragment key={computer.id}>
                    <tr
                      className={`transition-colors ${
                        isExpanded ? 'bg-[#190019]/60' : 'hover:bg-[#522B5B]/20'
                      }`}
                    >
                      {/* Código / ID */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-mono font-bold text-[#FBE4D8] text-xs">
                            {computer.id}
                          </span>
                          <div className="flex items-center gap-1 text-[11px] font-mono text-[#DFB6B2] mt-0.5">
                            <Barcode className="w-3.5 h-3.5 shrink-0 text-[#DFB6B2]" />
                            <span>{computer.barcode}</span>
                          </div>
                        </div>
                      </td>

                      {/* Equipo */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-[#FBE4D8] text-xs">
                            {computer.name}
                          </span>
                          <span className="text-[11px] text-[#DFB6B2] font-mono">
                            {computer.brand} &bull; {computer.model}
                          </span>
                        </div>
                      </td>

                      {/* Specs */}
                      <td className="py-3.5 px-4">
                        <div className="text-[11px] font-mono text-[#DFB6B2] space-y-0.5 max-w-[280px]">
                          <div className="flex items-center gap-1 text-[#FBE4D8]/90">
                            <Cpu className="w-3 h-3 text-[#DFB6B2] shrink-0" />
                            <span className="truncate">{computer.processor}</span>
                          </div>
                          <div className="flex items-center gap-2 text-[#DFB6B2]">
                            <span>RAM: {computer.ram}</span>
                            <span className="text-[#522B5B]">&bull;</span>
                            <span className="flex items-center gap-1">
                              <HardDrive className="w-3 h-3" />
                              {computer.storage}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Ubicación actual */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-[#DFB6B2]">
                          <MapPin className="w-3.5 h-3.5 text-[#DFB6B2] shrink-0" />
                          <span className="text-xs text-[#FBE4D8]">
                            {computer.location}
                          </span>
                        </div>

                        {/* Info de préstamo si está prestado */}
                        {isLoaned && computer.currentLoan && (
                          <div className="flex items-center gap-1 text-[11px] text-amber-300 font-mono mt-1">
                            <UserCheck className="w-3 h-3 shrink-0 text-amber-400" />
                            <span className="truncate max-w-[150px]" title={computer.currentLoan.borrowerName}>
                              {computer.currentLoan.borrowerName}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Estado: Badge semántico traslúcido */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <StatusBadge status={computer.status} />
                      </td>

                      {/* Acciones */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Botón "Prestar" */}
                          {isAvailable && (
                            <button
                              type="button"
                              onClick={() => openLoanModal(computer.id)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#190019] hover:bg-[#522B5B] text-[#FBE4D8] border border-[#522B5B] font-mono text-[11px] transition shadow-sm"
                              title="Prestar equipo"
                            >
                              <span>Prestar</span>
                              <ArrowUpRight className="w-3 h-3 stroke-[2]" />
                            </button>
                          )}

                          {/* Botón "Devolver" */}
                          {isLoaned && (
                            <button
                              type="button"
                              onClick={() => openReturnModal(computer.id)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber-950/40 hover:bg-amber-950/70 border border-amber-500/30 text-amber-300 font-mono text-[11px] transition shadow-sm"
                              title="Registrar devolución"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>Devolver</span>
                            </button>
                          )}

                          {/* FASE 7: Botón Desplegable del Historial de Mantenimientos */}
                          <button
                            type="button"
                            onClick={() => toggleAccordion(computer.id)}
                            className={cn(
                              'px-2.5 py-1 rounded border font-mono text-[11px] flex items-center gap-1 transition-colors',
                              isExpanded
                                ? 'bg-[#854F6C] text-[#FBE4D8] border-[#DFB6B2]'
                                : 'bg-[#190019] text-[#DFB6B2] border-[#522B5B] hover:bg-[#522B5B] hover:text-[#FBE4D8]'
                            )}
                            title="Ver historial de mantenimiento y registrar intervenciones"
                          >
                            <Wrench className="w-3 h-3" />
                            <span>Historial ({mntCount})</span>
                            {isExpanded ? (
                              <ChevronUp className="w-3 h-3" />
                            ) : (
                              <ChevronDown className="w-3 h-3" />
                            )}
                          </button>

                          {/* Eliminar registro */}
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`¿Eliminar definitivamente el equipo ${computer.id}?`)) {
                                deleteComputer(computer.id);
                              }
                            }}
                            className="p-1 rounded bg-[#190019] hover:bg-rose-950/50 text-[#DFB6B2] hover:text-rose-400 border border-[#522B5B] transition"
                            title="Eliminar equipo del sistema"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* FASE 7: Fila Expandida del Acordeón de Mantenimiento */}
                    {isExpanded && (
                      <tr>
                        <td colSpan={6} className="p-0 border-b border-[#522B5B]">
                          <MaintenanceAccordion computer={computer} />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer informativo de la tabla */}
      <div className="p-3 bg-[#190019] border-t border-[#522B5B] text-[11px] font-mono text-[#DFB6B2] flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Equipos sincronizados en tiempo real con LocalStorage</span>
        </div>
        <div>
          AuraStock Engine &bull; Rendimiento Sub-milisegundo
        </div>
      </div>
    </div>
  );
};
