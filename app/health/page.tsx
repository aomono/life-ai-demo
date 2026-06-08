"use client";

import { useMemo, useState } from "react";
import healthData from "@/data/healthCustomers.json";
import { CustomerSelector } from "@/components/CustomerSelector";
import { DataPanel } from "@/components/DataPanel";
import { DemoLayout } from "@/components/DemoLayout";
import { Disclaimer } from "@/components/Disclaimer";
import { HealthMetricChart } from "@/components/HealthMetricChart";
import { InsightPanel } from "@/components/InsightPanel";
import { RecommendationPanel } from "@/components/RecommendationPanel";
import { RiskScoreCard } from "@/components/RiskScoreCard";
import { analyzeHealth } from "@/lib/mockAnalysis";
import type { HealthCustomer } from "@/lib/types";

const CUSTOMERS = healthData as HealthCustomer[];

export default function HealthDemoPage() {
  const [selectedId, setSelectedId] = useState(CUSTOMERS[0].id);
  const [analyzed, setAnalyzed] = useState(false);

  const customer = useMemo(
    () => CUSTOMERS.find((c) => c.id === selectedId) ?? CUSTOMERS[0],
    [selectedId],
  );

  const result = useMemo(
    () => (analyzed ? analyzeHealth(customer) : null),
    [analyzed, customer],
  );

  const m = customer.healthMetrics;

  return (
    <DemoLayout
      title="健康データ AI 保険カウンセラー"
      subtitle="健診・生活習慣データから、健康リスクと保障見直しの論点を AI が同時に抽出。医療診断ではなく、面談の相談材料として活用するイメージです。"
      badge="Demo 01 / Health"
    >
      <div className="mb-5">
        <CustomerSelector
          legend="顧客プロファイルを選択"
          selectedId={selectedId}
          onSelect={(id) => {
            setSelectedId(id);
            setAnalyzed(false);
          }}
          options={CUSTOMERS.map((c) => ({
            id: c.id,
            label: `${c.name} (${c.age} 歳)`,
            sublabel: c.occupation,
          }))}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="lg:col-span-3 flex flex-col gap-5">
          <DataPanel
            title="顧客プロファイル"
            subtitle="基本情報・家族構成・既契約"
            rows={[
              { label: "氏名", value: customer.name },
              { label: "年齢 / 性別", value: `${customer.age} 歳 / ${customer.gender === "male" ? "男性" : "女性"}` },
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
            subtitle="直近健診 + ウェアラブル"
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
          {result ? (
            <>
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
            </>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-slate-300 bg-white p-12">
              <p className="text-sm text-slate-600">
                左の顧客データを元に AI が分析を行います。下のボタンを押してください。
              </p>
              <button
                type="button"
                onClick={() => setAnalyzed(true)}
                className="rounded-md bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-slate-800"
              >
                AI 分析を実行 →
              </button>
              <p className="max-w-md text-center text-xs text-slate-500">
                ※ デモでは事前に用意したモック結果を表示します。後続で LLM 接続版に差し替え予定。
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
