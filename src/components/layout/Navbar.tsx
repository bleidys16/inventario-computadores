import React from 'react';
import { useInventoryStore } from '../../store/useInventoryStore';
import { useAuthStore } from '../../store/useAuthStore';
import { 
  Search, 
  Plus, 
  LogOut, 
  X, 
  Users, 
  Layers, 
  Laptop, 
  ArrowRightLeft
} from 'lucide-react';
import logoImg from '../../assets/aurastocklogo.png';

export const Navbar: React.FC = () => {
  const { 
    searchQuery, 
    setSearchQuery, 
    openRegisterDrawer, 
    openUserManagementModal,
    activeTab,
    setActiveTab 
  } = useInventoryStore();

  const { currentUser, logout, switchUserRole } = useAuthStore();
  const isAdmin = currentUser?.role === 'admin';

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-brand-300/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Fila Principal de la Navbar (h-16) */}
        <div className="h-16 flex items-center justify-between gap-3 sm:gap-4">
          
          {/* Lado izquierdo: Logo oficial SUELTO y transparente + Nombre de Marca */}
          <div className="flex items-center gap-3 shrink-0">
            <img 
              src={logoImg} 
              alt="AuraStock" 
              className="h-10 w-auto object-contain cursor-pointer"
              onClick={() => setActiveTab('inventory')} 
            />
            <div>
              <div className="flex items-center gap-2">
                <span 
                  className="text-xl font-bold tracking-tight text-brand-600 font-sans cursor-pointer"
                  onClick={() => setActiveTab('inventory')}
                >
                  AuraStock
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-brand-100 text-brand-600 border border-brand-300/60">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-stone-500 leading-none hidden sm:block">
                Gestión Integral de Equipos
              </p>
            </div>
          </div>

          {/* Centro: Barra de Búsqueda reactiva en tiempo real */}
          <div className="flex-1 max-w-md mx-2 sm:mx-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por ID, modelo, RAM, CPU o custodio..."
                className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-stone-50/80 border border-brand-300/60 rounded-xl text-stone-800 placeholder-stone-400 focus:bg-white focus:outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600 transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-stone-400 hover:text-stone-700 transition"
                  title="Limpiar búsqueda"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Lado derecho: Acciones de Rol y Perfil de Usuario */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Botón "+ Nuevo Equipo" (Solo visible para Administrador) */}
            {isAdmin && (
              <button
                type="button"
                onClick={openRegisterDrawer}
                className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-600/90 text-white font-semibold text-xs sm:text-sm transition-all shadow-sm active:scale-95"
                title="Registrar nuevo equipo"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span className="hidden xs:inline sm:inline">+ Nuevo Equipo</span>
              </button>
            )}

            {/* Botón "Gestión de Usuarios" (Solo visible para Administrador) */}
            {isAdmin && (
              <button
                type="button"
                onClick={openUserManagementModal}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 hover:bg-brand-100/70 border border-stone-200 hover:border-brand-300 text-stone-700 hover:text-brand-600 text-xs font-semibold transition"
                title="Crear y administrar usuarios"
              >
                <Users className="w-4 h-4 text-brand-600" />
                <span className="hidden md:inline">Usuarios</span>
              </button>
            )}

            {/* Separador */}
            <div className="h-6 w-[1px] bg-brand-300/60 hidden sm:block" />

            {/* Perfil & Conmutador Rápido de Rol */}
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-semibold text-stone-800 truncate max-w-[130px]">
                  {currentUser?.name || 'Usuario'}
                </span>
                
                {/* Conmutador interactivo de Rol para pruebas inmediatas */}
                <div className="flex items-center justify-end gap-1 mt-0.5">
                  <span className={`text-[10px] font-mono uppercase font-bold px-1.5 py-0.2 rounded-full border ${
                    isAdmin 
                      ? 'bg-brand-100 text-brand-600 border-brand-300/60' 
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}>
                    {isAdmin ? 'Admin' : 'Usuario'}
                  </span>
                  
                  <button
                    type="button"
                    onClick={() => switchUserRole(isAdmin ? 'usuario' : 'admin')}
                    className="text-[10px] text-stone-400 hover:text-brand-600 flex items-center gap-0.5 underline transition"
                    title={`Cambiar a vista de ${isAdmin ? 'Usuario' : 'Administrador'}`}
                  >
                    <ArrowRightLeft className="w-2.5 h-2.5" />
                    <span>Cambiar</span>
                  </button>
                </div>
              </div>

              {/* Botón Logout */}
              <button
                type="button"
                onClick={logout}
                className="p-2 rounded-xl bg-stone-100 hover:bg-brand-100/70 border border-stone-200 hover:border-brand-300 text-stone-600 hover:text-brand-600 transition"
                title="Cerrar Sesión"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

        {/* Fila de Pestañas Secundarias (Navegación Fluida: Inventario vs Cotizaciones TI) */}
        <nav className="flex items-center space-x-2 border-t border-brand-300/40 py-1.5 -mb-px text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('inventory')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'inventory'
                ? 'bg-brand-100 text-brand-600 font-bold border border-brand-300/60 shadow-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            <span>Inventario y Préstamos</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('quotes')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'quotes'
                ? 'bg-brand-100 text-brand-600 font-bold border border-brand-300/60 shadow-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Cotizaciones Proveedores TI (Mayoristas)</span>
          </button>

          {isAdmin && (
            <button
              type="button"
              onClick={openUserManagementModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-stone-600 hover:text-brand-600 hover:bg-stone-100 transition-all ml-auto"
            >
              <Users className="w-3.5 h-3.5 text-brand-600" />
              <span>Gestión de Roles ({currentUser?.role})</span>
            </button>
          )}
        </nav>

      </div>
    </header>
  );
};
