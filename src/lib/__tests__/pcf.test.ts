import { describe, it, expect } from "vitest";
import { calculatePcf, aggregateByMonth, aggregateByScope } from "@/lib/pcf";
import { emissionFactors } from "@/lib/data/emission-factors";
import type { Activity } from "@/types";

const sampleActivities: Activity[] = [
  { id: "1", date: "2025-01-01", activityType: "electricity", source: "한국전력", quantity: 110, unit: "kWh" },
  { id: "2", date: "2025-01-01", activityType: "raw_material", source: "플라스틱 1", quantity: 230, unit: "kg" },
  { id: "3", date: "2025-01-01", activityType: "transport", source: "트럭", quantity: 41, unit: "ton-km" },
  { id: "4", date: "2025-02-01", activityType: "electricity", source: "한국전력", quantity: 112, unit: "kWh" },
];

describe("calculatePcf", () => {
  it("전기 배출량을 올바르게 계산한다 (110 kWh × 0.456 = 50.16 kgCO2e)", () => {
    const results = calculatePcf(sampleActivities, emissionFactors);
    const electricity = results.find((r) => r.activityId === "1");
    expect(electricity?.emissions).toBe(50.16);
    expect(electricity?.scope).toBe("scope2");
  });

  it("원소재 배출량을 올바르게 계산한다 (230 kg × 2.3 = 529 kgCO2e)", () => {
    const results = calculatePcf(sampleActivities, emissionFactors);
    const material = results.find((r) => r.activityId === "2");
    expect(material?.emissions).toBe(529);
    expect(material?.scope).toBe("scope3");
  });

  it("운송 배출량을 올바르게 계산한다 (41 ton-km × 3.5 = 143.5 kgCO2e)", () => {
    const results = calculatePcf(sampleActivities, emissionFactors);
    const transport = results.find((r) => r.activityId === "3");
    expect(transport?.emissions).toBe(143.5);
    expect(transport?.scope).toBe("scope3");
  });

  it("배출계수가 없는 활동은 emissions 0으로 처리한다", () => {
    const unknown: Activity = {
      id: "x",
      date: "2025-01-01",
      activityType: "electricity",
      source: "한국전력" as never,
      quantity: 100,
      unit: "kWh",
    };
    const results = calculatePcf([{ ...unknown, source: "알수없음" as never }], emissionFactors);
    expect(results[0].emissions).toBe(0);
  });
});

describe("aggregateByMonth", () => {
  it("같은 월의 배출량을 합산한다", () => {
    const results = calculatePcf(sampleActivities, emissionFactors);
    const monthly = aggregateByMonth(results);
    const jan = monthly.find((m) => m.yearMonth === "2025-01");
    // scope2: 50.16, scope3: 529 + 143.5 = 672.5, total: 722.66
    expect(jan?.scope2).toBe(50.16);
    expect(jan?.scope3).toBe(672.5);
    expect(jan?.total).toBe(722.66);
  });

  it("월별 결과를 날짜 순으로 정렬한다", () => {
    const results = calculatePcf(sampleActivities, emissionFactors);
    const monthly = aggregateByMonth(results);
    expect(monthly[0].yearMonth).toBe("2025-01");
    expect(monthly[1].yearMonth).toBe("2025-02");
  });
});

describe("aggregateByScope", () => {
  it("Scope별 배출량 합계와 비율을 계산한다", () => {
    const results = calculatePcf(sampleActivities, emissionFactors);
    const scopes = aggregateByScope(results);
    const scope2 = scopes.find((s) => s.scope === "scope2");
    const scope3 = scopes.find((s) => s.scope === "scope3");
    expect(scope2).toBeDefined();
    expect(scope3).toBeDefined();
    expect(scope2!.emissions + scope3!.emissions).toBeCloseTo(
      results.reduce((sum, r) => sum + r.emissions, 0),
      2
    );
  });
});
