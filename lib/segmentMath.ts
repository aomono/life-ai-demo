import type { SegmentChipState } from "./types";

export const MARKETDB_TOTAL = 42_370_000;

function ageRatio(range: [number, number]): number {
  const [lo, hi] = range;
  const span = Math.max(0, Math.min(100, hi) - Math.max(0, lo));
  return Math.max(0.02, Math.min(1, span / 100));
}

function incomeRatio(range: [number, number]): number {
  const [lo, hi] = range;
  if (hi <= lo) return 0.02;
  if (lo <= 0 && hi >= 3000) return 1;
  const inWindow = Math.max(0, Math.min(3000, hi) - Math.max(0, lo));
  const baseSpan = 3000;
  const center = (lo + hi) / 2;
  const peakBonus = Math.max(0.5, 1.5 - Math.abs(center - 800) / 800);
  return Math.max(0.02, Math.min(1, (inWindow / baseSpan) * peakBonus));
}

function pickRatio<T extends string>(
  all: readonly T[],
  selected: T[],
  weights?: Partial<Record<T, number>>,
): number {
  if (selected.length === 0) return 0.02;
  if (selected.length === all.length) return 1;
  if (!weights) return selected.length / all.length;
  let totalW = 0;
  let sumW = 0;
  for (const k of all) {
    const w = weights[k] ?? 1;
    totalW += w;
    if (selected.includes(k)) sumW += w;
  }
  return totalW === 0 ? 0.02 : Math.max(0.02, sumW / totalW);
}

const MARITAL_ALL = ["single", "married", "divorced"] as const;
const CHILDREN_ALL = [
  "none",
  "preschool",
  "elementary",
  "highschool",
  "independent",
] as const;
const REGION_ALL = ["metro", "prefecture", "rural"] as const;
const HOUSING_ALL = ["owned-house", "owned-condo", "rented"] as const;
const LIFE_EVENTS_ALL = [
  "home-buying",
  "pregnancy",
  "care-start",
  "inheritance",
] as const;
const EXISTING_POLICIES_ALL = [
  "life-only",
  "medical-only",
  "non-life-only",
  "multiple",
  "none",
] as const;

export function computeHeadcount(chips: SegmentChipState): number {
  const r =
    ageRatio(chips.ageRange) *
    incomeRatio(chips.incomeRange) *
    pickRatio(MARITAL_ALL, chips.marital, {
      single: 0.35,
      married: 0.55,
      divorced: 0.1,
    }) *
    pickRatio(CHILDREN_ALL, chips.children, {
      none: 0.4,
      preschool: 0.12,
      elementary: 0.15,
      highschool: 0.13,
      independent: 0.2,
    }) *
    pickRatio(REGION_ALL, chips.region, {
      metro: 0.45,
      prefecture: 0.3,
      rural: 0.25,
    }) *
    pickRatio(HOUSING_ALL, chips.housing, {
      "owned-house": 0.4,
      "owned-condo": 0.25,
      rented: 0.35,
    }) *
    (chips.lifeEvents.length === 0
      ? 1
      : pickRatio(LIFE_EVENTS_ALL, chips.lifeEvents, {
          "home-buying": 0.08,
          pregnancy: 0.04,
          "care-start": 0.07,
          inheritance: 0.05,
        })) *
    pickRatio(EXISTING_POLICIES_ALL, chips.existingPolicies, {
      "life-only": 0.15,
      "medical-only": 0.2,
      "non-life-only": 0.1,
      multiple: 0.35,
      none: 0.2,
    });

  const raw = Math.round(MARKETDB_TOTAL * r);
  return Math.max(1000, raw);
}
