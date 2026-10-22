import React from 'react';
import type { ComputerStatus } from '../../types/inventory';
import { cn } from '../../utils/cn';

interface StatusBadgeProps {
  status: ComputerStatus;
  className?: string;
  showDot?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className,
  showDot = true,
}) => {
  let badgeStyles = '';
  let dotStyles = '';

  switch (status) {
    case 'Disponible':
      badgeStyles = 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/60';
      dotStyles = 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]';
      break;

    case 'Prestado':
      badgeStyles = 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100/60';
      dotStyles = 'bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.5)]';
      break;

    case 'En Mantenimiento':
      badgeStyles = 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100/60';
      dotStyles = 'bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.5)]';
      break;

    case 'De Baja':
      badgeStyles = 'bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200/60';
      dotStyles = 'bg-stone-400';
      break;

    default:
      badgeStyles = 'bg-stone-100 text-stone-700 border-stone-200';
      dotStyles = 'bg-stone-400';
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border tracking-wide transition-colors whitespace-nowrap',
        badgeStyles,
        className
      )}
    >
      {showDot && (
        <span
          className={cn('w-1.5 h-1.5 rounded-full inline-block shrink-0', dotStyles)}
          aria-hidden="true"
        />
      )}
      <span>{status}</span>
    </span>
  );
};
