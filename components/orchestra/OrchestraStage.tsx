"use client";

import { useEffect, useMemo, useState } from "react";
import healthData from "@/data/healthCustomers.json";
import scenariosData from "@/data/orchestraScenarios.json";
import {
  type OrchestraScenario,
  activeHandoffs,
  agentStatuses,
  isComplete,
  logEntries,
  proposalSlots,
} from "@/lib/orchestra";
import type { HealthCustomer } from "@/lib/types";
import { ActivityLog } from "./ActivityLog";
import { AgentGraph } from "./AgentGraph";
import { CustomerPicker } from "./CustomerPicker";
import { PlaybackControls } from "./PlaybackControls";
import { ProposalBoard } from "./ProposalBoard";
import { usePlaybackClock } from "./usePlaybackClock";

const CUSTOMERS = healthData as HealthCustomer[];
const SCENARIOS = scenariosData as OrchestraScenario[];

export function OrchestraStage() {
  const [customer, setCustomer] = useState<HealthCustomer | null>(null);
  const clock = usePlaybackClock();

  const scenario = useMemo(
    () => (customer ? (SCENARIOS.find((s) => s.customerId === customer.id) ?? null) : null),
    [customer],
  );

  const elapsed = clock.elapsedMs;
  const complete = scenario ? isComplete(scenario, elapsed) : false;
  const { playing, pause } = clock;

  useEffect(() => {
    if (complete && playing) pause();
  }, [complete, playing, pause]);

  const handleSelect = (c: HealthCustomer) => {
    setCustomer(c);
    clock.reset();
    clock.play();
  };

  const handleBackToPicker = () => {
    setCustomer(null);
    clock.reset();
  };

  if (!customer || !scenario) {
    return (
      <div className="space-y-6">
        <p className="text-sm leading-relaxed text-slate-400">
          顧客を選ぶと、AI エージェントチームが提案を作り上げる過程をライブでご覧いただけます。
        </p>
        <CustomerPicker customers={CUSTOMERS} onSelect={handleSelect} />
      </div>
    );
  }

  const statuses = agentStatuses(scenario, elapsed);
  const handoffs = activeHandoffs(scenario, elapsed);
  const entries = logEntries(scenario, elapsed);
  const slots = proposalSlots(scenario, elapsed);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs text-slate-500">対象顧客</p>
          <p className="text-base font-bold text-slate-100">
            {customer.name}（{customer.age}歳）
          </p>
        </div>
        <button
          type="button"
          onClick={handleBackToPicker}
          className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-300 transition hover:bg-slate-800"
        >
          別の顧客で再実行
        </button>
      </div>

      <AgentGraph statuses={statuses} handoffs={handoffs} />

      <PlaybackControls
        playing={clock.playing}
        complete={complete}
        speed={clock.speed}
        progress={elapsed / scenario.durationMs}
        onToggle={clock.playing ? clock.pause : clock.play}
        onReset={() => {
          clock.reset();
          clock.play();
        }}
        onSpeed={clock.setSpeed}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ActivityLog entries={entries} />
        </div>
        <ProposalBoard slots={slots} />
      </div>
    </div>
  );
}
