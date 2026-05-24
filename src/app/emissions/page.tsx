"use client";

import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/layout/Header";
import { PcfTable } from "@/components/emissions/PcfTable";
import { MonthlySummaryTable } from "@/components/emissions/MonthlySummaryTable";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { ScopeChart } from "@/components/dashboard/ScopeChart";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { useDataStore } from "@/store/data";
import { calculatePcf, aggregateByMonth, aggregateByScope } from "@/lib/pcf";
import type { GhgScope } from "@/types";

type Tab = "detail" | "monthly";
type ScopeFilter = "" | GhgScope;

export default function EmissionsPage() {
  const {
    activities,
    emissionFactors,
    activitiesStatus,
    factorsStatus,
    activitiesError,
    factorsError,
    loadActivities,
    loadEmissionFactors,
  } = useDataStore();

  const [tab, setTab] = useState<Tab>("detail");
  const [scopeFilter, setScopeFilter] = useState<ScopeFilter>("");
  const [sourceFilter, setSourceFilter] = useState("");

  useEffect(() => {
    if (activitiesStatus === "idle") loadActivities();
    if (factorsStatus === "idle") loadEmissionFactors();
  }, [activitiesStatus, factorsStatus, loadActivities, loadEmissionFactors]);

  const isLoading = activitiesStatus === "loading" || activitiesStatus === "idle" || factorsStatus === "loading";
  const hasError = activitiesStatus === "error" || factorsStatus === "error";

  const allResults = useMemo(
    () => calculatePcf(activities, emissionFactors),
    [activities, emissionFactors]
  );

  const filteredResults = useMemo(() => {
    return allResults.filter((r) => {
      if (scopeFilter && r.scope !== scopeFilter) return false;
      if (sourceFilter && r.source !== sourceFilter) return false;
      return true;
    });
  }, [allResults, scopeFilter, sourceFilter]);

  const monthlyData = useMemo(() => aggregateByMonth(allResults), [allResults]);
  const scopeData = useMemo(() => aggregateByScope(allResults), [allResults]);
  const totalEmissions = allResults.reduce((s, r) => s + r.emissions, 0);

  const sources = useMemo(
    () => Array.from(new Set(allResults.map((r) => r.source))),
    [allResults]
  );

  if (hasError) {
    return (
      <div className="flex-1 p-6">
        <ErrorMessage
          message={activitiesError ?? factorsError ?? "오류가 발생했습니다."}
          onRetry={() => { loadActivities(); loadEmissionFactors(); }}
        />
      </div>
    );
  }

  const selectClass =
    "rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500";
  const tabClass = (active: boolean) =>
    `px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
      active ? "bg-emerald-600 text-white" : "text-slate-600 hover:bg-slate-100"
    }`;

  return (
    <>
      <Header
        title="PCF 계산 결과"
        description="Product Carbon Footprint — 활동량 × 배출계수 = kgCO₂e"
      />

      <div className="flex-1 p-6 space-y-6">
        {/* 요약 배너 */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "총 배출량", value: totalEmissions, color: "emerald" },
            { label: "Scope 2 (전기)", value: scopeData.find((s) => s.scope === "scope2")?.emissions ?? 0, color: "blue" },
            { label: "Scope 3 (원소재·운송)", value: scopeData.find((s) => s.scope === "scope3")?.emissions ?? 0, color: "purple" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-xl border border-slate-200 bg-white px-5 py-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
              <p className={`mt-1 text-2xl font-bold text-${color}-700`}>
                {isLoading ? "—" : value.toLocaleString()}
                <span className="ml-1 text-sm font-normal text-slate-500">kgCO₂e</span>
              </p>
            </div>
          ))}
        </div>

        {/* 차트 2열 */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <TrendChart data={monthlyData} loading={isLoading} />
          <ScopeChart data={scopeData} loading={isLoading} />
        </div>

        {/* 탭 + 필터 */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
            <button className={tabClass(tab === "detail")} onClick={() => setTab("detail")}>
              상세 내역
            </button>
            <button className={tabClass(tab === "monthly")} onClick={() => setTab("monthly")}>
              월별 요약
            </button>
          </div>

          {tab === "detail" && (
            <div className="flex gap-2">
              <select
                className={selectClass}
                value={scopeFilter}
                onChange={(e) => setScopeFilter(e.target.value as ScopeFilter)}
              >
                <option value="">전체 Scope</option>
                <option value="scope1">Scope 1</option>
                <option value="scope2">Scope 2</option>
                <option value="scope3">Scope 3</option>
              </select>
              <select
                className={selectClass}
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
              >
                <option value="">전체 출처</option>
                {sources.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* 테이블 */}
        {tab === "detail" ? (
          <PcfTable results={filteredResults} loading={isLoading} />
        ) : (
          <MonthlySummaryTable data={monthlyData} loading={isLoading} />
        )}
      </div>
    </>
  );
}
