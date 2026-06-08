"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { HealthMetrics } from "@/lib/types";

type Row = {
  name: string;
  value: number;
  threshold: number;
  unit: string;
};

export function HealthMetricChart({ m }: { m: HealthMetrics }) {
  const data: Row[] = [
    { name: "BMI", value: m.bmi, threshold: 25, unit: "" },
    { name: "収縮期 BP", value: m.bloodPressure.systolic, threshold: 130, unit: "mmHg" },
    { name: "HbA1c", value: m.hba1c * 20, threshold: 6.0 * 20, unit: "% ×20" },
    { name: "LDL", value: m.ldl, threshold: 140, unit: "mg/dL" },
    { name: "睡眠", value: m.averageSleepHours * 15, threshold: 6.5 * 15, unit: "h ×15" },
    { name: "歩数 / 1k", value: m.averageSteps / 100, threshold: 70, unit: "歩 /100" },
  ];

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} />
          <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
          <Tooltip
            contentStyle={{
              fontSize: 12,
              border: "1px solid #cbd5e1",
              borderRadius: 6,
            }}
            formatter={(v, _n, ctx) => {
              const unit = (ctx?.payload as Row | undefined)?.unit ?? "";
              return [`${v} ${unit}`.trim(), "値"];
            }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((d, i) => (
              <Cell
                key={i}
                fill={d.value > d.threshold ? "#dc2626" : "#1e3a8a"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p className="mt-1 text-[10px] text-slate-400">
        ※ HbA1c・睡眠・歩数はスケール調整して並べています (相対比較用)。
      </p>
    </div>
  );
}
