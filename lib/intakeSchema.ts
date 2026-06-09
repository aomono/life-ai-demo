import type {
  BusinessCompany,
  HealthCustomer,
  LifestyleCustomer,
  MonthlySpending,
} from "@/lib/types";

export type IntakeField = {
  key: string;
  label: string;
  placeholder?: string;
};

export type IntakeSection = {
  title: string;
  fields: IntakeField[];
};

export type IntakeValues = Record<string, string>;

export type IntakeSchema = {
  partner: {
    name: string;
    note: string;
    excelSheet: string;
  };
  sections: IntakeSection[];
};

const yen = (n: number) => `${n.toLocaleString()} 円`;
const pct = (n: number) => `${n}%`;
const oku = (n: number) => `${n.toFixed(1)} 億円`;

export const healthIntakeSchema: IntakeSchema = {
  partner: {
    name: "全国健康保険組合連合会 (架空)",
    note: "健診結果 + ウェアラブル + 通院履歴を匿名 ID で連携",
    excelSheet: "kenpo_HC_data_2026Q2.xlsx",
  },
  sections: [
    {
      title: "基本情報",
      fields: [
        { key: "name", label: "氏名" },
        { key: "age", label: "年齢" },
        { key: "gender", label: "性別" },
        { key: "occupation", label: "職業" },
        { key: "family", label: "家族構成" },
      ],
    },
    {
      title: "バイタル・身体計測",
      fields: [
        { key: "heightCm", label: "身長" },
        { key: "weightKg", label: "体重" },
        { key: "bmi", label: "BMI" },
        { key: "bpSys", label: "収縮期血圧" },
        { key: "bpDia", label: "拡張期血圧" },
        { key: "restingHr", label: "安静時心拍" },
      ],
    },
    {
      title: "血液検査",
      fields: [
        { key: "hba1c", label: "HbA1c" },
        { key: "ldl", label: "LDL コレステロール" },
        { key: "hdl", label: "HDL コレステロール" },
        { key: "triglyceride", label: "中性脂肪" },
        { key: "ast", label: "AST (GOT)" },
        { key: "alt", label: "ALT (GPT)" },
        { key: "ggt", label: "γ-GTP" },
      ],
    },
    {
      title: "生活習慣 (ウェアラブル + 問診)",
      fields: [
        { key: "smoking", label: "喫煙状態" },
        { key: "alcohol", label: "飲酒頻度" },
        { key: "averageSteps", label: "平均歩数 / 日" },
        { key: "averageSleep", label: "平均睡眠時間" },
        { key: "exerciseHabit", label: "運動習慣" },
        { key: "stressScore", label: "ストレス指数" },
      ],
    },
    {
      title: "通院・既往",
      fields: [
        { key: "pastConditions", label: "既往歴" },
        { key: "currentMedication", label: "服薬中" },
        { key: "lastCheckup", label: "直近健診日" },
        { key: "existingPolicies", label: "既加入保険" },
      ],
    },
  ],
};

const HEALTH_PROFILES: Record<string, Partial<IntakeValues>> = {
  h001: {
    heightCm: "172 cm",
    weightKg: "82.3 kg",
    restingHr: "78 bpm",
    hdl: "42 mg/dL",
    triglyceride: "188 mg/dL",
    ast: "32 U/L",
    alt: "44 U/L",
    ggt: "68 U/L",
    exerciseHabit: "ほぼなし (週 0 回)",
    stressScore: "6 / 10 (やや高)",
    pastConditions: "なし (健診で要観察通知あり)",
    currentMedication: "なし",
    lastCheckup: "2026-04-12",
  },
  h002: {
    heightCm: "162 cm",
    weightKg: "56.2 kg",
    restingHr: "66 bpm",
    hdl: "68 mg/dL",
    triglyceride: "78 mg/dL",
    ast: "18 U/L",
    alt: "16 U/L",
    ggt: "22 U/L",
    exerciseHabit: "週 1 回 (ヨガ)",
    stressScore: "5 / 10",
    pastConditions: "出産 (2024 年・帝王切開)",
    currentMedication: "なし",
    lastCheckup: "2026-03-08",
  },
  h003: {
    heightCm: "168 cm",
    weightKg: "73.0 kg",
    restingHr: "72 bpm",
    hdl: "48 mg/dL",
    triglyceride: "162 mg/dL",
    ast: "36 U/L",
    alt: "42 U/L",
    ggt: "78 U/L",
    exerciseHabit: "週 1 回 (現場作業による軽い運動)",
    stressScore: "7 / 10 (一人法人で代替不能)",
    pastConditions: "胃ポリープ切除 (2022 年)",
    currentMedication: "降圧剤 (アムロジピン 5mg)",
    lastCheckup: "2026-02-20",
  },
};

