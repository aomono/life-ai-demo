"use client";

import type { AgentId, AgentStatus, OrchestraEvent } from "@/lib/orchestra";
import { AGENT_META, GRAPH_EDGES, STATUS_LABEL } from "./agentMeta";

type Props = {
  statuses: Record<AgentId, AgentStatus>;
  handoffs: OrchestraEvent[];
};

function edgePath(a: AgentId, b: AgentId): string {
  const m1 = AGENT_META[a];
  const m2 = AGENT_META[b];
  return `M ${m1.x} ${m1.y} L ${m2.x} ${m2.y}`;
}

export function AgentGraph({ statuses, handoffs }: Props) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur">
      <svg
        viewBox="0 0 800 380"
        className="h-auto w-full"
        role="img"
        aria-label="エージェント相関図"
      >
        {GRAPH_EDGES.map(([a, b]) => {
          const active = handoffs.some(
            (h) => (h.agent === a && h.to === b) || (h.agent === b && h.to === a),
          );
          return (
            <path
              key={`${a}-${b}`}
              d={edgePath(a, b)}
              stroke={active ? "#38bdf8" : "#1e293b"}
              strokeWidth={active ? 2.5 : 1.5}
              fill="none"
              className="transition-all duration-300"
            />
          );
        })}
        {handoffs.map((h) => (
          <circle key={h.id} r={6} fill="#7dd3fc" opacity={0.95}>
            <animateMotion
              dur="1.7s"
              repeatCount="1"
              fill="freeze"
              path={edgePath(h.agent, h.to!)}
            />
          </circle>
        ))}
        {(Object.keys(AGENT_META) as AgentId[]).map((id) => {
          const meta = AGENT_META[id];
          const status = statuses[id];
          const lit = status === "thinking" || status === "working";
          return (
            <g
              key={id}
              opacity={status === "idle" ? 0.4 : 1}
              className="transition-opacity duration-500"
            >
              {status === "done" && (
                <circle
                  cx={meta.x}
                  cy={meta.y}
                  r={42}
                  fill="none"
                  stroke={meta.color}
                  strokeWidth={2}
                  opacity={0.7}
                />
              )}
              <circle
                cx={meta.x}
                cy={meta.y}
                r={34}
                fill="#0f172a"
                stroke={meta.color}
                strokeWidth={lit ? 3 : 1.5}
                className={lit ? "orchestra-pulse" : undefined}
                style={lit ? { filter: `drop-shadow(0 0 10px ${meta.color})` } : undefined}
              />
              <text
                x={meta.x}
                y={meta.y + 5}
                textAnchor="middle"
                fill={meta.color}
                fontSize={15}
                fontWeight={700}
              >
                {status === "done" ? "✓" : "AI"}
              </text>
              <text
                x={meta.x}
                y={meta.y + 58}
                textAnchor="middle"
                fill="#e2e8f0"
                fontSize={14}
                fontWeight={600}
              >
                {meta.label}
              </text>
              <text
                x={meta.x}
                y={meta.y + 76}
                textAnchor="middle"
                fill="#64748b"
                fontSize={11}
              >
                {STATUS_LABEL[status]}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
