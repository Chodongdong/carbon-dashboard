"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { EmissionFactorForm } from "@/components/emission-factors/EmissionFactorForm";
import { ScopeBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { useDataStore } from "@/store/data";
import type { EmissionFactor } from "@/types";

export default function EmissionFactorsPage() {
  const {
    emissionFactors,
    factorsStatus,
    factorsError,
    loadEmissionFactors,
    editEmissionFactor,
  } = useDataStore();

  const [editing, setEditing] = useState<EmissionFactor | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (factorsStatus === "idle") loadEmissionFactors();
  }, [factorsStatus, loadEmissionFactors]);

  const isLoading = factorsStatus === "loading" || factorsStatus === "idle";

  const handleSubmit = async (updated: EmissionFactor) => {
    setSaveError(null);
    setSaveSuccess(null);
    try {
      await editEmissionFactor(updated);
      setSaveSuccess(`${updated.source} 배출계수가 v${updated.version + 1}로 업데이트됐습니다.`);
      setEditing(null);
      setTimeout(() => setSaveSuccess(null), 3000);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "저장에 실패했습니다.");
    }
  };

  if (factorsStatus === "error") {
    return (
      <div className="flex-1 p-6">
        <ErrorMessage message={factorsError ?? "오류가 발생했습니다."} onRetry={loadEmissionFactors} />
      </div>
    );
  }

  return (
    <>
      <Header
        title="배출계수 관리"
        description="GHG Protocol 기준 배출계수 — 버전 이력 추적"
      />

      <div className="flex-1 p-6 space-y-6">
        {/* 안내 배너 */}
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-start gap-3">
            <span className="text-lg">ℹ️</span>
            <div>
              <p className="text-sm font-semibold text-blue-800">배출계수란?</p>
              <p className="text-xs text-blue-700 mt-1">
                단위 활동량 당 발생하는 온실가스 배출량(kgCO₂e)입니다. 배출계수가 변경되면
                버전이 자동 증가하며, 이력이 추적됩니다. PCF 계산 시 항상 최신 버전을 사용합니다.
              </p>
            </div>
          </div>
        </div>

        {/* 상태 메시지 */}
        {saveSuccess && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
            ✓ {saveSuccess}
          </div>
        )}
        {saveError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
            {saveError}
          </div>
        )}

        {/* 배출계수 테이블 */}
        {isLoading ? (
          <TableSkeleton rows={4} />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-medium uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3 text-left">출처</th>
                  <th className="px-4 py-3 text-left">활동 유형</th>
                  <th className="px-4 py-3 text-right">배출계수</th>
                  <th className="px-4 py-3 text-left">단위</th>
                  <th className="px-4 py-3 text-left">Scope</th>
                  <th className="px-4 py-3 text-center">버전</th>
                  <th className="px-4 py-3 text-left">적용일</th>
                  <th className="px-4 py-3 text-left">비고</th>
                  <th className="px-4 py-3 text-right">작업</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {emissionFactors.map((ef) => (
                  <tr key={ef.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-800">{ef.source}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {{ electricity: "전기", raw_material: "원소재", transport: "운송" }[ef.activityType]}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-semibold text-slate-900">
                      {ef.factor}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      kgCO₂e / {ef.unit}
                    </td>
                    <td className="px-4 py-3">
                      <ScopeBadge scope={ef.scope} />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                        v{ef.version}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{ef.effectiveFrom}</td>
                    <td className="px-4 py-3 text-xs text-slate-400 max-w-[200px] truncate">
                      {ef.notes ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => { setSaveError(null); setEditing(ef); }}
                      >
                        수정
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 수정 모달 */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-base font-semibold text-slate-900">
              배출계수 수정 — {editing.source}
            </h2>
            {saveError && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {saveError}
              </div>
            )}
            <EmissionFactorForm
              factor={editing}
              onSubmit={handleSubmit}
              onCancel={() => { setEditing(null); setSaveError(null); }}
            />
          </div>
        </div>
      )}
    </>
  );
}
