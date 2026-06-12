"use client";

import type { OrchestraArtifact, ProposalSlot } from "@/lib/orchestra";
import { PROPOSAL_SLOTS } from "@/lib/orchestra";

const SLOT_LABEL: Record<ProposalSlot, string> = {
  headline: "提案コンセプト",
  coverage: "保障内容",
  premium: "保険料",
  talk: "面談トーク",
};

type Props = { slots: Record<ProposalSlot, OrchestraArtifact | null> };

export function ProposalBoard({ slots }: Props) {
  return (
    <div className="flex h-full flex-col rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur">
      <div className="border-b border-slate-800 px-5 py-3">
        <h2 className="text-sm font-semibold text-slate-200">提案書（組み上げ中）</h2>
      </div>
      <div className="max-h-80 space-y-3 overflow-y-auto px-5 py-4">
        {PROPOSAL_SLOTS.map((slot) => {
          const artifact = slots[slot];
          return (
            <div
              key={slot}
              className={
                artifact
                  ? "orchestra-pop rounded-lg border border-slate-700 bg-slate-800/70 p-3"
                  : "rounded-lg border border-dashed border-slate-800 p-3"
              }
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  {SLOT_LABEL[slot]}
                </span>
                {artifact && artifact.revision >= 2 && (
                  <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                    v{artifact.revision} 修正済
                  </span>
                )}
              </div>
              {artifact ? (
                <div key={`${slot}-rev${artifact.revision}`} className="orchestra-pop">
                  <p className="mt-1 text-sm font-semibold text-slate-100">{artifact.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400">{artifact.body}</p>
                </div>
              ) : (
                <p className="mt-1 text-xs text-slate-600">生成待ち……</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
