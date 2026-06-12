import type { Metadata } from "next";
import { OrchestraStage } from "@/components/orchestra/OrchestraStage";

export const metadata: Metadata = {
  title: "Agent Orchestra — Life AI Demo Studio",
  description: "AI エージェントチームが協調して保険提案を作り上げる過程の可視化デモ",
};

export default function OrchestraPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <header className="border-b border-slate-800/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="inline-block size-8 rounded-md bg-gradient-to-br from-cyan-400 to-violet-500" />
            <span className="text-sm font-semibold tracking-wide text-slate-100">
              Life AI Demo Studio <span className="text-cyan-400">/ Agent Orchestra</span>
            </span>
          </div>
          <span className="hidden text-xs text-slate-500 md:inline">
            Demo 06 — マルチエージェント協調可視化（限定公開）
          </span>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400">
          Multi-Agent Orchestration
        </p>
        <h1 className="mt-2 text-3xl font-bold leading-tight text-slate-50 md:text-4xl">
          AI エージェントチームが、提案を「議論して」作る。
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-400">
          受付・分析・設計・審査の 4 つの AI
          エージェントが協調し、差し戻しを経て提案を磨き上げる舞台裏をリアルタイムに可視化します。
        </p>
      </section>

      <main className="mx-auto max-w-7xl px-6 pb-16">
        <OrchestraStage />
      </main>

      <footer className="border-t border-slate-800/80">
        <div className="mx-auto max-w-7xl px-6 py-6 text-xs text-slate-600">
          本デモのエージェント・顧客・分析・提案はすべて架空のシナリオ再生であり、保険募集・医療診断ではありません。
        </div>
      </footer>
    </div>
  );
}
