import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { 
  Computer, 
  ComputerStatus, 
  CreateComputerDTO, 
  CreateLoanDTO, 
  InventoryStats,
  SecondaryTab,
  TINode,
  ComponentQuote,
  MaintenanceRecord
} from '../types/inventory';
import { INITIAL_COMPUTERS, INITIAL_NODES, INITIAL_COMPONENTS_QUOTES } from '../data/initialComputers';

interface InventoryState {
  computers: Computer[];
  nodes: TINode[];
  quotes: ComponentQuote[];

  searchQuery: string;
  statusFilter: ComputerStatus | 'Todos';
  selectedComputerId: string | null;

  // Hoja de Vida (HV) modal
  isDetailModalOpen: boolean;
  selectedDetailComputerId: string | null;
  openDetailModal: (computerId: string) => void;
  closeDetailModal: () => void;

  // User Management Modal
  isUserManagementModalOpen: boolean;
  openUserManagementModal: () => void;
  closeUserManagementModal: () => void;

  // Modo Escáner y Métrica
  isScannerMode: boolean;
  searchExecutionTime: number;
  hasMeasuredScan: boolean;
  setScannerMode: (active?: boolean) => void;

  // Acordeón de mantenimiento
  expandedAccordions: Record<string, boolean>;
  toggleAccordion: (computerId: string) => void;
  addMaintenance: (
    computerId: string, 
    data: { technician: string; description: string; type?: string }, 
    newStatus?: ComputerStatus | null
  ) => void;

  // Pestañas secundarias
  activeTab: SecondaryTab;
  setActiveTab: (tab: SecondaryTab) => void;

  // Modales y drawers
  isLoanModalOpen: boolean;
  isReturnModalOpen: boolean;
  isRegisterDrawerOpen: boolean;

  // Acciones de inventario
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
      computers: INITIAL_COMPUTERS,
      nodes: INITIAL_NODES,
      quotes: INITIAL_COMPONENTS_QUOTES,

      searchQuery: '',
      statusFilter: 'Todos',
      selectedComputerId: null,

      isDetailModalOpen: false,
      selectedDetailComputerId: null,

      isUserManagementModalOpen: false,

      isScannerMode: false,
      searchExecutionTime: 0.38,
      hasMeasuredScan: false,

      expandedAccordions: {},
      activeTab: 'inventory',

      isLoanModalOpen: false,
      isReturnModalOpen: false,
      isRegisterDrawerOpen: false,

      openDetailModal: (computerId: string) => {
        set({ isDetailModalOpen: true, selectedDetailComputerId: computerId });
      },
      closeDetailModal: () => {
        set({ isDetailModalOpen: false, selectedDetailComputerId: null });
      },

      openUserManagementModal: () => set({ isUserManagementModalOpen: true }),
      closeUserManagementModal: () => set({ isUserManagementModalOpen: false }),

      setActiveTab: (tab: SecondaryTab) => set({ activeTab: tab }),

      setScannerMode: (active?: boolean) => {
        set((state) => ({
          isScannerMode: typeof active === 'boolean' ? active : !state.isScannerMode,
        }));
      },

      toggleAccordion: (computerId: string) => {
        set((state) => ({
          expandedAccordions: {
            ...state.expandedAccordions,
            [computerId]: !state.expandedAccordions[computerId],
          },
        }));
      },

      addMaintenance: (computerId, data, newStatus = null) => {
        const timestamp = new Date();
        const formattedDate = `${timestamp.getFullYear()}-${String(timestamp.getMonth() + 1).padStart(2, '0')}-${String(timestamp.getDate()).padStart(2, '0')} ${String(timestamp.getHours()).padStart(2, '0')}:${String(timestamp.getMinutes()).padStart(2, '0')}`;
        
        const newRecord: MaintenanceRecord = {
          id: `MNT-${Date.now().toString().slice(-5)}`,
          date: formattedDate,
          technician: data.technician.trim() || 'Técnico TI',
          type: data.type || 'Preventivo',
          description: data.description.trim(),
        };

        set((state) => ({
          computers: state.computers.map((comp) => {
            if (comp.id !== computerId) return comp;

            const existingHistory = comp.maintenanceHistory || [];
            const updatedComp: Computer = {
              ...comp,
              maintenanceHistory: [newRecord, ...existingHistory],
              updatedAt: new Date().toISOString(),
            };

            if (newStatus) {
              updatedComp.status = newStatus;
              if (newStatus === 'Disponible' || newStatus === 'De Baja') {
                updatedComp.currentLoan = undefined;
              }
            }

            return updatedComp;
          }),
        }));
      },

      setSearchQuery: (query: string) => {
        const start = performance.now();
        const computers = get().computers;
        const normalized = query.toLowerCase().trim();

        if (normalized.length > 0) {
          computers.filter((computer) => {
            return (
              computer.name.toLowerCase().includes(normalized) ||
              computer.id.toLowerCase().includes(normalized) ||
              computer.barcode.toLowerCase().includes(normalized) ||
              computer.brand.toLowerCase().includes(normalized) ||
              computer.model.toLowerCase().includes(normalized) ||
              computer.location.toLowerCase().includes(normalized) ||
              computer.processor.toLowerCase().includes(normalized) ||
              (computer.currentLoan?.borrowerName.toLowerCase().includes(normalized) ?? false)
            );
          });
        }

        const end = performance.now();
        const duration = Number((end - start).toFixed(2));

        set({
          searchQuery: query,
          searchExecutionTime: duration,
          hasMeasuredScan: true,
        });
      },

      addComputer: (dto: CreateComputerDTO) => {
        const now = new Date().toISOString();
        const fallbackImages = [
          'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1544731612-de292439cc4b?w=600&auto=format&fit=crop&q=80',
        ];
        const randomImg = fallbackImages[Math.floor(Math.random() * fallbackImages.length)];

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
          imageUrl: dto.imageUrl?.trim() || randomImg,
          nodeId: dto.nodeId || 'NODE-MED-01',
          status: 'Disponible',
          notes: dto.notes?.trim() || undefined,
          maintenanceHistory: [],
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
      name: 'aurastock-inventory-v4-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        computers: state.computers,
        nodes: state.nodes 
      }),
    }
  )
);
