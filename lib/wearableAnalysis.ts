import { labelForScore } from "./scoring";
import type { AnalysisResult, WearableCustomer } from "./types";

const SCORE: Record<WearableCustomer["id"], number> = {
  "acute-afib": 84,
  "chronic-stress": 58,
  "prodromal-lifestyle": 38,
};

const RESULT_BY_ID: Record<
  WearableCustomer["id"],
  Pick<
    AnalysisResult,
    "overallSummary" | "insights" | "recommendations" | "nextQuestions"
  >
> = {
  "acute-afib": {
    overallSummary:
      "Apple Watch の 30 日データで、過去 2 週間に安静時心拍が +30bpm 上昇 / HRV が半減 / 睡眠時間 2 時間短縮。心房細動 (AFib) を含む循環器イベントの前兆として強く要注意。",
    insights: [
      {
        title: "急性: 安静時心拍 急上昇",
        summary:
          "5/24 以降、安静時心拍が 68 → 102bpm に急上昇。日内変動も大きく、不整脈の可能性を示唆。",
        evidence: [
          "30 日平均: 82bpm (前月平均比 +14bpm)",
          "ピーク: 6/1 102bpm",
          "夜間最低値が以前より 8bpm 高い",
        ],
        riskLevel: "high",
      },
      {
        title: "HRV (RMSSD) が継続的に低下",
        summary:
          "心拍変動が 38ms → 17ms へ。自律神経バランスの著しい乱れ。",
        evidence: ["30 日平均: 27ms", "最低: 17ms (6/1)"],
        riskLevel: "high",
      },
      {
        title: "夜間睡眠の質低下",
        summary: "睡眠時間 6.8h → 4.4h、Sleep Score 78 → 48 と顕著に悪化。",
        evidence: ["30 日平均: 64", "最低: 48 (6/1)"],
        riskLevel: "medium",
      },
    ],
    recommendations: [
      {
        title: "医療相談アシスト (緊急)",
        reason:
          "AFib を含む不整脈の可能性。早期の循環器内科受診で重大イベントを未然に防げる。",
        suggestedAction:
          "提携クリニック「あおぞら循環器内科」のオンライン受診を 24h 以内に予約案内 (本人同意の上)。",
        conversationScript:
          "「心拍データに気になる動きがあったので、循環器の専門医に一度診てもらうとご安心かと思います。提携のクリニックですと最短明日朝のオンライン受診枠が空いておりますが、ご検討いかがでしょうか。」",
      },
      {
        title: "心疾患保障特約の上乗せ提案",
        reason:
          "現在の終身 + 医療では循環器イベント時の一時金が手薄。月額 800-1200 円で 1000 万円の一時金を上乗せ可能。",
        suggestedAction: "三大疾病一時金特約 + 通院給付特約のセット提案",
        conversationScript:
          "「ご体調が回復された後で構いませんが、こういった兆候が出たタイミングで保障の見直しをしておく方が多いです。月額 1000 円弱で大きな安心を足せるプランをご案内できます。」",
      },
      {
        title: "ご家族 (奥様) 同席の次回面談",
        reason:
          "重要な意思決定タイミング。配偶者の理解と協力が必要。",
        suggestedAction: "次回オンライン面談に奥様も同席いただけるよう調整",
        conversationScript:
          "「ご一緒に内容を共有いただいた方がよいかと思いますので、もしご都合つけば奥様もご同席いただけると幸いです。」",
      },
    ],
    nextQuestions: [
      "ご自覚症状 (動悸・息切れ・胸の違和感) はありますか?",
      "直近で大きな生活変化やストレスイベントはありましたか?",
      "現在の医療機関での定期受診状況を教えていただけますか?",
    ],
  },
  "chronic-stress": {
    overallSummary:
      "Apple Watch の 30 日データで、慢性的なストレス指標 (HRV 低下 / 睡眠の質悪化 / 安静時心拍微増) が継続的に出ている。バーンアウト前段階の典型パターン。",
    insights: [
      {
        title: "HRV 持続的低下",
        summary:
          "5/14 から 4 週連続で HRV が 52 → 20ms に低下。慢性ストレスの典型サイン。",
        evidence: ["30 日平均: 32ms", "30 日トレンド: 単調減少"],
        riskLevel: "high",
      },
      {
        title: "睡眠スコア 80 → 42 への悪化",
        summary:
          "Sleep Score が継続的に悪化、睡眠時間も 7.2h → 4.1h に短縮。",
        evidence: ["30 日平均: 60", "夜間中途覚醒回数増加"],
        riskLevel: "high",
      },
      {
        title: "歩数 8400 → 4400 歩へ減少",
        summary:
          "活動量も並行して減少。気力低下のサインの可能性。",
        evidence: ["30 日平均: 6240 歩", "前月比 -28%"],
        riskLevel: "medium",
      },
    ],
    recommendations: [
      {
        title: "提携カウンセリングプログラム (健康増進サービス)",
        reason:
          "バーンアウト・うつ症状の前段階。早期介入で本格的な病気になる前に手を打てる。",
        suggestedAction:
          "提携 EAP「ライフサポート心の相談室」の無料初回カウンセリングを案内",
        conversationScript:
          "「同世代のリードエンジニアの方々で同じパターンが出る方が増えていまして、提携の心理カウンセリングを初回無料でご紹介できます。誰でも気軽に使えるものですので、まずは話を聞いてもらうところからでも。」",
      },
      {
        title: "メンタル特約付き医療保険への切替",
        reason:
          "現在の医療保険にメンタル疾患カバーがない。万一の場合の通院・入院保障を強化。",
        suggestedAction:
          "女性向けメンタル特約 (月額 800 円) 付帯への切替を提案",
        conversationScript:
          "「現在の医療保険に、月額 800 円の特約を 1 つ加えるだけで、メンタル疾患も入院・通院保障の対象に入ります。同世代の女性の利用率が高い人気の特約です。」",
      },
      {
        title: "業務環境改善の声かけ (上司への共有許可)",
        reason:
          "ヘルスサポート担当として「健康データを根拠に上司に業務調整を相談する」サポートが可能。",
        suggestedAction:
          "本人同意の上で会社の人事・産業医に連携できるレポートを作成",
        conversationScript:
          "「ご希望があれば、Apple Watch のデータをもとに人事・産業医にお繋ぎするレポートを作れます。業務調整のご相談にお使いください。」",
      },
    ],
    nextQuestions: [
      "最近の業務量・残業時間はいかがですか?",
      "ご家族とご自身の状態を話せていますか?",
      "気分の落ち込みや興味の喪失を感じることはありますか?",
    ],
  },
  "prodromal-lifestyle": {
    overallSummary:
      "Apple Watch の 30 日データで、生活習慣病の前兆 (歩数 9800 → 3500 歩へ大幅減 / 安静時心拍微増) が見える。今が予防介入のベストタイミング。",
    insights: [
      {
        title: "歩数 9800 → 3500 歩 へ大幅減少",
        summary:
          "30 日で活動量が約 65% 減少。生活習慣病リスクの最大要因。",
        evidence: ["30 日平均: 6320 歩", "終盤 7 日平均: 3650 歩"],
        riskLevel: "medium",
      },
      {
        title: "安静時心拍 微増 + HRV 緩やかに低下",
        summary:
          "安静時心拍が 62 → 76bpm。基礎代謝の低下とストレス耐性悪化のサイン。",
        evidence: ["30 日平均: 69bpm", "30 日 HRV 平均: 34ms"],
        riskLevel: "medium",
      },
      {
        title: "睡眠時間 6.9h → 5.5h",
        summary:
          "睡眠時間と質ともに緩やかに悪化。残業・接待増の影響が示唆される。",
        evidence: ["30 日平均: 6.2h", "Sleep Score 68"],
        riskLevel: "low",
      },
    ],
    recommendations: [
      {
        title: "健康増進プログラム (法人プラン提案)",
        reason:
          "本人だけでなく、商社という業種の中間管理職に共通する課題。法人プラン化の余地。",
        suggestedAction:
          "個人向け Vitality 型プログラム + 法人福利厚生プランの 2 軸提案",
        conversationScript:
          "「個人で歩数目標を達成すると保険料割引が受けられる Vitality 型プランをご案内できます。あわせて、御社の中間管理職向けに法人プラン化のお話もできます。」",
      },
      {
        title: "医療特約に三大疾病カバー追加",
        reason:
          "現在の医療保険は入院日額 7000 円のみで一時金がない。働き盛りで一時金保障が手薄。",
        suggestedAction: "三大疾病一時金 100 万円特約 (月額約 400 円) を提案",
        conversationScript:
          "「現在の医療特約に月額 400 円足すだけで、万が一の三大疾病でまとまった一時金が出るプランに切替できます。お子様の進学費用と重なる時期なので、安心の上乗せとしておすすめです。」",
      },
      {
        title: "次回 6 か月後の経過観察面談",
        reason:
          "予兆段階での介入効果を測定し、必要に応じて追加提案へつなげる。",
        suggestedAction: "6 か月後にもう一度バイタルレビューの面談を設定",
        conversationScript:
          "「半年後に再度データをご一緒に振り返るお時間をいただけると、改善の手応えも見える化できると思います。」",
      },
    ],
    nextQuestions: [
      "出張・接待の頻度に変化はありましたか?",
      "ご自身の健康への意識は最近どう感じていますか?",
      "現在の体重・BMI は前回からどう変化していますか?",
    ],
  },
};

const DISCLAIMER =
  "※ 表示される検知結果は研究用シミュレーションです。医療診断ではありません。実際の体調不調時は速やかに医療機関にご相談ください。";

export function analyzeWearable(c: WearableCustomer): AnalysisResult {
  const score = SCORE[c.id];
  const base = RESULT_BY_ID[c.id];
  return {
    overallSummary: base.overallSummary,
    score,
    scoreLabel: labelForScore(score),
    insights: base.insights,
    recommendations: base.recommendations,
    nextQuestions: base.nextQuestions,
    disclaimer: DISCLAIMER,
  };
}
