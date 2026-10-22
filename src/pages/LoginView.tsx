import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { ShieldCheck, Lock, Mail, ArrowRight } from 'lucide-react';
import logoImg from '../assets/aurastocklogo.png';

interface LoginViewProps {
  onSuccess?: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuthStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Por favor ingresa tu correo electrónico corporativo.');
      return;
    }

    if (!password) {
      setError('Por favor ingresa tu contraseña.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      login(email, password);
      setIsLoading(false);
      if (onSuccess) onSuccess();
    }, 350);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 bg-[#FDFBF9] overflow-hidden selection:bg-brand-600 selection:text-white">
      {/* Fondos y auras decorativas sutiles en modo claro con la paleta de la imagen */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-100/50 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-300/30 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-md z-10">
        {/* Branding superior: LOGO SUELTO sin cuadro contenedor */}
        <div className="text-center mb-8 flex flex-col items-center">
          <img 
            src={logoImg} 
            alt="AuraStock" 
            className="h-28 w-auto object-contain mb-2 drop-shadow-sm" 
          />
          <p className="text-stone-500 text-xs sm:text-sm font-medium">
            Control de Inventario TI
          </p>
        </div>

        {/* Tarjeta de Login en Modo Claro */}
        <div className="bg-white border border-brand-300/50 rounded-2xl p-7 shadow-md">
          <div className="flex items-center justify-between pb-5 mb-5 border-b border-brand-300/30">
            <div>
              <h2 className="text-lg font-bold text-stone-900">Iniciar Sesión</h2>
              <p className="text-xs text-stone-500 mt-0.5">Ingresa al sistema de inventario</p>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-100 text-[11px] font-semibold text-brand-600 border border-brand-300/60">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
              <span>Acceso Seguro</span>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu.correo@empresa.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 placeholder-stone-400 text-sm focus:bg-white focus:outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 placeholder-stone-400 text-sm focus:bg-white focus:outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600 transition"
                />
              </div>
            </div>

            {/* Botón Primario CTA */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-600/90 text-white font-semibold text-sm transition-all duration-150 flex items-center justify-center gap-2 shadow-sm active:scale-[0.99] disabled:opacity-60"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Ingresar al Sistema</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-stone-400 mt-6 font-medium">
          AuraStock • Sistema de Control de Activos Informáticos
        </p>
      </div>
    </div>
  );
};
