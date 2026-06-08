# Life AI Demo Studio

生命保険会社 (T&D ホールディングス / 富屋さま) 役員プレゼン向けの **AI デモアプリ** です。健康・購買決済・会計 SaaS の 3 領域のダミーデータから、AI が個別化された保険提案・相談仮説を出すプロセスを実際に動くもので体感していただきます。

> 着地予定: 2026-06-12 (金)

---

## 何を見せるアプリか

- トップ画面に **3 つのデモカード** (健康 / 購買決済 / 法人 SaaS)
- 各デモは 3 カラムレイアウト
  - **左**: 入力データ (ダミー)
  - **中央**: AI が読み解いた示唆 + リスクスコア + チャート
  - **右**: 提案アクション + 面談トーク例
- 顧客 / 企業を切り替え、「AI 分析を実行」を押すと結果が出ます
- AI 出力は現状 **モック** (`lib/mockAnalysis.ts`)。`/api/analyze` 経由で後段 LLM 化予定

---

## 起動方法

### 開発サーバ

```bash
cd life-ai-demo
pnpm install      # 初回のみ
pnpm dev          # http://localhost:3000
```

### テスト

スコアリングロジックは Vitest でカバー (TDD)。

```bash
pnpm test
```

### 本番ビルド

```bash
pnpm build
pnpm start
```

---

## ディレクトリ構成

```
life-ai-demo/
  app/
    page.tsx                  トップ (3 デモカード)
    health/page.tsx           Demo 01: 健康データ AI 保険カウンセラー
    lifestyle/page.tsx        Demo 02: 購買・決済 AI ライフイベント検知
    business/page.tsx         Demo 03: 会計 SaaS AI 福利厚生プランナー
    api/analyze/route.ts      LLM 化用 POST stub (現状はモック返却)
  components/
    DemoLayout.tsx            デモ画面共通ヘッダ・コンテナ
    DemoCard.tsx              トップ画面のデモ導線カード
    CustomerSelector.tsx      顧客 / 企業切り替え
    DataPanel.tsx             左カラムのデータ表示
    InsightPanel.tsx          中央の AI 示唆 + Next Questions
    RecommendationPanel.tsx   右カラムの提案アクション + 面談トーク
    RiskScoreCard.tsx         スコアバンド可視化
    HealthMetricChart.tsx     健康指標バーチャート
    SpendingChart.tsx         月次支出ラインチャート
    BusinessMetricChart.tsx   法人 KPI バーチャート
    Disclaimer.tsx            免責テキスト
    ui/Card.tsx, ui/Badge.tsx 最小プリミティブ
  data/
    healthCustomers.json      健康データ 3 人分
    lifestyleCustomers.json   購買決済 3 人分 (出産 / 介護 / 住宅)
    businessCompanies.json    法人 3 社
  lib/
    types.ts                  共通型 (AnalysisResult / 各 Customer 型)
    scoring.ts                スコアリング (TDD)
    scoring.test.ts           Vitest テスト
    mockAnalysis.ts           顧客 ID 別の AI 出力モック
```

---

## 重要な設計方針

- **見せたいのはデータで提案が変わること**。UI 精緻さより、顧客切替時に出力が個別化されることを優先。
- **医療診断 / 保険募集ではない** ことを各画面に明示 (Disclaimer)。AI 出力は「相談仮説」「面談支援」「提案材料」として表示。
- スコアリングは独自指標 (0-100)。閾値: 安定 (<30) / 要フォロー (30-64) / 高い提案機会 (65+)。
- LLM 化はあと付け。`/api/analyze` POST に `{ demo, customerId }` を投げれば AI 結果が返る I/F に統一済み。

---

## 今後の差し替えポイント

1. `lib/mockAnalysis.ts` を実 LLM 呼び出しに差し替え
2. プロンプトを `lib/prompts.ts` に切り出し (デモごとに分離)
3. 顧客プロファイルの本物データ接続 (T&D 側で持っている顧客 ID と join)
4. 商品レコメンドの精緻化 (現状は仮説論点まで)

---

## 注記

本アプリで表示される顧客・企業・分析結果は **すべて架空** です。実在の個人・企業との一致は偶然です。AI 出力は仮説であり、保険商品の販売や医療診断を行うものではありません。
