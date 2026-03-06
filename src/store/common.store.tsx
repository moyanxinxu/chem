import { create } from "zustand";

interface CommonStore {
  page: number;
  size: number;
  total: number;

  setPage: (page: number) => void;
  setSize: (size: number) => void;
  setTotal: (total: number) => void;
}

const useCommonStore = create<CommonStore>((set) => ({
  page: 1,
  size: 6,
  total: 0,

  setPage: (page: number) => set({ page }),
  setSize: (size: number) => set({ size }),
  setTotal: (total: number) => set({ total }),
}));

export { useCommonStore };
