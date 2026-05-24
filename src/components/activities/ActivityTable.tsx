"use client";

import { useState } from "react";
import { ScopeBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { TableSkeleton } from "@/components/ui/Skeleton";
import type { Activity, EmissionFactor } from "@/types";

const ACTIVITY_LABELS: Record<string, string> = {
  electricity: "전기",
  raw_material: "원소재",
  transport: "운송",
};

const SCOPE_BY_TYPE = {
  electricity: "scope2",
  raw_material: "scope3",
  transport: "scope3",
} as const;

type Props = {
  activities: Activity[];
  emissionFactors: EmissionFactor[];
  loading: boolean;
  onEdit: (activity: Activity) => void;
  onDelete: (id: string) => Promise<void>;
};

export function ActivityTable({ activities, emissionFactors, loading, onEdit, onDelete }: Props) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("이 활동 데이터를 삭제하시겠습니까?")) return;
    setDeletingId(id);
    setDeleteError(null);
    try {
      await onDelete(id);
    } catch {
      setDeleteError("삭제에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setDeletingId(null);
    }
  };

  const getEmissions = (activity: Activity) => {
    const factor = emissionFactors.find((f) => f.source === activity.source);
    if (!factor) return null;
    return (activity.quantity * factor.factor).toFixed(2);
  };

  if (loading) return <TableSkeleton rows={8} />;

  if (activities.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 py-16 text-center">
        <p className="text-sm text-slate-500">활동 데이터가 없습니다.</p>
        <p className="text-xs text-slate-400 mt-1">위 버튼으로 추가하거나 Excel을 임포트하세요.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {deleteError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {deleteError}
        </div>
      )}
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-xs font-medium text-slate-500 uppercase tracking-wide">
              <th className="px-4 py-3 text-left">날짜</th>
              <th className="px-4 py-3 text-left">활동 유형</th>
              <th className="px-4 py-3 text-left">출처</th>
              <th className="px-4 py-3 text-right">량</th>
              <th className="px-4 py-3 text-left">단위</th>
              <th className="px-4 py-3 text-left">Scope</th>
              <th className="px-4 py-3 text-right">배출량 (kgCO₂e)</th>
              <th className="px-4 py-3 text-right">작업</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {activities.map((activity) => {
              const emissions = getEmissions(activity);
              const scope = SCOPE_BY_TYPE[activity.activityType];
              return (
                <tr key={activity.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-slate-600">{activity.date}</td>
                  <td className="px-4 py-3 text-slate-700">
                    {ACTIVITY_LABELS[activity.activityType]}
                  </td>
                  <td className="px-4 py-3 text-slate-700">{activity.source}</td>
                  <td className="px-4 py-3 text-right font-mono text-slate-700">
                    {activity.quantity.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-slate-500">{activity.unit}</td>
                  <td className="px-4 py-3">
                    <ScopeBadge scope={scope} />
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-medium text-slate-800">
                    {emissions ? parseFloat(emissions).toLocaleString() : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(activity)}
                      >
                        수정
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        loading={deletingId === activity.id}
                        onClick={() => handleDelete(activity.id)}
                        className="text-red-500 hover:bg-red-50 hover:text-red-700"
                      >
                        삭제
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
