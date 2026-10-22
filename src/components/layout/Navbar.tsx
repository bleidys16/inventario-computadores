import React, { useRef, useEffect } from 'react';
import { useInventoryStore } from '../../store/useInventoryStore';
import { useAuthStore } from '../../store/useAuthStore';
import { 
  Search, 
  Plus, 
  LogOut, 
  X, 
  Scan, 
  CheckCircle2, 
  Zap, 
  Cpu, 
  Server, 
  Activity 
} from 'lucide-react';
import logoImg from '../../assets/aurastocklogo.png';

export const Navbar: React.FC = () => {
  const { 
    searchQuery, 
    setSearchQuery, 
    openRegisterDrawer,
    isScannerMode,
    setScannerMode,
    searchExecutionTime,
    hasMeasuredScan,
    activeTab,
    setActiveTab,
    computers
  } = useInventoryStore();

  const { user, logout } = useAuthStore();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus search input when Scanner Mode is activated
  useEffect(() => {
    if (isScannerMode && searchInputRef.current) {
      searchInputRef.current.focus();
      searchInputRef.current.select();
    }
  }, [isScannerMode]);

  const handleScannerToggle = () => {
    const nextState = !isScannerMode;
    setScannerMode(nextState);
    if (nextState && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const simulateScan = (barcode: string) => {
    if (searchInputRef.current) {
      searchInputRef.current.value = barcode;
    }
    setSearchQuery(barcode);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#190019] border-b border-[#522B5B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Fila Superior: Logo, Barra de Búsqueda y Acciones de Usuario */}
        <div className="py-3 flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Marca & Logo */}
          <div className="flex items-center gap-3 shrink-0 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-2.5">
              <img 
                src={logoImg} 
                alt="AuraStock" 
                className="h-9 w-auto object-contain brightness-110" 
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold tracking-tight text-[#FBE4D8] font-mono">
                    AuraStock
                  </span>
                  <span className="text-[10px] font-mono uppercase bg-[#2B124C] text-[#DFB6B2] px-1.5 py-0.5 rounded border border-[#522B5B]">
                    v2.4 Core
                  </span>
                </div>
                <p className="text-[11px] text-[#DFB6B2] hidden sm:block">
                  Control y Gestión Técnica de Hardware TI
                </p>
              </div>
            </div>

            {/* Quick Mobile Counter */}
            <div className="flex md:hidden items-center gap-1.5 text-xs font-mono text-[#DFB6B2] bg-[#2B124C] px-2 py-1 rounded border border-[#522B5B]">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>{computers.length} PCs</span>
            </div>
          </div>

          {/* FASE 6: Barra de Búsqueda Unificada y Modo Escáner */}
          <div className="w-full md:max-w-xl flex-1 flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#DFB6B2]">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    isScannerMode 
                      ? "Modo Escáner: Esperando lectura de código de barras..." 
                      : "Buscar por ID, Serial, Modelo, CPU, Ubicación o Custodio..."
                  }
                  className={`w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-[#2B124C] text-[#FBE4D8] placeholder-[#DFB6B2]/60 rounded border transition-colors outline-none ${
                    isScannerMode
                      ? 'border-[#854F6C] ring-1 ring-[#854F6C]'
                      : 'border-[#522B5B] focus:border-[#DFB6B2]'
                  }`}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-[#DFB6B2] hover:text-[#FBE4D8] transition"
                    title="Limpiar búsqueda"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Botón "Modo Escáner Activo" */}
              <button
                type="button"
                onClick={handleScannerToggle}
                className={`flex items-center gap-2 px-3 py-2 text-xs font-mono uppercase tracking-wider rounded border transition-all select-none shrink-0 ${
                  isScannerMode
                    ? 'bg-[#854F6C] text-[#FBE4D8] border-[#DFB6B2] shadow-sm'
                    : 'bg-[#2B124C] text-[#DFB6B2] border-[#522B5B] hover:bg-[#522B5B] hover:text-[#FBE4D8]'
                }`}
                title="Activar escaneo continuo con autofocus"
              >
                <Scan className={`w-3.5 h-3.5 ${isScannerMode ? 'text-[#FBE4D8] animate-pulse' : 'text-[#DFB6B2]'}`} />
                <span className="hidden sm:inline">
                  {isScannerMode ? 'Escáner Activo' : 'Modo Escáner'}
                </span>
                <span className="sm:hidden">
                  {isScannerMode ? 'Activo' : 'Escáner'}
                </span>
              </button>
            </div>

            {/* FASE 6 - Métrica de Rendimiento en Tiempo Real (performance.now) */}
            <div className="flex flex-wrap items-center justify-between text-[11px] font-mono px-1">
              <div className="flex items-center gap-1.5">
                {hasMeasuredScan || isScannerMode ? (
                  <div className="inline-flex items-center gap-1.5 text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>
                      Escaneo completado en{' '}
                      <strong className="text-emerald-300 font-semibold">{searchExecutionTime} ms</strong>
                      {' '}&mdash; Cumple &lt; 1s
                    </span>
                  </div>
                ) : (
                  <span className="text-[#DFB6B2]/80 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-[#DFB6B2]" />
                    Motor de filtrado en memoria activo
                  </span>
                )}
              </div>

              {/* Simuladores rápidos de código de barras */}
              <div className="hidden lg:flex items-center gap-1.5 text-[#DFB6B2]">
                <span className="text-[10px] text-[#DFB6B2]/70">Simular código:</span>
                <button
                  onClick={() => simulateScan('770928374011')}
                  className="px-1.5 py-0.5 bg-[#2B124C] hover:bg-[#522B5B] text-[#FBE4D8] rounded border border-[#522B5B] text-[10px]"
                >
                  770928374011
                </button>
                <button
                  onClick={() => simulateScan('770928374022')}
                  className="px-1.5 py-0.5 bg-[#2B124C] hover:bg-[#522B5B] text-[#FBE4D8] rounded border border-[#522B5B] text-[10px]"
                >
                  770928374022
                </button>
                <button
                  onClick={() => simulateScan('770928374044')}
                  className="px-1.5 py-0.5 bg-[#2B124C] hover:bg-[#522B5B] text-[#FBE4D8] rounded border border-[#522B5B] text-[10px]"
                >
                  770928374044
                </button>
              </div>
            </div>
          </div>

          {/* Acciones & Usuario */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Botón "+ Nuevo Equipo" */}
            <button
              type="button"
              onClick={openRegisterDrawer}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded bg-[#FBE4D8] hover:bg-[#DFB6B2] text-[#190019] font-mono font-semibold text-xs transition shadow-sm"
              title="Registrar nuevo equipo"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">+ Nuevo Equipo</span>
            </button>

            {/* Separador */}
            <div className="h-6 w-[1px] bg-[#522B5B] hidden sm:block" />

            {/* Usuario & Logout */}
            <div className="flex items-center gap-2">
              <div className="hidden md:flex flex-col text-right">
                <span className="text-xs font-semibold text-[#FBE4D8] truncate max-w-[120px]">
                  {user?.name || 'Administrador'}
                </span>
                <span className="text-[10px] text-[#DFB6B2] truncate max-w-[120px] font-mono">
                  {user?.role || 'Admin TI'}
                </span>
              </div>

              <button
                type="button"
                onClick={logout}
                className="p-2 rounded bg-[#2B124C] hover:bg-[#522B5B] border border-[#522B5B] text-[#DFB6B2] hover:text-[#FBE4D8] transition"
                title="Cerrar Sesión"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* FASE 8: Pestañas de Navegación Secundarias */}
        <nav className="flex items-center space-x-1 border-t border-[#522B5B]/80 pt-1 -mb-px overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-mono font-medium uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'inventory'
                ? 'border-[#FBE4D8] text-[#FBE4D8] bg-[#2B124C]/60'
                : 'border-transparent text-[#DFB6B2] hover:text-[#FBE4D8] hover:border-[#522B5B]'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>1. Inventario y Préstamos</span>
            <span className="ml-1 text-[10px] px-1.5 py-0.2 bg-[#522B5B] text-[#FBE4D8] rounded font-mono">
              {computers.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('nodes')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-mono font-medium uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'nodes'
                ? 'border-[#FBE4D8] text-[#FBE4D8] bg-[#2B124C]/60'
                : 'border-transparent text-[#DFB6B2] hover:text-[#FBE4D8] hover:border-[#522B5B]'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>2. Geolocalización de Nodos</span>
            <span className="text-[10px] px-1 bg-[#854F6C]/40 text-[#DFB6B2] rounded border border-[#522B5B]">
              Simulado
            </span>
          </button>

          <button
            onClick={() => setActiveTab('quotes')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-mono font-medium uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'quotes'
                ? 'border-[#FBE4D8] text-[#FBE4D8] bg-[#2B124C]/60'
                : 'border-transparent text-[#DFB6B2] hover:text-[#FBE4D8] hover:border-[#522B5B]'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>3. Cotizaciones Proveedores TI</span>
            <span className="text-[10px] px-1 bg-[#854F6C]/40 text-[#DFB6B2] rounded border border-[#522B5B]">
              3 Mayoristas
            </span>
          </button>
        </nav>

      </div>
    </header>
  );
};
