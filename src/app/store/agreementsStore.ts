import { create } from 'zustand';
import { toast } from 'sonner';
import axios from 'axios';

export interface SignatureCoords {
    id: string;
    page: number;
    xPct: number;
    yPct: number;
    wPct: number;
    hPct: number;
}

interface ReceiverEmail {
    name: string;
    email: string;
}

export interface Agreement {
  name: string;
  creatorId: number;
  fileUrl: string;
  receiverEmail: ReceiverEmail[];
  status: string;
  signatureCoords: SignatureCoords[];
  createdAt: string;
  mimeType: string;
  fileSize: number;
  originalFilename: string;
}

interface CreateAgreementData {
  name: string;
  receiverEmail: ReceiverEmail[];
  fileUrl: string;
  mimeType?: string;
  signatureCoords: SignatureCoords[];
  originalFilename: string;
}

interface AgreementState {
  agreements: Agreement[];
  totalAgreements: number;
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
  agreementData: CreateAgreementData | null;
  // setters
  setAgreements: (agreements: Agreement[]) => void;
  setTotalAgreements: (total: number) => void;
  setCurrentPage: (page: number) => void;
  setTotalPages: (pages: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setAgreementData: (data: CreateAgreementData | null) => void;
  // API functions
  fetchAgreements: (page: number, limit: number) => void;
  createAgreement: (data: CreateAgreementData) => void;
  getAgreementById: (id: number) => Promise<{ success: boolean; agreement?: Agreement; error?: string }>;
}

export const useAgreementStore = create<AgreementState>((set, get) => ({
  agreements: [],
  totalAgreements: 0,
  currentPage: 1,
  totalPages: 1,
  isLoading: false,
  error: null,
  agreementData: null,

  setAgreements: (agreements) => set({ agreements }),
  setTotalAgreements: (total) => set({ totalAgreements: total }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setTotalPages: (pages) => set({ totalPages: pages }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setAgreementData: (data) => set({ agreementData: data }),

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
    console.log("============",data)
    set({ isLoading: true, error: null });
    
    axios.post(`${process.env.NEXT_PUBLIC_API_URL}/agreements`, data, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      const responseData = response.data;
    console.log({responseData})
      if (!responseData.data || !responseData.data.agreement) {
        throw new Error('Invalid response format from server');
      }
    
      const newAgreement = responseData.data.agreement;
    
      // Update state/store with new agreement
      set((state) => ({
        agreements: [newAgreement, ...state.agreements],
        totalAgreements: state.totalAgreements + 1,
        isLoading: false,
        error: null,
      }));
    
      toast.success('Agreement created successfully');
      return { success: true, agreement: newAgreement };
    })
    .catch((error) => {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to create agreement';
      console.error('Error creating agreement:', errorMessage);
    
      set({
        error: errorMessage,
        isLoading: false,
      });
    
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    });
    
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
