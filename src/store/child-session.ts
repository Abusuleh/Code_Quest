import { create } from "zustand";

type ChildSessionState = {
  activeChildId?: string;
  setActiveChildId: (id?: string) => void;
};

export const useChildSession = create<ChildSessionState>((set) => ({
  activeChildId: undefined,
  setActiveChildId: (id) => set({ activeChildId: id }),
}));
