"use client";

type Props = { script: string };

export function CallScriptCard({ script }: Props) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
        AI 推奨架電トーク (1 ターム目)
      </p>
      <p className="rounded border-l-2 border-slate-700 bg-slate-50/70 px-3 py-2 text-sm leading-relaxed text-slate-800">
        {script}
      </p>
      <p className="mt-2 text-[10px] text-slate-500">
        ※ 実際の架電前に検知根拠を再確認の上、ご本人の状況に応じて自然な言葉に置き換えてください。
      </p>
    </div>
  );
}
