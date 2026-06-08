import { describe, expect, it } from "vitest";
import {
  labelForScore,
  scoreBusiness,
  scoreHealth,
  scoreLifestyle,
} from "./scoring";
import type {
  BusinessCompany,
  HealthCustomer,
  LifestyleCustomer,
} from "./types";

const healthyBase: HealthCustomer = {
  id: "test",
  name: "テスト 太郎",
  age: 30,
  gender: "male",
  family: "独身",
  occupation: "会社員",
  existingPolicies: [],
  healthMetrics: {
    bmi: 21,
    bloodPressure: { systolic: 110, diastolic: 70 },
    hba1c: 5.0,
    ldl: 100,
    smoking: "never",
    alcoholPerWeek: 0,
    averageSteps: 9000,
    averageSleepHours: 7.5,
  },
};

describe("scoreHealth", () => {
  it("returns near-zero for a clean healthy single-person profile", () => {
    expect(scoreHealth(healthyBase)).toBeLessThan(15);
  });

  it("adds points for high blood pressure", () => {
    const cust: HealthCustomer = {
      ...healthyBase,
      healthMetrics: {
        ...healthyBase.healthMetrics,
        bloodPressure: { systolic: 142, diastolic: 92 },
      },
    };
    expect(scoreHealth(cust)).toBeGreaterThanOrEqual(15);
  });

  it("adds points for elevated HbA1c", () => {
    const cust: HealthCustomer = {
      ...healthyBase,
      healthMetrics: { ...healthyBase.healthMetrics, hba1c: 6.1 },
    };
    expect(scoreHealth(cust)).toBeGreaterThanOrEqual(15);
  });

  it("adds points for high LDL", () => {
    const cust: HealthCustomer = {
      ...healthyBase,
      healthMetrics: { ...healthyBase.healthMetrics, ldl: 156 },
    };
    expect(scoreHealth(cust)).toBeGreaterThanOrEqual(10);
  });

  it("adds points for current smoking", () => {
    const cust: HealthCustomer = {
      ...healthyBase,
      healthMetrics: { ...healthyBase.healthMetrics, smoking: "current" },
    };
    expect(scoreHealth(cust)).toBeGreaterThanOrEqual(15);
  });

  it("adds points for low step count", () => {
    const cust: HealthCustomer = {
      ...healthyBase,
      healthMetrics: { ...healthyBase.healthMetrics, averageSteps: 4200 },
    };
    expect(scoreHealth(cust)).toBeGreaterThanOrEqual(10);
  });

  it("adds points for short sleep", () => {
    const cust: HealthCustomer = {
      ...healthyBase,
      healthMetrics: { ...healthyBase.healthMetrics, averageSleepHours: 5.4 },
    };
    expect(scoreHealth(cust)).toBeGreaterThanOrEqual(10);
  });

  it("adds points for dependents (non-単身)", () => {
    const cust: HealthCustomer = {
      ...healthyBase,
      family: "配偶者・子 2 人",
    };
    expect(scoreHealth(cust)).toBeGreaterThanOrEqual(10);
  });

  it("clamps to 0-100", () => {
    const bad: HealthCustomer = {
      ...healthyBase,
      family: "配偶者・子 2 人",
      healthMetrics: {
        bmi: 32,
        bloodPressure: { systolic: 160, diastolic: 100 },
        hba1c: 7.2,
        ldl: 180,
        smoking: "current",
        alcoholPerWeek: 10,
        averageSteps: 3000,
        averageSleepHours: 5.0,
      },
    };
    const s = scoreHealth(bad);
    expect(s).toBeLessThanOrEqual(100);
    expect(s).toBeGreaterThan(60);
  });
});

const flatLifestyle: LifestyleCustomer = {
  id: "lf-test",
  name: "テスト",
  age: 30,
  family: "夫婦",
  patternHint: "birth",
  monthlySpending: [
    {
      month: "2026-01",
      food: 60000,
      medicalPharmacy: 8000,
      baby: 0,
      care: 0,
      housing: 90000,
      education: 0,
      investment: 30000,
      insurance: 15000,
    },
    {
      month: "2026-02",
      food: 60000,
      medicalPharmacy: 8000,
      baby: 0,
      care: 0,
      housing: 90000,
      education: 0,
      investment: 30000,
      insurance: 15000,
    },
    {
      month: "2026-03",
      food: 60000,
      medicalPharmacy: 8000,
      baby: 0,
      care: 0,
      housing: 90000,
      education: 0,
      investment: 30000,
      insurance: 15000,
    },
  ],
};

