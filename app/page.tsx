import { DemoCard } from "@/components/DemoCard";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="inline-block size-8 rounded-md bg-slate-900" />
            <span className="text-sm font-semibold tracking-wide text-slate-900">
              Life AI Demo Studio
            </span>
          </div>
          <span className="hidden text-xs text-slate-500 md:inline">
            異業種データ連携 × 保険販売オートメーション 研究デモ (2026-06-12)
          </span>
        </div>
      </header>

      <section className="border-b border-slate-200 bg-gradient-to-b from-white to-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-700">
            Research Prototype / Cross-industry Data × Insurance
          </p>
          <h1 className="mt-3 max-w-4xl text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
            異業種データ連携で、
            <br />
            保険販売を自動化・高度化する研究デモ。
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-700">
            通常は顧客ヒアリングが必要な数十項目を、外部パートナー (健保 / 金融機関 / 会計 SaaS) との情報連携でワンクリック取得。
            AI が即座にリスクと提案論点を抽出し、寄り添った高品質な提案までを自動化します。
            ホールディングスとして「異業種連携を柔軟にやる会社」になるための研究プロトタイプです。
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-xs">
            <span className="rounded-full bg-slate-900 px-3 py-1 font-medium text-white">
              異業種データ連携 研究中
            </span>
            <span className="rounded-full bg-blue-50 px-3 py-1 font-medium text-blue-700">
              提案生成は AI 仮説
            </span>
            <span className="rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-700">
              架空データ・医療診断ではありません
            </span>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            3 つの連携シナリオ
          </p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900">
            「顧客にヒアリングしないと埋まらなかったフォーム」を、外部データで一気に埋める。
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">
            各シナリオで体験できるのは「① 空の入力フォーム → ② 提携先データを連携 → ③ 数十項目が一括入力 → ④ AI が個別提案を生成」というフローです。
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <DemoCard
            href="/health"
            number="01"
            title="健保データ連携 × 健康提案"
            subtitle="健康保険組合の健診・生活習慣データを連携。28 項目を一括入力 → AI が保障論点を抽出。"
            bullets={[
              "提携先: 健康保険組合連合会 (架空)",
              "入力項目: 健診・血液検査・生活習慣 28 項目",
              "出力: リスク示唆 + 保障見直し提案 + 面談トーク",
            ]}
            cta="健保連携デモを見る"
          />
          <DemoCard
            href="/lifestyle"
            number="02"
            title="金融機関連携 × ライフイベント検知"
            subtitle="銀行・決済 SaaS と連携。家計プロファイル 22 項目から AI がライフイベントを検知。"
            bullets={[
              "提携先: あおぞらネット銀行 + 決済 SaaS (架空)",
              "入力項目: 支出推移・住宅・資産 22 項目",
              "出力: ライフイベント仮説 + 提案タイミング前出し",
            ]}
            cta="金融機関連携デモを見る"
          />
          <DemoCard
            href="/business"
            number="03"
            title="会計 SaaS 連携 × 法人福利厚生"
            subtitle="会計 SaaS と商工リサーチを連携。法人プロファイル 21 項目から AI が福利厚生・経営者保険を提案。"
            bullets={[
              "提携先: freee + 商工リサーチ (架空)",
              "入力項目: 財務・人事 KPI 21 項目",
              "出力: 団体保険 / 経営者保険 / 福利厚生 提案論点",
            ]}
            cta="会計 SaaS 連携デモを見る"
          />
        </div>
      </main>

      <footer className="mt-12 border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-6 text-xs text-slate-500">
          Life AI Demo Studio © 2026 — 異業種データ連携による保険販売オートメーションに関する研究プロトタイプ。表示される個人・企業情報・分析結果は架空のものであり、保険募集・医療診断ではありません。
        </div>
      </footer>
    </div>
  );
}
