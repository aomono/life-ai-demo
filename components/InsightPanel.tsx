import type { AIInsight } from "@/lib/types";
import { Badge, riskLabel } from "./ui/Badge";
import { Card, CardBody, CardHeader, CardSubtitle, CardTitle } from "./ui/Card";

export function InsightPanel({
  summary,
  insights,
  nextQuestions,
}: {
  summary: string;
  insights: AIInsight[];
  nextQuestions: string[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI が読み解いた示唆</CardTitle>
        <CardSubtitle>個別データから抽出した相談論点 3 つ</CardSubtitle>
      </CardHeader>
      <CardBody>
        <p className="rounded-md border border-blue-100 bg-blue-50/60 px-3 py-3 text-sm leading-relaxed text-slate-800">
          {summary}
        </p>
        <ul className="mt-4 space-y-3">
          {insights.map((it, i) => (
            <li
              key={i}
              className="rounded-lg border border-slate-200 bg-white p-3"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-slate-900">
                  {i + 1}. {it.title}
                </span>
                <Badge tone={it.riskLevel}>
                  リスク {riskLabel(it.riskLevel)}
                </Badge>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                {it.summary}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {it.evidence.map((e, j) => (
                  <span
                    key={j}
                    className="rounded bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600"
                  >
                    {e}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            次回面談で確認したい質問
          </p>
          <ul className="mt-2 space-y-1.5">
            {nextQuestions.map((q, i) => (
              <li key={i} className="flex gap-2 text-sm text-slate-700">
                <span className="text-slate-400">Q{i + 1}.</span>
                <span>{q}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardBody>
    </Card>
  );
}
