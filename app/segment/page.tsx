"use client";

import { useMemo, useState } from "react";
import segmentPresetsRaw from "@/data/segmentPresets.json";
import segmentProposalsRaw from "@/data/segmentProposals.json";
import { DemoLayout } from "@/components/DemoLayout";
import { Disclaimer } from "@/components/Disclaimer";
import { PartnerConnectGrid, SEGMENT_PARTNERS } from "@/components/PartnerConnectGrid";
import { MarketDbSummary } from "@/components/MarketDbSummary";
import { SegmentPresetPicker } from "@/components/SegmentPresetPicker";
import { SegmentChipFilter } from "@/components/SegmentChipFilter";
import { SegmentResultPanel } from "@/components/SegmentResultPanel";
import { SegmentProposalCard } from "@/components/SegmentProposalCard";
import { computeHeadcount } from "@/lib/segmentMath";
import type {
  SegmentChipState,
  SegmentPreset,
  SegmentPresetId,
  SegmentProposal,
} from "@/lib/types";

const PRESETS = segmentPresetsRaw as SegmentPreset[];
const PROPOSALS = segmentProposalsRaw as SegmentProposal[];

export default function SegmentDemoPage() {
  const [connectedIds, setConnectedIds] = useState<string[]>([]);
  const [presetId, setPresetId] = useState<SegmentPresetId | null>(null);
  const [chips, setChips] = useState<SegmentChipState | null>(null);
  const [analyzed, setAnalyzed] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const allConnected = connectedIds.length === SEGMENT_PARTNERS.length;

  const onConnect = (id: string) => {
    setConnectedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const onSelectPreset = (id: SegmentPresetId) => {
    setPresetId(id);
    const p = PRESETS.find((x) => x.id === id);
    if (p) setChips(p.baseChips);
    setAnalyzed(false);
  };

  const preset = useMemo(
    () => PRESETS.find((p) => p.id === presetId) ?? null,
    [presetId],
  );

  const headcount = useMemo(
    () => (chips ? computeHeadcount(chips) : 0),
    [chips],
  );

  const proposal = useMemo(
    () => (presetId ? PROPOSALS.find((p) => p.presetId === presetId) ?? null : null),
    [presetId],
  );

  const runAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzed(true);
      setAnalyzing(false);
    }, 750);
  };

  const reset = () => {
    setAnalyzed(false);
    setAnalyzing(false);
  };

  return (
    <DemoLayout
      title="マクロ・セグメント営業企画"
      subtitle="異業種統合マーケ DB から、AI がプリセットセグメントと推奨アプローチをコンサル風 5 セクションで起こします。マーケ・営業企画部の意思決定を 30 秒で支援。"
      badge="Demo 04 / Segment"
    >
      {!analyzed && !analyzing && (
        <div className="flex flex-col gap-5">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              STEP 1 / 異業種データ連携
            </p>
            <h2 className="mt-1 text-lg font-bold text-slate-900">
              4 パートナーからマーケ DB を構築
            </h2>
            <p className="mt-1 mb-3 text-xs text-slate-500">
              すべて連携すると、統合済みマーケ DB が立ち上がります。
            </p>
            <PartnerConnectGrid
              connectedIds={connectedIds}
              onConnect={onConnect}
            />
            {allConnected && (
              <div className="mt-4">
                <MarketDbSummary />
              </div>
            )}
          </div>

          <div
            className={`rounded-xl border bg-white p-5 shadow-sm transition ${
              allConnected ? "border-slate-200" : "border-slate-100 opacity-60"
            }`}
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              STEP 2 / セグメント設計
            </p>
            <h2 className="mt-1 text-lg font-bold text-slate-900">
              プリセット選択 + チップで微調整
            </h2>
            <p className="mt-1 mb-3 text-xs text-slate-500">
              {allConnected
                ? "プリセットから 1 つ選び、必要に応じてチップで条件を絞ってください。"
                : "STEP 1 のパートナー連携を完了してください。"}
            </p>
            <fieldset disabled={!allConnected} className="flex flex-col gap-4">
              <SegmentPresetPicker
                presets={PRESETS}
                selectedId={presetId}
                onSelect={onSelectPreset}
              />
              {chips && preset && (
                <>
                  <SegmentResultPanel
                    headcount={headcount}
                    baseHeadcount={preset.baseHeadcount}
                  />
                  <SegmentChipFilter value={chips} onChange={setChips} />
                </>
              )}
            </fieldset>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs text-slate-500">
              STEP 3: AI がセグメント向け提案を生成します。
            </p>
            <button
              type="button"
              onClick={runAnalyze}
              disabled={!presetId}
              className={`rounded-md px-5 py-2 text-sm font-semibold shadow ${
                presetId
                  ? "bg-slate-900 text-white hover:bg-slate-800"
                  : "cursor-not-allowed bg-slate-200 text-slate-400"
              }`}
            >
              AI 提案を生成 →
            </button>
          </div>
        </div>
      )}

      {analyzing && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white p-16 shadow-sm">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />
          <p className="text-sm font-semibold text-slate-700">
            AI がセグメントに最適なマーケミックスを設計中…
          </p>
          <p className="text-xs text-slate-500">
            商品 / 訴求 / チャネル / 予算配分を一括試算
          </p>
        </div>
      )}

      {analyzed && proposal && preset && (
        <>
          <div className="mb-4 flex items-center justify-between">
            <button
              type="button"
              onClick={reset}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              ← STEP 1-2 (条件画面) に戻る
            </button>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
              STEP 3 / AI 提案生成完了
            </span>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
            <div className="lg:col-span-4 flex flex-col gap-4">
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  選択中セグメント
                </p>
                <p className="mt-1 text-base font-bold text-slate-900">
                  {preset.label}
                </p>
                <p className="text-xs text-slate-600">{preset.description}</p>
              </div>
              <SegmentResultPanel
                headcount={headcount}
                baseHeadcount={preset.baseHeadcount}
              />
              <Disclaimer text="表示される見込み客数・CV 率・LTV・予算配分は研究用シミュレーション値です。保険募集行為ではありません。" />
            </div>
            <div className="lg:col-span-8">
              <SegmentProposalCard proposal={proposal} />
            </div>
          </div>
        </>
      )}
    </DemoLayout>
  );
}
