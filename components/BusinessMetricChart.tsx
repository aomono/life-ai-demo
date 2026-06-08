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
import type { BusinessCompany } from "@/lib/types";

type Row = {
  name: string;
  value: number;
  benchmark: number;
  worseWhenHigh: boolean;
  unit: string;
};

export function BusinessMetricChart({ c }: { c: BusinessCompany }) {
  const data: Row[] = [
    {
      name: "平均年齢",
      value: c.averageAge,
      benchmark: 42,
      worseWhenHigh: true,
      unit: "歳",
    },
    {
      name: "離職率",
      value: c.turnoverRate,
      benchmark: 15,
      worseWhenHigh: true,
      unit: "%",
    },
    {
      name: "福利厚生費 /人 (×1k)",
      value: c.welfareCostPerEmployee / 1000,
      benchmark: 60,
      worseWhenHigh: false,
      unit: "k 円",
    },
  ];

  return (
    <div className="h-52 w-full">
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
            {data.map((d, i) => {
              const bad = d.worseWhenHigh
                ? d.value > d.benchmark
                : d.value < d.benchmark;
              return <Cell key={i} fill={bad ? "#dc2626" : "#1e3a8a"} />;
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
