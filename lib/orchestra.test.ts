import { describe, expect, it } from "vitest";
import {
  type OrchestraScenario,
  visibleEvents,
  agentStatuses,
  activeHandoffs,
  proposalSlots,
  logEntries,
  isComplete,
  DEFAULT_HANDOFF_WINDOW_MS,
} from "./orchestra";

const MINI: OrchestraScenario = {
  customerId: "h001",
  durationMs: 10_000,
  events: [
    { id: "e1", at: 0, agent: "manager", type: "status", status: "thinking" },
    { id: "e2", at: 500, agent: "manager", type: "message", text: "受付しました" },
    { id: "e3", at: 1_000, agent: "manager", type: "handoff", to: "health" },
    { id: "e4", at: 1_200, agent: "health", type: "status", status: "working" },
    {
      id: "e5",
      at: 2_000,
      agent: "product",
      type: "artifact",
      artifact: { slot: "headline", title: "v1", body: "最初の案", revision: 1 },
    },
    {
      id: "e6",
      at: 3_000,
      agent: "compliance",
      type: "verdict",
      verdict: "rejected",
      text: "差し戻し",
    },
    {
      id: "e7",
      at: 4_000,
      agent: "product",
      type: "artifact",
      artifact: { slot: "headline", title: "v2", body: "修正案", revision: 2 },
    },
    {
      id: "e8",
      at: 5_000,
      agent: "compliance",
      type: "verdict",
      verdict: "approved",
      text: "承認",
    },
    { id: "e9", at: 6_000, agent: "health", type: "status", status: "done" },
  ],
};

describe("visibleEvents", () => {
  it("at <= elapsed のイベントだけ返す（境界 at === elapsed を含む）", () => {
    expect(visibleEvents(MINI, 1_000).map((e) => e.id)).toEqual(["e1", "e2", "e3"]);
  });
  it("elapsed 0 でも at=0 は見える", () => {
    expect(visibleEvents(MINI, 0).map((e) => e.id)).toEqual(["e1"]);
  });
});

describe("agentStatuses", () => {
  it("初期値は全員 idle", () => {
    expect(agentStatuses(MINI, -1)).toEqual({
      manager: "idle",
      health: "idle",
      product: "idle",
      compliance: "idle",
    });
  });
  it("最新の status イベントが勝つ", () => {
    const s = agentStatuses(MINI, 6_000);
    expect(s.health).toBe("done");
    expect(s.manager).toBe("thinking");
  });
});

describe("activeHandoffs", () => {
  it("ウィンドウ内の handoff だけ返す", () => {
    expect(activeHandoffs(MINI, 1_000).map((e) => e.id)).toEqual(["e3"]);
    expect(
      activeHandoffs(MINI, 1_000 + DEFAULT_HANDOFF_WINDOW_MS).map((e) => e.id),
    ).toEqual([]);
  });
});

describe("proposalSlots", () => {
  it("revision が高い artifact で上書きされる", () => {
    expect(proposalSlots(MINI, 2_500).headline?.title).toBe("v1");
    expect(proposalSlots(MINI, 4_500).headline?.title).toBe("v2");
    expect(proposalSlots(MINI, 4_500).coverage).toBeNull();
  });
});

describe("logEntries", () => {
  it("message と verdict のみログに出る", () => {
    const entries = logEntries(MINI, 10_000);
    expect(entries.map((l) => l.event.id)).toEqual(["e2", "e6", "e8"]);
  });
  it("タイプライター: 開始直後は 0 文字、時間経過で全文字", () => {
    const atStart = logEntries(MINI, 500)[0];
    expect(atStart.visibleChars).toBe(0);
    expect(atStart.complete).toBe(false);
    const later = logEntries(MINI, 10_000)[0];
    expect(later.visibleChars).toBe("受付しました".length);
    expect(later.complete).toBe(true);
  });
  it("charsPerSec=30 で 1 秒後は 30 文字（文字数上限あり）", () => {
    const e = logEntries(MINI, 1_500)[0];
    expect(e.visibleChars).toBe(Math.min("受付しました".length, 30));
  });
});

describe("isComplete", () => {
  it("durationMs 以上で完了（境界含む）", () => {
    expect(isComplete(MINI, 9_999)).toBe(false);
    expect(isComplete(MINI, 10_000)).toBe(true);
  });
});
