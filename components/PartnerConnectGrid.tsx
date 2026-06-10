"use client";

export type Partner = {
  id: string;
  name: string;
  category: string;
  note: string;
  fieldCount: number;
  brandColor: string;
};

export const SEGMENT_PARTNERS: Partner[] = [
  {
    id: "mobile-spatial",
    name: "モバイル空間統計",
    category: "通信キャリア (架空)",
    note: "居住地区別の世帯属性・人流",
    fieldCount: 21,
    brandColor: "bg-rose-500",
  },
  {
    id: "card-consortium",
    name: "カード購買データ",
    category: "カードコンソーシアム (架空)",
    note: "月次支出カテゴリ + ライフイベント兆候",
    fieldCount: 32,
    brandColor: "bg-emerald-600",
  },
  {
    id: "housing-saas",
    name: "不動産情報 SaaS",
    category: "住宅情報 SaaS (架空)",
    note: "居住形態・住宅価格帯・取得検討フラグ",
    fieldCount: 18,
    brandColor: "bg-amber-600",
  },
  {
    id: "estat",
    name: "国勢調査・e-Stat",
    category: "公的統計",
    note: "年代別世帯構成・年収帯分布",
    fieldCount: 16,
    brandColor: "bg-sky-700",
  },
];

type Props = {
  connectedIds: string[];
  onConnect: (id: string) => void;
};

export function PartnerConnectGrid({ connectedIds, onConnect }: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {SEGMENT_PARTNERS.map((p) => {
        const connected = connectedIds.includes(p.id);
        return (
          <div
            key={p.id}
            className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <span
                className={`inline-flex size-9 items-center justify-center rounded-md text-sm font-bold text-white ${p.brandColor}`}
              >
                {p.name.slice(0, 1)}
              </span>
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-900">{p.name}</p>
                <p className="text-[11px] text-slate-500">{p.category}</p>
              </div>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                {p.fieldCount} 項目
              </span>
            </div>
            <p className="text-xs text-slate-600">{p.note}</p>
            <button
              type="button"
              onClick={() => onConnect(p.id)}
              disabled={connected}
              className={`mt-1 rounded-md px-3 py-1.5 text-xs font-semibold shadow ${
                connected
                  ? "cursor-default bg-emerald-100 text-emerald-700"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {connected ? "✓ 連携済み" : "連携する ▶"}
            </button>
          </div>
        );
      })}
    </div>
  );
}
