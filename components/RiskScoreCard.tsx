import { clsx } from "clsx";

function bandColor(score: number) {
  if (score < 30) return "text-emerald-600";
  if (score < 65) return "text-amber-600";
  return "text-rose-600";
}

function barColor(score: number) {
  if (score < 30) return "bg-emerald-500";
  if (score < 65) return "bg-amber-500";
  return "bg-rose-500";
}

export function RiskScoreCard({
  score,
  label,
}: {
  score: number;
  label: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-baseline justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          AI 提案優先度スコア
        </p>
        <span
          className={clsx(
            "text-xs font-semibold",
            score < 30
              ? "text-emerald-600"
              : score < 65
                ? "text-amber-600"
                : "text-rose-600",
          )}
        >
          {label}
        </span>
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className={clsx("text-4xl font-bold", bandColor(score))}>
          {score}
        </span>
        <span className="text-sm text-slate-400">/ 100</span>
      </div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={clsx("h-full rounded-full transition-all", barColor(score))}
          style={{ width: `${score}%` }}
        />
      </div>
      <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
        スコアはデモ上の論点優先度を示す独自指標です。保険料・医療リスクの算定値ではありません。
      </p>
    </div>
  );
}
