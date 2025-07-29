import { create } from 'zustand';
import { toast } from 'sonner';

// Enums matching Prisma schema
export enum ActorRole {
  CREATOR = 'CREATOR',
  SIGNER = 'SIGNER'
}

export enum ActorAction {
  CREATED = 'CREATED',
  SENT = 'SENT',
  OPENED = 'OPENED',
  SIGNED = 'SIGNED',
  EXPIRED = 'EXPIRED',
  VIEWED = 'VIEWED'
}

export enum SignerStatus {
  PENDING = 'PENDING',
  SIGNED = 'SIGNED'
}

export interface Agreement {
  id: number;
  name: string;
  creatorId: number;
  file?: Uint8Array;
  receiverEmail: string;
  status: string;
  signatureCoords?: string;
  createdAt: string;
  mimeType?: string;
  fileSize?: number;
  originalFilename?: string;
  
  // Relations
  creator?: {
    id: number;
    email: string;
    name?: string;
  };
  signers?: AgreementSigner[];
  trails?: AgreementTrail[];
}

export interface AgreementSigner {
  id: number;
  agreementId: number;
  signerEmail: string;
  signerName?: string;
  status: SignerStatus;
  signedAt?: string;
  signatureCoords?: string;
}

export interface AgreementTrail {
  id: number;
  agreementId: number;
  actorId?: number;
  actorRole: ActorRole;
  actorAction: ActorAction;
  createdAt: string;
  ipAddress?: string;
  
  actor?: {
    id: number;
    email: string;
    name?: string;
  };
}

export interface CreateAgreementData {
  name: string;
  receiverEmail: string;
  file?: File;
  mimeType?: string;
  fileSize?: number;
  originalFilename?: string;
}

interface AgreementState {
  agreements: Agreement[];
  totalAgreements: number;
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;

  // setters
  setAgreements: (agreements: Agreement[]) => void;
  setTotalAgreements: (total: number) => void;
  setCurrentPage: (page: number) => void;
  setTotalPages: (pages: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // API functions
  fetchAgreements: (page: number, limit: number) => void;
  createAgreement: (data: CreateAgreementData) => Promise<{ success: boolean; agreement?: Agreement; error?: string }>;
  getAgreementById: (id: number) => Promise<{ success: boolean; agreement?: Agreement; error?: string }>;
}

export const useAgreementStore = create<AgreementState>((set, get) => ({
  agreements: [],
  totalAgreements: 0,
  currentPage: 1,
  totalPages: 1,
  isLoading: false,
  error: null,

  setAgreements: (agreements) => set({ agreements }),
  setTotalAgreements: (total) => set({ totalAgreements: total }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setTotalPages: (pages) => set({ totalPages: pages }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  fetchAgreements: async (page: number = 1, limit: number = 10) => {
    set({ isLoading: true, error: null });
    try {
      const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/agreements`);
      url.searchParams.append('page', page.toString());
      url.searchParams.append('limit', limit.toString());

      const res = await fetch(url.toString(), {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errorMessage = errorData.message || `HTTP ${res.status}: ${res.statusText}`;
        throw new Error(errorMessage);
      }

      const response = await res.json();

      // Validate response structure
      if (!response.data || !Array.isArray(response.data.agreements)) {
        throw new Error('Invalid response format from server');
      }

      const data = response.data;

      set((state) => ({
        agreements: data.agreements,
        totalAgreements: data.totalAgreements || 0,
        totalPages: data.totalPages || 1,
        currentPage: page,
        isLoading: false,
        error: null,
      }));

      toast.success('Agreements loaded successfully');
    } catch (e: any) {
      const errorMessage = e.message || 'Failed to fetch agreements';
      console.error('Error fetching agreements:', e);

      set({
        error: errorMessage,
        isLoading: false,
        agreements: [],
        totalAgreements: 0,
        totalPages: 1
      });

      toast.error(errorMessage);
    }
  },

  createAgreement: async (data: CreateAgreementData) => {
    set({ isLoading: true, error: null });
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('receiverEmail', data.receiverEmail);
      
      if (data.file) {
        formData.append('file', data.file);
      }
      
      if (data.mimeType) {
        formData.append('mimeType', data.mimeType);
      }
      
      if (data.fileSize) {
        formData.append('fileSize', data.fileSize.toString());
      }
      
      if (data.originalFilename) {
        formData.append('originalFilename', data.originalFilename);
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/agreements`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errorMessage = errorData.message || `HTTP ${res.status}: ${res.statusText}`;
        throw new Error(errorMessage);
      }

      const response = await res.json();

      // Validate response structure
      if (!response.data || !response.data.agreement) {
        throw new Error('Invalid response format from server');
      }

      const newAgreement = response.data.agreement;

      // Add the new agreement to the current list
      set((state) => ({
        agreements: [newAgreement, ...state.agreements],
        totalAgreements: state.totalAgreements + 1,
        isLoading: false,
        error: null,
      }));

      toast.success('Agreement created successfully');
      return { success: true, agreement: newAgreement };
    } catch (e: any) {
      const errorMessage = e.message || 'Failed to create agreement';
      console.error('Error creating agreement:', e);

      set({
        error: errorMessage,
        isLoading: false,
      });

      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  },

  getAgreementById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/agreements/${id}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errorMessage = errorData.message || `HTTP ${res.status}: ${res.statusText}`;
        throw new Error(errorMessage);
      }

      const response = await res.json();

      // Validate response structure
      if (!response.data || !response.data.agreement) {
        throw new Error('Invalid response format from server');
      }

      set({ isLoading: false, error: null });
      return { success: true, agreement: response.data.agreement };
    } catch (e: any) {
      const errorMessage = e.message || 'Failed to fetch agreement';
      console.error('Error fetching agreement:', e);

      set({
        error: errorMessage,
        isLoading: false,
      });

      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  },
}));
