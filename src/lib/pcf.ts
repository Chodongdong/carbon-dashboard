import type {
  Activity,
  EmissionFactor,
  MonthlyEmissionSummary,
  PcfResult,
  ScopeSummary,
} from "@/types";

export function calculatePcf(
  activities: Activity[],
  factors: EmissionFactor[]
): PcfResult[] {
  return activities.map((activity) => {
    const factor = factors.find((f) => f.source === activity.source);
    if (!factor) {
      return {
        activityId: activity.id,
        date: activity.date,
        activityType: activity.activityType,
        source: activity.source,
        quantity: activity.quantity,
        unit: activity.unit,
        factor: 0,
        emissions: 0,
        scope: "scope3",
      };
    }
    return {
      activityId: activity.id,
      date: activity.date,
      activityType: activity.activityType,
      source: activity.source,
      quantity: activity.quantity,
      unit: activity.unit,
      factor: factor.factor,
      emissions: roundTo(activity.quantity * factor.factor, 3),
      scope: factor.scope,
    };
  });
}

export function aggregateByMonth(results: PcfResult[]): MonthlyEmissionSummary[] {
  const map = new Map<string, MonthlyEmissionSummary>();

  for (const r of results) {
    const yearMonth = r.date.slice(0, 7); // "2025-01"
    const existing = map.get(yearMonth) ?? {
      yearMonth,
      scope1: 0,
      scope2: 0,
      scope3: 0,
      total: 0,
    };
    existing[r.scope] = roundTo(existing[r.scope] + r.emissions, 3);
    existing.total = roundTo(existing.total + r.emissions, 3);
    map.set(yearMonth, existing);
  }

  return Array.from(map.values()).sort((a, b) =>
    a.yearMonth.localeCompare(b.yearMonth)
  );
}

export function aggregateByScope(results: PcfResult[]): ScopeSummary[] {
  const totals = { scope1: 0, scope2: 0, scope3: 0 };

  for (const r of results) {
    totals[r.scope] = roundTo(totals[r.scope] + r.emissions, 3);
  }

  const total = totals.scope1 + totals.scope2 + totals.scope3;

  const labels: Record<string, string> = {
    scope1: "Scope 1 (직접 배출)",
    scope2: "Scope 2 (간접 에너지)",
    scope3: "Scope 3 (가치사슬)",
  };

  return (["scope1", "scope2", "scope3"] as const)
    .filter((s) => totals[s] > 0)
    .map((s) => ({
      scope: s,
      label: labels[s],
      emissions: totals[s],
      percentage: total > 0 ? roundTo((totals[s] / total) * 100, 1) : 0,
    }));
}

function roundTo(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}
