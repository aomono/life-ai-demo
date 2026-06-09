"use client";

import { useMemo, useState } from "react";
import businessData from "@/data/businessCompanies.json";
import { BusinessMetricChart } from "@/components/BusinessMetricChart";
import { CustomerSelector } from "@/components/CustomerSelector";
import { DataIntakeForm } from "@/components/DataIntakeForm";
import { DataPanel } from "@/components/DataPanel";
import { DemoLayout } from "@/components/DemoLayout";
import { Disclaimer } from "@/components/Disclaimer";
import { InsightPanel } from "@/components/InsightPanel";
import { RecommendationPanel } from "@/components/RecommendationPanel";
import { RiskScoreCard } from "@/components/RiskScoreCard";
import { analyzeBusiness } from "@/lib/mockAnalysis";
import {
  businessIntakeSchema,
  mapBusinessToIntake,
} from "@/lib/intakeSchema";
import type { BusinessCompany } from "@/lib/types";

const COMPANIES = businessData as BusinessCompany[];

export default function BusinessDemoPage() {
  const [selectedId, setSelectedId] = useState(COMPANIES[0].id);
  const [connected, setConnected] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const company = useMemo(
    () => COMPANIES.find((c) => c.id === selectedId) ?? COMPANIES[0],
    [selectedId],
  );

  const intakeValues = useMemo(
    () => (connected ? mapBusinessToIntake(company) : null),
    [connected, company],
  );

  const result = useMemo(
    () => (analyzed ? analyzeBusiness(company) : null),
    [analyzed, company],
  );

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
      title="会計 SaaS AI 福利厚生プランナー"
      subtitle="会計 SaaS と商工リサーチを連携。中小企業の財務・人事プロファイルを即座に取得し、福利厚生・団体保険・経営者保険の提案論点を AI が抽出します。"
      badge="Demo 03 / Business"
    >
      {!analyzed && !analyzing && (
        <DataIntakeForm
          schema={businessIntakeSchema}
          values={intakeValues}
          connectLabel="会計 SaaS データを連携 ▶"
          onConnect={() => setConnected(true)}
          onAnalyze={runAnalyze}
          isConnected={connected}
          isAnalyzing={false}
          selectorSlot={
            <CustomerSelector
              legend="法人プロファイルを選択"
              selectedId={selectedId}
              onSelect={(id) => {
                setSelectedId(id);
                resetFlow();
              }}
              options={COMPANIES.map((c) => ({
                id: c.id,
                label: c.companyName,
                sublabel: `${c.industry} / ${c.employees} 名`,
              }))}
            />
          }
        />
      )}

      {analyzing && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white p-16 shadow-sm">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />
          <p className="text-sm font-semibold text-slate-700">
            AI が {company.companyName} のデータを分析中…
          </p>
          <p className="text-xs text-slate-500">
            業種ベンチマークと突合し、提案論点を抽出しています
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
                title="会社プロファイル"
                subtitle="連携済データから抽出"
                rows={[
                  { label: "社名", value: company.companyName },
                  { label: "業種", value: company.industry },
                  { label: "売上", value: `${company.revenueOku} 億円` },
                  {
                    label: "営業利益",
                    value: `${company.operatingProfitOku} 億円`,
                  },
                  { label: "従業員", value: `${company.employees} 名` },
                  { label: "平均年齢", value: `${company.averageAge} 歳` },
                ]}
              />
              <DataPanel
                title="人件費・福利厚生"
                subtitle="会計 SaaS データ抽出"
                rows={[
                  {
                    label: "人件費",
                    value: `${company.laborCostOku} 億円`,
                  },
                  {
                    label: "離職率",
                    value: `${company.turnoverRate} %`,
                    emphasize: company.turnoverRate >= 15 ? "warn" : undefined,
                  },
                  {
                    label: "福利厚生費 /人",
                    value: `${company.welfareCostPerEmployee.toLocaleString()} 円`,
                    emphasize:
                      company.welfareCostPerEmployee < 50000 ? "warn" : undefined,
                  },
                  {
                    label: "退職金制度",
                    value: company.hasRetirementPlan ? "あり" : "なし",
                    emphasize: company.hasRetirementPlan ? undefined : "warn",
                  },
                  {
                    label: "団体保険",
                    value: company.hasGroupInsurance ? "あり" : "なし",
                    emphasize: company.hasGroupInsurance ? undefined : "warn",
                  },
                  {
                    label: "キーパーソン依存",
                    value:
                      company.keyPersonDependency === "high"
                        ? "高"
                        : company.keyPersonDependency === "medium"
                          ? "中"
                          : "低",
                    emphasize:
                      company.keyPersonDependency === "high" ? "warn" : undefined,
                  },
                ]}
                extra={
                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      メモ
                    </p>
                    <p className="text-xs leading-relaxed text-slate-600">
                      {company.notes}
                    </p>
                  </div>
                }
              />
            </div>

            <div className="lg:col-span-5 flex flex-col gap-5">
              <RiskScoreCard score={result.score} label={result.scoreLabel} />
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  経営指標サマリー
                </p>
                <BusinessMetricChart c={company} />
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
