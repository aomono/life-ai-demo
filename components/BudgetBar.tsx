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
import type { SegmentProposal } from "@/lib/types";

const CHANNEL_LABEL: Record<SegmentProposal["channelAllocation"][number]["channel"], string> = {
  dm: "DM",
  line: "LINE 公式",
  "face-to-face": "対面 (代理店)",
};

const CHANNEL_COLOR: Record<string, string> = {
  dm: "#64748b",
  line: "#06b6d4",
  "face-to-face": "#0f172a",
};

type Props = {
  allocation: SegmentProposal["channelAllocation"];
};

export function BudgetBar({ allocation }: Props) {
  const data = allocation.map((a) => ({
    name: CHANNEL_LABEL[a.channel],
    share: a.sharePct,
    budget: a.budgetYen,
    reach: a.estimatedReach,
    fill: CHANNEL_COLOR[a.channel],
  }));
  return (
    <div className="h-44 w-full">
      <ResponsiveContainer>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 12, bottom: 4, left: 60 }}
        >
          <CartesianGrid stroke="#e2e8f0" strokeDasharray="2 2" horizontal={false} />
          <XAxis
            type="number"
            domain={[0, 60]}
            tickFormatter={(v) => `${v}%`}
            tick={{ fontSize: 10, fill: "#64748b" }}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 11, fill: "#1e293b" }}
            width={80}
          />
          <Tooltip
            formatter={(value, _name, item) => {
              const p = (item as { payload?: { budget: number; reach: number } }).payload;
              if (!p) return [`${value}%`, "シェア"];
              return [
                `${value}% (予算 ${(p.budget / 1_000_000).toFixed(0)}M / 接触 ${p.reach.toLocaleString()})`,
                "シェア",
              ];
            }}
          />
          <Bar dataKey="share" radius={[0, 4, 4, 0]}>
            {data.map((d, i) => (
              <Cell key={i} fill={d.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
