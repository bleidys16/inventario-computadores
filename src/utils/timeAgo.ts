/**
 * Calcula de manera legible hace cuánto tiempo ocurrió una fecha dada
 */
export function formatTimeAgo(dateInput?: string | null): string {
  if (!dateInput) return 'Sin mantenimientos registrados';

  const date = new Date(dateInput);
  if (isNaN(date.getTime())) {
    // Si viene en formato "YYYY-MM-DD HH:mm", intentar parsear
    const parts = dateInput.split(' ');
    if (parts.length >= 1) {
      const parsed = new Date(parts[0]);
      if (!isNaN(parsed.getTime())) {
        return calculateRelative(parsed);
      }
    }
    return dateInput;
  }

  return calculateRelative(date);
}

function calculateRelative(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 0) return 'Hoy';
  if (diffInSeconds < 60) return 'Hace unos momentos';
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return diffInMinutes === 1 ? 'Hace 1 minuto' : `Hace ${diffInMinutes} minutos`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return diffInHours === 1 ? 'Hace 1 hora' : `Hace ${diffInHours} horas`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return diffInDays === 1 ? 'Hace 1 día' : `Hace ${diffInDays} días`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return diffInMonths === 1 ? 'Hace 1 mes' : `Hace ${diffInMonths} meses`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return diffInYears === 1 ? 'Hace 1 año' : `Hace ${diffInYears} años`;
}
