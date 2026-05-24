"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { ScopeSummary } from "@/types";
import { Skeleton } from "@/components/ui/Skeleton";

const COLORS: Record<string, string> = {
  scope1: "#f97316",
  scope2: "#3b82f6",
  scope3: "#a855f7",
};

type Props = {
  data: ScopeSummary[];
  loading?: boolean;
};

export function ScopeChart({ data, loading }: Props) {
  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <Skeleton className="h-4 w-28 mb-6" />
        <Skeleton className="h-52 w-full rounded-full" />
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-slate-900">Scope별 배출 비율</h2>
        <p className="text-xs text-slate-500 mt-0.5">GHG Protocol 분류 기준</p>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={3}
            dataKey="emissions"
          >
            {data.map((entry) => (
              <Cell key={entry.scope} fill={COLORS[entry.scope]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [`${Number(value).toLocaleString()} kgCO₂e`]}
            contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "12px" }}
          />
          <Legend
            formatter={(_, entry) => (entry.payload as ScopeSummary).label}
            wrapperStyle={{ fontSize: "12px" }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* 범례 상세 */}
      <div className="mt-2 space-y-2">
        {data.map((item) => (
          <div key={item.scope} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: COLORS[item.scope] }}
              />
              <span className="text-slate-600">{item.label}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 font-medium">
              <span>{item.emissions.toLocaleString()} kgCO₂e</span>
              <span className="text-slate-400">({item.percentage}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
