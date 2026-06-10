"use client";

import type { WearableCustomer } from "@/lib/types";

type Props = { customer: WearableCustomer };

export function AppleHealthPreview({ customer }: Props) {
  const v = customer.vitalsSummary;
  const last = customer.vitals30d[customer.vitals30d.length - 1];
  return (
    <div className="mx-auto w-full max-w-sm overflow-hidden rounded-[28px] border border-slate-300 bg-white shadow-lg">
      <div className="flex items-center justify-between bg-white px-5 py-1.5 text-[10px] font-semibold text-slate-900">
        <span>9:41</span>
        <span className="flex items-center gap-1">
          <span>•••</span>
          <span>📶</span>
          <span>🔋</span>
        </span>
      </div>
      <div className="flex items-center gap-2 bg-white px-4 pb-2 pt-1">
        <span className="text-xl">❤️</span>
        <div className="flex-1">
          <p className="text-base font-bold text-slate-900">ヘルスケア</p>
          <p className="text-[10px] text-slate-500">概要 · {customer.name}</p>
        </div>
        <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
          保険会社に共有中
        </span>
      </div>
      <div className="space-y-2 bg-slate-50 px-3 py-3">
        <Card
          icon="❤️"
          title="安静時心拍"
          value={`${last.restingHr} bpm`}
          sub={`30 日平均 ${v.avgRestingHr} bpm`}
          tint="rose"
        />
        <Card
          icon="〰️"
          title="心拍変動 (HRV)"
          value={`${last.hrv} ms`}
          sub={`30 日平均 ${v.avgHrv} ms`}
          tint="orange"
        />
        <Card
          icon="🛏"
          title="睡眠"
          value={`${last.sleepHours.toFixed(1)} h`}
          sub={`スコア ${last.sleepScore} / 30 日平均 ${v.avgSleepHours.toFixed(1)}h`}
          tint="indigo"
        />
        <Card
          icon="👟"
          title="アクティビティ"
          value={`${last.steps.toLocaleString()} 歩`}
          sub={`30 日平均 ${v.avgSteps.toLocaleString()} 歩`}
          tint="emerald"
        />
        {v.vo2maxLatest && (
          <Card
            icon="🫁"
            title="心肺機能 (VO₂max)"
            value={`${v.vo2maxLatest}`}
            sub="mL/kg/min"
            tint="cyan"
          />
        )}
      </div>
      <div className="border-t border-slate-200 bg-white px-4 py-2 text-center text-[10px] text-slate-500">
        Apple Health · 過去 30 日のデータを保険会社に共有 (本人同意済)
      </div>
    </div>
  );
}

function Card({
  icon,
  title,
  value,
  sub,
  tint,
}: {
  icon: string;
  title: string;
  value: string;
  sub: string;
  tint: "rose" | "orange" | "indigo" | "emerald" | "cyan";
}) {
  const tintMap: Record<string, string> = {
    rose: "text-rose-600",
    orange: "text-orange-600",
    indigo: "text-indigo-600",
    emerald: "text-emerald-700",
    cyan: "text-cyan-700",
  };
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm">
      <span className={`text-2xl ${tintMap[tint]}`}>{icon}</span>
      <div className="flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </p>
        <p className="text-lg font-bold text-slate-900">{value}</p>
        <p className="text-[10px] text-slate-500">{sub}</p>
      </div>
      <span className="text-slate-300">›</span>
    </div>
  );
}
