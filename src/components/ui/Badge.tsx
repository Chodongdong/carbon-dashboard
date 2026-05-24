import type { GhgScope } from "@/types";

type Variant = "scope1" | "scope2" | "scope3" | "success" | "warning" | "error" | "neutral";

const variantStyles: Record<Variant, string> = {
  scope1: "bg-orange-100 text-orange-700 border border-orange-200",
  scope2: "bg-blue-100 text-blue-700 border border-blue-200",
  scope3: "bg-purple-100 text-purple-700 border border-purple-200",
  success: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  warning: "bg-amber-100 text-amber-700 border border-amber-200",
  error: "bg-red-100 text-red-700 border border-red-200",
  neutral: "bg-slate-100 text-slate-600 border border-slate-200",
};

type Props = {
  label: string;
  variant?: Variant;
  size?: "sm" | "md";
};

export function Badge({ label, variant = "neutral", size = "sm" }: Props) {
  const sizeClass = size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-2.5 py-1";
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${sizeClass} ${variantStyles[variant]}`}>
      {label}
    </span>
  );
}

export function ScopeBadge({ scope }: { scope: GhgScope }) {
  const labels: Record<GhgScope, string> = {
    scope1: "Scope 1",
    scope2: "Scope 2",
    scope3: "Scope 3",
  };
  return <Badge label={labels[scope]} variant={scope} />;
}
