"use client";

type Props = {
  headcount: number;
  baseHeadcount: number;
};

export function SegmentResultPanel({ headcount, baseHeadcount }: Props) {
  const deltaPct = baseHeadcount
    ? Math.round(((headcount - baseHeadcount) / baseHeadcount) * 100)
    : 0;
  const positive = deltaPct >= 0;
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        該当世帯数 (リアルタイム)
      </p>
      <div className="mt-1 flex items-baseline gap-3">
        <span className="text-4xl font-bold tracking-tight text-slate-900 tabular-nums">
          {headcount.toLocaleString()}
        </span>
        <span className="text-sm text-slate-600">世帯</span>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
            positive
              ? "bg-emerald-100 text-emerald-700"
              : "bg-rose-100 text-rose-700"
          }`}
        >
          ベース比 {positive ? "+" : ""}
          {deltaPct}%
        </span>
      </div>
      <p className="mt-1 text-[11px] text-slate-500">
        条件変更で即座に再集計 (架空マーケ DB 4,237 万世帯ベース)
      </p>
    </div>
  );
}
