"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { MonthlyEmissionSummary } from "@/types";
import { Skeleton } from "@/components/ui/Skeleton";

type Props = {
  data: MonthlyEmissionSummary[];
  loading?: boolean;
};

const formatMonth = (yearMonth: string) => {
  const [, month] = yearMonth.split("-");
  return `${parseInt(month)}월`;
};

const formatEmission = (value: number) => `${value.toLocaleString()} kg`;

export function TrendChart({ data, loading }: Props) {
  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <Skeleton className="h-4 w-32 mb-6" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-slate-900">월별 배출량 추이</h2>
        <p className="text-xs text-slate-500 mt-0.5">Scope별 kgCO₂e 누적</p>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="scope2Grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="scope3Grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a855f7" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="yearMonth"
            tickFormatter={formatMonth}
            tick={{ fontSize: 12, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v) => `${v.toLocaleString()}`}
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
            width={60}
          />
          <Tooltip
            formatter={(value, name) => [
              `${Number(value).toLocaleString()} kgCO₂e`,
              name === "scope2" ? "Scope 2" : name === "scope3" ? "Scope 3" : "Scope 1",
            ]}
            labelFormatter={(label) => `${label}`}
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              fontSize: "12px",
            }}
          />
          <Legend
            formatter={(value) =>
              value === "scope2" ? "Scope 2 (전기)" : value === "scope3" ? "Scope 3 (원소재·운송)" : "Scope 1"
            }
            wrapperStyle={{ fontSize: "12px" }}
          />
          <Area
            type="monotone"
            dataKey="scope2"
            stroke="#3b82f6"
            strokeWidth={2}
            fill="url(#scope2Grad)"
            dot={{ r: 3, fill: "#3b82f6" }}
            activeDot={{ r: 5 }}
          />
          <Area
            type="monotone"
            dataKey="scope3"
            stroke="#a855f7"
            strokeWidth={2}
            fill="url(#scope3Grad)"
            dot={{ r: 3, fill: "#a855f7" }}
            activeDot={{ r: 5 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
