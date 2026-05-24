import { create } from "zustand";

type LayoutStore = {
  drawerOpen: boolean;
  toggleDrawer: () => void;
  closeDrawer: () => void;
};

export const useLayoutStore = create<LayoutStore>((set) => ({
  drawerOpen: true,
  toggleDrawer: () => set((s) => ({ drawerOpen: !s.drawerOpen })),
  closeDrawer: () => set({ drawerOpen: false }),
}));
