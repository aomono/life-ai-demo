"use client";

import { useMemo } from "react";
import type { IntakeSchema, IntakeValues } from "@/lib/intakeSchema";
import { ExcelPreview } from "@/components/ExcelPreview";

type Props = {
  schema: IntakeSchema;
  values: IntakeValues | null;
  connectLabel: string;
  onConnect: () => void;
  onAnalyze: () => void;
  isConnected: boolean;
  isAnalyzing?: boolean;
  selectorSlot?: React.ReactNode;
  highlightExcelRowId?: string;
};

export function DataIntakeForm({
  schema,
  values,
  connectLabel,
  onConnect,
  onAnalyze,
  isConnected,
  isAnalyzing = false,
  selectorSlot,
  highlightExcelRowId,
}: Props) {
  const totalFields = useMemo(
    () => schema.sections.reduce((acc, s) => acc + s.fields.length, 0),
    [schema],
  );
  const filledFields = useMemo(() => {
    if (!values) return 0;
    let n = 0;
    for (const s of schema.sections) {
      for (const f of s.fields) {
        if (values[f.key]) n++;
      }
    }
    return n;
  }, [schema, values]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            STEP 1 / 顧客プロファイル入力
          </p>
          <h2 className="mt-1 text-lg font-bold text-slate-900">
            提案に必要な {totalFields} 項目
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            通常はお客様からヒアリングが必要。今回は提携先データを連携して一括入力します。
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700">
            入力済 {filledFields} / {totalFields}
          </span>
        </div>
      </div>

      {selectorSlot && <div className="mb-4">{selectorSlot}</div>}

      <div className="mb-5 rounded-lg border border-blue-100 bg-blue-50/60 p-4">
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex-1 text-sm">
            <p className="font-semibold text-slate-900">
              提携データソース: {schema.partner.name}
            </p>
            <p className="mt-0.5 text-xs text-slate-600">
              {schema.partner.note}
            </p>
            <p className="mt-1 font-mono text-[11px] text-slate-500">
              読み込み対象: {schema.partner.excelSheet}
            </p>
          </div>
          <button
            type="button"
            onClick={onConnect}
            disabled={isConnected}
            className={`flex shrink-0 items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold shadow ${
              isConnected
                ? "cursor-default bg-emerald-100 text-emerald-700"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isConnected ? (
              <>
                <span aria-hidden>✓</span> 連携済み
              </>
            ) : (
              <>{connectLabel}</>
            )}
          </button>
        </div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          連携対象データのプレビュー (提携先で実際に保有しているデータの形)
        </p>
        <ExcelPreview
          sheet={schema.excelPreview}
          highlightId={highlightExcelRowId}
        />
        <p className="mt-2 text-[11px] text-slate-500">
          ※ 上のボタンを押すと、ハイライト行のデータを匿名 ID で取得し、下のフォームに一括入力します。
        </p>
      </div>

      <div className="space-y-5">
        {schema.sections.map((section) => (
          <div key={section.title}>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              {section.title}
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {section.fields.map((f) => {
                const v = values?.[f.key] ?? "";
                return (
                  <div
                    key={f.key}
                    className="flex flex-col gap-1 rounded border border-slate-200 bg-slate-50/60 px-3 py-2"
                  >
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      {f.label}
                    </label>
                    <div
                      className={`min-h-[1.25rem] text-sm ${
                        v ? "font-semibold text-slate-900" : "text-slate-300"
                      }`}
                    >
                      {v || "—"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-500">
          STEP 2: フォーム完了後、AI が提案を生成します。
        </p>
        <button
          type="button"
          onClick={onAnalyze}
          disabled={!isConnected || isAnalyzing}
          className={`rounded-md px-5 py-2 text-sm font-semibold shadow ${
            isConnected && !isAnalyzing
              ? "bg-slate-900 text-white hover:bg-slate-800"
              : "cursor-not-allowed bg-slate-200 text-slate-400"
          }`}
        >
          {isAnalyzing ? "AI 分析中…" : "AI 提案を生成 →"}
        </button>
      </div>
    </div>
  );
}
