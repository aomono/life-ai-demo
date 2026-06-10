import { describe, expect, it } from "vitest";
import { computeHeadcount, MARKETDB_TOTAL } from "./segmentMath";
import type { SegmentChipState } from "./types";

const ALL: SegmentChipState = {
  ageRange: [0, 100],
  incomeRange: [0, 3000],
  marital: ["single", "married", "divorced"],
  children: ["none", "preschool", "elementary", "highschool", "independent"],
  region: ["metro", "prefecture", "rural"],
  housing: ["owned-house", "owned-condo", "rented"],
  lifeEvents: [],
  existingPolicies: ["life-only", "medical-only", "non-life-only", "multiple", "none"],
};

describe("computeHeadcount", () => {
  it("returns full population when no filter applied", () => {
    expect(computeHeadcount(ALL)).toBe(MARKETDB_TOTAL);
  });

  it("shrinks when age range narrows", () => {
    const narrow: SegmentChipState = { ...ALL, ageRange: [30, 39] };
    expect(computeHeadcount(narrow)).toBeLessThan(MARKETDB_TOTAL);
  });

  it("shrinks more when multiple chips narrow simultaneously", () => {
    const single = computeHeadcount({ ...ALL, ageRange: [30, 39] });
    const double = computeHeadcount({
      ...ALL,
      ageRange: [30, 39],
      region: ["metro"],
    });
    expect(double).toBeLessThan(single);
  });

  it("approaches 0 with extreme narrow filters but never goes below 1000", () => {
    const tiny: SegmentChipState = {
      ...ALL,
      ageRange: [35, 38],
      incomeRange: [900, 1000],
      marital: ["married"],
      children: ["preschool"],
      region: ["metro"],
      housing: ["rented"],
      lifeEvents: ["home-buying"],
      existingPolicies: ["none"],
    };
    const n = computeHeadcount(tiny);
    expect(n).toBeGreaterThanOrEqual(1000);
    expect(n).toBeLessThan(50_000);
  });

  it("returns same value for same input (deterministic)", () => {
    const a = computeHeadcount({ ...ALL, ageRange: [30, 39] });
    const b = computeHeadcount({ ...ALL, ageRange: [30, 39] });
    expect(a).toBe(b);
  });
});