export function mapHealthToIntake(c: HealthCustomer): IntakeValues {
  const m = c.healthMetrics;
  const synth = HEALTH_PROFILES[c.id] ?? {};
  const policies =
    c.existingPolicies
      .map((p) => `${p.type} (月 ${p.monthlyPremium.toLocaleString()} 円)`)
      .join(" / ") || "—";
  return {
    name: c.name,
    age: `${c.age} 歳`,
    gender: c.gender === "male" ? "男性" : "女性",
    occupation: c.occupation,
    family: c.family,
    bmi: String(m.bmi),
    bpSys: `${m.bloodPressure.systolic} mmHg`,
    bpDia: `${m.bloodPressure.diastolic} mmHg`,
    hba1c: `${m.hba1c} %`,
    ldl: `${m.ldl} mg/dL`,
    smoking:
      m.smoking === "current"
        ? "現役喫煙 (15 本/日)"
        : m.smoking === "past"
          ? "過去喫煙 (2018 年禁煙)"
          : "非喫煙",
    alcohol: `週 ${m.alcoholPerWeek} 回`,
    averageSteps: `${m.averageSteps.toLocaleString()} 歩`,
    averageSleep: `${m.averageSleepHours} h`,
    existingPolicies: policies,
    ...synth,
  };
}

export const lifestyleIntakeSchema: IntakeSchema = {
  partner: {
    name: "あおぞらネット銀行 (架空) + 主要決済 SaaS",
    note: "口座・カード・電子マネー履歴を本人同意下でカテゴリ別集計",
    excelSheet: "bank_aozora_tx_2026Q2.xlsx",
  },
  sections: [
    {
      title: "基本情報",
      fields: [
        { key: "name", label: "氏名" },
        { key: "age", label: "年齢" },
        { key: "family", label: "世帯構成" },
        { key: "incomeBand", label: "世帯年収帯 (推計)" },
        { key: "takehomePerMonth", label: "月次手取り (中央値)" },
      ],
    },
    {
      title: "住居・固定費",
      fields: [
        { key: "housing", label: "住宅関連支出 (最新月)" },
        { key: "housingType", label: "住居形態" },
        { key: "mortgage", label: "住宅ローン残債" },
        { key: "utilities", label: "光熱・通信 (合算)" },
      ],
    },
    {
      title: "ライフイベント感応カテゴリ (直近 3 ヶ月推移)",
      fields: [
        { key: "babyTrend", label: "ベビー用品" },
        { key: "careTrend", label: "介護用品・サービス" },
        { key: "educationTrend", label: "教育・学習" },
        { key: "medicalTrend", label: "医療・薬局" },
        { key: "housingTrend", label: "住宅関連推移" },
      ],
    },
    {
      title: "資産形成・保障",
      fields: [
        { key: "investmentTrend", label: "投資積立" },
        { key: "insuranceTrend", label: "保険料引き落とし" },
        { key: "savingsBalance", label: "預金残高 (中央値)" },
        { key: "creditUtilization", label: "クレジット枠利用率" },
      ],
    },
    {
      title: "シグナル",
      fields: [
        { key: "recentBigTransaction", label: "直近 30 日の大口決済" },
        { key: "lifeEventHypothesis", label: "推定ライフイベント" },
      ],
    },
  ],
};

const LIFESTYLE_PROFILES: Record<string, Partial<IntakeValues>> = {
  l001: {
    incomeBand: "650 - 800 万円",
    takehomePerMonth: "412,000 円",
    housingType: "賃貸マンション (3LDK)",
    mortgage: "なし",
    utilities: "31,500 円",
    savingsBalance: "820,000 円",
    creditUtilization: "38%",
    recentBigTransaction: "産婦人科 ¥48,200 / ベビー用品店 ¥31,400",
    lifeEventHypothesis: "第一子出産直前 (3-4 ヶ月以内)",
  },
  l002: {
    incomeBand: "950 - 1,200 万円 (共働き)",
    takehomePerMonth: "624,000 円",
    housingType: "持ち家 (戸建・ローン残)",
    mortgage: "1,820 万円 (残 11 年)",
    utilities: "44,200 円",
    savingsBalance: "2,140,000 円",
    creditUtilization: "27%",
    recentBigTransaction: "訪問介護サービス ¥28,000 / 介護ベッド ¥86,000",
    lifeEventHypothesis: "親の要介護度上昇 (要支援 2 → 要介護 1-2 移行期)",
  },
  l003: {
    incomeBand: "780 - 920 万円",
    takehomePerMonth: "498,000 円",
    housingType: "新築戸建 (購入 2026/04)",
    mortgage: "4,260 万円 (35 年)",
    utilities: "28,800 円",
    savingsBalance: "640,000 円",
    creditUtilization: "62%",
    recentBigTransaction: "住宅ローン ¥158,000 / 引越業者 ¥272,000",
    lifeEventHypothesis: "住宅購入直後 (家計再構築局面)",
  },
};

function trendLabel(values: number[]): string {
  if (!values.length) return "—";
  const fmt = values.map((v) => `${(v / 1000).toFixed(0)}k`).join(" → ");
  const delta = values[values.length - 1] - values[0];
  const sign = delta >= 0 ? "+" : "−";
  return `${fmt} (${sign}${Math.abs(delta).toLocaleString()} 円)`;
}

