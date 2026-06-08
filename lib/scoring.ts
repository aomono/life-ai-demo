import type {
  BusinessCompany,
  HealthCustomer,
  LifestyleCustomer,
} from "./types";

const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));

export function scoreHealth(c: HealthCustomer): number {
  const m = c.healthMetrics;
  let s = 0;
  if (m.bloodPressure.systolic >= 140 || m.bloodPressure.diastolic >= 90) s += 15;
  if (m.hba1c >= 6.0) s += 15;
  if (m.ldl >= 140) s += 10;
  if (m.smoking === "current") s += 15;
  if (m.averageSteps < 6000) s += 10;
  if (m.averageSleepHours < 6.0) s += 10;
  if (!c.family.includes("独身") && !c.family.includes("単身")) s += 10;
  if (m.bmi >= 27) s += 5;
  if (m.ldl >= 160) s += 5;
  return clamp(s, 0, 100);
}

function delta(values: number[]): number {
  if (values.length === 0) return 0;
  return values[values.length - 1] - values[0];
}

export function scoreLifestyle(c: LifestyleCustomer): number {
  let s = 0;
  const baby = c.monthlySpending.map((m) => m.baby);
  const care = c.monthlySpending.map((m) => m.care);
  const housing = c.monthlySpending.map((m) => m.housing);
  const education = c.monthlySpending.map((m) => m.education);
  const insurance = c.monthlySpending.map((m) => m.insurance);

  if (delta(baby) >= 10000) s += 25;
  if (delta(care) >= 10000) s += 25;
  if (delta(housing) >= 30000) s += 20;
  if (delta(education) >= 10000) s += 15;
  const insAvg = insurance.reduce((a, b) => a + b, 0) / insurance.length;
  const insFirst = insurance[0] || 0;
  if (insAvg > 0 && Math.abs(insAvg - insFirst) <= insAvg * 0.05) s += 10;
  return clamp(s, 0, 100);
}

export function scoreBusiness(c: BusinessCompany): number {
  let s = 0;
  if (c.averageAge >= 45) s += 15;
  if (c.turnoverRate >= 15) s += 15;
  if (!c.hasGroupInsurance) s += 20;
  if (!c.hasRetirementPlan) s += 15;
  if (c.welfareCostPerEmployee < 50000) s += 15;
  if (c.keyPersonDependency === "high") s += 20;
  if (c.keyPersonDependency === "medium") s += 10;
  return clamp(s, 0, 100);
}

export function labelForScore(score: number): string {
  if (score < 30) return "安定";
  if (score < 65) return "要フォロー";
  return "高い提案機会";
}
