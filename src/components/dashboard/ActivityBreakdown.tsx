"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import type { PcfResult } from "@/types";
import { Skeleton } from "@/components/ui/Skeleton";

type Props = {
  results: PcfResult[];
  loading?: boolean;
};

const ACTIVITY_LABELS: Record<string, string> = {
  electricity: "전기",
  raw_material: "원소재",
  transport: "운송",
};

const ACTIVITY_COLORS: Record<string, string> = {
  electricity: "#3b82f6",
  raw_material: "#a855f7",
  transport: "#f97316",
};

export function ActivityBreakdown({ results, loading }: Props) {
  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <Skeleton className="h-4 w-36 mb-6" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  const breakdown = Object.entries(
    results.reduce<Record<string, number>>((acc, r) => {
      acc[r.activityType] = (acc[r.activityType] ?? 0) + r.emissions;
      return acc;
    }, {})
  ).map(([type, emissions]) => ({
    type,
    label: ACTIVITY_LABELS[type] ?? type,
    emissions: Math.round(emissions),
    color: ACTIVITY_COLORS[type] ?? "#64748b",
  }));

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-slate-900">활동 유형별 배출량</h2>
        <p className="text-xs text-slate-500 mt-0.5">누적 kgCO₂e</p>
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={breakdown} layout="vertical" margin={{ left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
          <XAxis
            type="number"
            tickFormatter={(v) => v.toLocaleString()}
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="label"
            tick={{ fontSize: 12, fill: "#64748b" }}
            axisLine={false}
            tickLine={false}
            width={44}
          />
          <Tooltip
            formatter={(value) => [`${Number(value).toLocaleString()} kgCO₂e`]}
            contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "12px" }}
          />
          <Bar dataKey="emissions" radius={[0, 4, 4, 0]}>
            {breakdown.map((entry) => (
              <Cell key={entry.type} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

