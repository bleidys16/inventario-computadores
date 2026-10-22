export type ComputerStatus = 'Disponible' | 'Prestado' | 'En Mantenimiento' | 'De Baja';

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
  status: ComputerStatus;
  currentLoan?: Loan;
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
