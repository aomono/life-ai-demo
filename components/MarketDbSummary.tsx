"use client";

import { MARKETDB_TOTAL } from "@/lib/segmentMath";
import { SEGMENT_PARTNERS } from "./PartnerConnectGrid";

export function MarketDbSummary() {
  const totalFields = SEGMENT_PARTNERS.reduce((a, p) => a + p.fieldCount, 0);
  return (
    <div className="rounded-lg border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-4 shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
        異業種統合マーケ DB (構築済)
      </p>
      <div className="mt-1 flex flex-wrap items-baseline gap-x-6 gap-y-1">
        <div>
          <span className="text-2xl font-bold text-slate-900">
            {(MARKETDB_TOTAL / 10_000).toLocaleString()}
          </span>
          <span className="ml-1 text-xs text-slate-600">万世帯</span>
        </div>
        <div className="text-xs text-slate-600">
          データソース:{" "}
          <span className="font-semibold text-slate-900">
            {SEGMENT_PARTNERS.length} 連携
          </span>
        </div>
        <div className="text-xs text-slate-600">
          項目数:{" "}
          <span className="font-semibold text-slate-900">{totalFields} 項目</span>
        </div>
        <div className="text-xs text-slate-600">
          最終更新: <span className="font-mono text-slate-900">2026-06-09</span>
        </div>
      </div>
    </div>
  );
}
