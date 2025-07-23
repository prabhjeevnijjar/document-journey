import { create } from "zustand";
interface UserData {
  id: number;
  email: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
}
type AuthState = {
  token: string | null;
  userData: UserData | null;
  setUserData: (userData: UserData | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  userData: null,
  setUserData: (userData) => set({ userData }),
  setToken: (token) => set({ token }),
  logout: () => set({ token: null }),
}));

useAuthStore.subscribe((state) => {
  console.log("Auth Store Updated:", {
    token: state.token,
    userData: state.userData,
  });
});
