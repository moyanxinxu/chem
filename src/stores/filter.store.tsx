import { create } from "zustand";
import { toast } from "sonner";

interface FilterStore {
  chemLab: string;
  chemCas: string;
  chemName: string;
  cabinet: string;
  place: string;

  setChemLab: (chemLab: string) => void;
  setChemCas: (chemCas: string) => void;
  setChemName: (chemName: string) => void;
  setCabinet: (cabinet: string) => void;
  setPlace: (place: string) => void;

  setFilters: (chemInfo: Record<string, string>) => void;
  clearFilters: () => void;
}

const useFilterStore = create<FilterStore>((set) => ({
  chemLab: "",
  chemCas: "",
  chemName: "",
  cabinet: "",
  place: "",

  setChemLab: (chemLab) => set({ chemLab }),
  setChemCas: (chemCas) => set({ chemCas }),
  setChemName: (chemName) => set({ chemName }),
  setCabinet: (cabinet) => set({ cabinet }),
  setPlace: (place) => set({ place }),

  setFilters: (chemInfo) => set({ ...chemInfo }),
  clearFilters: () => {
    set({
      chemLab: "",
      chemCas: "",
      chemName: "",
      cabinet: "",
      place: "",
    });

    toast.success("清除筛选条件成功！");
  },
}));

export { useFilterStore };
