import React from 'react';
import { useInventoryStore } from '../store/useInventoryStore';
import { Navbar } from '../components/layout/Navbar';
import { KpiGrid } from '../components/dashboard/KpiGrid';
import { ComputerTable } from '../components/dashboard/ComputerTable';
import { NodesView } from '../components/dashboard/NodesView';
import { QuotesView } from '../components/dashboard/QuotesView';
import { RegisterComputerSheet } from '../components/sheet/RegisterComputerSheet';
import { LoanModal } from '../components/modals/LoanModal';
import { ReturnModal } from '../components/modals/ReturnModal';
import { Database, Terminal, ShieldCheck } from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { activeTab, computers, nodes } = useInventoryStore();

  const availableCount = computers.filter((c) => c.status === 'Disponible').length;
  const loanedCount = computers.filter((c) => c.status === 'Prestado').length;
  const maintenanceCount = computers.filter((c) => c.status === 'En Mantenimiento').length;
  const activeNodesCount = nodes.filter((n) => n.networkStatus === 'Activo').length;

  return (
    <div className="min-h-screen bg-[#190019] text-[#FBE4D8] flex flex-col font-sans">
      {/* 1. Navbar Superior con Búsqueda, Modo Escáner y Pestañas */}
      <Navbar />

      {/* 2. Contenedor Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Banner Técnico de Estado Operativo */}
        <div className="bg-[#2B124C] border border-[#522B5B] rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#DFB6B2]" />
            <span className="text-[#DFB6B2] uppercase tracking-wider text-[11px]">
              Panel de Control Operativo
            </span>
            <span className="text-[#522B5B]">&bull;</span>
            <span className="text-[#FBE4D8]">
              {activeTab === 'inventory' && 'Inventario Principal y Control de Préstamos'}
              {activeTab === 'nodes' && 'Topología de Red y Distribución Física'}
              {activeTab === 'quotes' && 'Cotizaciones y Suministros TI Mayoristas'}
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-[#DFB6B2]">Disponibles:</span>
              <span className="text-[#FBE4D8] font-semibold">{availableCount}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-[#DFB6B2]">En Préstamo:</span>
              <span className="text-[#FBE4D8] font-semibold">{loanedCount}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              <span className="text-[#DFB6B2]">Mantenimiento:</span>
              <span className="text-[#FBE4D8] font-semibold">{maintenanceCount}</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 border-l border-[#522B5B] pl-3">
              <Database className="w-3.5 h-3.5 text-[#DFB6B2]" />
              <span className="text-[#DFB6B2]">Nodos Activos:</span>
              <span className="text-[#FBE4D8] font-semibold">{activeNodesCount}/{nodes.length}</span>
            </div>
          </div>
        </div>

        {/* 3. Vistas según la pestaña activa */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <section aria-label="Métricas de Inventario">
              <KpiGrid />
            </section>
            <section aria-label="Tabla de Equipos">
              <ComputerTable />
            </section>
          </div>
        )}

        {activeTab === 'nodes' && (
          <section aria-label="Geolocalización de Nodos">
            <NodesView />
          </section>
        )}

        {activeTab === 'quotes' && (
          <section aria-label="Cotizaciones Proveedores TI">
            <QuotesView />
          </section>
        )}

      </main>

      {/* 4. Modales y Paneles Deslizantes Preexistentes */}
      <RegisterComputerSheet />
      <LoanModal />
      <ReturnModal />

      {/* Footer Minimalista Técnico */}
      <footer className="border-t border-[#522B5B] bg-[#190019] py-4 px-4 text-xs font-mono text-[#DFB6B2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>AuraStock Core TI &mdash; Persistencia LocalStorage Activa</span>
          </div>
          <div className="text-[11px] text-[#DFB6B2]/70">
            Arquitectura React 19 + TypeScript + Zustand + Tailwind CSS
          </div>
        </div>
      </footer>
    </div>
  );
};
