"use client";

import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/layout/Header";
import { ActivityTable } from "@/components/activities/ActivityTable";
import { ActivityForm } from "@/components/activities/ActivityForm";
import { ActivityFilters, type Filters } from "@/components/activities/ActivityFilters";
import { ExcelImport } from "@/components/activities/ExcelImport";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Button } from "@/components/ui/Button";
import { useDataStore } from "@/store/data";
import type { Activity } from "@/types";

type ModalState =
  | { type: "closed" }
  | { type: "add" }
  | { type: "edit"; activity: Activity };

export default function ActivitiesPage() {
  const {
    activities,
    emissionFactors,
    activitiesStatus,
    factorsStatus,
    activitiesError,
    loadActivities,
    loadEmissionFactors,
    addActivity,
    bulkAddActivities,
    editActivity,
    removeActivity,
  } = useDataStore();

  const [modal, setModal] = useState<ModalState>({ type: "closed" });
  const [formError, setFormError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    activityType: "",
    source: "",
    yearMonth: "",
  });

  useEffect(() => {
    if (activitiesStatus === "idle") loadActivities();
    if (factorsStatus === "idle") loadEmissionFactors();
  }, [activitiesStatus, factorsStatus, loadActivities, loadEmissionFactors]);

  const isLoading =
    activitiesStatus === "loading" || activitiesStatus === "idle" || factorsStatus === "loading";

  const filteredActivities = useMemo(() => {
    return activities.filter((a) => {
      if (filters.activityType && a.activityType !== filters.activityType) return false;
      if (filters.source && a.source !== filters.source) return false;
      if (filters.yearMonth && !a.date.startsWith(filters.yearMonth)) return false;
      return true;
    });
  }, [activities, filters]);

  const handleFormSubmit = async (values: Omit<Activity, "id">) => {
    setFormError(null);
    try {
      if (modal.type === "edit") {
        await editActivity({ ...values, id: modal.activity.id });
      } else {
        await addActivity(values);
      }
      setModal({ type: "closed" });
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "저장에 실패했습니다.");
    }
  };

  const handleImport = async (items: Omit<Activity, "id">[]) => {
    await bulkAddActivities(items);
  };

  if (activitiesStatus === "error") {
    return (
      <div className="flex-1 p-6">
        <ErrorMessage message={activitiesError ?? "오류가 발생했습니다."} onRetry={loadActivities} />
      </div>
    );
  }

  return (
    <>
      <Header
        title="활동 데이터"
        description="원본 활동 데이터 입력 및 관리"
        actions={
          <div className="flex items-center gap-2">
            <ExcelImport onImport={handleImport} />
            <Button size="sm" onClick={() => { setFormError(null); setModal({ type: "add" }); }}>
              + 활동 추가
            </Button>
          </div>
        }
      />

      <div className="flex-1 p-6 space-y-4">
        {/* 필터 */}
        <ActivityFilters filters={filters} onChange={setFilters} />

        {/* 건수 요약 */}
        {!isLoading && (
          <p className="text-xs text-slate-500">
            총 {filteredActivities.length}건
            {filteredActivities.length !== activities.length && ` (전체 ${activities.length}건)`}
          </p>
        )}

        {/* 테이블 */}
        <ActivityTable
          activities={filteredActivities}
          emissionFactors={emissionFactors}
          loading={isLoading}
          onEdit={(a) => { setFormError(null); setModal({ type: "edit", activity: a }); }}
          onDelete={removeActivity}
        />
      </div>

      {/* 모달 */}
      {modal.type !== "closed" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-base font-semibold text-slate-900">
              {modal.type === "edit" ? "활동 데이터 수정" : "새 활동 데이터 추가"}
            </h2>

            {formError && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {formError}
              </div>
            )}

            <ActivityForm
              initial={modal.type === "edit" ? modal.activity : undefined}
              onSubmit={handleFormSubmit}
              onCancel={() => setModal({ type: "closed" })}
            />
          </div>
        </div>
      )}
    </>
  );
}
