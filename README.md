# AuraStock - Sistema de Control de Inventario TI

SPA moderna, ligera y profesional para el control de inventario y gestión de préstamos de computadores y activos tecnológicos.

![AuraStock Logo](./aurastocklogo.png)

## 🚀 Características Principales

- **Gestión Integral de Activos**: Registro detallado de equipos (ID, código de barras, marca, modelo, procesador, memoria RAM, almacenamiento y ubicación).
- **Flujo de Préstamos**: Registro de custodio, documento de identidad, rol, sala destino y fecha estimada de retorno con actualización automática de estado.
- **Registro de Devoluciones**: Reintegro de equipos en préstamo con reubicación automática a Bodega Central y notas de recepción física.
- **Métricas y KPIs en Tiempo Real**: Tarjetas interactivas con conteos de equipos Totales, Disponibles, Prestados y en Mantenimiento con filtrado rápido al hacer clic.
- **Búsqueda Dinámica**: Búsqueda en tiempo real por ID, modelo, especificaciones, ubicación o nombre de custodio.
- **Panel Deslizante (Sheet / Drawer)**: Interfaz ergonómica para alta rápida de nuevos equipos.
- **Persistencia Local**: Almacenamiento automático y seguro en `localStorage` mediante Zustand Persist.
- **Diseño en Modo Claro & Paleta de Marca**:
  - `#854F6C` (Acento primario de marca)
  - `#DFB6B2` (Bordes y separadores)
  - `#FBE4D8` (Fondos sutiles y resaltados)
  - Badges semánticos para estados: Disponible, Prestado, En Mantenimiento y De Baja.

## 🛠️ Stack Tecnológico

- **Framework**: React 19 + TypeScript + Vite
- **Estilos**: Tailwind CSS
- **Iconografía**: Lucide React
- **Primitivas UI Accesibles**: Radix UI Dialog
- **Gestión de Estado**: Zustand con middleware Persist

## 📦 Instalación y Ejecución

```bash
# 1. Clonar el repositorio
git clone https://github.com/bleidys16/inventario-computadores.git
cd inventario-computadores

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev

# 4. Construir para producción
npm run build
```

---

Desarrollado con ❤️ para la gestión ágil de activos tecnológicos.
