import { labelForScore, scoreBusiness, scoreHealth, scoreLifestyle } from "./scoring";
import type {
  AnalysisResult,
  BusinessCompany,
  HealthCustomer,
  LifestyleCustomer,
} from "./types";

const HEALTH_DISCLAIMER =
  "本分析は医療診断や保険募集ではなく、お客さま相談時の参考情報として AI が論点を仮説化したものです。";
const LIFESTYLE_DISCLAIMER =
  "本分析は購買・決済データに基づくライフイベント仮説であり、事実認定や保険募集ではありません。";
const BUSINESS_DISCLAIMER =
  "本分析は経営データに基づく法人向け提案仮説であり、具体的な保険契約の推奨ではありません。";

export function analyzeHealth(c: HealthCustomer): AnalysisResult {
  const score = scoreHealth(c);
  const label = labelForScore(score);
  const m = c.healthMetrics;

  if (c.id === "h001") {
    return {
      overallSummary:
        "中年期の高ストレス・高負荷型ライフスタイルが複数指標に表れています。働き盛りの収入保障と早期介入余地が同時にあり、医療保障の上乗せと就業不能保障の確認が論点候補です。",
      score,
      scoreLabel: label,
      insights: [
        {
          title: "代謝・循環器リスクの複合上昇",
          summary:
            "血圧 142/92・HbA1c 6.1・LDL 156 が同時に基準域超。早期の生活習慣介入で十分改善余地のあるレンジです。",
          evidence: [
            `収縮期 ${m.bloodPressure.systolic} / 拡張期 ${m.bloodPressure.diastolic} mmHg`,
            `HbA1c ${m.hba1c} %`,
            `LDL ${m.ldl} mg/dL`,
          ],
          riskLevel: "high",
        },
        {
          title: "生活習慣負荷の積み重ね",
          summary:
            "喫煙・週 5 飲酒・睡眠 5.6h・歩数 4,200 が複合。心血管・代謝系へのリスクが時間と共に累積する典型パターン。",
          evidence: [
            "喫煙: 現役喫煙",
            `飲酒: 週 ${m.alcoholPerWeek} 回`,
            `睡眠: 平均 ${m.averageSleepHours} h`,
            `歩数: 平均 ${m.averageSteps.toLocaleString()} 歩/日`,
          ],
          riskLevel: "high",
        },
        {
          title: "家計上の保障ギャップ",
          summary:
            "扶養家族 3 名に対し死亡保障 1,500 万・入院日額 5,000 円。子の学齢期と本人健康リスクを踏まえ、就業不能保障の有無の確認余地があります。",
          evidence: [
            "扶養: 配偶者・子 2 人 (12 歳・9 歳)",
            "既契約: 定期死亡 1,500 万 + 医療日額 5,000 円",
            "就業不能保障: 未確認",
          ],
          riskLevel: "medium",
        },
      ],
      recommendations: [
        {
          title: "就業不能・所得補償の論点提示",
          reason:
            "生活習慣病の発症余地が複合しており、長期療養に伴う収入減リスクが顕在化しやすい年代。",
          suggestedAction:
            "現状の傷病手当・既契約での就業不能カバー有無を整理し、不足が見えた段階で所得補償商品の選択肢を提示。",
          conversationScript:
            "「お子さま 2 人が中学・小学校に上がるタイミングですので、もし佐藤さま本人が長期療養になった場合に、家計がどれくらい持つかを一度シミュレーションしておきませんか。」",
        },
        {
          title: "医療保障の入院日額・特約再点検",
          reason:
            "代謝・循環器の数値が複合的に基準域を上回っており、生活習慣病による入院・通院の可能性が中期的に高まる年代。",
          suggestedAction:
            "現契約の入院日額 5,000 円が現実の自己負担と乖離していないか、退院後の通院・先進医療特約のカバー範囲を確認。",
          conversationScript:
            "「いまの医療保険は入院日額 5,000 円ベースですが、ご家族での自己負担イメージと比べて少し細めです。生活習慣病系で長引いた場合の備えを一緒に見直してみませんか。」",
        },
        {
          title: "生活改善プログラム接続",
          reason:
            "保障論点と並行して、健康改善余地が大きい (歩数・睡眠・喫煙)。保険会社の健康増進サービスを面談材料に。",
          suggestedAction:
            "歩数連動の付帯サービス・禁煙支援・睡眠改善コンテンツを面談で提示し、生活側の伴走者ポジションを取る。",
          conversationScript:
            "「数値はまだ介入で動きやすいレンジです。歩数や禁煙の取り組みに連動した付帯サービスもありますので、保障だけでなく改善のほうから一緒に伴走させてください。」",
        },
      ],
      nextQuestions: [
        "直近 1 年で健診結果が悪化した項目はあるか",
        "勤務先の傷病手当金の支給期間・水準を把握しているか",
        "禁煙・運動・睡眠のうち、まず変えやすそうな項目はどれか",
      ],
      disclaimer: HEALTH_DISCLAIMER,
    };
  }

  if (c.id === "h002") {
    return {
      overallSummary:
        "健康指標は安定。育児期の家計負担と将来の教育費・職場復帰後の保障再点検が主な論点候補です。",
      score,
      scoreLabel: label,
      insights: [
        {
          title: "健康指標は良好レンジ",
          summary:
            "BMI 21.4・血圧 112/72・HbA1c 5.3・LDL 102 と全項目が基準域内。当面の医療リスクは低位。",
          evidence: [
            `BMI ${m.bmi}`,
            `BP ${m.bloodPressure.systolic}/${m.bloodPressure.diastolic}`,
            `HbA1c ${m.hba1c}`,
            `LDL ${m.ldl}`,
          ],
          riskLevel: "low",
        },
        {
          title: "育児・職場復帰フェーズの保障論点",
          summary:
            "子 2 歳・時短勤務という生活ステージ。死亡保障・就業不能保障が薄く、配偶者依存度が想定より高い可能性。",
          evidence: [
            "扶養: 配偶者・子 1 人 (2 歳)",
            "既契約: 医療 (日額 5,000 円)・学資 (300 万)",
            "死亡保障: 既契約に含まれず",
          ],
          riskLevel: "medium",
        },
        {
          title: "長期家計の組み立て余地",
          summary:
            "学資保険は導入済だが、教育資金の総額・住宅取得・配偶者万一に対する備えは未整理の可能性。ライフプランからの逆算余地。",
          evidence: [
            "学資: 18 歳満期 300 万",
            "住宅取得状況: 未確認",
            "配偶者保障: 未確認",
          ],
          riskLevel: "low",
        },
      ],
      recommendations: [
        {
          title: "夫婦単位でのライフプラン整理",
          reason:
            "個人の健康は良好だが、家族としての保障構成・教育費・住宅費のバランスは未整理の可能性が高い。",
          suggestedAction:
            "夫婦双方の収入・支出・想定教育費を一枚にまとめた簡易キャッシュフローを次回までに準備。",
          conversationScript:
            "「健康面は今のところとても安定していますので、攻める方の論点として、ご夫婦のキャッシュフローを 1 枚にまとめて、これからの教育費や住宅をどう組み立てるか一緒に考えてみませんか。」",
        },
        {
          title: "医療・女性疾病保障の再点検",
          reason:
            "産後・育児期は女性特有の疾病リスクも論点。現契約のカバー範囲が育児期に最適化されているかを確認。",
          suggestedAction:
            "入院日額 5,000 円が現状の自己負担に対し十分か、女性疾病特約・通院特約の有無を整理。",
          conversationScript:
            "「お子さまがまだ小さい時期は、入院時のサポート体制が論点になりやすいので、いまの医療保険の中身を一度ご一緒に棚卸ししませんか。」",
        },
        {
          title: "復職後の収入保障の選択肢",
          reason:
            "時短勤務 → フルタイム復帰時に世帯収入構造が変わる。復帰後の所得補償・iDeCo / NISA 含む資産形成と一体提案が有効。",
          suggestedAction:
            "復職時期と将来年収の見通しをヒアリングし、保障 + 資産形成セットの仮提案を準備。",
          conversationScript:
            "「将来フルタイム復帰されたタイミングで、保障と一緒に資産形成も含めて見直す方が多いです。ざっくりでよいので復帰の時期感だけ教えてください。」",
        },
      ],
      nextQuestions: [
        "配偶者の保障状況と勤務先の福利厚生はどうなっているか",
        "希望の教育費総額 (大学までのトータル) はどの水準か",
        "復職時期はおおまかにいつ頃を想定しているか",
      ],
      disclaimer: HEALTH_DISCLAIMER,
    };
  }

  return {
    overallSummary:
      "境界域の生活習慣病兆候と、自営業特有の保障空白が同時に存在します。退職金代替・がん・就業不能の論点を統合的に整理する余地があります。",
    score,
    scoreLabel: label,
    insights: [
      {
        title: "代謝指標が境界域に滞留",
        summary:
          "HbA1c 6.4・LDL 148・血圧 136/88 と境界域。年齢的に進行リスクが上振れしやすいレンジ。",
        evidence: [
          `HbA1c ${m.hba1c}`,
          `LDL ${m.ldl}`,
          `BP ${m.bloodPressure.systolic}/${m.bloodPressure.diastolic}`,
        ],
        riskLevel: "high",
      },
      {
        title: "自営業 × 60 歳手前の保障空白",
        summary:
          "終身 1,000 万のみで、医療・がん・就業不能の保障は未整備。傷病手当金等の社保バックアップも限定的。",
        evidence: [
          "既契約: 終身 1,000 万 (払込済) のみ",
          "医療保険: 未加入",
          "業態: 一人法人 (傷病手当金なし)",
        ],
        riskLevel: "high",
      },
      {
        title: "退職金代替・事業承継準備の必要性",
        summary:
          "退職金制度なし。法人契約・経営者保険の検討タイミングであり、相続・事業承継論点と接続できる。",
        evidence: [
          "退職金制度: なし",
          "事業承継: 未整理",
          "相続資産規模: 未確認",
        ],
        riskLevel: "medium",
      },
    ],
    recommendations: [
      {
        title: "がん・医療保障の優先確認",
        reason:
          "現契約は終身死亡のみで医療・がんが未カバー。境界域の指標と年齢が重なり、近年中の医療費発生確率が中位以上。",
        suggestedAction:
          "終身医療 + がん診断一時金を中心に、収入減を意識した三本柱 (医療・がん・所得補償) の論点提示。",
        conversationScript:
          "「いまの保障は終身の死亡保険のみで、医療・がんの備えがほぼ空白の状態です。自営業ですと傷病手当金もありませんので、まずこの部分から一緒に整えませんか。」",
      },
      {
        title: "経営者保険・退職金準備の論点提示",
        reason:
          "退職金制度なし・法人契約の保険なし。事業承継・退職金原資・節税の三方向で論点が立つ。",
        suggestedAction:
          "法人契約の経営者保険 (定期 / 養老) と小規模企業共済の比較材料を準備。次回面談で論点整理。",
        conversationScript:
          "「自営業の方には、退職金代わりに法人で保険を組む選択肢があります。事業承継の話とセットになるので、税理士さんと一緒に整理する機会を作りませんか。」",
      },
      {
        title: "生活習慣の早期介入オファー",
        reason:
          "境界域指標は介入で改善余地大。健康増進サービスの提示で営業接点を継続化。",
        suggestedAction:
          "歩数・体重・血圧連動の付帯サービスを提示し、改善 → 保険料優遇のストーリーで継続接触。",
        conversationScript:
          "「数値はまだ境界域ですので、生活面の取り組みと連動した健康サービスもあわせてご案内できます。半年後に一緒に振り返りませんか。」",
      },
    ],
    nextQuestions: [
      "事業の後継者像と退職時期のイメージはあるか",
      "がん・医療費発生時の事業継続プランは何かあるか",
      "顧問税理士と保険・退職金の話を整理したいか",
    ],
    disclaimer: HEALTH_DISCLAIMER,
  };
}