describe("scoreLifestyle", () => {
  it("returns near-zero for a flat spending profile", () => {
    expect(scoreLifestyle(flatLifestyle)).toBeLessThan(15);
  });

  it("adds points when baby spending grows", () => {
    const c: LifestyleCustomer = {
      ...flatLifestyle,
      monthlySpending: flatLifestyle.monthlySpending.map((m, i) => ({
        ...m,
        baby: [0, 8000, 22000][i] ?? 0,
      })),
    };
    expect(scoreLifestyle(c)).toBeGreaterThanOrEqual(25);
  });

  it("adds points when care spending grows", () => {
    const c: LifestyleCustomer = {
      ...flatLifestyle,
      patternHint: "care",
      monthlySpending: flatLifestyle.monthlySpending.map((m, i) => ({
        ...m,
        care: [0, 12000, 26000][i] ?? 0,
      })),
    };
    expect(scoreLifestyle(c)).toBeGreaterThanOrEqual(25);
  });

  it("adds points when housing spending grows", () => {
    const c: LifestyleCustomer = {
      ...flatLifestyle,
      patternHint: "housing",
      monthlySpending: flatLifestyle.monthlySpending.map((m, i) => ({
        ...m,
        housing: [80000, 110000, 180000][i] ?? 0,
      })),
    };
    expect(scoreLifestyle(c)).toBeGreaterThanOrEqual(20);
  });
});

const baseCompany: BusinessCompany = {
  id: "b-test",
  companyName: "テスト株式会社",
  industry: "IT",
  revenueOku: 5,
  operatingProfitOku: 0.5,
  employees: 30,
  averageAge: 36,
  laborCostOku: 1.5,
  turnoverRate: 8,
  welfareCostPerEmployee: 80000,
  hasRetirementPlan: true,
  hasGroupInsurance: true,
  keyPersonDependency: "low",
  notes: "安定基準",
};

describe("scoreBusiness", () => {
  it("returns low for stable company", () => {
    expect(scoreBusiness(baseCompany)).toBeLessThan(20);
  });

  it("adds points for high average age", () => {
    const c: BusinessCompany = { ...baseCompany, averageAge: 47 };
    expect(scoreBusiness(c)).toBeGreaterThanOrEqual(15);
  });

  it("adds points for high turnover", () => {
    const c: BusinessCompany = { ...baseCompany, turnoverRate: 22 };
    expect(scoreBusiness(c)).toBeGreaterThanOrEqual(15);
  });

  it("adds points when no group insurance", () => {
    const c: BusinessCompany = { ...baseCompany, hasGroupInsurance: false };
    expect(scoreBusiness(c)).toBeGreaterThanOrEqual(20);
  });

  it("adds points when no retirement plan", () => {
    const c: BusinessCompany = { ...baseCompany, hasRetirementPlan: false };
    expect(scoreBusiness(c)).toBeGreaterThanOrEqual(15);
  });

  it("adds points for low welfare cost", () => {
    const c: BusinessCompany = { ...baseCompany, welfareCostPerEmployee: 35000 };
    expect(scoreBusiness(c)).toBeGreaterThanOrEqual(15);
  });

  it("adds points for high key person dependency", () => {
    const c: BusinessCompany = { ...baseCompany, keyPersonDependency: "high" };
    expect(scoreBusiness(c)).toBeGreaterThanOrEqual(20);
  });
});

describe("labelForScore", () => {
  it("labels low scores as 安定", () => {
    expect(labelForScore(10)).toBe("安定");
  });

  it("labels medium scores as 要フォロー", () => {
    expect(labelForScore(45)).toBe("要フォロー");
  });

  it("labels high scores as 高い提案機会", () => {
    expect(labelForScore(70)).toBe("高い提案機会");
  });

  it("boundary at 30 -> 要フォロー", () => {
    expect(labelForScore(30)).toBe("要フォロー");
  });

  it("boundary at 65 -> 高い提案機会", () => {
    expect(labelForScore(65)).toBe("高い提案機会");
  });
});
