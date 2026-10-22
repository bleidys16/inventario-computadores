import React from 'react';
import { useInventoryStore } from '../../store/useInventoryStore';
import { useAuthStore } from '../../store/useAuthStore';
import type { ComputerStatus } from '../../types/inventory';
import { StatusBadge } from '../common/StatusBadge';
import { formatTimeAgo } from '../../utils/timeAgo';
import { 
  Cpu, 
  HardDrive, 
  MemoryStick, 
  MapPin, 
  UserCheck, 
  ArrowUpRight, 
  RotateCcw, 
  Barcode, 
  Trash2,
  Plus,
  Laptop,
  Clock,
  Eye,
  FileText
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
    openDetailModal,
    updateStatus,
    deleteComputer,
    computers
  } = useInventoryStore();

  const { currentUser } = useAuthStore();
  const isAdmin = currentUser?.role === 'admin';

  const filteredComputers = getFilteredComputers();

  const statusTabs: (ComputerStatus | 'Todos')[] = [
    'Todos',
    'Disponible',
    'Prestado',
    'En Mantenimiento',
    'De Baja',
  ];

  return (
    <div className="bg-white rounded-2xl border border-brand-300/50 shadow-sm overflow-hidden">
      {/* Header de controles de la tabla: Tabs de filtrado y contador */}
      <div className="p-4 sm:p-5 border-b border-brand-300/40 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white">
        
        {/* Tabs de estado */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
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
                  'px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5',
                  isActive
                    ? 'bg-brand-600 text-white font-semibold shadow-sm'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                )}
              >
                <span>{tab}</span>
                <span
                  className={cn(
                    'px-1.5 py-0.2 rounded-full text-[10px]',
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-stone-100 text-stone-600'
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Resumen y Nota de Vista */}
        <div className="text-xs text-stone-600 flex items-center justify-between md:justify-end gap-3">
          <span className="text-[11px] text-stone-500 hidden sm:inline">
            Toca cualquier equipo para ver su <strong>Hoja de Vida (HV)</strong>
          </span>
          <span className="font-mono text-stone-900 font-semibold bg-stone-50 border border-brand-300/50 px-2 py-0.5 rounded-lg">
            {filteredComputers.length} {filteredComputers.length === 1 ? 'equipo' : 'equipos'}
          </span>
        </div>
      </div>

      {/* Tabla Densa en Modo Claro */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-brand-300/40 bg-stone-50 text-[11px] font-semibold tracking-wider text-stone-500 uppercase">
              <th scope="col" className="py-3.5 px-4 sm:px-5">Equipo & Foto</th>
              <th scope="col" className="py-3.5 px-4 sm:px-5">Código / ID</th>
              <th scope="col" className="py-3.5 px-4 sm:px-5">Especificaciones</th>
              <th scope="col" className="py-3.5 px-4 sm:px-5">Mantenimiento</th>
              <th scope="col" className="py-3.5 px-4 sm:px-5">Estado</th>
              {isAdmin && (
                <th scope="col" className="py-3.5 px-4 sm:px-5">Ubicación / Custodio</th>
              )}
              <th scope="col" className="py-3.5 px-4 sm:px-5 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-300/30 text-xs text-stone-800">
            {filteredComputers.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 7 : 6} className="py-14 text-center">
                  <div className="max-w-sm mx-auto flex flex-col items-center">
                    <div className="w-14 h-14 rounded-2xl bg-brand-100/60 border border-brand-300/40 flex items-center justify-center text-brand-600 mb-3 shadow-sm">
                      <Laptop className="w-7 h-7" />
                    </div>
                    <p className="font-semibold text-stone-900 text-sm">
                      {computers.length === 0 
                        ? 'Tu inventario está listo' 
                        : 'No se encontraron equipos'}
                    </p>
                    <p className="text-xs text-stone-500 mt-1 mb-4 text-center">
                      {computers.length === 0
                        ? 'Aún no has registrado ningún computador. Haz clic abajo para añadir tu primer equipo.'
                        : searchQuery
                          ? 'No hay registros que coincidan con los términos de búsqueda.'
                          : 'No hay equipos registrados con este filtro de estado.'}
                    </p>
                    {computers.length === 0 && isAdmin && (
                      <button
                        type="button"
                        onClick={openRegisterDrawer}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-600/90 text-white font-semibold text-xs shadow-sm transition active:scale-95"
                      >
                        <Plus className="w-4 h-4 stroke-[2.5]" />
                        <span>Registrar mi primer computador</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              filteredComputers.map((computer) => {
                const isAvailable = computer.status === 'Disponible';
                const isLoaned = computer.status === 'Prestado';
                const latestMnt = computer.maintenanceHistory?.[0];
                const timeAgo = formatTimeAgo(latestMnt?.date);

                return (
                  <tr
                    key={computer.id}
                    className="hover:bg-brand-100/25 transition-colors group cursor-pointer"
                    onClick={() => openDetailModal(computer.id)}
                    title="Haz clic para abrir la Hoja de Vida (HV) del equipo"
                  >
                    {/* Equipo & Foto */}
                    <td className="py-3.5 px-4 sm:px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-stone-100 border border-brand-300/50 shrink-0 shadow-sm relative">
                          {computer.imageUrl ? (
                            <img 
                              src={computer.imageUrl} 
                              alt={computer.name} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-stone-400">
                              <Laptop className="w-5 h-5" />
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col">
                          <span className="font-semibold text-stone-900 text-sm group-hover:text-brand-600 transition-colors flex items-center gap-1.5">
                            {computer.name}
                            <Eye className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-brand-600 transition-opacity" />
                          </span>
                          <span className="text-[11px] text-stone-500">
                            {computer.brand} • {computer.model}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Código / ID */}
                    <td className="py-3.5 px-4 sm:px-5 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-mono font-bold text-stone-900 text-xs">
                          {computer.id}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] font-mono text-stone-500 mt-0.5">
                          <Barcode className="w-3.5 h-3.5 shrink-0 text-stone-400" />
                          <span>{computer.barcode}</span>
                        </div>
                      </div>
                    </td>

                    {/* Especificaciones: chips discretos */}
                    <td className="py-3.5 px-4 sm:px-5">
                      <div className="flex flex-wrap items-center gap-1.5 max-w-[300px]">
                        {/* Chip CPU */}
                        <span 
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-50 border border-brand-300/50 text-[11px] text-stone-700 font-mono"
                          title={`Procesador: ${computer.processor}`}
                        >
                          <Cpu className="w-3 h-3 text-brand-600" />
                          <span className="truncate max-w-[110px]">{computer.processor}</span>
                        </span>

                        {/* Chip RAM */}
                        <span 
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-50 border border-brand-300/50 text-[11px] text-stone-700 font-mono"
                          title={`Memoria RAM: ${computer.ram}`}
                        >
                          <MemoryStick className="w-3 h-3 text-brand-600" />
                          <span>{computer.ram}</span>
                        </span>

                        {/* Chip Almacenamiento */}
                        <span 
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-50 border border-brand-300/50 text-[11px] text-stone-700 font-mono"
                          title={`Almacenamiento: ${computer.storage}`}
                        >
                          <HardDrive className="w-3 h-3 text-brand-600" />
                          <span>{computer.storage}</span>
                        </span>
                      </div>
                    </td>

                    {/* Mantenimiento: Hace cuánto se le hizo */}
                    <td className="py-3.5 px-4 sm:px-5 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5 text-stone-700 font-medium text-xs">
                          <Clock className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                          <span>{timeAgo}</span>
                        </div>
                        {latestMnt && (
                          <span className="text-[10px] font-mono text-stone-500 mt-0.5">
                            {latestMnt.date.split(' ')[0]} ({latestMnt.type})
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Estado: Badge semántico con punto de luz */}
                    <td className="py-3.5 px-4 sm:px-5 whitespace-nowrap">
                      <StatusBadge status={computer.status} />
                    </td>

                    {/* Ubicación / Custodio (Solo visible para Admin en la tabla) */}
                    {isAdmin && (
                      <td className="py-3.5 px-4 sm:px-5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-stone-700">
                          <MapPin className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                          <span className="text-xs font-semibold text-stone-800">
                            {computer.location}
                          </span>
                        </div>

                        {isLoaned && computer.currentLoan && (
                          <div className="flex items-center gap-1 text-[11px] text-amber-800 font-medium mt-1">
                            <UserCheck className="w-3 h-3 shrink-0 text-amber-600" />
                            <span className="truncate max-w-[130px]" title={computer.currentLoan.borrowerName}>
                              {computer.currentLoan.borrowerName}
                            </span>
                          </div>
                        )}
                      </td>
                    )}

                    {/* Acciones */}
                    <td 
                      className="py-3.5 px-4 sm:px-5 whitespace-nowrap text-right"
                      onClick={(e) => e.stopPropagation()} // Evita abrir el modal al pulsar botones específicos
                    >
                      <div className="flex items-center justify-end gap-2">
                        {/* Botón Ver HV Ficha */}
                        <button
                          type="button"
                          onClick={() => openDetailModal(computer.id)}
                          className="p-1.5 rounded-lg bg-stone-100 hover:bg-brand-100 text-stone-600 hover:text-brand-600 border border-stone-200 transition"
                          title="Ver Hoja de Vida (HV)"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>

                        {/* Botón "Prestar" (visible en Disponible tanto para Usuario como para Admin) */}
                        {isAvailable && (
                          <button
                            type="button"
                            onClick={() => openLoanModal(computer.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-600/90 text-white font-semibold text-xs transition shadow-sm active:scale-95"
                            title="Prestar este computador"
                          >
                            <span>Prestar</span>
                            <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                          </button>
                        )}

                        {/* Botón "Devolver" (visible para Admin en Prestado) */}
                        {isLoaned && isAdmin && (
                          <button
                            type="button"
                            onClick={() => openReturnModal(computer.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-semibold text-xs transition shadow-sm active:scale-95"
                            title="Registrar devolución"
                          >
                            <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
                            <span>Devolver</span>
                          </button>
                        )}

                        {/* Acciones de administración */}
                        {isAdmin && (
                          <div className="inline-flex items-center gap-1">
                            {computer.status === 'En Mantenimiento' && (
                              <button
                                type="button"
                                onClick={() => updateStatus(computer.id, 'Disponible', 'Mantenimiento finalizado con éxito')}
                                className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 text-[11px] font-medium transition"
                                title="Marcar como Disponible"
                              >
                                Dar de Alta
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`¿Eliminar definitivamente el equipo ${computer.id}?`)) {
                                  deleteComputer(computer.id);
                                }
                              }}
                              className="p-1.5 rounded-lg bg-stone-100 hover:bg-rose-50 text-stone-400 hover:text-rose-600 border border-stone-200 hover:border-rose-200 transition"
                              title="Eliminar registro"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer informativo de la tabla */}
      <div className="p-3.5 bg-stone-50 border-t border-brand-300/40 text-[11px] text-stone-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Equipos en tiempo real guardados en tu almacenamiento local</span>
        </div>
        <div className="font-mono text-[10px] text-stone-400">
          Rol activo: <strong className="text-brand-600">{isAdmin ? 'Administrador (HV Completa)' : 'Usuario (Consulta y Préstamos)'}</strong>
        </div>
      </div>
    </div>
  );
};
