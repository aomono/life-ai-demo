"use client";

import { useMemo, useState } from "react";
import healthData from "@/data/healthCustomers.json";
import { CustomerSelector } from "@/components/CustomerSelector";
import { DataIntakeForm } from "@/components/DataIntakeForm";
import { DataPanel } from "@/components/DataPanel";
import { DemoLayout } from "@/components/DemoLayout";
import { Disclaimer } from "@/components/Disclaimer";
import { HealthMetricChart } from "@/components/HealthMetricChart";
import { InsightPanel } from "@/components/InsightPanel";
import { RecommendationPanel } from "@/components/RecommendationPanel";
import { RiskScoreCard } from "@/components/RiskScoreCard";
import { analyzeHealth } from "@/lib/mockAnalysis";
import {
  healthIntakeSchema,
  mapHealthToIntake,
} from "@/lib/intakeSchema";
import type { HealthCustomer } from "@/lib/types";

const CUSTOMERS = healthData as HealthCustomer[];

export default function HealthDemoPage() {
  const [selectedId, setSelectedId] = useState(CUSTOMERS[0].id);
  const [connected, setConnected] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const customer = useMemo(
    () => CUSTOMERS.find((c) => c.id === selectedId) ?? CUSTOMERS[0],
    [selectedId],
  );

  const intakeValues = useMemo(
    () => (connected ? mapHealthToIntake(customer) : null),
    [connected, customer],
  );

  const result = useMemo(
    () => (analyzed ? analyzeHealth(customer) : null),
    [analyzed, customer],
  );

  const m = customer.healthMetrics;

  const resetFlow = () => {
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
      title="健康データ AI 保険カウンセラー"
      subtitle="健保 (健康保険組合) との情報連携で、本来はヒアリングが必要な健診・生活習慣データを一括取得。提案生成までの所要時間を AI で大幅短縮します。"
      badge="Demo 01 / Health"
    >
      {!analyzed && !analyzing && (
        <DataIntakeForm
          schema={healthIntakeSchema}
          values={intakeValues}
          connectLabel="健保データを連携 ▶"
          onConnect={() => setConnected(true)}
          onAnalyze={runAnalyze}
          isConnected={connected}
          isAnalyzing={false}
          selectorSlot={
            <CustomerSelector
              legend="顧客プロファイルを選択"
              selectedId={selectedId}
              onSelect={(id) => {
                setSelectedId(id);
                resetFlow();
              }}
              options={CUSTOMERS.map((c) => ({
                id: c.id,
                label: `${c.name} (${c.age} 歳)`,
                sublabel: c.occupation,
              }))}
            />
          }
        />
      )}

      {analyzing && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white p-16 shadow-sm">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />
          <p className="text-sm font-semibold text-slate-700">
            AI が {customer.name} さんのデータを分析中…
          </p>
          <p className="text-xs text-slate-500">
            外部連携データを統合し、リスク・提案論点を抽出しています
          </p>
        </div>
      )}

      {result && (
        <>
          <div className="mb-4 flex items-center justify-between">
            <button
              type="button"
              onClick={resetFlow}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              ← STEP 1 (入力画面) に戻る
            </button>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
              STEP 2 / AI 提案生成完了
            </span>
          </div>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
            <div className="lg:col-span-3 flex flex-col gap-5">
              <DataPanel
                title="顧客プロファイル"
                subtitle="連携済データから抽出"
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
                title="健診・生活習慣データ"
                subtitle="健保 + ウェアラブル連携"
                rows={[
                  {
                    label: "BMI",
                    value: m.bmi,
                    emphasize: m.bmi >= 27 ? "warn" : undefined,
                  },
                  {
                    label: "血圧",
                    value: `${m.bloodPressure.systolic} / ${m.bloodPressure.diastolic}`,
                    emphasize:
                      m.bloodPressure.systolic >= 140 ||
                      m.bloodPressure.diastolic >= 90
                        ? "warn"
                        : undefined,
                  },
                  {
                    label: "HbA1c",
                    value: `${m.hba1c} %`,
                    emphasize: m.hba1c >= 6.0 ? "warn" : undefined,
                  },
                  {
                    label: "LDL",
                    value: `${m.ldl} mg/dL`,
                    emphasize: m.ldl >= 140 ? "warn" : undefined,
                  },
                  {
                    label: "喫煙",
                    value:
                      m.smoking === "current"
                        ? "現役喫煙"
                        : m.smoking === "past"
                          ? "過去喫煙"
                          : "非喫煙",
                    emphasize: m.smoking === "current" ? "warn" : undefined,
                  },
                  { label: "飲酒 (/週)", value: `${m.alcoholPerWeek} 回` },
                  {
                    label: "平均歩数",
                    value: `${m.averageSteps.toLocaleString()} 歩`,
                    emphasize: m.averageSteps < 6000 ? "warn" : undefined,
                  },
                  {
                    label: "平均睡眠",
                    value: `${m.averageSleepHours} h`,
                    emphasize: m.averageSleepHours < 6.0 ? "warn" : undefined,
                  },
                ]}
              />
            </div>

            <div className="lg:col-span-5 flex flex-col gap-5">
              <RiskScoreCard score={result.score} label={result.scoreLabel} />
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  健康指標サマリー
                </p>
                <HealthMetricChart m={m} />
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
            </div>
          </div>
        </>
      )}
    </DemoLayout>
  );
}
