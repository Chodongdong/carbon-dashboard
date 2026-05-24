"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutStore } from "@/store/layout";

type NavItem = {
  href: string;
  label: string;
  icon: string;
  description: string;
};

const navItems: NavItem[] = [
  { href: "/", icon: "◈", label: "대시보드", description: "PCF 요약 및 트렌드" },
  { href: "/activities", icon: "⊞", label: "활동 데이터", description: "원본 활동 데이터 입력" },
  { href: "/emissions", icon: "◉", label: "PCF 결과", description: "탄소 발자국 계산 결과" },
  { href: "/emission-factors", icon: "⊛", label: "배출계수", description: "계수 관리 및 버전 이력" },
];

export function NavigationDrawer() {
  const pathname = usePathname();
  const { drawerOpen } = useLayoutStore();

  return (
    <aside
      className={`
        fixed top-0 left-0 z-30 h-full bg-slate-900 text-white
        flex flex-col transition-all duration-300 ease-in-out
        ${drawerOpen ? "w-64" : "w-16"}
      `}
    >
      {/* 로고 */}
      <div className="flex h-16 items-center border-b border-slate-700 px-4 overflow-hidden">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-2xl shrink-0">🌿</span>
          {drawerOpen && (
            <div className="min-w-0">
              <p className="font-bold text-white truncate">Hanaloop</p>
              <p className="text-xs text-slate-400 truncate">Carbon Dashboard</p>
            </div>
          )}
        </div>
      </div>

      {/* 네비게이션 */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center gap-3 rounded-lg px-3 py-2.5
                    transition-colors duration-150
                    ${isActive
                      ? "bg-emerald-600 text-white"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    }
                  `}
                  title={!drawerOpen ? item.label : undefined}
                >
                  <span className="text-lg shrink-0">{item.icon}</span>
                  {drawerOpen && (
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{item.label}</p>
                      <p className="text-xs text-slate-500 truncate">{item.description}</p>
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* 하단 정보 */}
      {drawerOpen && (
        <div className="border-t border-slate-700 px-4 py-3">
          <p className="text-xs text-slate-500">GHG Protocol 기준</p>
          <p className="text-xs text-slate-600">Scope 1 · 2 · 3</p>
        </div>
      )}
    </aside>
  );
}
