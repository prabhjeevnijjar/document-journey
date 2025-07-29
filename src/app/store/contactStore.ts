import { create } from 'zustand';
import { toast } from 'sonner';

export interface Contact {
  id: string;
  name: string;
  email: string;
  createdAt: string;
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
  fetchContacts: (page: number, limit: number) => void;
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
  fetchContacts: async (page: number = 1, limit: number = 10) => {
    set({ isLoading: true, error: null });
    try {
      const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/contacts`);
      url.searchParams.append('page', page.toString());
      url.searchParams.append('limit', limit.toString());

      const res = await fetch(url.toString(), {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) throw new Error('Failed to fetch');
      const response = await res.json();

      const data = response.data;

      set((state) => ({
        contacts: data.contacts,
        totalContacts: data.totalContacts || 0,
        totalPages: data.totalPages || 1,
        isLoading: false,
        error: null,
      }));
    } catch (e: any) {
      const errorMessage = e.message || 'Failed to fetch contacts';
      console.error('Error fetching contacts:', e);

      set({
        error: errorMessage,
        isLoading: false,
        contacts: [],
        totalContacts: 0,
        totalPages: 1
      });

      toast.error(errorMessage);
    }
  },
}));
