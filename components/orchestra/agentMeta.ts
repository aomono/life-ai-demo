import type { AgentId } from "@/lib/orchestra";

export type AgentMeta = {
  label: string;
  role: string;
  color: string;
  twText: string;
  twBorder: string;
  x: number;
  y: number;
};

export const AGENT_META: Record<AgentId, AgentMeta> = {
  manager: {
    label: "案件マネージャー",
    role: "受付・差配・とりまとめ",
    color: "#22d3ee",
    twText: "text-cyan-300",
    twBorder: "border-cyan-400/40",
    x: 400,
    y: 90,
  },
  health: {
    label: "健康リスク分析",
    role: "健診データの読解",
    color: "#34d399",
    twText: "text-emerald-300",
    twBorder: "border-emerald-400/40",
    x: 130,
    y: 270,
  },
  product: {
    label: "商品設計",
    role: "保障プランの組成",
    color: "#a78bfa",
    twText: "text-violet-300",
    twBorder: "border-violet-400/40",
    x: 400,
    y: 300,
  },
  compliance: {
    label: "コンプラ確認",
    role: "提案の審査",
    color: "#fbbf24",
    twText: "text-amber-300",
    twBorder: "border-amber-400/40",
    x: 670,
    y: 270,
  },
};

export const GRAPH_EDGES: [AgentId, AgentId][] = [
  ["manager", "health"],
  ["manager", "product"],
  ["manager", "compliance"],
  ["health", "product"],
];

export const STATUS_LABEL: Record<string, string> = {
  idle: "待機中",
  thinking: "検討中",
  working: "作業中",
  done: "完了",
};
