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
    }, 250);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 bg-[#190019] text-[#FBE4D8] overflow-hidden selection:bg-[#854F6C] selection:text-[#FBE4D8]">
      <div className="relative w-full max-w-md z-10">
        
        {/* Branding superior */}
        <div className="text-center mb-6 flex flex-col items-center">
          <img 
            src={logoImg} 
            alt="AuraStock" 
            className="h-20 w-auto object-contain mb-2 brightness-110" 
          />
          <h1 className="text-xl font-mono font-bold tracking-tight text-[#FBE4D8]">
            AuraStock Core TI
          </h1>
          <p className="text-[#DFB6B2] text-xs font-mono">
            Control de Inventario y Hardware
          </p>
        </div>

        {/* Tarjeta de Login Técnica */}
        <div className="bg-[#2B124C] border border-[#522B5B] rounded-xl p-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#522B5B]">
            <div>
              <h2 className="text-sm font-mono font-semibold uppercase tracking-wider text-[#FBE4D8]">
                Iniciar Sesión
              </h2>
              <p className="text-[11px] text-[#DFB6B2]">Acceso con credenciales de técnico o administrador</p>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#190019] text-[10px] font-mono text-[#DFB6B2] border border-[#522B5B]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Auth Core</span>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-2.5 rounded bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-[11px] font-mono uppercase text-[#DFB6B2] mb-1">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#DFB6B2]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@aurastock.ti"
                  required
                  className="w-full pl-9 pr-3 py-2 rounded bg-[#190019] border border-[#522B5B] text-[#FBE4D8] placeholder-[#DFB6B2]/40 text-xs focus:outline-none focus:border-[#DFB6B2]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-[#DFB6B2] mb-1">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#DFB6B2]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-9 pr-3 py-2 rounded bg-[#190019] border border-[#522B5B] text-[#FBE4D8] placeholder-[#DFB6B2]/40 text-xs focus:outline-none focus:border-[#DFB6B2]"
                />
              </div>
            </div>

            {/* Botón Primario */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded bg-[#FBE4D8] hover:bg-[#DFB6B2] text-[#190019] font-mono font-semibold text-xs transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-60"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-[#190019] border-t-transparent rounded-full animate-spin" />
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
        <p className="text-center text-[11px] text-[#DFB6B2]/60 mt-4 font-mono">
          AuraStock &bull; Control y Trazabilidad de Hardware TI
        </p>
      </div>
    </div>
  );
};
