import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useInventoryStore } from '../../store/useInventoryStore';
import { useAuthStore } from '../../store/useAuthStore';
import type { UserRole } from '../../types/inventory';
import { 
  Users, 
  X, 
  UserPlus, 
  ShieldCheck, 
  User, 
  Trash2, 
  Check, 
  AlertCircle, 
  ArrowRightLeft 
} from 'lucide-react';

export const UserManagementModal: React.FC = () => {
  const { isUserManagementModalOpen, closeUserManagementModal } = useInventoryStore();
  const { users, currentUser, createUser, deleteUser, setCurrentUser } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('user123');
  const [role, setRole] = useState<UserRole>('usuario');
  const [department, setDepartment] = useState('Ingeniería TI');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Por favor indica el nombre del usuario.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Por favor indica un correo corporativo válido.');
      return;
    }

    const success = createUser({
      name: name.trim(),
      email: email.trim(),
      password: password.trim() || 'user123',
      role,
      department: department.trim(),
    });

    if (!success) {
      setError('Ya existe un usuario registrado con este correo electrónico.');
      return;
    }

    setName('');
    setEmail('');
    setPassword('user123');
    setRole('usuario');
    setFeedback('Usuario creado exitosamente con rol asignado.');
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <Dialog.Root open={isUserManagementModalOpen} onOpenChange={(open) => !open && closeUserManagementModal()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl bg-white border border-brand-300/60 rounded-2xl shadow-2xl p-0 overflow-hidden max-h-[90vh] flex flex-col data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="p-5 border-b border-brand-300/40 bg-stone-50/90 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-100 border border-brand-300/60 text-brand-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <Dialog.Title className="text-base font-bold text-stone-900">
                  Control de Usuarios y Roles (RBAC)
                </Dialog.Title>
                <Dialog.Description className="text-xs text-stone-500">
                  Crea y gestiona cuentas con roles de Administrador o Usuario
                </Dialog.Description>
              </div>
            </div>

            <Dialog.Close asChild>
              <button
                type="button"
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
            
            {/* Formulario para Crear Usuario */}
            <div className="bg-stone-50/80 p-4 rounded-xl border border-brand-300/40">
              <h3 className="font-bold text-stone-900 text-xs uppercase tracking-wider font-mono flex items-center gap-1.5 mb-3">
                <UserPlus className="w-4 h-4 text-brand-600" />
                <span>Registrar Nuevo Usuario</span>
              </h3>

              {feedback && (
                <div className="mb-3 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{feedback}</span>
                </div>
              )}

              {error && (
                <div className="mb-3 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Nombre Completo *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ej: Laura Restrepo"
                      className="w-full px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-stone-900 text-xs focus:outline-none focus:border-brand-600"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Correo Corporativo *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="laura@aurastock.io"
                      className="w-full px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-stone-900 text-xs focus:outline-none focus:border-brand-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Rol en Sistema *</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as UserRole)}
                      className="w-full px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-stone-900 text-xs focus:outline-none focus:border-brand-600 font-semibold"
                    >
                      <option value="usuario">Usuario (Solo Consulta & Préstamos)</option>
                      <option value="admin">Administrador (Control Total & HV)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Contraseña</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-stone-900 text-xs focus:outline-none focus:border-brand-600"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Área / Departamento</label>
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="Ej: TI, Docencia, Finanzas"
                      className="w-full px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-stone-900 text-xs focus:outline-none focus:border-brand-600"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-600/90 text-white font-semibold text-xs shadow-sm transition active:scale-95"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Crear Usuario</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Listado de Usuarios Registrados */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-stone-900 uppercase font-mono tracking-wider text-xs flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-brand-600" />
                  <span>Usuarios Activos en el Sistema ({users.length})</span>
                </h4>
                <span className="text-[10px] text-stone-500 font-mono">Toca &quot;Usar Cuenta&quot; para probar la perspectiva</span>
              </div>

              <div className="divide-y divide-stone-200 border border-stone-200 rounded-xl overflow-hidden bg-white">
                {users.map((u) => {
                  const isCurrent = currentUser?.id === u.id;
                  const isAdminRole = u.role === 'admin';

                  return (
                    <div 
                      key={u.id}
                      className={`p-3.5 flex items-center justify-between gap-3 transition-colors ${
                        isCurrent ? 'bg-brand-100/40' : 'hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                          isAdminRole 
                            ? 'bg-brand-100 text-brand-600 border border-brand-300/60' 
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {isAdminRole ? <ShieldCheck className="w-4 h-4" /> : <User className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-stone-900 text-xs">
                              {u.name}
                            </span>
                            {isCurrent && (
                              <span className="text-[9px] bg-brand-600 text-white font-bold px-1.5 py-0.2 rounded-full uppercase">
                                En Uso
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-stone-500 font-mono">
                            {u.email} • {u.department || 'Sin área'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-mono uppercase font-semibold px-2 py-0.5 rounded-full border ${
                          isAdminRole 
                            ? 'bg-brand-100 text-brand-600 border-brand-300/60' 
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}>
                          {isAdminRole ? 'Admin' : 'Usuario'}
                        </span>

                        {!isCurrent && (
                          <button
                            type="button"
                            onClick={() => setCurrentUser(u)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-stone-300 hover:bg-stone-100 text-stone-700 text-[11px] font-medium transition"
                            title="Probar sesión con esta cuenta"
                          >
                            <ArrowRightLeft className="w-3 h-3 text-brand-600" />
                            <span>Usar Cuenta</span>
                          </button>
                        )}

                        {users.length > 1 && !isCurrent && (
                          <button
                            type="button"
                            onClick={() => deleteUser(u.id)}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition"
                            title="Eliminar usuario"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          <div className="p-4 border-t border-brand-300/40 bg-stone-50/90 flex justify-end">
            <button
              type="button"
              onClick={closeUserManagementModal}
              className="px-4 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-semibold transition"
            >
              Listo
            </button>
          </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
