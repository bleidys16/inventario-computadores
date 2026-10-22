import React from 'react';
import type { ComputerStatus } from '../../types/inventory';

interface StatusBadgeProps {
  status: ComputerStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  const config = {
    'Disponible': {
      label: 'Disponible',
      classes: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dot: 'bg-emerald-500',
    },
    'Prestado': {
      label: 'Prestado',
      classes: 'bg-amber-50 text-amber-800 border-amber-200',
      dot: 'bg-amber-500',
    },
    'En Mantenimiento': {
      label: 'En Mantenimiento',
      classes: 'bg-rose-50 text-rose-700 border-rose-200',
      dot: 'bg-rose-500',
    },
    'De Baja': {
      label: 'De Baja',
      classes: 'bg-stone-100 text-stone-600 border-stone-200',
      dot: 'bg-stone-400',
    },
  }[status] || {
    label: status as string,
    classes: 'bg-stone-100 text-stone-700 border-stone-200',
    dot: 'bg-stone-500',
  };

  const sizeClasses = size === 'sm'
    ? 'text-[11px] px-2.5 py-0.5'
    : 'text-xs px-3 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${config.classes} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <span>{config.label}</span>
    </span>
  );
};
