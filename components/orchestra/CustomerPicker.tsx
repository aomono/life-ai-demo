"use client";

import type { HealthCustomer } from "@/lib/types";

type Props = {
  customers: HealthCustomer[];
  onSelect: (customer: HealthCustomer) => void;
};

export function CustomerPicker({ customers, onSelect }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {customers.map((c) => (
        <button
          key={c.id}
          type="button"
          onClick={() => onSelect(c)}
          className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-left backdrop-blur transition hover:border-cyan-400/50 hover:bg-slate-900"
        >
          <p className="text-base font-bold text-slate-100">{c.name}</p>
          <p className="mt-0.5 text-xs text-slate-400">
            {c.age}歳 / {c.occupation}
          </p>
          <dl className="mt-3 space-y-1 text-xs text-slate-500">
            <div className="flex justify-between">
              <dt>血圧</dt>
              <dd className="text-slate-300">
                {c.healthMetrics.bloodPressure.systolic}/{c.healthMetrics.bloodPressure.diastolic}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt>HbA1c</dt>
              <dd className="text-slate-300">{c.healthMetrics.hba1c}%</dd>
            </div>
            <div className="flex justify-between">
              <dt>喫煙</dt>
              <dd className="text-slate-300">
                {c.healthMetrics.smoking === "current"
                  ? "あり"
                  : c.healthMetrics.smoking === "past"
                    ? "過去"
                    : "なし"}
              </dd>
            </div>
          </dl>
          <p className="mt-4 text-xs font-semibold text-cyan-300">この顧客で AI チームに依頼 →</p>
        </button>
      ))}
    </div>
  );
}
