"use client";

import { TableSkeleton } from "@/components/ui/Skeleton";
import type { MonthlyEmissionSummary } from "@/types";

type Props = {
  data: MonthlyEmissionSummary[];
  loading: boolean;
};

export function MonthlySummaryTable({ data, loading }: Props) {
  if (loading) return <TableSkeleton rows={6} />;

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-xs font-medium uppercase tracking-wide text-slate-500">
            <th className="px-4 py-3 text-left">월</th>
            <th className="px-4 py-3 text-right text-orange-600">Scope 1</th>
            <th className="px-4 py-3 text-right text-blue-600">Scope 2</th>
            <th className="px-4 py-3 text-right text-purple-600">Scope 3</th>
            <th className="px-4 py-3 text-right">합계 (kgCO₂e)</th>
            <th className="px-4 py-3 text-left">추이</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((row, i) => {
            const prev = data[i - 1];
            const change = prev && prev.total > 0
              ? ((row.total - prev.total) / prev.total) * 100
              : null;

            return (
              <tr key={row.yearMonth} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-medium text-slate-800">{row.yearMonth}</td>
                <td className="px-4 py-3 text-right font-mono text-slate-600">
                  {row.scope1 > 0 ? row.scope1.toLocaleString() : "—"}
                </td>
                <td className="px-4 py-3 text-right font-mono text-slate-600">
                  {row.scope2 > 0 ? row.scope2.toLocaleString() : "—"}
                </td>
                <td className="px-4 py-3 text-right font-mono text-slate-600">
                  {row.scope3 > 0 ? row.scope3.toLocaleString() : "—"}
                </td>
                <td className="px-4 py-3 text-right font-mono font-semibold text-slate-900">
                  {row.total.toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  {change !== null && (
                    <span className={`text-xs font-medium ${change <= 0 ? "text-emerald-600" : "text-red-500"}`}>
                      {change <= 0 ? "↓" : "↑"} {Math.abs(change).toFixed(1)}%
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
