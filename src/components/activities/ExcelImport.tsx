"use client";

import { useRef, useState } from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/Button";
import type { Activity, ActivityType, EmissionSource, Unit } from "@/types";

// Excel 컬럼 → 내부 타입 매핑
const TYPE_MAP: Record<string, ActivityType> = {
  전기: "electricity",
  원소재: "raw_material",
  운송: "transport",
};

const SOURCE_MAP: Record<string, EmissionSource> = {
  한국전력: "한국전력",
  "플라스틱 1": "플라스틱 1",
  "플라스틱 2": "플라스틱 2",
  트럭: "트럭",
};

const UNIT_MAP: Record<string, Unit> = {
  kWh: "kWh",
  kg: "kg",
  "ton-km": "ton-km",
};

type ParseResult = {
  imported: Omit<Activity, "id">[];
  skipped: number;
};

type Props = {
  onImport: (activities: Omit<Activity, "id">[]) => Promise<void>;
};

export function ExcelImport({ onImport }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const parseExcel = (file: File): Promise<ParseResult> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const wb = XLSX.read(e.target?.result, { type: "array", cellDates: true });
          // "원본 활동 데이터" 시트 우선, 없으면 첫 번째 시트
          const sheetName =
            wb.SheetNames.find((n) => n.includes("활동")) ?? wb.SheetNames[0];
          const ws = wb.Sheets[sheetName];
          const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, {
            defval: "",
          });

          const imported: Omit<Activity, "id">[] = [];
          let skipped = 0;

          for (const row of rows) {
            // 헤더 행 또는 빈 행 스킵
            const rawDate = row["일자(원본)"] ?? row["일자"] ?? row["date"] ?? "";
            const rawType = String(row["활동 유형"] ?? row["activityType"] ?? "").trim();
            const rawSource = String(row["설명"] ?? row["source"] ?? "").trim();
            const rawQty = row["량"] ?? row["quantity"] ?? "";
            const rawUnit = String(row["단위"] ?? row["unit"] ?? "").trim();

            const activityType = TYPE_MAP[rawType];
            const source = SOURCE_MAP[rawSource];
            const unit = UNIT_MAP[rawUnit];
            const quantity = parseFloat(String(rawQty));

            // 날짜 변환 (Date 객체 또는 문자열)
            let date = "";
            if (rawDate instanceof Date) {
              date = rawDate.toISOString().slice(0, 10);
            } else if (typeof rawDate === "string" && rawDate) {
              date = rawDate.slice(0, 10);
            }

            if (!activityType || !source || !unit || isNaN(quantity) || !date) {
              skipped++;
              continue;
            }

            imported.push({ date, activityType, source, quantity, unit });
          }

          resolve({ imported, skipped });
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus("loading");
    setMessage("");

    try {
      const { imported, skipped } = await parseExcel(file);
      if (imported.length === 0) {
        setStatus("error");
        setMessage("임포트할 데이터가 없습니다. 컬럼명을 확인해 주세요.");
        return;
      }
      await onImport(imported);
      setStatus("success");
      setMessage(`${imported.length}건 임포트 완료${skipped > 0 ? ` (${skipped}건 스킵)` : ""}`);
    } catch {
      setStatus("error");
      setMessage("파일을 읽는 중 오류가 발생했습니다.");
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="flex items-center gap-3">
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        className="hidden"
        onChange={handleFile}
      />
      <Button
        variant="secondary"
        size="sm"
        loading={status === "loading"}
        onClick={() => inputRef.current?.click()}
      >
        📥 Excel 임포트
      </Button>

      {status === "success" && (
        <span className="text-xs text-emerald-600 font-medium">{message}</span>
      )}
      {status === "error" && (
        <span className="text-xs text-red-600 font-medium">{message}</span>
      )}
    </div>
  );
}
