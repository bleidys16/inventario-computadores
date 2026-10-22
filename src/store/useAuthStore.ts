import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password?: string) => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: true,
      user: {
        id: 'usr-admin',
        name: 'Administrador TI',
        email: 'admin@aurastock.io',
        role: 'Gestor de Inventario',
      },

      login: (email: string) => {
        if (!email.trim()) return false;
        set({
          isAuthenticated: true,
          user: {
            id: `usr-${Date.now().toString().slice(-4)}`,
            name: email.split('@')[0] || 'Administrador',
            email,
            role: 'Gestor de Inventario',
          },
        });
        return true;
      },

      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
        });
      },
    }),
    {
      name: 'aurastock-auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
