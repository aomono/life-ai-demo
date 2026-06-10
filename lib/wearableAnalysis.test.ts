import { describe, expect, it } from "vitest";
import wearableData from "@/data/wearableCustomers.json";
import { analyzeWearable } from "./wearableAnalysis";
import type { WearableCustomer } from "./types";

const CUSTOMERS = wearableData as WearableCustomer[];

describe("analyzeWearable", () => {
  it("returns an AnalysisResult for every customer", () => {
    for (const c of CUSTOMERS) {
      const r = analyzeWearable(c);
      expect(r).toBeTruthy();
      expect(r.overallSummary).toBeTruthy();
      expect(r.insights.length).toBeGreaterThan(0);
      expect(r.recommendations.length).toBeGreaterThan(0);
      expect(r.nextQuestions.length).toBeGreaterThan(0);
      expect(r.score).toBeGreaterThan(0);
      expect(r.score).toBeLessThanOrEqual(100);
    }
  });

  it("AFib profile gets the highest score (critical)", () => {
    const afib = CUSTOMERS.find((c) => c.id === "acute-afib")!;
    const stress = CUSTOMERS.find((c) => c.id === "chronic-stress")!;
    const lifestyle = CUSTOMERS.find((c) => c.id === "prodromal-lifestyle")!;
    expect(analyzeWearable(afib).score).toBeGreaterThan(
      analyzeWearable(stress).score,
    );
    expect(analyzeWearable(stress).score).toBeGreaterThan(
      analyzeWearable(lifestyle).score,
    );
  });
});
