"use client";

import { useMemo, useState } from "react";
import lifestyleData from "@/data/lifestyleCustomers.json";
import { CustomerSelector } from "@/components/CustomerSelector";
import { DataPanel } from "@/components/DataPanel";
import { DemoLayout } from "@/components/DemoLayout";
import { Disclaimer } from "@/components/Disclaimer";
import { InsightPanel } from "@/components/InsightPanel";
import { RecommendationPanel } from "@/components/RecommendationPanel";
import { RiskScoreCard } from "@/components/RiskScoreCard";
import { SpendingChart } from "@/components/SpendingChart";
import { analyzeLifestyle } from "@/lib/mockAnalysis";
import type { LifestyleCustomer } from "@/lib/types";

const CUSTOMERS = lifestyleData as LifestyleCustomer[];

const PATTERN_HINT_LABEL = {
  birth: "出産・育児イベント想定",
  care: "介護イベント想定",
  housing: "住宅取得イベント想定",
} as const;

export default function LifestyleDemoPage() {
  const [selectedId, setSelectedId] = useState(CUSTOMERS[0].id);
  const [analyzed, setAnalyzed] = useState(false);

  const customer = useMemo(
    () => CUSTOMERS.find((c) => c.id === selectedId) ?? CUSTOMERS[0],
    [selectedId],
  );

  const result = useMemo(
    () => (analyzed ? analyzeLifestyle(customer) : null),
    [analyzed, customer],
  );

  const last = customer.monthlySpending[customer.monthlySpending.length - 1];

  return (
    <DemoLayout
      title="購買・決済 AI ライフイベント検知"
      subtitle="買い物・決済履歴から、出産・介護・住宅購入などの生活変化を AI が検知。保険会社が持っていない生活データを論点化し、提案タイミングをデータドリブンに前出しします。"
      badge="Demo 02 / Lifestyle"
    >
      <div className="mb-5">
        <CustomerSelector
          legend="顧客 (家計プロファイル) を選択"
          selectedId={selectedId}
          onSelect={(id) => {
            setSelectedId(id);
            setAnalyzed(false);
          }}
          options={CUSTOMERS.map((c) => ({
            id: c.id,
            label: `${c.name} (${c.age} 歳)`,
            sublabel: PATTERN_HINT_LABEL[c.patternHint],
          }))}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="lg:col-span-3 flex flex-col gap-5">
          <DataPanel
            title="家計プロファイル"
            subtitle="基本属性 + 直近 3 か月支出"
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
          {result ? (
            <>
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
            </>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-slate-300 bg-white p-12">
              <p className="text-sm text-slate-600">
                左の購買・決済データを元に AI が分析を行います。下のボタンを押してください。
              </p>
              <button
                type="button"
                onClick={() => setAnalyzed(true)}
                className="rounded-md bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-slate-800"
              >
                AI 分析を実行 →
              </button>
              <p className="max-w-md text-center text-xs text-slate-500">
                ※ デモでは事前に用意したモック結果を表示します。
              </p>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 flex flex-col gap-5">
          {result ? (
            <RecommendationPanel recommendations={result.recommendations} />
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-500">
              AI 分析実行後、ここに提案アクションと面談トーク例が表示されます。
            </div>
          )}
        </div>
      </div>
    </DemoLayout>
  );
}
