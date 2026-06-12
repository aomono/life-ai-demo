"use client";

import { useEffect, useRef } from "react";
import type { LogEntry } from "@/lib/orchestra";
import { AGENT_META } from "./agentMeta";

type Props = { entries: LogEntry[] };

export function ActivityLog({ entries }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastEntry = entries[entries.length - 1];

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [entries.length, lastEntry?.visibleChars]);

  return (
    <div className="flex h-full flex-col rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur">
      <div className="border-b border-slate-800 px-5 py-3">
        <h2 className="text-sm font-semibold text-slate-200">ライブ活動ログ</h2>
      </div>
      <div ref={scrollRef} className="max-h-80 flex-1 space-y-3 overflow-y-auto px-5 py-4">
        {entries.length === 0 && (
          <p className="text-sm text-slate-500">
            依頼を受け付けるとここに各エージェントの発言が流れます。
          </p>
        )}
        {entries.map(({ event, visibleChars, complete }) => {
          const meta = AGENT_META[event.agent];
          const isVerdict = event.type === "verdict";
          const rejected = event.verdict === "rejected";
          return (
            <div key={event.id} className="orchestra-pop flex gap-3">
              <span
                className="mt-1 size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: meta.color }}
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold ${meta.twText}`}>{meta.label}</span>
                  {isVerdict && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        rejected
                          ? "bg-rose-500/15 text-rose-300"
                          : "bg-emerald-500/15 text-emerald-300"
                      }`}
                    >
                      {rejected ? "差し戻し" : "承認"}
                    </span>
                  )}
                </div>
                <p className="text-sm leading-relaxed text-slate-300">
                  {event.text!.slice(0, visibleChars)}
                  {!complete && <span className="orchestra-caret text-slate-400">▌</span>}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
