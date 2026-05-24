export type GhgScope = "scope1" | "scope2" | "scope3";

export type ActivityType = "electricity" | "raw_material" | "transport";

export type EmissionSource =
  | "한국전력"
  | "플라스틱 1"
  | "플라스틱 2"
  | "트럭";

export type Unit = "kWh" | "kg" | "ton-km";

export type Activity = {
  id: string;
  date: string; // "2025-01-01"
  activityType: ActivityType;
  source: EmissionSource;
  quantity: number;
  unit: Unit;
};

export type EmissionFactor = {
  id: string;
  source: EmissionSource;
  activityType: ActivityType;
  unit: Unit;
  factor: number; // kgCO2e per unit
  scope: GhgScope;
  version: number;
  effectiveFrom: string; // "2025-01-01"
  notes?: string;
};

export type PcfResult = {
  activityId: string;
  date: string;
  activityType: ActivityType;
  source: EmissionSource;
  quantity: number;
  unit: Unit;
  factor: number;
  emissions: number; // kgCO2e = quantity * factor
  scope: GhgScope;
};

export type MonthlyEmissionSummary = {
  yearMonth: string; // "2025-01"
  scope1: number;
  scope2: number;
  scope3: number;
  total: number;
};

export type ScopeSummary = {
  scope: GhgScope;
  label: string;
  emissions: number;
  percentage: number;
};

// Company / Post (과제 문서 기본 모델 유지)
export type Company = {
  id: string;
  name: string;
  country: string;
  emissions: GhgEmission[];
};

export type GhgEmission = {
  yearMonth: string;
  source: string;
  emissions: number;
};

export type Post = {
  id: string;
  title: string;
  resourceUid: string;
  dateTime: string;
  content: string;
};