export function analyzeLifestyle(c: LifestyleCustomer): AnalysisResult {
  const score = scoreLifestyle(c);
  const label = labelForScore(score);
  const m0 = c.monthlySpending[0];
  const mLast = c.monthlySpending[c.monthlySpending.length - 1];

  if (c.patternHint === "birth") {
    return {
      overallSummary:
        "薬局・ベビー用品の急増から、妊娠後期 → 出産前後フェーズのライフイベントが強く示唆されます。出産前後の保障・家計再設計に最適なタイミングです。",
      score,
      scoreLabel: label,
      insights: [
        {
          title: "ベビー用品支出が 0 → 22,000 円へ立ち上がり",
          summary:
            "3 か月でベビー用品が 0 から 22,000 円。出産準備フェーズの典型パターン。",
          evidence: [
            `${m0.month}: ベビー用品 ${m0.baby.toLocaleString()} 円`,
            `${mLast.month}: ベビー用品 ${mLast.baby.toLocaleString()} 円`,
          ],
          riskLevel: "high",
        },
        {
          title: "医療・薬局費の継続増加",
          summary:
            "医療・薬局費が 12,000 → 24,000 円。妊婦健診・関連受診の頻度上昇と整合。",
          evidence: [
            `${m0.month}: 医療薬局 ${m0.medicalPharmacy.toLocaleString()} 円`,
            `${mLast.month}: 医療薬局 ${mLast.medicalPharmacy.toLocaleString()} 円`,
          ],
          riskLevel: "medium",
        },
        {
          title: "投資積立の圧縮 = 家計の優先順位シフト",
          summary:
            "投資が 30,000 → 20,000 円に減少。可処分の使い道が育児準備にシフトしている兆候。",
          evidence: [
            `${m0.month}: 投資 ${m0.investment.toLocaleString()} 円`,
            `${mLast.month}: 投資 ${mLast.investment.toLocaleString()} 円`,
          ],
          riskLevel: "low",
        },
      ],
      recommendations: [
        {
          title: "出産前後の死亡・医療保障再点検",
          reason:
            "扶養家族が増えるタイミング。死亡保障・医療保障が空白なら今が見直しの最適期。",
          suggestedAction:
            "現状の保障内容を棚卸し、扶養が増えた前提での必要保障額を再計算。育児休業中の所得減も加味。",
          conversationScript:
            "「お子さまが生まれる前後は、ご家族のリスク構造が大きく変わる時期です。いまの保障で十分か、一緒に棚卸ししませんか。」",
        },
        {
          title: "学資 / 教育準備のプランニング",
          reason:
            "0 歳〜大学までの教育費総額は約 1,000 万〜2,500 万。早期積立が効率的。",
          suggestedAction:
            "学資保険・NISA・低リスク積立の比較資料を準備し、早期スタートの利点を可視化。",
          conversationScript:
            "「早く始めるほど月々の負担は軽くなります。学資の選択肢を、無理のない範囲で 3 パターンほどお持ちしますね。」",
        },
        {
          title: "配偶者側の保障状況の確認",
          reason:
            "家族が増えるタイミングで、配偶者万一時の備えも論点化しやすい。",
          suggestedAction:
            "配偶者の現在の保障内容を共有してもらい、夫婦単位での保障バランスを整理。",
          conversationScript:
            "「ご夫婦両方の保障を並べると、お互いに何かあったときに足りるかが見やすくなります。次回までにお持ちいただけますか。」",
        },
      ],
      nextQuestions: [
        "ご出産の予定時期はいつ頃か",
        "育児休業中の所得イメージはどの水準か",
        "教育費のゴール (大学までの総額) で意識している水準はあるか",
      ],
      disclaimer: LIFESTYLE_DISCLAIMER,
    };
  }

  if (c.patternHint === "care") {
    return {
      overallSummary:
        "介護用品・医療薬局費の継続増加から、ご家族の介護フェーズへの移行が強く示唆されます。介護期家計の備えとサポート保障の論点提示余地。",
      score,
      scoreLabel: label,
      insights: [
        {
          title: "介護用品支出の段階的増加",
          summary:
            "介護関連が 4,000 → 32,000 円。要介護度の進行 or 在宅介護シフトと整合する動き。",
          evidence: [
            `${m0.month}: 介護 ${m0.care.toLocaleString()} 円`,
            `${mLast.month}: 介護 ${mLast.care.toLocaleString()} 円`,
          ],
          riskLevel: "high",
        },
        {
          title: "医療・薬局費の同時増加",
          summary:
            "医療薬局費も 14,000 → 28,000 円。受診頻度・処方の増加と整合。",
          evidence: [
            `${m0.month}: 医療薬局 ${m0.medicalPharmacy.toLocaleString()} 円`,
            `${mLast.month}: 医療薬局 ${mLast.medicalPharmacy.toLocaleString()} 円`,
          ],
          riskLevel: "medium",
        },
        {
          title: "投資余力の圧迫",
          summary:
            "投資が 25,000 → 12,000 円。介護出費が他項目を圧迫し始めるフェーズ。",
          evidence: [
            `${m0.month}: 投資 ${m0.investment.toLocaleString()} 円`,
            `${mLast.month}: 投資 ${mLast.investment.toLocaleString()} 円`,
          ],
          riskLevel: "medium",
        },
      ],
      recommendations: [
        {
          title: "介護一時金・介護年金保障の論点提示",
          reason:
            "介護期の家計負担は長期化しやすく、家計貯蓄を直撃。介護保険の有無を最初に確認したい。",
          suggestedAction:
            "公的介護保険のカバー範囲と私的補完の必要額を整理。在宅介護の場合の月額シミュレーションを用意。",
          conversationScript:
            "「介護の費用は数年単位で見ると大きくなります。公的介護でカバーできる範囲と、ご家族で備えておく範囲を分けてご説明させてください。」",
        },
        {
          title: "本人の医療・がん保障再点検",
          reason:
            "介護をするご本人 (49 歳) の健康論点も同時に重要。介護離職リスクも視野に。",
          suggestedAction:
            "ご本人の医療・がん保障の状況を確認し、介護期に体調不良が重なった場合のリスクを整理。",
          conversationScript:
            "「介護をされる側のご本人のリスクは見落とされがちです。中村さま自身の保障も、この機会に一緒に確認させてください。」",
        },
        {
          title: "教育費・住宅ローンとのバランス再設計",
          reason:
            "教育費 56,000 円が並走している家計。介護費が長期化した場合の収支バランス再設計が論点。",
          suggestedAction:
            "教育費・住宅費・介護費を一枚に並べ、長期シミュレーションを共有。",
          conversationScript:
            "「ご家計は教育費と介護費を同時に背負う形になります。長期で見渡せる一枚図を作ってご相談しましょう。」",
        },
      ],
      nextQuestions: [
        "ご実母の要介護度・在宅 / 施設の方針はどちらか",
        "介護への支出はあと何年継続する見込みか",
        "中村さま自身の傷病・就業不能時の備えは整っているか",
      ],
      disclaimer: LIFESTYLE_DISCLAIMER,
    };
  }

  return {
    overallSummary:
      "住宅関連支出の急増から、住宅取得 (購入・引越し・リフォーム) のイベントが示唆されます。団信・住宅ローン連動の保障論点が立てやすいタイミング。",
    score,
    scoreLabel: label,
    insights: [
      {
        title: "住宅関連支出の急増",
        summary:
          "住宅関連が 95,000 → 158,000 円。住宅取得・引越しに伴う一時負担と整合する動き。",
        evidence: [
          `${m0.month}: 住宅 ${m0.housing.toLocaleString()} 円`,
          `${mLast.month}: 住宅 ${mLast.housing.toLocaleString()} 円`,
        ],
        riskLevel: "high",
      },
      {
        title: "投資余力の圧縮",
        summary:
          "投資積立が 35,000 → 18,000 円。住宅支出が家計の他項目を圧迫。",
        evidence: [
          `${m0.month}: 投資 ${m0.investment.toLocaleString()} 円`,
          `${mLast.month}: 投資 ${mLast.investment.toLocaleString()} 円`,
        ],
        riskLevel: "low",
      },
      {
        title: "保険料水準は据え置き",
        summary:
          "保険料 18,000 円が横ばい。住宅取得後の保障再設計が未着手の可能性。",
        evidence: [
          `${m0.month}: 保険料 ${m0.insurance.toLocaleString()} 円`,
          `${mLast.month}: 保険料 ${mLast.insurance.toLocaleString()} 円`,
        ],
        riskLevel: "medium",
      },
    ],
    recommendations: [
      {
        title: "団信・住宅ローン関連保障の整理",
        reason:
          "住宅ローン保有時の万一は、団信でどこまでカバーされ、何が残るかが論点。",
        suggestedAction:
          "団信の保障範囲 (疾病団信・がん団信) と既契約死亡保険の重複・不足を整理。",
        conversationScript:
          "「住宅ローンが入ったタイミングは、保障の全体像が一度大きく変わります。団信でカバーされる部分とそれ以外を一緒に切り分けましょう。」",
      },
      {
        title: "就業不能保障の論点提示",
        reason:
          "住宅ローン継続支払のため、長期療養時の所得保障の必要性が高まる。",
        suggestedAction:
          "ローン返済期間に合わせた就業不能・所得補償の選択肢を提示。",
        conversationScript:
          "「ローンが続く間に長期療養になった場合の備えが、住宅購入直後はとても重要になります。所得補償を一緒に検討してみませんか。」",
      },
      {
        title: "家計簿リセットと保障 / 投資の再配分",
        reason:
          "住宅取得後の家計バランスが変わる。保険料・投資の配分見直しの好機。",
        suggestedAction:
          "住宅取得後 6 か月後を目処に家計再点検 → 保障 / 投資の配分を提案。",
        conversationScript:
          "「半年後くらいに、住宅取得後の家計が落ち着いた状態でもう一度全体を見直しませんか。投資と保険のバランスもそこで決めましょう。」",
      },
    ],
    nextQuestions: [
      "ローン残高・返済期間はおおまかにどの水準か",
      "団信の特約 (がん・三大疾病) は付帯しているか",
      "教育費・住宅費の将来バランスはイメージできているか",
    ],
    disclaimer: LIFESTYLE_DISCLAIMER,
  };
}

