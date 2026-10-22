import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { KpiGrid } from '../components/dashboard/KpiGrid';
import { ComputerTable } from '../components/dashboard/ComputerTable';
import { QuotesView } from '../components/dashboard/QuotesView';
import { ComputerDetailModal } from '../components/dashboard/ComputerDetailModal';
import { UserManagementModal } from '../components/dashboard/UserManagementModal';
import { RegisterComputerSheet } from '../components/sheet/RegisterComputerSheet';
import { LoanModal } from '../components/modals/LoanModal';
import { ReturnModal } from '../components/modals/ReturnModal';
import { useInventoryStore } from '../store/useInventoryStore';
import { Database } from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { activeTab } = useInventoryStore();

  return (
    <div className="min-h-screen bg-[#FDFBF9] text-stone-900 flex flex-col selection:bg-brand-600 selection:text-white font-sans">
      {/* 1. Navbar Superior Fija en Modo Claro */}
      <Navbar />

      {/* 2. Contenedor Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {activeTab === 'quotes' ? (
          <div>
            <div className="mb-6 pb-4 border-b border-brand-300/40">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900 font-sans">
                Cotizaciones de Componentes TI
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                Comparativa en tiempo real de precios de repuestos mayoristas (Proveedor Alfa, Beta y Gamma) para optimizar costos de mantenimiento.
              </p>
            </div>
            <QuotesView />
          </div>
        ) : (
          <>
            {/* Banner superior de bienvenida */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-brand-300/40">
              <div>
                <div className="flex items-center gap-2.5 mb-1">
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900 font-sans">
                    Inventario de Computadores
                  </h1>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    En Línea
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-stone-500">
                  Control de préstamos, salas, especificaciones de hardware y trazabilidad.
                </p>
              </div>

              <div className="flex items-center gap-2 self-start md:self-auto text-xs text-stone-600 bg-white border border-brand-300/50 px-3.5 py-2 rounded-xl shadow-sm">
                <Database className="w-3.5 h-3.5 text-brand-600" />
                <span className="font-medium">Almacenamiento Local Activo</span>
              </div>
            </div>

            {/* 3. Fila de KPIs */}
            <section aria-label="Métricas de Inventario">
              <KpiGrid />
            </section>

            {/* 4. Tabla Densa con Listado de Equipos */}
            <section aria-label="Tabla de Equipos">
              <ComputerTable />
            </section>
          </>
        )}

      </main>

      {/* 5. Modales, Hojas de Vida y Paneles Deslizantes */}
      <RegisterComputerSheet />
      <LoanModal />
      <ReturnModal />
      <ComputerDetailModal />
      <UserManagementModal />

      {/* Footer minimalista */}
      <footer className="border-t border-brand-300/40 bg-white py-4 px-4 text-center text-xs text-stone-500">
        <p>AuraStock © 2025 • Control Inteligente de Inventario TI.</p>
      </footer>
    </div>
  );
};
