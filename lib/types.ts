export type RiskLevel = "low" | "medium" | "high";

export type AIInsight = {
  title: string;
  summary: string;
  evidence: string[];
  riskLevel: RiskLevel;
};

export type Recommendation = {
  title: string;
  reason: string;
  suggestedAction: string;
  conversationScript: string;
};

export type AnalysisResult = {
  overallSummary: string;
  score: number;
  scoreLabel: string;
  insights: AIInsight[];
  recommendations: Recommendation[];
  nextQuestions: string[];
  disclaimer: string;
};

export type ExistingPolicy = {
  type: string;
  monthlyPremium: number;
  coverageSummary: string;
};

export type HealthMetrics = {
  bmi: number;
  bloodPressure: { systolic: number; diastolic: number };
  hba1c: number;
  ldl: number;
  smoking: "never" | "past" | "current";
  alcoholPerWeek: number;
  averageSteps: number;
  averageSleepHours: number;
};

export type HealthCustomer = {
  id: string;
  name: string;
  age: number;
  gender: "male" | "female";
  family: string;
  occupation: string;
  existingPolicies: ExistingPolicy[];
  healthMetrics: HealthMetrics;
};

export type MonthlySpending = {
  month: string;
  food: number;
  medicalPharmacy: number;
  baby: number;
  care: number;
  housing: number;
  education: number;
  investment: number;
  insurance: number;
};

export type LifestyleCustomer = {
  id: string;
  name: string;
  age: number;
  family: string;
  patternHint: "birth" | "care" | "housing";
  monthlySpending: MonthlySpending[];
};

export type BusinessCompany = {
  id: string;
  companyName: string;
  industry: string;
  revenueOku: number;
  operatingProfitOku: number;
  employees: number;
  averageAge: number;
  laborCostOku: number;
  turnoverRate: number;
  welfareCostPerEmployee: number;
  hasRetirementPlan: boolean;
  hasGroupInsurance: boolean;
  keyPersonDependency: "low" | "medium" | "high";
  notes: string;
};
