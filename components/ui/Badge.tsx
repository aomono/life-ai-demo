import { clsx } from "clsx";
import type { HTMLAttributes } from "react";
import type { RiskLevel } from "@/lib/types";

const TONES: Record<string, string> = {
  high: "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200",
  medium: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
  low: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
  navy: "bg-slate-900 text-white",
  blue: "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200",
  slate: "bg-slate-100 text-slate-700",
};

type Props = HTMLAttributes<HTMLSpanElement> & {
  tone?: RiskLevel | "navy" | "blue" | "slate";
};

export function Badge({ className, tone = "slate", ...props }: Props) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        TONES[tone],
        className,
      )}
      {...props}
    />
  );
}

export const riskLabel = (r: RiskLevel) =>
  r === "high" ? "高" : r === "medium" ? "中" : "低";
