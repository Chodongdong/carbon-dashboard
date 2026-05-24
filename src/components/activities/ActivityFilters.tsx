"use client";

type Filters = {
  activityType: string;
  source: string;
  yearMonth: string;
};

type Props = {
  filters: Filters;
  onChange: (filters: Filters) => void;
};

const ACTIVITY_TYPE_OPTIONS = [
  { value: "", label: "전체 유형" },
  { value: "electricity", label: "전기" },
  { value: "raw_material", label: "원소재" },
  { value: "transport", label: "운송" },
];

const SOURCE_OPTIONS = [
  { value: "", label: "전체 출처" },
  { value: "한국전력", label: "한국전력" },
  { value: "플라스틱 1", label: "플라스틱 1" },
  { value: "플라스틱 2", label: "플라스틱 2" },
  { value: "트럭", label: "트럭" },
];

const selectClass =
  "rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500";

export function ActivityFilters({ filters, onChange }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        className={selectClass}
        value={filters.activityType}
        onChange={(e) => onChange({ ...filters, activityType: e.target.value })}
      >
        {ACTIVITY_TYPE_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      <select
        className={selectClass}
        value={filters.source}
        onChange={(e) => onChange({ ...filters, source: e.target.value })}
      >
        {SOURCE_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      <input
        type="month"
        className={selectClass}
        value={filters.yearMonth}
        onChange={(e) => onChange({ ...filters, yearMonth: e.target.value })}
      />

      {(filters.activityType || filters.source || filters.yearMonth) && (
        <button
          onClick={() => onChange({ activityType: "", source: "", yearMonth: "" })}
          className="text-xs text-slate-500 underline hover:text-slate-700"
        >
          필터 초기화
        </button>
      )}
    </div>
  );
}

export type { Filters };
