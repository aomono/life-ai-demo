"use client";

import type { SegmentProposal } from "@/lib/types";
import { BudgetBar } from "./BudgetBar";

const PRIORITY_STYLE: Record<string, string> = {
  main: "bg-slate-900 text-white",
  recommended: "bg-blue-100 text-blue-800",
  optional: "bg-slate-100 text-slate-600",
};

const PRIORITY_LABEL: Record<string, string> = {
  main: "主力",
  recommended: "推奨",
  optional: "オプション",
};

type Props = { proposal: SegmentProposal };

export function SegmentProposalCard({ proposal }: Props) {
  return (
    <div className="flex flex-col gap-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <Section title="1. 推奨商品ミックス">
        <ul className="space-y-2">
          {proposal.productMix.map((p, i) => (
            <li
              key={i}
              className="flex items-center justify-between rounded border border-slate-100 bg-slate-50/60 px-3 py-2"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${PRIORITY_STYLE[p.priority]}`}
                >
                  {PRIORITY_LABEL[p.priority]}
                </span>
                <span className="text-sm font-semibold text-slate-900">
                  {p.name}
                </span>
              </div>
              <span className="text-xs text-slate-600">
                想定加入率{" "}
                <span className="font-semibold text-slate-900">
                  {p.adoptionRate}%
                </span>
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="2. アプローチストーリー (訴求軸 3 行)">
        <ol className="list-decimal space-y-1 pl-4">
          {proposal.approachStory.map((s, i) => (
            <li key={i} className="text-sm leading-relaxed text-slate-800">
              {s}
            </li>
          ))}
        </ol>
      </Section>

      <Section title="3. 想定 CV 率 + 1 人あたり LTV">
        <div className="flex flex-wrap gap-x-8 gap-y-3">
          <Metric
            label="想定 CV 率"
            value={`${proposal.expectedCvRate.toFixed(1)}%`}
            sub={`業界平均 ${proposal.industryAverageCvRate.toFixed(1)}% 比 +${(proposal.expectedCvRate - proposal.industryAverageCvRate).toFixed(1)}pt`}
            emphasize
          />
          <Metric
            label="1 人あたり LTV"
            value={`${(proposal.ltvPerCustomer / 10_000).toFixed(1)} 万円`}
          />
          <Metric
            label="想定総予算"
            value={`${(proposal.totalBudgetYen / 100_000_000).toFixed(1)} 億円`}
          />
        </div>
      </Section>

      <Section title="4. チャネル別予算配分">
        <BudgetBar allocation={proposal.channelAllocation} />
        <ul className="mt-2 grid grid-cols-1 gap-1 text-[11px] text-slate-600 sm:grid-cols-3">
          {proposal.channelAllocation.map((a, i) => (
            <li key={i}>
              {a.channel === "dm" ? "DM" : a.channel === "line" ? "LINE" : "対面"}:
              予算 {(a.budgetYen / 1_000_000).toFixed(0)}M / 接触{" "}
              {a.estimatedReach.toLocaleString()} 人
            </li>
          ))}
        </ul>
      </Section>

      <Section title="5. 競合との差別化メッセージ">
        <ul className="space-y-1">
          {proposal.competitiveDifferentiation.map((s, i) => (
            <li
              key={i}
              className="rounded border-l-2 border-blue-400 bg-blue-50/40 px-3 py-1.5 text-sm leading-relaxed text-slate-800"
            >
              {s}
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
        {title}
      </h3>
      {children}
    </section>
  );
}

function Metric({
  label,
  value,
  sub,
  emphasize,
}: {
  label: string;
  value: string;
  sub?: string;
  emphasize?: boolean;
}) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wider text-slate-500">{label}</p>
      <p
        className={`tabular-nums ${emphasize ? "text-2xl font-bold text-slate-900" : "text-lg font-semibold text-slate-900"}`}
      >
        {value}
      </p>
      {sub && <p className="text-[11px] text-emerald-700">{sub}</p>}
    </div>
  );
}
