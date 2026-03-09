import { create } from "zustand";

interface CommonStore {
  page: number;
  size: number;

  setPage: (page: number) => void;
  setSize: (size: number) => void;
}

const useCommonStore = create<CommonStore>((set) => ({
  page: 1,
  size: 20,

  setPage: (page: number) => set({ page }),
  setSize: (size: number) => set({ size }),
}));

export { useCommonStore };
