import { create } from 'zustand';

export interface Contact {
  id: string;
  name: string;
  email?: string;
}

interface ContactState {
  contacts: Contact[];
  totalContacts: number;
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;

  // setters
  setContacts: (contacts: Contact[]) => void;
  setTotalContacts: (total: number) => void;
  setCurrentPage: (page: number) => void;
  setTotalPages: (pages: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useContactStore = create<ContactState>((set) => ({
  contacts: [],
  totalContacts: 0,
  currentPage: 1,
  totalPages: 1,
  isLoading: false,
  error: null,

  setContacts: (contacts) => set({ contacts }),
  setTotalContacts: (total) => set({ totalContacts: total }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setTotalPages: (pages) => set({ totalPages: pages }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));
