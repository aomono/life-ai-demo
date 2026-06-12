# Session Log — Life AI Demo Studio Demo 04 & 05 出荷

**日時:** 2026-06-10 〜 2026-06-11 (JST)
**担当モデル:** Claude Opus 4.7
**目的:** BCG/T&D Holdings 2026-06-12 プレゼン向けに Demo 04 (マクロ・セグメント営業企画) と Demo 05 (Apple Health × リアルタイム異常検知) を本番投入

---

## 成果サマリ

- 全 5 デモが https://life-ai-demo.vercel.app で稼働中
- スモークテスト (HTTP 200 + コンテンツ一致) 全通過
- テスト 32/32 green、`tsc` クリーン、Next.js build 成功
- 2026-06-12 のプレゼンに間に合う状態

## URL 一覧

| # | URL | テーマ |
|---|---|---|
| 01 | https://life-ai-demo.vercel.app/health | 健康・医療データ × 保険提案 |
| 02 | https://life-ai-demo.vercel.app/lifestyle | 家計・ライフイベント × 提案 |
| 03 | https://life-ai-demo.vercel.app/business | 法人決算 × 福利厚生 |
| 04 | https://life-ai-demo.vercel.app/segment | マクロ・セグメント営業企画 (今回追加) |
| 05 | https://life-ai-demo.vercel.app/wearable | Apple Health × 異常検知 (今回追加) |

## Demo 04 (segment) 実装

### プリセット 3 種
- millennial-family (30 代既婚子育て、CV 8.4%)
- dinks (30〜40 代 DINKs、CV 11.2%)
- presenior-inheritance (55〜65 代相続対策、CV 6.7%)

### 主要ファイル
- `lib/segmentMath.ts` + `lib/segmentMath.test.ts` (TDD)
- `data/segmentPresets.json`、`data/segmentProposals.json`
- `components/SegmentChipFilter.tsx` / `SegmentPresetPicker.tsx` / `SegmentProposalCard.tsx` / `SegmentResultPanel.tsx` / `BudgetBar.tsx` / `MarketDbSummary.tsx` / `PartnerConnectGrid.tsx`
- `app/segment/page.tsx`

## Demo 05 (wearable) 実装

### プロファイル 3 種 × 30 日バイタル
- `acute-afib`: 田村 浩二 (62 男) — 心房細動兆候 critical、HR 68→102bpm 急上昇、SCORE 84
- `chronic-stress`: 西山 紗英 (42 女) — メンタル不調リスク warn、HRV 52→20ms 単調減少、SCORE 58
- `prodromal-lifestyle`: 谷川 啓介 (54 男) — 生活習慣病前兆 info、歩数 9800→3500、SCORE 38

### 主要ファイル
- `lib/wearableAnalysis.ts` + `lib/wearableAnalysis.test.ts` (TDD)
- `data/wearableCustomers.json`
- `lib/intakeSchema.ts` (`wearableIntakeSchema` + `mapWearableToIntake`)
- `components/AlertBanner.tsx` / `AppleHealthPreview.tsx` / `VitalsTimelineChart.tsx` / `CallScriptCard.tsx`
- `components/DataIntakeForm.tsx` に `previewSlot` prop 追加 (Apple Health モックアップ差し替え用)
- `app/wearable/page.tsx` (selectedId / connected / analyzed / analyzing の状態機械)

### 既知の罠 (解決済み)
1. **Recharts Tooltip Formatter 型エラー** — 明示的な型注釈を外す (`formatter={(value) => [...]}` の形に統一、BudgetBar と同じパターン)
2. **`vercel deploy --prod 2>&1 | tail -10` で 0 byte 出力** — `tail` がプロセス終了までバッファするため。`tee /tmp/vercel-deploy.log | grep -E ...` に置換
3. **Vercel ビルドキュー詰まり (30+ 分 Queued)** — `vercel remove <dpl_id> --yes` で先頭を削除するとキューが進行する

## トップページ更新

`app/page.tsx`:
- 「4 つの連携シナリオ」→「5 つの連携シナリオ」
- グリッド: `md:grid-cols-2 lg:grid-cols-4` → `md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5`
- 5 枚目のカード追加 (`href="/wearable"`, 番号 "05", タイトル "Apple Health × リアルタイム異常検知")

## 動作環境

- Docker container `claude-dev` on AWS Lightsail / Ubuntu 24.04 / Node v22
- screen セッションで Claude Code 常駐 (start-channels.sh)
- watchdog.sh がメモリ 80% 超で自動再起動
- pnpm + Next.js 16.2.7 (Turbopack)
- AGENTS.md 警告: このバージョンは「通常の Next.js」ではない。必ず `node_modules/next/dist/docs/` を先読み

## プラグイン (Claude Code)

- claude-plugins-official: superpowers (5.1.0) / telegram (0.0.6) / frontend-design / skill-creator
- everything-claude-code 1.9.0
- ralph-marketplace
- プロジェクト agents: architect / backend / frontend / qa / reviewer (.claude/agents/)
- MCP: mem0 (長期記憶) / context7 (最新ドキュメント) / playwright (ブラウザ自動操作)

## 次セッションの再開ポイント

- 何かを足すなら **AGENTS.md を最初に再確認** (Next.js 16 特有の罠)
- TDD ファーストで `lib/` を作ってから components を組む流れに揃える
- 既存パターン: Card、DataIntakeForm + previewSlot、RiskScoreCard、InsightPanel、RecommendationPanel を流用
- デプロイは `pnpm vercel deploy --prod --yes 2>&1 | tee /tmp/vercel-deploy.log | grep -E "(Production|Ready|Error)"` パターン

## プレゼン当日チェックリスト

- [ ] 全 5 URL 開いて表示確認
- [ ] /wearable で 3 プロファイル切替動作 (acute-afib / chronic-stress / prodromal-lifestyle)
- [ ] /segment で 3 プリセット切替動作
- [ ] Apple Health プレビュー (iPhone モックアップ) の見た目
- [ ] VitalsTimelineChart の異常検知マーカー (赤丸) 表示
