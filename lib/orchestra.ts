export type AgentId = "manager" | "health" | "product" | "compliance";
export type AgentStatus = "idle" | "thinking" | "working" | "done";
export type ProposalSlot = "headline" | "coverage" | "premium" | "talk";

export type OrchestraArtifact = {
  slot: ProposalSlot;
  title: string;
  body: string;
  revision: number;
};

export type OrchestraEvent = {
  id: string;
  at: number;
  agent: AgentId;
  type: "status" | "message" | "handoff" | "artifact" | "verdict";
  status?: AgentStatus;
  text?: string;
  to?: AgentId;
  artifact?: OrchestraArtifact;
  verdict?: "approved" | "rejected";
};

export type OrchestraScenario = {
  customerId: string;
  durationMs: number;
  events: OrchestraEvent[];
};

export type LogEntry = {
  event: OrchestraEvent;
  visibleChars: number;
  complete: boolean;
};

export const AGENT_IDS: AgentId[] = ["manager", "health", "product", "compliance"];
export const PROPOSAL_SLOTS: ProposalSlot[] = ["headline", "coverage", "premium", "talk"];
export const DEFAULT_HANDOFF_WINDOW_MS = 1_800;
export const TYPEWRITER_CHARS_PER_SEC = 30;

export function visibleEvents(
  scenario: OrchestraScenario,
  elapsedMs: number,
): OrchestraEvent[] {
  return scenario.events.filter((e) => e.at <= elapsedMs);
}

export function agentStatuses(
  scenario: OrchestraScenario,
  elapsedMs: number,
): Record<AgentId, AgentStatus> {
  const statuses: Record<AgentId, AgentStatus> = {
    manager: "idle",
    health: "idle",
    product: "idle",
    compliance: "idle",
  };
  for (const e of visibleEvents(scenario, elapsedMs)) {
    if (e.type === "status" && e.status) statuses[e.agent] = e.status;
  }
  return statuses;
}

export function activeHandoffs(
  scenario: OrchestraScenario,
  elapsedMs: number,
  windowMs: number = DEFAULT_HANDOFF_WINDOW_MS,
): OrchestraEvent[] {
  return scenario.events.filter(
    (e) => e.type === "handoff" && e.at <= elapsedMs && e.at > elapsedMs - windowMs,
  );
}

export function proposalSlots(
  scenario: OrchestraScenario,
  elapsedMs: number,
): Record<ProposalSlot, OrchestraArtifact | null> {
  const slots: Record<ProposalSlot, OrchestraArtifact | null> = {
    headline: null,
    coverage: null,
    premium: null,
    talk: null,
  };
  for (const e of visibleEvents(scenario, elapsedMs)) {
    if (e.type === "artifact" && e.artifact) {
      const current = slots[e.artifact.slot];
      if (!current || e.artifact.revision >= current.revision) {
        slots[e.artifact.slot] = e.artifact;
      }
    }
  }
  return slots;
}

export function logEntries(
  scenario: OrchestraScenario,
  elapsedMs: number,
  charsPerSec: number = TYPEWRITER_CHARS_PER_SEC,
): LogEntry[] {
  return visibleEvents(scenario, elapsedMs)
    .filter((e) => (e.type === "message" || e.type === "verdict") && e.text)
    .map((e) => {
      const total = e.text!.length;
      const visibleChars = Math.max(
        0,
        Math.min(total, Math.floor(((elapsedMs - e.at) / 1_000) * charsPerSec)),
      );
      return { event: e, visibleChars, complete: visibleChars >= total };
    });
}

export function isComplete(scenario: OrchestraScenario, elapsedMs: number): boolean {
  return elapsedMs >= scenario.durationMs;
}
