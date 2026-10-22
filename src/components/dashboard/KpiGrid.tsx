import React from 'react';
import { useInventoryStore } from '../../store/useInventoryStore';
import type { ComputerStatus } from '../../types/inventory';
import { Laptop, CheckCircle2, Clock, Wrench } from 'lucide-react';
import { cn } from '../../utils/cn';

export const KpiGrid: React.FC = () => {
  const { getStats, statusFilter, setStatusFilter } = useInventoryStore();
  const stats = getStats();

  const handleCardClick = (targetStatus: ComputerStatus | 'Todos') => {
    if (statusFilter === targetStatus) {
      setStatusFilter('Todos');
    } else {
      setStatusFilter(targetStatus);
    }
  };

  const cards = [
    {
      id: 'todos' as const,
      label: 'Total de Equipos',
      filterValue: 'Todos' as const,
      count: stats.total,
      description: 'Hardware en inventario',
      icon: Laptop,
      colorClasses: {
        activeRing: 'border-[#FBE4D8] ring-1 ring-[#FBE4D8]',
        iconBg: 'bg-[#190019] text-[#DFB6B2] border border-[#522B5B]',
        countColor: 'text-[#FBE4D8]',
      },
    },
    {
      id: 'disponible' as const,
      label: 'Disponibles',
      filterValue: 'Disponible' as const,
      count: stats.available,
      description: 'Listos para préstamo',
      icon: CheckCircle2,
      colorClasses: {
        activeRing: 'border-emerald-400 ring-1 ring-emerald-400',
        iconBg: 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/30',
        countColor: 'text-emerald-300',
      },
    },
    {
      id: 'prestado' as const,
      label: 'Prestados',
      filterValue: 'Prestado' as const,
      count: stats.loaned,
      description: 'En asignación activa',
      icon: Clock,
      colorClasses: {
        activeRing: 'border-amber-400 ring-1 ring-amber-400',
        iconBg: 'bg-amber-950/40 text-amber-400 border border-amber-500/30',
        countColor: 'text-amber-300',
      },
    },
    {
      id: 'mantenimiento' as const,
      label: 'En Mantenimiento',
      filterValue: 'En Mantenimiento' as const,
      count: stats.maintenance,
      description: 'En revisión técnica',
      icon: Wrench,
      colorClasses: {
        activeRing: 'border-rose-400 ring-1 ring-rose-400',
        iconBg: 'bg-rose-950/40 text-rose-400 border border-rose-500/30',
        countColor: 'text-rose-300',
      },
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => {
        const Icon = card.icon;
        const isActive = statusFilter === card.filterValue;

        return (
          <button
            key={card.id}
            type="button"
            onClick={() => handleCardClick(card.filterValue)}
            className={cn(
              'group relative flex items-start justify-between p-4 rounded-xl bg-[#2B124C] border text-left transition-all duration-150 cursor-pointer',
              'hover:border-[#854F6C]',
              isActive
                ? cn('bg-[#2B124C]', card.colorClasses.activeRing)
                : 'border-[#522B5B]'
            )}
          >
            <div>
              <span className="text-[11px] font-mono uppercase text-[#DFB6B2] block mb-1">
                {card.label}
              </span>
              <div className="flex items-baseline gap-2">
                <span className={cn('text-2xl font-mono font-bold tracking-tight', card.colorClasses.countColor)}>
                  {card.count}
                </span>
                <span className="text-[11px] text-[#DFB6B2]/70 font-mono">
                  {stats.total > 0 ? `${Math.round((card.count / stats.total) * 100)}%` : '0%'}
                </span>
              </div>
              <p className="text-[11px] text-[#DFB6B2] mt-1 truncate max-w-[160px]">
                {card.description}
              </p>
            </div>

            <div
              className={cn(
                'w-9 h-9 rounded flex items-center justify-center shrink-0 transition-transform group-hover:scale-105',
                card.colorClasses.iconBg
              )}
            >
              <Icon className="w-4 h-4" />
            </div>

            {isActive && (
              <span className="absolute bottom-1.5 right-3 text-[9px] font-mono font-bold tracking-wider uppercase text-[#FBE4D8]">
                &bull; Activo
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
