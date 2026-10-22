import React from 'react';
import type { ComputerStatus } from '../../types/inventory';

interface StatusBadgeProps {
  status: ComputerStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  const config = {
    'Disponible': {
      label: 'DISPONIBLE',
      classes: 'bg-emerald-950/50 text-emerald-300 border-emerald-500/30',
      dot: 'bg-emerald-400',
    },
    'Prestado': {
      label: 'PRESTADO',
      classes: 'bg-amber-950/50 text-amber-300 border-amber-500/30',
      dot: 'bg-amber-400',
    },
    'En Mantenimiento': {
      label: 'MANTENIMIENTO',
      classes: 'bg-rose-950/50 text-rose-300 border-rose-500/30',
      dot: 'bg-rose-400 animate-pulse',
    },
    'De Baja': {
      label: 'DE BAJA',
      classes: 'bg-zinc-900/70 text-zinc-400 border-zinc-600/30',
      dot: 'bg-zinc-500',
    },
  }[status] || {
    label: (status as string).toUpperCase(),
    classes: 'bg-brand-900 text-brand-300 border-brand-800',
    dot: 'bg-brand-600',
  };

  const sizeClasses = size === 'sm'
    ? 'text-[11px] px-2 py-0.5 tracking-wider'
    : 'text-xs px-2.5 py-1 tracking-wider';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono font-medium rounded border ${config.classes} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <span>{config.label}</span>
    </span>
  );
};
