import { create } from 'zustand';
import { toast } from 'sonner';

export interface Document {
  id: string;
  name: string;
  fileUrl: string;
  createdAt: string;
  mimeType: string;
  fileSize: number;
  originalFilename?: string;
}

interface DocumentState {
  documents: Document[];
  totalDocuments: number;
  isLoading: boolean;
  error: string | null;
  setDocuments: (documents: Document[]) => void;
  setTotalDocuments: (total: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchDocuments: (page: number, limit: number) => Promise<{ totalPages: number; totalDocuments: number }>;
}

export const useDocumentStore = create<DocumentState>((set) => ({
  documents: [],
  totalDocuments: 0,
  isLoading: false,
  error: null,
  setDocuments: (documents) => set({ documents }),
  setTotalDocuments: (total) => set({ totalDocuments: total }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  fetchDocuments: async (page: number = 1, limit: number = 10) => {
    set({ isLoading: true, error: null });
    try {
      const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/documents`);
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
      if (!response.data || !Array.isArray(response.data.documents)) {
        throw new Error('Invalid response format from server');
      }
      
      const data = response.data;
      
      set((state) => ({
        documents: data.documents,
        totalDocuments: data.total || 0,
        isLoading: false,
        error: null,
      }));
            
      return {
        totalPages: data.totalPages || 1,
        totalDocuments: data.total || 0
      };
    } catch (e: any) {
      const errorMessage = e.message || 'Failed to fetch documents';
      console.error('Error fetching documents:', e);
      
      set({ 
        error: errorMessage, 
        isLoading: false,
        documents: [],
        totalDocuments: 0
      });
      
      toast.error(errorMessage);
      
      return {
        totalPages: 1,
        totalDocuments: 0
      };
    }
  },
}));