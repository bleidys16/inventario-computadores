import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { 
  Computer, 
  ComputerStatus, 
  CreateComputerDTO, 
  CreateLoanDTO, 
  InventoryStats 
} from '../types/inventory';

interface InventoryState {
  computers: Computer[];
  searchQuery: string;
  statusFilter: ComputerStatus | 'Todos';
  selectedComputerId: string | null;

  isLoanModalOpen: boolean;
  isReturnModalOpen: boolean;
  isRegisterDrawerOpen: boolean;

  // Acciones
  addComputer: (dto: CreateComputerDTO) => void;
  updateStatus: (id: string, status: ComputerStatus, notes?: string) => void;
  loanComputer: (computerId: string, loanData: CreateLoanDTO) => void;
  returnComputer: (computerId: string, notes?: string) => void;

  // UI & Filtros
  setSearchQuery: (query: string) => void;
  setStatusFilter: (filter: ComputerStatus | 'Todos') => void;
  setSelectedComputerId: (id: string | null) => void;
  openLoanModal: (computerId: string) => void;
  closeLoanModal: () => void;
  openReturnModal: (computerId: string) => void;
  closeReturnModal: () => void;
  openRegisterDrawer: () => void;
  closeRegisterDrawer: () => void;
  deleteComputer: (id: string) => void;

  // Selectores
  getStats: () => InventoryStats;
  getFilteredComputers: () => Computer[];
}

export const useInventoryStore = create<InventoryState>()(
  persist(
    (set, get) => ({
      // Inicia limpio sin datos demo para que el usuario ingrese sus propios equipos
      computers: [],
      searchQuery: '',
      statusFilter: 'Todos',
      selectedComputerId: null,

      isLoanModalOpen: false,
      isReturnModalOpen: false,
      isRegisterDrawerOpen: false,

      addComputer: (dto: CreateComputerDTO) => {
        const now = new Date().toISOString();
        const newComputer: Computer = {
          id: dto.id.trim() || `AST-${Math.floor(100 + Math.random() * 900)}`,
          barcode: dto.barcode.trim() || `${Date.now()}`,
          name: dto.name.trim(),
          brand: dto.brand.trim(),
          model: dto.model.trim(),
          processor: dto.processor.trim(),
          ram: dto.ram.trim(),
          storage: dto.storage.trim(),
          location: dto.location?.trim() || 'Bodega Central',
          status: 'Disponible',
          notes: dto.notes?.trim() || undefined,
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({
          computers: [newComputer, ...state.computers],
          isRegisterDrawerOpen: false,
        }));
      },

      updateStatus: (id: string, status: ComputerStatus, notes?: string) => {
        set((state) => ({
          computers: state.computers.map((computer) => {
            if (computer.id !== id) return computer;

            return {
              ...computer,
              status,
              notes: notes !== undefined ? notes : computer.notes,
              currentLoan: status === 'Prestado' ? computer.currentLoan : undefined,
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      loanComputer: (computerId: string, loanData: CreateLoanDTO) => {
        const now = new Date().toISOString();
        const loanId = `LN-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

        set((state) => ({
          computers: state.computers.map((computer) => {
            if (computer.id !== computerId) return computer;

            const loan = {
              id: loanId,
              computerId,
              borrowerName: loanData.borrowerName.trim(),
              borrowerDocument: loanData.borrowerDocument.trim(),
              borrowerRole: loanData.borrowerRole.trim(),
              destinationLocation: loanData.destinationLocation.trim(),
              loanDate: now,
              expectedReturnDate: loanData.expectedReturnDate,
              notes: loanData.notes?.trim(),
            };

            return {
              ...computer,
              status: 'Prestado' as ComputerStatus,
              location: loanData.destinationLocation.trim(),
              currentLoan: loan,
              updatedAt: now,
            };
          }),
          isLoanModalOpen: false,
          selectedComputerId: null,
        }));
      },

      returnComputer: (computerId: string, returnNotes?: string) => {
        const now = new Date().toISOString();

        set((state) => ({
          computers: state.computers.map((computer) => {
            if (computer.id !== computerId) return computer;

            return {
              ...computer,
              status: 'Disponible' as ComputerStatus,
              location: 'Bodega Central',
              currentLoan: undefined,
              notes: returnNotes ? `Devolución: ${returnNotes}` : computer.notes,
              updatedAt: now,
            };
          }),
          isReturnModalOpen: false,
          selectedComputerId: null,
        }));
      },

      setSearchQuery: (query: string) => set({ searchQuery: query }),
      setStatusFilter: (filter: ComputerStatus | 'Todos') => set({ statusFilter: filter }),
      setSelectedComputerId: (id: string | null) => set({ selectedComputerId: id }),

      openLoanModal: (computerId: string) =>
        set({ isLoanModalOpen: true, selectedComputerId: computerId }),
      closeLoanModal: () =>
        set({ isLoanModalOpen: false, selectedComputerId: null }),

      openReturnModal: (computerId: string) =>
        set({ isReturnModalOpen: true, selectedComputerId: computerId }),
      closeReturnModal: () =>
        set({ isReturnModalOpen: false, selectedComputerId: null }),

      openRegisterDrawer: () => set({ isRegisterDrawerOpen: true }),
      closeRegisterDrawer: () => set({ isRegisterDrawerOpen: false }),

      deleteComputer: (id: string) =>
        set((state) => ({
          computers: state.computers.filter((c) => c.id !== id),
        })),

      getStats: () => {
        const computers = get().computers;
        return {
          total: computers.length,
          available: computers.filter((c) => c.status === 'Disponible').length,
          loaned: computers.filter((c) => c.status === 'Prestado').length,
          maintenance: computers.filter((c) => c.status === 'En Mantenimiento').length,
          decommissioned: computers.filter((c) => c.status === 'De Baja').length,
        };
      },

      getFilteredComputers: () => {
        const { computers, searchQuery, statusFilter } = get();
        const query = searchQuery.toLowerCase().trim();

        return computers.filter((computer) => {
          if (statusFilter !== 'Todos' && computer.status !== statusFilter) {
            return false;
          }

          if (!query) return true;

          const matchName = computer.name.toLowerCase().includes(query);
          const matchId = computer.id.toLowerCase().includes(query);
          const matchBarcode = computer.barcode.toLowerCase().includes(query);
          const matchBrand = computer.brand.toLowerCase().includes(query);
          const matchModel = computer.model.toLowerCase().includes(query);
          const matchLocation = computer.location.toLowerCase().includes(query);
          const matchProcessor = computer.processor.toLowerCase().includes(query);
          const matchBorrower =
            computer.currentLoan?.borrowerName.toLowerCase().includes(query) || false;

          return (
            matchName ||
            matchId ||
            matchBarcode ||
            matchBrand ||
            matchModel ||
            matchLocation ||
            matchProcessor ||
            matchBorrower
          );
        });
      },
    }),
    {
      name: 'aurastock-inventory-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ computers: state.computers }),
    }
  )
);
