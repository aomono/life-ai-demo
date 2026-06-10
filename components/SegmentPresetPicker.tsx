"use client";

import type { SegmentPreset, SegmentPresetId } from "@/lib/types";

type Props = {
  presets: SegmentPreset[];
  selectedId: SegmentPresetId | null;
  onSelect: (id: SegmentPresetId) => void;
};

export function SegmentPresetPicker({ presets, selectedId, onSelect }: Props) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
        プリセットセグメント
      </p>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {presets.map((p) => {
          const selected = selectedId === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onSelect(p.id)}
              className={`flex flex-col gap-1 rounded-lg border p-3 text-left transition ${
                selected
                  ? "border-blue-500 bg-blue-50 shadow-md"
                  : "border-slate-200 bg-white hover:border-slate-400"
              }`}
            >
              <span className="text-sm font-bold text-slate-900">
                {p.label}
              </span>
              <span className="text-[11px] leading-relaxed text-slate-600">
                {p.description}
              </span>
              <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                ベース該当: {p.baseHeadcount.toLocaleString()} 世帯
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
