import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AppUser, UserRole } from '../types/inventory';

const DEFAULT_USERS: AppUser[] = [
  {
    id: 'usr-admin-1',
    name: 'Ing. Carlos Silva',
    email: 'admin@aurastock.io',
    password: 'admin123',
    role: 'admin',
    department: 'Dirección de Tecnología e Infraestructura',
    createdAt: '2025-01-10T08:00:00.000Z',
  },
  {
    id: 'usr-user-1',
    name: 'Lic. Andrea Gómez',
    email: 'usuario@aurastock.io',
    password: 'user123',
    role: 'usuario',
    department: 'Coordinación Académica y Docencia',
    createdAt: '2025-01-15T09:30:00.000Z',
  },
  {
    id: 'usr-user-2',
    name: 'David Morales',
    email: 'david.morales@aurastock.io',
    password: 'user123',
    role: 'usuario',
    department: 'Laboratorio de Innovación e I+D',
    createdAt: '2025-02-01T11:00:00.000Z',
  },
];

interface AuthState {
  isAuthenticated: boolean;
  currentUser: AppUser;
  users: AppUser[];

  login: (email: string, password?: string) => boolean;
  logout: () => void;
  createUser: (data: { name: string; email: string; password?: string; role: UserRole; department?: string }) => boolean;
  deleteUser: (id: string) => void;
  switchUserRole: (role: UserRole) => void;
  setCurrentUser: (user: AppUser) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: true,
      currentUser: DEFAULT_USERS[0], // Inicia por defecto como Admin
      users: DEFAULT_USERS,

      login: (email: string, password?: string) => {
        const normalizedEmail = email.trim().toLowerCase();
        const found = get().users.find((u) => u.email.toLowerCase() === normalizedEmail);

        if (found) {
          // Si especificó contraseña y no coincide
          if (password && found.password && found.password !== password) {
            return false;
          }
          set({
            isAuthenticated: true,
            currentUser: found,
          });
          return true;
        }

        // Si es un email nuevo, crear sesión como usuario normal por defecto
        const newUser: AppUser = {
          id: `usr-${Date.now().toString().slice(-4)}`,
          name: email.split('@')[0] || 'Usuario',
          email: normalizedEmail,
          password: password || '123456',
          role: normalizedEmail.includes('admin') ? 'admin' : 'usuario',
          department: 'General',
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          isAuthenticated: true,
          currentUser: newUser,
          users: [...state.users, newUser],
        }));
        return true;
      },

      logout: () => {
        set({
          isAuthenticated: false,
        });
      },

      createUser: (data) => {
        const normalizedEmail = data.email.trim().toLowerCase();
        const exists = get().users.some((u) => u.email.toLowerCase() === normalizedEmail);
        if (exists) return false;

        const newUser: AppUser = {
          id: `usr-${Date.now().toString().slice(-5)}`,
          name: data.name.trim(),
          email: normalizedEmail,
          password: data.password?.trim() || 'user123',
          role: data.role,
          department: data.department?.trim() || 'General TI',
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          users: [newUser, ...state.users],
        }));
        return true;
      },

      deleteUser: (id: string) => {
        set((state) => ({
          users: state.users.filter((u) => u.id !== id),
        }));
      },

      switchUserRole: (role: UserRole) => {
        set((state) => ({
          currentUser: {
            ...state.currentUser,
            role,
          },
        }));
      },

      setCurrentUser: (user: AppUser) => {
        set({
          currentUser: user,
          isAuthenticated: true,
        });
      },
    }),
    {
      name: 'aurastock-auth-v3-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
