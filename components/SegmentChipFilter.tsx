"use client";

import type { SegmentChipState } from "@/lib/types";

type Props = {
  value: SegmentChipState;
  onChange: (next: SegmentChipState) => void;
};

const MARITAL_OPTIONS = [
  { id: "single", label: "未婚" },
  { id: "married", label: "既婚" },
  { id: "divorced", label: "離別" },
] as const;

const CHILDREN_OPTIONS = [
  { id: "none", label: "子なし" },
  { id: "preschool", label: "未就学" },
  { id: "elementary", label: "小中学" },
  { id: "highschool", label: "高校" },
  { id: "independent", label: "独立" },
] as const;

const REGION_OPTIONS = [
  { id: "metro", label: "政令市" },
  { id: "prefecture", label: "県庁所在地" },
  { id: "rural", label: "地方" },
] as const;

const HOUSING_OPTIONS = [
  { id: "owned-house", label: "持家戸建" },
  { id: "owned-condo", label: "持家マンション" },
  { id: "rented", label: "賃貸" },
] as const;

const LIFE_EVENTS_OPTIONS = [
  { id: "home-buying", label: "住宅取得検討" },
  { id: "pregnancy", label: "妊娠予兆" },
  { id: "care-start", label: "介護開始" },
  { id: "inheritance", label: "相続検討" },
] as const;

const POLICY_OPTIONS = [
  { id: "life-only", label: "生命のみ" },
  { id: "medical-only", label: "医療のみ" },
  { id: "non-life-only", label: "損保のみ" },
  { id: "multiple", label: "複数" },
  { id: "none", label: "なし" },
] as const;

type Chip = { id: string; label: string };

function ChipGroup(props: {
  legend: string;
  options: readonly Chip[];
  selected: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <div>
      <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
        {props.legend}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {props.options.map((o) => {
          const on = props.selected.includes(o.id);
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => props.onToggle(o.id)}
              className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition ${
                on
                  ? "border-blue-500 bg-blue-500 text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:border-slate-500"
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function toggle<T extends string>(arr: T[], id: T): T[] {
  return arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id];
}

export function SegmentChipFilter({ value, onChange }: Props) {
  const set = <K extends keyof SegmentChipState>(
    key: K,
    next: SegmentChipState[K],
  ) => onChange({ ...value, [key]: next });

  return (
    <div className="grid grid-cols-1 gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-2">
      <div className="md:col-span-2">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          年齢レンジ: {value.ageRange[0]} — {value.ageRange[1]} 歳
        </p>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={20}
            max={75}
            value={value.ageRange[0]}
            onChange={(e) =>
              set("ageRange", [
                Number(e.target.value),
                Math.max(Number(e.target.value), value.ageRange[1]),
              ])
            }
            className="flex-1"
          />
          <input
            type="range"
            min={20}
            max={75}
            value={value.ageRange[1]}
            onChange={(e) =>
              set("ageRange", [
                Math.min(value.ageRange[0], Number(e.target.value)),
                Number(e.target.value),
              ])
            }
            className="flex-1"
          />
        </div>
      </div>

      <div className="md:col-span-2">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          世帯年収レンジ: {value.incomeRange[0]} — {value.incomeRange[1]} 万円
        </p>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={200}
            max={3000}
            step={50}
            value={value.incomeRange[0]}
            onChange={(e) =>
              set("incomeRange", [
                Number(e.target.value),
                Math.max(Number(e.target.value), value.incomeRange[1]),
              ])
            }
            className="flex-1"
          />
          <input
            type="range"
            min={200}
            max={3000}
            step={50}
            value={value.incomeRange[1]}
            onChange={(e) =>
              set("incomeRange", [
                Math.min(value.incomeRange[0], Number(e.target.value)),
                Number(e.target.value),
              ])
            }
            className="flex-1"
          />
        </div>
      </div>

      <ChipGroup
        legend="婚姻状態"
        options={MARITAL_OPTIONS}
        selected={value.marital}
        onToggle={(id) =>
          set("marital", toggle(value.marital, id as SegmentChipState["marital"][number]))
        }
      />
      <ChipGroup
        legend="子供"
        options={CHILDREN_OPTIONS}
        selected={value.children}
        onToggle={(id) =>
          set("children", toggle(value.children, id as SegmentChipState["children"][number]))
        }
      />
      <ChipGroup
        legend="居住エリア"
        options={REGION_OPTIONS}
        selected={value.region}
        onToggle={(id) =>
          set("region", toggle(value.region, id as SegmentChipState["region"][number]))
        }
      />
      <ChipGroup
        legend="居住形態"
        options={HOUSING_OPTIONS}
        selected={value.housing}
        onToggle={(id) =>
          set("housing", toggle(value.housing, id as SegmentChipState["housing"][number]))
        }
      />
      <ChipGroup
        legend="ライフイベント兆候"
        options={LIFE_EVENTS_OPTIONS}
        selected={value.lifeEvents}
        onToggle={(id) =>
          set(
            "lifeEvents",
            toggle(value.lifeEvents, id as SegmentChipState["lifeEvents"][number]),
          )
        }
      />
      <ChipGroup
        legend="既加入保険"
        options={POLICY_OPTIONS}
        selected={value.existingPolicies}
        onToggle={(id) =>
          set(
            "existingPolicies",
            toggle(
              value.existingPolicies,
              id as SegmentChipState["existingPolicies"][number],
            ),
          )
        }
      />
    </div>
  );
}
