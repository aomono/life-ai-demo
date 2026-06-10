"use client";

import { useMemo, useState } from "react";
import wearableData from "@/data/wearableCustomers.json";
import { AlertBanner } from "@/components/AlertBanner";
import { AppleHealthPreview } from "@/components/AppleHealthPreview";
import { CallScriptCard } from "@/components/CallScriptCard";
import { CustomerSelector } from "@/components/CustomerSelector";
import { DataIntakeForm } from "@/components/DataIntakeForm";
import { DataPanel } from "@/components/DataPanel";
import { DemoLayout } from "@/components/DemoLayout";
import { Disclaimer } from "@/components/Disclaimer";
import { InsightPanel } from "@/components/InsightPanel";
import { RecommendationPanel } from "@/components/RecommendationPanel";
import { RiskScoreCard } from "@/components/RiskScoreCard";
import { VitalsTimelineChart } from "@/components/VitalsTimelineChart";
import { analyzeWearable } from "@/lib/wearableAnalysis";
import {
  mapWearableToIntake,
  wearableIntakeSchema,
} from "@/lib/intakeSchema";
import type { WearableCustomer } from "@/lib/types";

const CUSTOMERS = wearableData as WearableCustomer[];

export default function WearableDemoPage() {
  const [selectedId, setSelectedId] = useState<WearableCustomer["id"]>(
    CUSTOMERS[0].id,
  );
  const [connected, setConnected] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const customer = useMemo(
    () => CUSTOMERS.find((c) => c.id === selectedId) ?? CUSTOMERS[0],
    [selectedId],
  );

  const intakeValues = useMemo(
    () => (connected ? mapWearableToIntake(customer) : null),
    [connected, customer],
  );

  const result = useMemo(
    () => (analyzed ? analyzeWearable(customer) : null),
    [analyzed, customer],
  );

  const reset = () => {
    setConnected(false);
    setAnalyzed(false);
    setAnalyzing(false);
  };

  const runAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzed(true);
      setAnalyzing(false);
    }, 750);
  };

  return (
    <DemoLayout
      title="Apple Health × リアルタイム異常検知"
      subtitle="Apple Watch の継続バイタルから AI が異変兆候を検知し、保険会社ヘルスサポート担当者の画面に早期介入アラートと推奨アクションを出します。"
      badge="Demo 05 / Wearable"
    >
      {!analyzed && !analyzing && (
        <DataIntakeForm
          schema={wearableIntakeSchema}
          values={intakeValues}
          connectLabel="Apple Health データを連携 ▶"
          onConnect={() => setConnected(true)}
          onAnalyze={runAnalyze}
          isConnected={connected}
          isAnalyzing={false}
          previewSlot={<AppleHealthPreview customer={customer} />}
          selectorSlot={
            <CustomerSelector
              legend="顧客プロファイルを選択"
              selectedId={selectedId}
              onSelect={(id) => {
                setSelectedId(id as WearableCustomer["id"]);
                reset();
              }}
              options={CUSTOMERS.map((c) => ({
                id: c.id,
                label: `${c.name} (${c.age} 歳)`,
                sublabel: c.detectionLabel,
              }))}
            />
          }
        />
      )}

      {analyzing && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white p-16 shadow-sm">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />
          <p className="text-sm font-semibold text-slate-700">
            AI が {customer.name} さんの 30 日バイタルを分析中…
          </p>
          <p className="text-xs text-slate-500">
            異変兆候の検出と推奨アクションを生成しています
          </p>
        </div>
      )}

      {result && (
        <>
          <div className="mb-4 flex items-center justify-between">
            <button
              type="button"
              onClick={reset}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              ← STEP 1 (入力画面) に戻る
            </button>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
              STEP 2 / AI 検知完了
            </span>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
            <div className="lg:col-span-3 flex flex-col gap-5">
              <DataPanel
                title="顧客プロファイル"
                subtitle="Apple Health 連携から抽出"
                rows={[
                  { label: "氏名", value: customer.name },
                  {
                    label: "年齢 / 性別",
                    value: `${customer.age} 歳 / ${customer.gender === "male" ? "男性" : "女性"}`,
                  },
                  { label: "家族構成", value: customer.family },
                  { label: "職業", value: customer.occupation },
                ]}
                extra={
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      既契約
                    </p>
                    <ul className="space-y-2">
                      {customer.existingPolicies.map((p, i) => (
                        <li
                          key={i}
                          className="rounded border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs"
                        >
                          <p className="font-semibold text-slate-800">{p.type}</p>
                          <p className="text-slate-500">{p.coverageSummary}</p>
                          <p className="text-slate-500">
                            月額 {p.monthlyPremium.toLocaleString()} 円
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                }
              />
              <DataPanel
                title="直近 30 日 Apple Watch サマリー"
                subtitle="連続バイタル"
                rows={[
                  {
                    label: "平均安静時心拍",
                    value: `${customer.vitalsSummary.avgRestingHr} bpm`,
                    emphasize:
                      customer.vitalsSummary.avgRestingHr >= 75
                        ? "warn"
                        : undefined,
                  },
                  {
                    label: "平均 HRV",
                    value: `${customer.vitalsSummary.avgHrv} ms`,
                    emphasize:
                      customer.vitalsSummary.avgHrv < 30 ? "warn" : undefined,
                  },
                  {
                    label: "平均睡眠時間",
                    value: `${customer.vitalsSummary.avgSleepHours.toFixed(1)} h`,
                    emphasize:
                      customer.vitalsSummary.avgSleepHours < 6.0
                        ? "warn"
                        : undefined,
                  },
                  {
                    label: "平均歩数",
                    value: `${customer.vitalsSummary.avgSteps.toLocaleString()} 歩`,
                    emphasize:
                      customer.vitalsSummary.avgSteps < 6000
                        ? "warn"
                        : undefined,
                  },
                  ...(customer.vitalsSummary.vo2maxLatest
                    ? [
                        {
                          label: "VO₂max (最新)",
                          value: `${customer.vitalsSummary.vo2maxLatest}`,
                        },
                      ]
                    : []),
                ]}
              />
            </div>

            <div className="lg:col-span-5 flex flex-col gap-5">
              <AlertBanner
                severity={customer.alertSeverity}
                label={customer.detectionLabel}
              />
              <RiskScoreCard score={result.score} label={result.scoreLabel} />
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  30 日バイタル推移
                </p>
                <VitalsTimelineChart data={customer.vitals30d} />
              </div>
              <InsightPanel
                summary={result.overallSummary}
                insights={result.insights}
                nextQuestions={result.nextQuestions}
              />
              <Disclaimer text={result.disclaimer} />
            </div>

            <div className="lg:col-span-4 flex flex-col gap-5">
              <RecommendationPanel recommendations={result.recommendations} />
              <CallScriptCard script={customer.callScript} />
            </div>
          </div>
        </>
      )}
    </DemoLayout>
  );
}
