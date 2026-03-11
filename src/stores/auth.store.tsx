import { create } from "zustand";

interface AuthStore {
  username: string;
  accessToken: string;
  role: string;

  setUsername: (username: string) => void;
  setAccessToken: (accessToken: string) => void;

  setAuthStore: (user: Partial<AuthStore>) => void;
  clearAuthStore: () => void;
}

const useAuthStore = create<AuthStore>((set) => ({
  username: "",
  accessToken: "",
  role: "",

  setUsername: (username: string) => set({ username }),
  setAccessToken: (accessToken: string) => set({ accessToken }),
  setAuthStore: (store) => set((state) => ({ ...state, ...store })),
  clearAuthStore: () => set({ username: "", accessToken: "" }),
}));

export { useAuthStore };
