"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MonthlySpending } from "@/lib/types";

const SERIES = [
  { key: "baby" as const, name: "ベビー用品", color: "#dc2626" },
  { key: "care" as const, name: "介護用品", color: "#7c3aed" },
  { key: "housing" as const, name: "住宅関連", color: "#0ea5e9" },
  { key: "medicalPharmacy" as const, name: "医療・薬局", color: "#f59e0b" },
  { key: "investment" as const, name: "投資積立", color: "#16a34a" },
  { key: "insurance" as const, name: "保険料", color: "#475569" },
];

export function SpendingChart({ data }: { data: MonthlySpending[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 8, right: 8, bottom: 0, left: -8 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} />
          <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
          <Tooltip
            contentStyle={{
              fontSize: 12,
              border: "1px solid #cbd5e1",
              borderRadius: 6,
            }}
            formatter={(v) =>
              typeof v === "number" ? `${v.toLocaleString()} 円` : String(v)
            }
          />
          <Legend
            wrapperStyle={{ fontSize: 11 }}
            iconType="plainline"
            verticalAlign="bottom"
          />
          {SERIES.map((s) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.name}
              stroke={s.color}
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
