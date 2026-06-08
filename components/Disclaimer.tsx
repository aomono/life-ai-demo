export function Disclaimer({ text }: { text: string }) {
  return (
    <p className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] leading-relaxed text-slate-500">
      <span className="mr-1 font-semibold text-slate-600">注記</span>
      {text}
    </p>
  );
}
