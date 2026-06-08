import Link from "next/link";

export function DemoCard({
  href,
  number,
  title,
  subtitle,
  bullets,
  cta,
}: {
  href: string;
  number: string;
  title: string;
  subtitle: string;
  bullets: string[];
  cta: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-slate-900 hover:shadow-lg"
    >
      <span className="text-xs font-semibold uppercase tracking-widest text-blue-700">
        Demo {number}
      </span>
      <h3 className="mt-2 text-lg font-bold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{subtitle}</p>
      <ul className="mt-4 flex flex-col gap-1.5 text-sm text-slate-700">
        {bullets.map((b, i) => (
          <li key={i} className="flex gap-2">
            <span className="mt-1 inline-block size-1.5 shrink-0 rounded-full bg-slate-400" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
      <span className="mt-auto pt-5 text-sm font-semibold text-slate-900 group-hover:underline">
        {cta} →
      </span>
    </Link>
  );
}
