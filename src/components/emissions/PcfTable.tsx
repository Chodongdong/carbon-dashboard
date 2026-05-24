"use client";

import { ScopeBadge } from "@/components/ui/Badge";
import { TableSkeleton } from "@/components/ui/Skeleton";
import type { PcfResult } from "@/types";

const ACTIVITY_LABELS: Record<string, string> = {
  electricity: "전기",
  raw_material: "원소재",
  transport: "운송",
};

type Props = {
  results: PcfResult[];
  loading: boolean;
};

export function PcfTable({ results, loading }: Props) {
  if (loading) return <TableSkeleton rows={8} />;

  if (results.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 py-16 text-center">
        <p className="text-sm text-slate-500">계산할 활동 데이터가 없습니다.</p>
      </div>
    );
  }

  const total = results.reduce((sum, r) => sum + r.emissions, 0);

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-xs font-medium uppercase tracking-wide text-slate-500">
            <th className="px-4 py-3 text-left">날짜</th>
            <th className="px-4 py-3 text-left">활동 유형</th>
            <th className="px-4 py-3 text-left">출처</th>
            <th className="px-4 py-3 text-right">활동량</th>
            <th className="px-4 py-3 text-left">단위</th>
            <th className="px-4 py-3 text-right">배출계수</th>
            <th className="px-4 py-3 text-left">Scope</th>
            <th className="px-4 py-3 text-right">배출량 (kgCO₂e)</th>
            <th className="px-4 py-3 text-right">비율</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {results.map((r) => (
            <tr key={r.activityId} className="hover:bg-slate-50 transition-colors">
              <td className="px-4 py-3 text-slate-600">{r.date}</td>
              <td className="px-4 py-3 text-slate-700">{ACTIVITY_LABELS[r.activityType]}</td>
              <td className="px-4 py-3 text-slate-700">{r.source}</td>
              <td className="px-4 py-3 text-right font-mono text-slate-700">
                {r.quantity.toLocaleString()}
              </td>
              <td className="px-4 py-3 text-slate-500">{r.unit}</td>
              <td className="px-4 py-3 text-right font-mono text-slate-500">
                {r.factor}
              </td>
              <td className="px-4 py-3">
                <ScopeBadge scope={r.scope} />
              </td>
              <td className="px-4 py-3 text-right font-mono font-semibold text-slate-900">
                {r.emissions.toLocaleString()}
              </td>
              <td className="px-4 py-3 text-right text-slate-500">
                {total > 0 ? ((r.emissions / total) * 100).toFixed(1) : 0}%
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-slate-300 bg-slate-50 font-semibold">
            <td colSpan={7} className="px-4 py-3 text-sm text-slate-700">합계</td>
            <td className="px-4 py-3 text-right font-mono text-base text-emerald-700">
              {total.toLocaleString()} kgCO₂e
            </td>
            <td className="px-4 py-3 text-right text-slate-500">100%</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
