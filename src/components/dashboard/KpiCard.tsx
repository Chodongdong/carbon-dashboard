import { Skeleton } from "@/components/ui/Skeleton";

type Props = {
  label: string;
  value: string;
  unit?: string;
  sub?: string;
  trend?: { value: number; label: string };
  accentColor?: string;
  loading?: boolean;
};

export function KpiCard({ label, value, unit, sub, trend, accentColor = "emerald", loading }: Props) {
  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-3 w-20" />
      </div>
    );
  }

  const trendPositive = trend && trend.value <= 0;
  const trendColor = trendPositive ? "text-emerald-600" : "text-red-500";
  const trendArrow = trend ? (trend.value <= 0 ? "↓" : "↑") : null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 hover:shadow-md transition-shadow">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <div className="mt-2 flex items-end gap-1.5">
        <span className={`text-3xl font-bold text-slate-900`}>{value}</span>
        {unit && <span className="mb-0.5 text-sm text-slate-500">{unit}</span>}
      </div>
      <div className="mt-2 flex items-center gap-2">
        {sub && <span className="text-xs text-slate-500">{sub}</span>}
        {trend && (
          <span className={`text-xs font-medium ${trendColor}`}>
            {trendArrow} {Math.abs(trend.value).toFixed(1)}% {trend.label}
          </span>
        )}
      </div>
      <div className={`mt-3 h-1 w-12 rounded-full bg-${accentColor}-500 opacity-60`} />
    </div>
  );
}
