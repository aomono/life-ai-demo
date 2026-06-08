"use client";

import { useMemo, useState } from "react";
import businessData from "@/data/businessCompanies.json";
import { BusinessMetricChart } from "@/components/BusinessMetricChart";
import { CustomerSelector } from "@/components/CustomerSelector";
import { DataPanel } from "@/components/DataPanel";
import { DemoLayout } from "@/components/DemoLayout";
import { Disclaimer } from "@/components/Disclaimer";
import { InsightPanel } from "@/components/InsightPanel";
import { RecommendationPanel } from "@/components/RecommendationPanel";
import { RiskScoreCard } from "@/components/RiskScoreCard";
import { analyzeBusiness } from "@/lib/mockAnalysis";
import type { BusinessCompany } from "@/lib/types";

const COMPANIES = businessData as BusinessCompany[];

export default function BusinessDemoPage() {
  const [selectedId, setSelectedId] = useState(COMPANIES[0].id);
  const [analyzed, setAnalyzed] = useState(false);

  const company = useMemo(
    () => COMPANIES.find((c) => c.id === selectedId) ?? COMPANIES[0],
    [selectedId],
  );

  const result = useMemo(
    () => (analyzed ? analyzeBusiness(company) : null),
    [analyzed, company],
  );

  return (
    <DemoLayout
      title="会計 SaaS AI 福利厚生プランナー"
      subtitle="中小企業の会計・給与・従業員構成から、福利厚生・団体保険・経営者保険の提案余地を AI が出力。法人チャネル × SaaS 連携のイメージを体感していただきます。"
      badge="Demo 03 / Business"
    >
      <div className="mb-5">
        <CustomerSelector
          legend="法人プロファイルを選択"
          selectedId={selectedId}
          onSelect={(id) => {
            setSelectedId(id);
            setAnalyzed(false);
          }}
          options={COMPANIES.map((c) => ({
            id: c.id,
            label: c.companyName,
            sublabel: `${c.industry} / ${c.employees} 名`,
          }))}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="lg:col-span-3 flex flex-col gap-5">
          <DataPanel
            title="会社プロファイル"
            subtitle="基本属性"
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
          {result ? (
            <>
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
            </>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-slate-300 bg-white p-12">
              <p className="text-sm text-slate-600">
                左の経営データを元に AI が分析を行います。下のボタンを押してください。
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
