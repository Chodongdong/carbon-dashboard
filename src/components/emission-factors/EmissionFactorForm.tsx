"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { ScopeBadge } from "@/components/ui/Badge";
import type { EmissionFactor } from "@/types";

const schema = z.object({
  factor: z
    .number({ error: "숫자를 입력해 주세요." })
    .positive("0보다 큰 값을 입력해 주세요."),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  factor: EmissionFactor;
  onSubmit: (updated: EmissionFactor) => Promise<void>;
  onCancel: () => void;
};

const inputClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500";
const labelClass = "mb-1 block text-xs font-medium text-slate-600";

export function EmissionFactorForm({ factor, onSubmit, onCancel }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { factor: factor.factor, notes: factor.notes ?? "" },
  });

  const handleFormSubmit = async (values: FormValues) => {
    await onSubmit({ ...factor, ...values });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* 읽기 전용 정보 */}
      <div className="rounded-lg bg-slate-50 px-4 py-3 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-500">출처</span>
          <span className="font-medium text-slate-800">{factor.source}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">단위</span>
          <span className="font-medium text-slate-800">kgCO₂e / {factor.unit}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-500">Scope</span>
          <ScopeBadge scope={factor.scope} />
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">현재 버전</span>
          <span className="font-medium text-slate-800">v{factor.version}</span>
        </div>
      </div>

      {/* 수정 가능 필드 */}
      <div>
        <label className={labelClass}>배출계수 값 (kgCO₂e / {factor.unit}) *</label>
        <input
          type="number"
          step="any"
          className={inputClass}
          {...register("factor", { valueAsNumber: true })}
        />
        {errors.factor && <p className="mt-1 text-xs text-red-600">{errors.factor.message}</p>}
      </div>

      <div>
        <label className={labelClass}>비고</label>
        <input type="text" className={inputClass} {...register("notes")} placeholder="변경 사유 등" />
      </div>

      <p className="text-xs text-slate-500">
        저장 시 버전이 v{factor.version + 1}로 자동 증가합니다.
      </p>

      <div className="flex justify-end gap-2 pt-1">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
          취소
        </Button>
        <Button type="submit" loading={isSubmitting}>
          저장
        </Button>
      </div>
    </form>
  );
}
