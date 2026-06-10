"use client";

type Props = {
  severity: "critical" | "warn" | "info";
  label: string;
};

const STYLE: Record<Props["severity"], string> = {
  critical: "bg-rose-50 border-rose-300 text-rose-800",
  warn: "bg-amber-50 border-amber-300 text-amber-800",
  info: "bg-sky-50 border-sky-300 text-sky-800",
};

const ICON: Record<Props["severity"], string> = {
  critical: "⚠️",
  warn: "⚠️",
  info: "ℹ️",
};

const PREFIX: Record<Props["severity"], string> = {
  critical: "緊急: AI 検知アラート",
  warn: "要フォロー: AI 検知アラート",
  info: "注意: AI 検知サイン",
};

export function AlertBanner({ severity, label }: Props) {
  return (
    <div
      className={`flex items-center gap-3 rounded-lg border-2 px-4 py-3 shadow-sm ${STYLE[severity]}`}
    >
      <span className="text-2xl">{ICON[severity]}</span>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider">
          {PREFIX[severity]}
        </p>
        <p className="text-base font-bold">{label}</p>
      </div>
    </div>
  );
}
