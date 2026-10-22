export type ComputerStatus = 'Disponible' | 'Prestado' | 'En Mantenimiento' | 'De Baja';

export type SecondaryTab = 'inventory' | 'nodes' | 'quotes';

export interface Specs {
  processor: string;
  ram: string;
  storage: string;
}

export interface Loan {
  id: string;
  computerId: string;
  borrowerName: string;
  borrowerDocument: string;
  borrowerRole: string;
  destinationLocation: string;
  loanDate: string;
  expectedReturnDate?: string;
  returnDate?: string;
  notes?: string;
}

export interface MaintenanceRecord {
  id: string;
  date: string;
  technician: string;
  type: 'Preventivo' | 'Correctivo' | 'Actualización' | 'Diagnóstico' | string;
  description: string;
}

export interface Computer {
  id: string;
  barcode: string;
  name: string;
  brand: string;
  model: string;
  processor: string;
  ram: string;
  storage: string;
  location: string;
  nodeId?: string;
  status: ComputerStatus;
  currentLoan?: Loan;
  maintenanceHistory?: MaintenanceRecord[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateComputerDTO {
  id: string;
  barcode: string;
  name: string;
  brand: string;
  model: string;
  processor: string;
  ram: string;
  storage: string;
  location?: string;
  nodeId?: string;
  notes?: string;
}

export interface CreateLoanDTO {
  borrowerName: string;
  borrowerDocument: string;
  borrowerRole: string;
  destinationLocation: string;
  expectedReturnDate?: string;
  notes?: string;
}

export interface InventoryStats {
  total: number;
  available: number;
  loaned: number;
  maintenance: number;
  decommissioned: number;
}

export interface TINode {
  id: string;
  name: string;
  room: string;
  coordinates: string;
  networkStatus: 'Activo' | 'Inactivo';
  subnet: string;
  gateway: string;
  pingMs: number;
}

export interface ComponentQuote {
  id: string;
  name: string;
  category: string;
  sku: string;
  specs: string;
  prices: {
    alfa: number;
    beta: number;
    gamma: number;
  };
  stock: {
    alfa: number;
    beta: number;
    gamma: number;
  };
}
