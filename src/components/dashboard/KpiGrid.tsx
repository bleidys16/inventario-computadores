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
      description: 'Activos en el sistema',
      icon: Laptop,
      colorClasses: {
        activeRing: 'ring-2 ring-brand-600 border-brand-600',
        iconBg: 'bg-brand-100 text-brand-600 border border-brand-300/60',
        countColor: 'text-stone-900',
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
        activeRing: 'ring-2 ring-emerald-500 border-emerald-500',
        iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
        countColor: 'text-emerald-700',
      },
    },
    {
      id: 'prestado' as const,
      label: 'Prestados',
      filterValue: 'Prestado' as const,
      count: stats.loaned,
      description: 'En uso activo',
      icon: Clock,
      colorClasses: {
        activeRing: 'ring-2 ring-amber-500 border-amber-500',
        iconBg: 'bg-amber-50 text-amber-600 border border-amber-200',
        countColor: 'text-amber-800',
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
        activeRing: 'ring-2 ring-rose-500 border-rose-500',
        iconBg: 'bg-rose-50 text-rose-600 border border-rose-200',
        countColor: 'text-rose-700',
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
              'group relative flex items-start justify-between p-4 sm:p-5 rounded-2xl bg-white border text-left transition-all duration-200 cursor-pointer shadow-sm',
              'hover:translate-y-[-2px] hover:shadow-md hover:border-brand-600/50',
              isActive
                ? cn('border-transparent shadow-brand-soft', card.colorClasses.activeRing)
                : 'border-brand-300/50'
            )}
          >
            <div>
              <span className="text-xs font-semibold text-stone-500 block mb-1">
                {card.label}
              </span>
              <div className="flex items-baseline gap-2">
                <span className={cn('text-3xl font-bold tracking-tight', card.colorClasses.countColor)}>
                  {card.count}
                </span>
                <span className="text-[11px] text-stone-400 font-medium">
                  {stats.total > 0 ? `${Math.round((card.count / stats.total) * 100)}%` : '0%'}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 mt-1 truncate max-w-[160px]">
                {card.description}
              </p>
            </div>

            <div
              className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105',
                card.colorClasses.iconBg
              )}
            >
              <Icon className="w-5 h-5" />
            </div>

            {/* Indicador de filtro activo */}
            {isActive && (
              <span className="absolute bottom-2 right-3 text-[10px] font-bold tracking-wide uppercase text-brand-600">
                • Filtro activo
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
