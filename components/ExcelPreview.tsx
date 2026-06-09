"use client";

import type { ExcelPreview as ExcelPreviewType } from "@/lib/intakeSchema";

const COL_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function colLetter(i: number): string {
  if (i < 26) return COL_LETTERS[i];
  const head = COL_LETTERS[Math.floor(i / 26) - 1];
  const tail = COL_LETTERS[i % 26];
  return `${head}${tail}`;
}

function formatCell(value: string | number): string {
  if (typeof value === "number") {
    return value >= 1000 ? value.toLocaleString() : String(value);
  }
  return value;
}

export function ExcelPreview({
  sheet,
  highlightId,
}: {
  sheet: ExcelPreviewType;
  highlightId?: string;
}) {
  const columnCount = sheet.columns.length + 1; // +1 for row number column
  const visibleRows = sheet.rows.length;
  const hiddenRowCount = sheet.rowsTotal - visibleRows;
  return (
    <div className="overflow-hidden rounded-md border border-slate-300 bg-white shadow-inner">
      <div className="flex items-center gap-2 border-b border-slate-300 bg-[#217346] px-3 py-1.5 text-xs text-white">
        <span className="font-mono font-semibold">XLS</span>
        <span className="font-semibold">{sheet.fileName}</span>
        <span className="ml-auto text-[10px] opacity-80">
          {sheet.rowsTotal.toLocaleString()} 行 × {sheet.columns.length} 列
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-[11px]">
          <thead>
            <tr className="bg-[#f3f3f3] text-[10px] text-slate-500">
              <th className="sticky left-0 z-10 w-10 border-r border-b border-slate-300 bg-[#f3f3f3] px-1 py-0.5 font-normal" />
              {sheet.columns.map((_, i) => (
                <th
                  key={i}
                  className="border-r border-b border-slate-300 px-2 py-0.5 font-normal"
                >
                  {colLetter(i)}
                </th>
              ))}
            </tr>
            <tr className="bg-[#e7eef5] text-[11px] text-slate-800">
              <th className="sticky left-0 z-10 w-10 border-r border-b border-slate-300 bg-[#f3f3f3] px-1 py-1 font-normal text-slate-500">
                1
              </th>
              {sheet.columns.map((c, i) => (
                <th
                  key={i}
                  className="whitespace-nowrap border-r border-b border-slate-300 px-2 py-1 text-left font-semibold"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sheet.rows.map((row, rIdx) => {
              const highlighted = row.id === highlightId;
              return (
                <tr
                  key={row.id}
                  className={
                    highlighted ? "bg-amber-100" : rIdx % 2 ? "bg-white" : "bg-slate-50/40"
                  }
                >
                  <td className="sticky left-0 z-10 w-10 border-r border-b border-slate-200 bg-[#f3f3f3] px-1 py-1 text-center text-[10px] text-slate-500">
                    {rIdx + 2}
                  </td>
                  {row.cells.map((cell, i) => (
                    <td
                      key={i}
                      className={`whitespace-nowrap border-r border-b border-slate-200 px-2 py-1 ${
                        highlighted ? "font-semibold text-slate-900" : "text-slate-700"
                      }`}
                    >
                      {formatCell(cell)}
                    </td>
                  ))}
                </tr>
              );
            })}
            <tr className="bg-slate-50 text-center text-[10px] italic text-slate-400">
              <td
                colSpan={columnCount}
                className="border-b border-slate-200 px-2 py-1"
              >
                … 残り {hiddenRowCount.toLocaleString()} 行を省略表示
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="flex items-center gap-2 border-t border-slate-300 bg-[#f3f3f3] px-3 py-1 text-[10px] text-slate-600">
        <span className="rounded-sm bg-white px-2 py-0.5 font-semibold text-slate-700 shadow-sm">
          {sheet.sheetName}
        </span>
        <span className="text-slate-400">+</span>
        <span className="text-slate-400">ベンチマーク</span>
        <span className="text-slate-400">業界平均</span>
        {highlightId && (
          <span className="ml-auto rounded bg-amber-200 px-2 py-0.5 font-semibold text-amber-900">
            ハイライト = 選択中の顧客行
          </span>
        )}
      </div>
    </div>
  );
}