export function mapLifestyleToIntake(c: LifestyleCustomer): IntakeValues {
  const synth = LIFESTYLE_PROFILES[c.id] ?? {};
  const months = c.monthlySpending;
  const latest: MonthlySpending = months[months.length - 1];
  const valueOf = (k: keyof MonthlySpending) =>
    months.map((m) => Number(m[k]) || 0);
  return {
    name: c.name,
    age: `${c.age} 歳`,
    family: c.family,
    housing: yen(latest.housing),
    babyTrend: trendLabel(valueOf("baby")),
    careTrend: trendLabel(valueOf("care")),
    educationTrend: trendLabel(valueOf("education")),
    medicalTrend: trendLabel(valueOf("medicalPharmacy")),
    housingTrend: trendLabel(valueOf("housing")),
    investmentTrend: trendLabel(valueOf("investment")),
    insuranceTrend: trendLabel(valueOf("insurance")),
    ...synth,
  };
}

export const businessIntakeSchema: IntakeSchema = {
  partner: {
    name: "freee 連携 (架空) + 商工リサーチ",
    note: "会計データ・人事 KPI・業界ベンチマークを集約",
    excelSheet: "saas_freee_corp_profile_2026Q2.xlsx",
  },
  sections: [
    {
      title: "企業基本情報",
      fields: [
        { key: "companyName", label: "会社名" },
        { key: "industry", label: "業種" },
        { key: "foundedYear", label: "設立" },
        { key: "headquarters", label: "本社所在地" },
        { key: "employees", label: "従業員数" },
      ],
    },
    {
      title: "財務 KPI (直近期)",
      fields: [
        { key: "revenue", label: "売上高" },
        { key: "operatingProfit", label: "営業利益" },
        { key: "laborCost", label: "人件費総額" },
        { key: "profitTrend", label: "営業利益推移 (3 期)" },
        { key: "ytdGrowth", label: "売上 YoY" },
      ],
    },
    {
      title: "人事プロファイル",
      fields: [
        { key: "averageAge", label: "平均年齢" },
        { key: "averageTenure", label: "平均勤続年数" },
        { key: "femaleRatio", label: "女性比率" },
        { key: "turnoverRate", label: "離職率" },
        { key: "healthCheckupRate", label: "健診受診率" },
      ],
    },
    {
      title: "既存制度",
      fields: [
        { key: "welfareCost", label: "福利厚生費 / 人" },
        { key: "retirementPlan", label: "退職金制度" },
        { key: "groupInsurance", label: "団体保険" },
        { key: "dcPension", label: "確定拠出年金" },
      ],
    },
    {
      title: "シグナル",
      fields: [
        { key: "keyPerson", label: "キーパーソン依存度" },
        { key: "notes", label: "信用調査メモ" },
      ],
    },
  ],
};

const BUSINESS_PROFILES: Record<string, Partial<IntakeValues>> = {
  b001: {
    foundedYear: "1988 年 (38 期)",
    headquarters: "大阪府 東大阪市",
    averageTenure: "14.2 年",
    femaleRatio: "11%",
    healthCheckupRate: "92%",
    profitTrend: "0.4 → 0.5 → 0.6 億円",
    ytdGrowth: "+3.8%",
    dcPension: "未導入",
  },
  b002: {
    foundedYear: "2005 年 (21 期)",
    headquarters: "千葉県 柏市",
    averageTenure: "5.8 年",
    femaleRatio: "78%",
    healthCheckupRate: "74%",
    profitTrend: "0.22 → 0.20 → 0.18 億円",
    ytdGrowth: "+2.1%",
    dcPension: "未導入",
  },
  b003: {
    foundedYear: "2017 年 (9 期)",
    headquarters: "東京都 渋谷区",
    averageTenure: "3.4 年",
    femaleRatio: "32%",
    healthCheckupRate: "86%",
    profitTrend: "1.4 → 1.8 → 2.1 億円",
    ytdGrowth: "+24.7%",
    dcPension: "導入済 (拠出上限 27,500 円)",
  },
};

export function mapBusinessToIntake(c: BusinessCompany): IntakeValues {
  const synth = BUSINESS_PROFILES[c.id] ?? {};
  return {
    companyName: c.companyName,
    industry: c.industry,
    employees: `${c.employees} 名`,
    revenue: oku(c.revenueOku),
    operatingProfit: oku(c.operatingProfitOku),
    laborCost: oku(c.laborCostOku),
    averageAge: `${c.averageAge} 歳`,
    turnoverRate: pct(c.turnoverRate),
    welfareCost: `${c.welfareCostPerEmployee.toLocaleString()} 円 / 年`,
    retirementPlan: c.hasRetirementPlan ? "あり" : "なし",
    groupInsurance: c.hasGroupInsurance ? "加入" : "未加入",
    keyPerson:
      c.keyPersonDependency === "high"
        ? "高 (後継候補 1 名のみ)"
        : c.keyPersonDependency === "medium"
          ? "中"
          : "低",
    notes: c.notes,
    ...synth,
  };
}
