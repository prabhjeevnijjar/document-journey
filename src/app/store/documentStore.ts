import { create } from 'zustand';

export interface Document {
  id: string;
  name: string;
  fileUrl: string;
  createdAt: string;
  mimeType: string;
  fileSize?: string;
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
}));