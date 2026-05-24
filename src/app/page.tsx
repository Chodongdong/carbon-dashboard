"use client";

import { useEffect, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { ScopeChart } from "@/components/dashboard/ScopeChart";
import { ActivityBreakdown } from "@/components/dashboard/ActivityBreakdown";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { useDataStore } from "@/store/data";
import { calculatePcf, aggregateByMonth, aggregateByScope } from "@/lib/pcf";

export default function DashboardPage() {
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

  useEffect(() => {
    if (activitiesStatus === "idle") loadActivities();
    if (factorsStatus === "idle") loadEmissionFactors();
  }, [activitiesStatus, factorsStatus, loadActivities, loadEmissionFactors]);

  const isLoading = activitiesStatus === "loading" || factorsStatus === "loading";
  const hasError = activitiesStatus === "error" || factorsStatus === "error";

  const pcfResults = useMemo(
    () => calculatePcf(activities, emissionFactors),
    [activities, emissionFactors]
  );

  const monthlyData = useMemo(() => aggregateByMonth(pcfResults), [pcfResults]);
  const scopeData = useMemo(() => aggregateByScope(pcfResults), [pcfResults]);

  const totalEmissions = useMemo(
    () => pcfResults.reduce((sum, r) => sum + r.emissions, 0),
    [pcfResults]
  );

  const momTrend = useMemo(() => {
    if (monthlyData.length < 2) return null;
    const last = monthlyData[monthlyData.length - 1];
    const prev = monthlyData[monthlyData.length - 2];
    if (prev.total === 0) return null;
    return ((last.total - prev.total) / prev.total) * 100;
  }, [monthlyData]);

  const latestMonth = monthlyData[monthlyData.length - 1];
  const scope2Total = scopeData.find((s) => s.scope === "scope2")?.emissions ?? 0;
  const scope3Total = scopeData.find((s) => s.scope === "scope3")?.emissions ?? 0;

  if (hasError) {
    return (
      <div className="flex-1 p-6">
        <ErrorMessage
          message={activitiesError ?? factorsError ?? "데이터를 불러오지 못했습니다."}
          onRetry={() => {
            loadActivities();
            loadEmissionFactors();
          }}
        />
      </div>
    );
  }

  return (
    <>
      <Header
        title="탄소 배출량 대시보드"
        description="PCF (Product Carbon Footprint) 전과정 데이터 요약"
      />

      <div className="flex-1 p-6 space-y-6">
        {/* KPI 카드 */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <KpiCard
            label="총 배출량 (누적)"
            value={isLoading ? "-" : totalEmissions.toLocaleString()}
            unit="kgCO₂e"
            sub={`${activities.length}건 활동 데이터`}
            loading={isLoading}
          />
          <KpiCard
            label="최근 월 배출량"
            value={isLoading ? "-" : (latestMonth?.total ?? 0).toLocaleString()}
            unit="kgCO₂e"
            sub={latestMonth?.yearMonth ?? "-"}
            trend={momTrend !== null ? { value: momTrend, label: "전월 대비" } : undefined}
            loading={isLoading}
          />
          <KpiCard
            label="Scope 2 (전기)"
            value={isLoading ? "-" : scope2Total.toLocaleString()}
            unit="kgCO₂e"
            sub="간접 에너지 배출"
            loading={isLoading}
          />
          <KpiCard
            label="Scope 3 (원소재·운송)"
            value={isLoading ? "-" : scope3Total.toLocaleString()}
            unit="kgCO₂e"
            sub="가치사슬 배출"
            loading={isLoading}
          />
        </div>

        {/* 트렌드 차트 */}
        <TrendChart data={monthlyData} loading={isLoading} />

        {/* 하단 2열 */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ScopeChart data={scopeData} loading={isLoading} />
          <ActivityBreakdown results={pcfResults} loading={isLoading} />
        </div>

        {/* PCF 계산 방식 설명 배너 */}
        {!isLoading && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex items-start gap-3">
              <span className="text-lg">🌿</span>
              <div>
                <p className="text-sm font-semibold text-emerald-800">PCF 계산 방식</p>
                <p className="text-xs text-emerald-700 mt-1">
                  배출량(kgCO₂e) = 활동량 × 배출계수 &nbsp;·&nbsp; Scope 2: 전기(한국전력 0.456
                  kgCO₂e/kWh) &nbsp;·&nbsp; Scope 3: 원소재(플라스틱 2.3–3.2 kgCO₂e/kg), 운송(트럭
                  3.5 kgCO₂e/ton-km)
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
