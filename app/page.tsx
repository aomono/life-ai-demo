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
            生命保険 × AI 体験デモ (役員向けプレゼン用 / 2026-06-12 着地)
          </span>
        </div>
      </header>

      <section className="border-b border-slate-200 bg-gradient-to-b from-white to-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-700">
            For T&D Executives
          </p>
          <h1 className="mt-3 max-w-4xl text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
            AI が生活データを読み解き、
            <br />
            保険提案を「個別化された伴走体験」へ変える。
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-700">
            健康・購買決済・会計 SaaS の 3 領域のダミーデータから、AI が個別化された保険提案・相談仮説を出します。
            「データを選ぶ → AI 分析を実行 → 個別提案が出る」を体感していただくデモです。
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-xs">
            <span className="rounded-full bg-slate-900 px-3 py-1 font-medium text-white">
              実データではありません
            </span>
            <span className="rounded-full bg-blue-50 px-3 py-1 font-medium text-blue-700">
              提案は AI の仮説です
            </span>
            <span className="rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-700">
              医療診断・保険募集ではありません
            </span>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <DemoCard
            href="/health"
            number="01"
            title="健康データ AI 保険カウンセラー"
            subtitle="健診・生活習慣データから、健康リスクと保障見直しの論点を同時に提示。"
            bullets={[
              "健診結果・喫煙・歩数・睡眠から AI が論点を抽出",
              "医療保障・就業不能保障の確認余地を提案",
              "生活改善プログラムへの接続トーク例まで提示",
            ]}
            cta="健康データ デモを見る"
          />
          <DemoCard
            href="/lifestyle"
            number="02"
            title="購買・決済 AI ライフイベント検知"
            subtitle="買い物・決済履歴から、出産・介護・住宅購入などの生活変化を AI が検知。"
            bullets={[
              "ベビー・介護・住宅関連の支出変化からイベント仮説",
              "保険会社が持たない生活データを論点化",
              "提案タイミングをデータドリブンで前出し",
            ]}
            cta="購買・決済 デモを見る"
          />
          <DemoCard
            href="/business"
            number="03"
            title="会計 SaaS AI 福利厚生プランナー"
            subtitle="中小企業の会計・給与・従業員構成から、福利厚生・団体保険の提案余地を出力。"
            bullets={[
              "従業員構成・退職金・離職率から経営論点を整理",
              "団体医療・所得補償・経営者保険を提案",
              "従業員説明会のトーク骨子まで提示",
            ]}
            cta="法人 SaaS デモを見る"
          />
        </div>
      </main>

      <footer className="mt-12 border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-6 text-xs text-slate-500">
          Life AI Demo Studio © 2026 — このデモは AI 活用イメージの体感を目的としており、表示される個人・企業情報・分析結果は架空のものです。
        </div>
      </footer>
    </div>
  );
}
