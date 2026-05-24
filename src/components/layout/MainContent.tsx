"use client";

import { useLayoutStore } from "@/store/layout";

export function MainContent({ children }: { children: React.ReactNode }) {
  const { drawerOpen } = useLayoutStore();
  return (
    <main
      className={`
        flex-1 flex flex-col min-h-full overflow-auto
        transition-all duration-300 ease-in-out
        ${drawerOpen ? "ml-64" : "ml-16"}
      `}
    >
      {children}
    </main>
  );
}