export function analyzeBusiness(c: BusinessCompany): AnalysisResult {
  const score = scoreBusiness(c);
  const label = labelForScore(score);

  if (c.id === "b001") {
    return {
      overallSummary:
        "高齢化した熟練社員依存・福利厚生未整備の典型的な中小製造業。経営者保険・退職金代替・団体保障の三方向で論点提示余地が大きい先。",
      score,
      scoreLabel: label,
      insights: [
        {
          title: "従業員構成の高齢化リスク",
          summary:
            "平均年齢 46.8 歳、熟練工依存高。今後 10 年で 40% 程度の自然減リスクが見込まれる。",
          evidence: [
            `平均年齢 ${c.averageAge} 歳`,
            `キーパーソン依存: ${c.keyPersonDependency}`,
            "事業承継候補: 社長次男のみ",
          ],
          riskLevel: "high",
        },
        {
          title: "福利厚生・退職金制度の手薄さ",
          summary:
            "退職金制度なし・団体保険なし・福利厚生費 48k 円/人 は同業平均比で低水準。",
          evidence: [
            "退職金制度: なし",
            "団体保険: なし",
            `福利厚生費: ${c.welfareCostPerEmployee.toLocaleString()} 円/人`,
          ],
          riskLevel: "high",
        },
        {
          title: "経営者保障 / 事業承継の空白",
          summary:
            "経営者万一時の事業継続資金、事業承継時の株式評価対策が未整備の可能性。",
          evidence: [
            "経営者保険: 未確認",
            "後継者: 社長次男 (38 歳・部長)",
            "事業承継準備: 未確認",
          ],
          riskLevel: "high",
        },
      ],
      recommendations: [
        {
          title: "経営者保険による退職金代替・事業継続資金準備",
          reason:
            "退職金制度なし・経営者万一時の事業継続資金が手薄。法人契約による準備が王道の論点。",
          suggestedAction:
            "経営者退職金原資 + 万一時の運転資金確保を目的とした法人契約 (定期・養老) の提案を準備。",
          conversationScript:
            "「社長ご自身の退職金原資と、万一の際の運転資金を、法人契約で一体的に準備する方法をご紹介させてください。」",
        },
        {
          title: "従業員向け団体保険・所得補償の導入",
          reason:
            "団体保険なし・退職金なしのため、福利厚生強化が採用 / 定着上のレバレッジになる。",
          suggestedAction:
            "団体定期・団体医療・所得補償の導入パッケージと、追加コスト試算を準備。",
          conversationScript:
            "「採用・定着の差別化として、団体保険の導入は費用対効果が高い領域です。月々の負担イメージと合わせてご説明させてください。」",
        },
        {
          title: "事業承継・株式対策の論点提示",
          reason:
            "事業承継候補が社長次男に集中。株式評価・相続対策が未着手なら早期論点化に値する。",
          suggestedAction:
            "顧問税理士同席の場を提案し、事業承継 + 法人保険のセットで論点整理。",
          conversationScript:
            "「事業承継は税理士さんと一緒に整理するのが効率的です。法人保険を含めて、一度三者で整理する場を作りませんか。」",
        },
      ],
      nextQuestions: [
        "ご自身の退職時期と退職金イメージはあるか",
        "事業承継先 (息子さま) への株式移転計画はあるか",
        "団体保険導入の社内合意は取りやすいか",
      ],
      disclaimer: BUSINESS_DISCLAIMER,
    };
  }

  if (c.id === "b002") {
    return {
      overallSummary:
        "高離職率 × 介護業界の典型的な労務負荷 = 採用定着論点が経営課題。所得補償・メンタル支援を福利厚生として打ち出す余地が大きい先。",
      score,
      scoreLabel: label,
      insights: [
        {
          title: "離職率 22% — 業界平均超",
          summary:
            "業界平均 16% に対し 22%。1 名あたり採用コストを掛けると年 1,200 万規模の流出。",
          evidence: [
            `離職率 ${c.turnoverRate}%`,
            `従業員 ${c.employees} 名`,
            "業界平均比 +6pt",
          ],
          riskLevel: "high",
        },
        {
          title: "福利厚生費は同業低位",
          summary:
            "福利厚生費 32k 円/人 は同業平均比で低水準。退職金制度もなく、定着インセンティブが弱い。",
          evidence: [
            `福利厚生費 ${c.welfareCostPerEmployee.toLocaleString()} 円/人`,
            "退職金制度: なし",
            "団体保険: あり (内容未確認)",
          ],
          riskLevel: "medium",
        },
        {
          title: "腰痛・メンタルによる労務負荷",
          summary:
            "業務特性上、腰痛・メンタル不調による休職リスクが高い。所得補償の論点としては最適。",
          evidence: [
            "業務: 訪問介護 5 拠点",
            "休職要因: 腰痛・メンタル散発",
            "所得補償: 未確認",
          ],
          riskLevel: "high",
        },
      ],
      recommendations: [
        {
          title: "所得補償付き団体保険への切替",
          reason:
            "既存団体保険があるが、所得補償 (GLTD) を含むかが要確認。介護現場の休職リスクと最適にフィット。",
          suggestedAction:
            "既存契約の内容棚卸し → 所得補償特約付加 or 切替の提案を準備。",
          conversationScript:
            "「訪問介護の現場では腰痛・メンタル不調による休職が大きな経営課題ですよね。所得補償をセットにした団体保険で、現場の安心を底上げできます。」",
        },
        {
          title: "退職金制度設計支援",
          reason:
            "退職金制度がなく定着インセンティブが弱い。中退共・選択型 DC との比較で論点化できる。",
          suggestedAction:
            "中退共・選択制 DC・養老保険 (ハーフタックス) の三択比較を準備。",
          conversationScript:
            "「定着のレバレッジとして退職金制度の設計余地があります。中退共・DC・養老の比較で、青葉さまに合う形を一緒に検討しましょう。」",
        },
        {
          title: "従業員向け健康増進・メンタル支援連携",
          reason:
            "メンタル不調が散発しているため、EAP (従業員支援プログラム) + 健康増進サービスのセット提案が刺さる。",
          suggestedAction:
            "保険会社の付帯サービス (EAP・健康相談 24h) の比較を整理。",
          conversationScript:
            "「保険の付帯サービスに、24 時間の健康相談やメンタル相談を含められるものがあります。福利厚生として打ち出せます。」",
        },
      ],
      nextQuestions: [
        "既存団体保険の保障内容は所得補償を含むか",
        "退職金制度導入の社内合意は取りやすいか",
        "EAP 等のメンタルケア施策を導入しているか",
      ],
      disclaimer: BUSINESS_DISCLAIMER,
    };
  }

  return {
    overallSummary:
      "急成長フェーズのテック企業。福利厚生は手厚いが団体保険の整備は未着手。採用競争上の差別化と若手定着の観点で論点提示余地。",
    score,
    scoreLabel: label,
    insights: [
      {
        title: "団体保険未整備 — 採用競争上のギャップ",
        summary:
          "福利厚生費 86k 円/人 と高水準。一方で団体保険がなく、競合 IT 企業比で見劣りする要素。",
        evidence: [
          `福利厚生費 ${c.welfareCostPerEmployee.toLocaleString()} 円/人`,
          "団体保険: なし",
          "退職金制度: あり",
        ],
        riskLevel: "medium",
      },
      {
        title: "離職率 16% — IT 業界としては中位",
        summary:
          "業界平均 13-15% に対し 16%。エンジニア競争激化を踏まえると更に上昇余地あり。",
        evidence: [
          `離職率 ${c.turnoverRate}%`,
          "業界平均: 13-15%",
          "リファラル採用比率高",
        ],
        riskLevel: "medium",
      },
      {
        title: "成長期 × 経営者保障の検討余地",
        summary:
          "急成長フェーズ × 経営者保障の整備状況が論点。万一時の事業継続・キーパーソンリスクの対策が手薄な可能性。",
        evidence: [
          "営業利益 2.1 億 (成長フェーズ)",
          "キーパーソン依存: medium",
          "経営者保険: 未確認",
        ],
        riskLevel: "medium",
      },
    ],
    recommendations: [
      {
        title: "団体定期 + 団体医療の導入提案",
        reason:
          "福利厚生は手厚い一方、保障系の整備が空白。エンジニア採用上のアピールにつながる。",
        suggestedAction:
          "団体定期保険 + 団体医療のセット提案、競合 IT 企業の福利厚生比較資料を整理。",
        conversationScript:
          "「ネクストリンクさまの福利厚生は手厚いですが、保障系が一段空白です。採用面接で響くポイントになりますので、団体保険の導入をご提案させてください。」",
      },
      {
        title: "キーパーソン保険 (役員保障) の論点提示",
        reason:
          "急成長フェーズの経営リスク。CEO / CTO 万一時の事業継続資金準備が論点。",
        suggestedAction:
          "役員向けキーパーソン保険の試算を準備。VC 投資先によくある事例として説明。",
        conversationScript:
          "「成長フェーズのスタートアップでよく入る、キーパーソン保険があります。投資家から見ても事業継続性のサインになります。」",
      },
      {
        title: "選択制企業年金 / DC との連携",
        reason:
          "若手中心の従業員層に対し、年金・資産形成系の福利厚生は刺さる。",
        suggestedAction:
          "DC・iDeCo+ との連携プランを整理し、保険商品と組み合わせた提案を準備。",
        conversationScript:
          "「20-30 代エンジニアに刺さる福利厚生として、年金・資産形成系を一緒にセットアップしませんか。」",
      },
    ],
    nextQuestions: [
      "経営者・主要役員の保障状況はどうか",
      "投資家 / 取締役会からの福利厚生に対する期待はあるか",
      "DC / iDeCo+ の導入状況はどうか",
    ],
    disclaimer: BUSINESS_DISCLAIMER,
  };
}
