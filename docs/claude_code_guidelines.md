# Claude Code 開発ガイドライン

## 概要

このドキュメントは、Claude Codeに効果的にコーディングを依頼するための指示書です。一貫した品質と完全性を確保するため、以下のガイドラインに従ってください。

## 必須チェック項目

### 🔍 コード品質チェック

**すべてのコード変更後に必ず実行すること:**

```bash
# 1. Lintチェックと自動修正
npm run lint
npm run lint:fix

# 2. 型チェック
npm run type-check

# 3. テスト実行
npm run test

# 4. ビルドチェック
npm run build
```

### ✅ 完了基準

**以下がすべて成功するまで作業は完了ではない:**
- [ ] Lintエラー: 0件
- [ ] 型エラー: 0件
- [ ] テスト: すべてPASS
- [ ] ビルド: 成功

## 指示テンプレート

### 新機能開発時

```
【依頼内容】
[具体的な機能の説明]

【必須要件】
1. TypeScriptで型安全な実装
2. 対応するテストコードの作成
3. Biome lintルールの完全遵守
4. エラーハンドリングの実装

【完了チェック】
以下をすべて実行し、エラー0件で完了すること:
- npm run lint && npm run lint:fix
- npm run type-check
- npm run test
- npm run build

【レポート要求】
完了時に以下を報告すること:
- 作成・変更したファイル一覧
- 追加したテスト内容
- Lint/型チェック/テスト/ビルドの実行結果
```

### バグ修正時

```
【修正内容】
[バグの詳細説明]

【修正要件】
1. 根本原因の特定と修正
2. 再現テストケースの追加
3. 関連する既存テストの更新
4. リグレッション防止策

【完了チェック】
- npm run lint && npm run lint:fix (エラー0件)
- npm run type-check (エラー0件)
- npm run test (すべてPASS、新規テスト含む)
- npm run build (成功)

【レポート要求】
- 修正内容の詳細
- 追加したテストの説明
- 実行結果のスクリーンショット
```

### Lintエラー修正時

```
【修正指示】
現在のLintエラーをすべて修正してください。

【修正方針】
1. 一つずつエラーを確認し、適切に修正
2. 自動修正可能なものは npm run lint:fix を使用
3. 手動修正が必要なものは、コードの意図を保ちながら修正
4. どうしても修正困難な場合のみ、理由とともにdisableコメントを使用

【完全修正の確認】
以下を順次実行し、すべてクリアするまで継続:
1. npm run lint:fix
2. npm run lint
3. npm run type-check
4. npm run test
5. npm run build

【必須報告事項】
- 修正したエラーの種類と件数
- 各コマンドの実行結果（すべて成功していること）
- disable コメントを使用した場合はその理由
```

## プロジェクト固有設定

### ディレクトリ構造（Atomic Design）

```
src/
├── components/
│   ├── atoms/     # 最小単位（Button, Input等）
│   ├── molecules/ # atoms組み合わせ（SearchBox等）
│   ├── organisms/ # molecules組み合わせ（TopicList等）
│   ├── templates/ # レイアウト構造
│   └── pages/     # 完成ページ
├── app/           # Next.js App Router
├── lib/           # ユーティリティ
├── types/         # 型定義
└── __tests__/     # テストファイル
```

### テストファイル命名規則

```
components/atoms/Button/Button.tsx
→ __tests__/components/atoms/Button.test.tsx

lib/utils.ts
→ __tests__/lib/utils.test.ts

app/page.tsx
→ __tests__/app/page.test.tsx
```

### テスト必須項目

**すべてのコンポーネントで以下をテスト:**
- [ ] 正常な描画
- [ ] Propsの動作
- [ ] ユーザーイベント（クリック、入力等）
- [ ] エラー状態の処理
- [ ] アクセシビリティ

**Hookの場合:**
- [ ] 初期状態
- [ ] 状態変更
- [ ] 副作用（API呼び出し等）
- [ ] エラーハンドリング

**ユーティリティ関数の場合:**
- [ ] 正常系のすべてのパターン
- [ ] 異常系（エラー入力）
- [ ] エッジケース（空文字、null、undefined等）

## コマンド定義

### package.json スクリプト

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "biome check .",
    "lint:fix": "biome check --apply .",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

## よくある問題と対処法

### 問題1: Lintエラーが残る

**対処法:**
```bash
# 1. 自動修正を試す
npm run lint:fix

# 2. 残りのエラーを確認
npm run lint

# 3. 一つずつ手動修正
# ファイル名とエラー内容を確認し、適切に修正

# 4. 修正後再確認
npm run lint
```

### 問題2: テストが失敗する

**対処法:**
```bash
# 1. 詳細なエラー内容を確認
npm run test -- --verbose

# 2. 特定のテストのみ実行
npm run test -- Button.test.tsx

# 3. ウォッチモードで開発
npm run test:watch
```

### 問題3: ビルドが失敗する

**対処法:**
```bash
# 1. 型エラーを先に解決
npm run type-check

# 2. Lintエラーを解決
npm run lint

# 3. 再度ビルド
npm run build
```

## 効果的なコミュニケーション

### 良い依頼例

```
新規コンポーネント「TopicCard」を作成してください。

【機能】
- お題情報を表示するカードコンポーネント
- カテゴリバッジ、難易度表示、クリックイベント対応

【技術要件】
- TypeScript interface定義
- Tailwind CSSでスタイリング
- React Testing Libraryでテスト
- Storybookでドキュメント（任意）

【ファイル構成】
- components/molecules/TopicCard/TopicCard.tsx
- components/molecules/TopicCard/index.ts
- __tests__/components/molecules/TopicCard.test.tsx

【完了確認】
すべてのチェックコマンドがエラー0件で通ること
```

### 悪い依頼例

```
TopicCardを作って
```

## チェックリスト

開発完了前に以下を確認:

**コード品質:**
- [ ] TypeScript型定義が適切
- [ ] Lintルール準拠
- [ ] 命名規則準拠
- [ ] コメント適切

**テスト:**
- [ ] 単体テストカバレッジ十分
- [ ] エッジケーステスト実装
- [ ] エラーハンドリングテスト実装

**ビルド:**
- [ ] 開発環境で動作確認
- [ ] プロダクションビルド成功
- [ ] 型チェック成功

**ドキュメント:**
- [ ] README更新（必要に応じて）
- [ ] コンポーネントのProps説明
- [ ] 使用例の記載

## 継続的改善

このガイドラインは開発進行に合わせて更新していきます。問題が発生した場合は、原因分析と改善策をこのドキュメントに反映してください。