import type { ReactNode } from "react";
import { Card, CardBody, CardHeader, CardSubtitle, CardTitle } from "./ui/Card";

export type DataRow = {
  label: string;
  value: ReactNode;
  emphasize?: "warn" | "info";
};

export function DataPanel({
  title,
  subtitle,
  rows,
  extra,
}: {
  title: string;
  subtitle?: string;
  rows: DataRow[];
  extra?: ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {subtitle && <CardSubtitle>{subtitle}</CardSubtitle>}
      </CardHeader>
      <CardBody>
        <dl className="divide-y divide-slate-100">
          {rows.map((r, i) => (
            <div
              key={i}
              className="flex items-start justify-between gap-3 py-2 text-sm"
            >
              <dt className="shrink-0 text-slate-500">{r.label}</dt>
              <dd
                className={
                  r.emphasize === "warn"
                    ? "text-right font-medium text-rose-700"
                    : r.emphasize === "info"
                      ? "text-right font-medium text-blue-700"
                      : "text-right font-medium text-slate-800"
                }
              >
                {r.value}
              </dd>
            </div>
          ))}
        </dl>
        {extra && <div className="mt-4">{extra}</div>}
      </CardBody>
    </Card>
  );
}
