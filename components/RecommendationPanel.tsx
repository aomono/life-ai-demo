import type { Recommendation } from "@/lib/types";
import { Card, CardBody, CardHeader, CardSubtitle, CardTitle } from "./ui/Card";

export function RecommendationPanel({
  recommendations,
}: {
  recommendations: Recommendation[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>提案アクション</CardTitle>
        <CardSubtitle>面談で提示できる仮説と次の一歩</CardSubtitle>
      </CardHeader>
      <CardBody>
        <ol className="space-y-4">
          {recommendations.map((r, i) => (
            <li
              key={i}
              className="rounded-lg border border-slate-200 bg-white p-3"
            >
              <p className="text-sm font-semibold text-slate-900">
                {i + 1}. {r.title}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                <span className="font-semibold text-slate-600">なぜ: </span>
                {r.reason}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                <span className="font-semibold text-slate-600">
                  推奨アクション:{" "}
                </span>
                {r.suggestedAction}
              </p>
              <div className="mt-3 rounded-md bg-slate-900 px-3 py-2 text-xs leading-relaxed text-slate-100">
                <p className="mb-1 font-semibold uppercase tracking-wider text-slate-400">
                  面談トーク例
                </p>
                {r.conversationScript}
              </div>
            </li>
          ))}
        </ol>
      </CardBody>
    </Card>
  );
}
