"use client";

import { useMemo, useState } from "react";
import lifestyleData from "@/data/lifestyleCustomers.json";
import { CustomerSelector } from "@/components/CustomerSelector";
import { DataIntakeForm } from "@/components/DataIntakeForm";
import { DataPanel } from "@/components/DataPanel";
import { DemoLayout } from "@/components/DemoLayout";
import { Disclaimer } from "@/components/Disclaimer";
import { InsightPanel } from "@/components/InsightPanel";
import { RecommendationPanel } from "@/components/RecommendationPanel";
import { RiskScoreCard } from "@/components/RiskScoreCard";
import { SpendingChart } from "@/components/SpendingChart";
import { analyzeLifestyle } from "@/lib/mockAnalysis";
import {
  lifestyleIntakeSchema,
  mapLifestyleToIntake,
} from "@/lib/intakeSchema";
import type { LifestyleCustomer } from "@/lib/types";

const CUSTOMERS = lifestyleData as LifestyleCustomer[];

const PATTERN_HINT_LABEL = {
  birth: "出産・育児イベント想定",
  care: "介護イベント想定",
  housing: "住宅取得イベント想定",
} as const;

export default function LifestyleDemoPage() {
  const [selectedId, setSelectedId] = useState(CUSTOMERS[0].id);
  const [connected, setConnected] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const customer = useMemo(
    () => CUSTOMERS.find((c) => c.id === selectedId) ?? CUSTOMERS[0],
    [selectedId],
  );

  const intakeValues = useMemo(
    () => (connected ? mapLifestyleToIntake(customer) : null),
    [connected, customer],
  );

  const result = useMemo(
    () => (analyzed ? analyzeLifestyle(customer) : null),
    [analyzed, customer],
  );

  const last = customer.monthlySpending[customer.monthlySpending.length - 1];

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
      title="購買・決済 AI ライフイベント検知"
      subtitle="金融機関・決済 SaaS との情報連携で、口座・カードの取引履歴から出産・介護・住宅購入などの生活イベントを AI が検知。提案タイミングを前出しします。"
      badge="Demo 02 / Lifestyle"
    >
      {!analyzed && !analyzing && (
        <DataIntakeForm
          schema={lifestyleIntakeSchema}
          values={intakeValues}
          connectLabel="金融機関データを連携 ▶"
          onConnect={() => setConnected(true)}
          onAnalyze={runAnalyze}
          isConnected={connected}
          isAnalyzing={false}
          selectorSlot={
            <CustomerSelector
              legend="顧客 (家計プロファイル) を選択"
              selectedId={selectedId}
              onSelect={(id) => {
                setSelectedId(id);
                resetFlow();
              }}
              options={CUSTOMERS.map((c) => ({
                id: c.id,
                label: `${c.name} (${c.age} 歳)`,
                sublabel: PATTERN_HINT_LABEL[c.patternHint],
              }))}
            />
          }
        />
      )}

      {analyzing && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white p-16 shadow-sm">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />
          <p className="text-sm font-semibold text-slate-700">
            AI が {customer.name} さんの家計データを分析中…
          </p>
          <p className="text-xs text-slate-500">
            時系列の支出変化を読み解き、ライフイベント仮説を生成しています
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
                title="家計プロファイル"
                subtitle="連携済データから抽出"
                rows={[
                  { label: "氏名", value: customer.name },
                  { label: "年齢", value: `${customer.age} 歳` },
                  { label: "家族構成", value: customer.family },
                ]}
              />
              <DataPanel
                title={`直近月支出 (${last.month})`}
                subtitle="購買・決済データ集計"
                rows={[
                  { label: "食費", value: `${last.food.toLocaleString()} 円` },
                  {
                    label: "医療・薬局",
                    value: `${last.medicalPharmacy.toLocaleString()} 円`,
                  },
                  {
                    label: "ベビー用品",
                    value: `${last.baby.toLocaleString()} 円`,
                    emphasize: last.baby >= 10000 ? "warn" : undefined,
                  },
                  {
                    label: "介護用品",
                    value: `${last.care.toLocaleString()} 円`,
                    emphasize: last.care >= 10000 ? "warn" : undefined,
                  },
                  {
                    label: "住宅関連",
                    value: `${last.housing.toLocaleString()} 円`,
                    emphasize: last.housing >= 130000 ? "warn" : undefined,
                  },
                  {
                    label: "教育費",
                    value: `${last.education.toLocaleString()} 円`,
                  },
                  {
                    label: "投資積立",
                    value: `${last.investment.toLocaleString()} 円`,
                  },
                  {
                    label: "保険料",
                    value: `${last.insurance.toLocaleString()} 円`,
                  },
                ]}
              />
            </div>

            <div className="lg:col-span-5 flex flex-col gap-5">
              <RiskScoreCard score={result.score} label={result.scoreLabel} />
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  3 か月支出推移
                </p>
                <SpendingChart data={customer.monthlySpending} />
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
