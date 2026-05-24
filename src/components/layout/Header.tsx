"use client";

import { useLayoutStore } from "@/store/layout";

type Props = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
};

export function Header({ title, description, actions }: Props) {
  const { drawerOpen, toggleDrawer } = useLayoutStore();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-slate-200 bg-white/80 backdrop-blur-sm px-6">
      <button
        onClick={toggleDrawer}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
        aria-label={drawerOpen ? "사이드바 닫기" : "사이드바 열기"}
      >
        {drawerOpen ? "✕" : "☰"}
      </button>

      <div className="flex-1 min-w-0">
        <h1 className="text-lg font-semibold text-slate-900 truncate">{title}</h1>
        {description && (
          <p className="text-xs text-slate-500 truncate">{description}</p>
        )}
      </div>

      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </header>
  );
}
