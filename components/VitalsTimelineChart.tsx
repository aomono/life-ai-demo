"use client";

import { useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DailyVitals } from "@/lib/types";

type Series = "restingHr" | "hrv" | "sleepScore" | "steps";

const SERIES: { id: Series; label: string; unit: string; threshold?: number }[] = [
  { id: "restingHr", label: "安静時心拍", unit: "bpm", threshold: 80 },
  { id: "hrv", label: "HRV", unit: "ms", threshold: 30 },
  { id: "sleepScore", label: "睡眠スコア", unit: "", threshold: 60 },
  { id: "steps", label: "歩数", unit: "歩", threshold: 5000 },
];

const COLOR: Record<Series, string> = {
  restingHr: "#e11d48",
  hrv: "#ea580c",
  sleepScore: "#4f46e5",
  steps: "#0d9488",
};

type Props = { data: DailyVitals[] };

export function VitalsTimelineChart({ data }: Props) {
  const [tab, setTab] = useState<Series>("restingHr");
  const meta = SERIES.find((s) => s.id === tab)!;
  const chartData = data.map((d) => ({
    date: d.date.slice(5),
    value: d[tab],
    anomalyFlag: d.anomalyFlag,
  }));
  const anomalyPoints = chartData
    .map((d, i) => ({ ...d, index: i }))
    .filter((d) => d.anomalyFlag === "critical");
  return (
    <div>
      <div className="mb-2 flex flex-wrap gap-1.5">
        {SERIES.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setTab(s.id)}
            className={`rounded-md px-2.5 py-1 text-[11px] font-semibold ${
              tab === s.id
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
      <div className="h-56 w-full">
        <ResponsiveContainer>
          <LineChart data={chartData} margin={{ top: 8, right: 16, bottom: 4, left: 8 }}>
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="2 2" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: "#64748b" }}
              interval={5}
            />
            <YAxis tick={{ fontSize: 10, fill: "#64748b" }} />
            <Tooltip
              formatter={(value) => [`${value} ${meta.unit}`, meta.label]}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={COLOR[tab]}
              strokeWidth={2}
              dot={{ r: 2 }}
              activeDot={{ r: 4 }}
            />
            {anomalyPoints.map((p) => (
              <ReferenceDot
                key={p.date}
                x={p.date}
                y={p.value}
                r={5}
                fill="#dc2626"
                stroke="#fff"
                strokeWidth={1}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-1 text-[10px] text-slate-500">
        単位: {meta.unit || "-"}
        {meta.threshold !== undefined && ` / 注意閾値 ${meta.threshold}`}
        {anomalyPoints.length > 0 &&
          ` / 赤マーカーは AI 検知ポイント (${anomalyPoints.length} 日)`}
      </p>
    </div>
  );
}
