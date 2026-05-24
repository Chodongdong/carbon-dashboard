"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { ScopeBadge } from "@/components/ui/Badge";
import type { Activity, ActivityType, EmissionSource, Unit } from "@/types";

const schema = z.object({
  date: z.string().min(1, "날짜를 입력해 주세요."),
  activityType: z.enum(["electricity", "raw_material", "transport"], {
    error: "활동 유형을 선택해 주세요.",
  }),
  source: z.enum(["한국전력", "플라스틱 1", "플라스틱 2", "트럭"], {
    error: "출처를 선택해 주세요.",
  }),
  quantity: z
    .number({ error: "숫자를 입력해 주세요." })
    .positive("0보다 큰 값을 입력해 주세요."),
  unit: z.enum(["kWh", "kg", "ton-km"]),
});

type FormValues = z.infer<typeof schema>;

const SOURCE_BY_TYPE: Record<ActivityType, { source: EmissionSource; unit: Unit }[]> = {
  electricity: [{ source: "한국전력", unit: "kWh" }],
  raw_material: [
    { source: "플라스틱 1", unit: "kg" },
    { source: "플라스틱 2", unit: "kg" },
  ],
  transport: [{ source: "트럭", unit: "ton-km" }],
};

const SCOPE_BY_TYPE: Record<ActivityType, "scope1" | "scope2" | "scope3"> = {
  electricity: "scope2",
  raw_material: "scope3",
  transport: "scope3",
};

type Props = {
  initial?: Activity;
  onSubmit: (values: Omit<Activity, "id">) => Promise<void>;
  onCancel: () => void;
};

const inputClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500";
const errorClass = "mt-1 text-xs text-red-600";
const labelClass = "mb-1 block text-xs font-medium text-slate-600";

export function ActivityForm({ initial, onSubmit, onCancel }: Props) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: initial
      ? {
          date: initial.date,
          activityType: initial.activityType,
          source: initial.source,
          quantity: initial.quantity,
          unit: initial.unit,
        }
      : { activityType: "electricity", source: "한국전력", unit: "kWh" },
  });

  const activityType = watch("activityType");
  const source = watch("source");

  // 활동 유형 변경 시 source/unit 자동 설정
  useEffect(() => {
    const options = SOURCE_BY_TYPE[activityType];
    if (options && options.length > 0) {
      setValue("source", options[0].source);
      setValue("unit", options[0].unit);
    }
  }, [activityType, setValue]);

  // source 변경 시 unit 자동 설정
  useEffect(() => {
    const options = SOURCE_BY_TYPE[activityType];
    const matched = options?.find((o) => o.source === source);
    if (matched) setValue("unit", matched.unit);
  }, [source, activityType, setValue]);

  const handleFormSubmit = async (values: FormValues) => {
    await onSubmit(values as Omit<Activity, "id">);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {/* 날짜 */}
        <div>
          <label className={labelClass}>날짜 *</label>
          <input type="date" className={inputClass} {...register("date")} />
          {errors.date && <p className={errorClass}>{errors.date.message}</p>}
        </div>

        {/* 활동 유형 */}
        <div>
          <label className={labelClass}>활동 유형 *</label>
          <select className={inputClass} {...register("activityType")}>
            <option value="electricity">전기</option>
            <option value="raw_material">원소재</option>
            <option value="transport">운송</option>
          </select>
          {errors.activityType && <p className={errorClass}>{errors.activityType.message}</p>}
        </div>

        {/* 출처 */}
        <div>
          <label className={labelClass}>출처 *</label>
          <select className={inputClass} {...register("source")}>
            {SOURCE_BY_TYPE[activityType]?.map(({ source }) => (
              <option key={source} value={source}>{source}</option>
            ))}
          </select>
          {errors.source && <p className={errorClass}>{errors.source.message}</p>}
        </div>

        {/* 량 */}
        <div>
          <label className={labelClass}>량 *</label>
          <div className="flex gap-2">
            <input
              type="number"
              step="any"
              placeholder="0"
              className={inputClass}
              {...register("quantity", { valueAsNumber: true })}
            />
            <span className="flex items-center rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500 whitespace-nowrap">
              {watch("unit")}
            </span>
          </div>
          {errors.quantity && <p className={errorClass}>{errors.quantity.message}</p>}
        </div>
      </div>

      {/* Scope 미리보기 */}
      <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2">
        <span className="text-xs text-slate-500">GHG Scope 분류:</span>
        <ScopeBadge scope={SCOPE_BY_TYPE[activityType]} />
        <span className="text-xs text-slate-400">
          {activityType === "electricity"
            ? "간접 에너지 배출"
            : activityType === "raw_material"
            ? "Upstream 가치사슬"
            : "Downstream 가치사슬"}
        </span>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
          취소
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {initial ? "수정 저장" : "활동 추가"}
        </Button>
      </div>
    </form>
  );
}
