"use client";

type Props = {
  playing: boolean;
  complete: boolean;
  speed: number;
  progress: number;
  onToggle: () => void;
  onReset: () => void;
  onSpeed: (speed: number) => void;
};

export function PlaybackControls({
  playing,
  complete,
  speed,
  progress,
  onToggle,
  onReset,
  onSpeed,
}: Props) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-900/60 px-5 py-3 backdrop-blur">
      <button
        type="button"
        onClick={onToggle}
        disabled={complete}
        className="rounded-lg bg-cyan-500/15 px-4 py-1.5 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-500/25 disabled:opacity-40"
      >
        {complete ? "完了" : playing ? "一時停止" : "再生"}
      </button>
      <button
        type="button"
        onClick={onReset}
        className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-300 transition hover:bg-slate-800"
      >
        リセット
      </button>
      <div className="flex gap-1">
        {[1, 2].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onSpeed(s)}
            className={`rounded px-2 py-1 text-xs font-semibold transition ${
              speed === s ? "bg-slate-200 text-slate-900" : "text-slate-400 hover:bg-slate-800"
            }`}
          >
            {s}x
          </button>
        ))}
      </div>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-400 transition-[width] duration-200"
          style={{ width: `${Math.min(100, progress * 100)}%` }}
        />
      </div>
    </div>
  );
}
