"use client";

import { clsx } from "clsx";

type Option = { id: string; label: string; sublabel?: string };

export function CustomerSelector({
  options,
  selectedId,
  onSelect,
  legend,
}: {
  options: Option[];
  selectedId: string;
  onSelect: (id: string) => void;
  legend: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
        {legend}
      </p>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
        {options.map((o) => {
          const active = o.id === selectedId;
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => onSelect(o.id)}
              className={clsx(
                "flex flex-col items-start rounded-lg border px-3 py-2 text-left transition-all",
                active
                  ? "border-slate-900 bg-slate-900 text-white shadow"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-400",
              )}
            >
              <span className="text-sm font-semibold">{o.label}</span>
              {o.sublabel && (
                <span
                  className={clsx(
                    "mt-0.5 text-xs",
                    active ? "text-slate-200" : "text-slate-500",
                  )}
                >
                  {o.sublabel}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
