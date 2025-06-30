# Claude Code 開発ガイドライン

## 概要

このドキュメントは、Claude Codeに効果的にコーディングを依頼するための指示書です。一貫した品質と完全性を確保するため、以下のガイドラインに従ってください。

## 作業開始前の必須手順

### 📥 最新コード取得（作業開始時に必ず実行）

**すべての作業開始前に必ず実行すること:**

```bash
# 1. 最新のmainブランチを取得
git checkout main
git pull origin main

# 2. 依存関係の更新確認
npm install

# 3. 現在の状態確認
npm run lint
npm run type-check
npm run test
npm run build
```

**⚠️ 重要: この手順を飛ばすと古いコードベースで作業することになり、競合やバグの原因となります。**

## 日本語コミュニケーション規則

### 📝 コメント・ドキュメント記述規則

**すべてのコメントは日本語で記述すること:**

```typescript
// ✅ 良い例
/**
 * ユーザーの投稿データを取得する関数
 * @param userId - 取得対象のユーザーID
 * @returns Promise<Submission[]> - ユーザーの投稿一覧
 * @throws {Error} - ユーザーが見つからない場合
 */
const getUserSubmissions = async (userId: string): Promise<Submission[]> => {
  // APIエンドポイントの構築
  const url = `/api/submissions?user_id=${userId}`;
  
  try {
    // データ取得処理
    const response = await fetch(url);
    
    if (!response.ok) {
      // エラーレスポンスの場合は例外をスロー
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    // ネットワークエラーまたはパースエラーの処理
    console.error('投稿データの取得に失敗しました:', error);
    throw error;
  }
};

// ❌ 悪い例
// Get user submissions
const getUserSubmissions = async (userId: string) => {
  // Build endpoint
  const url = `/api/submissions?user_id=${userId}`;
  // ...
};
```

**TODOコメントの書き方:**
```typescript
// TODO: パフォーマンス改善 - キャッシュ機能の実装を検討
// FIXME: エラーハンドリングが不十分 - 具体的なエラーメッセージを追加
// HACK: 一時的な回避策 - 正式なAPIが完成したら削除予定
```

### 🔧 Git関連の日本語規則

**コミットメッセージ:**
```bash
# ✅ 良い例
git commit -m "feat: ユーザープロフィール編集機能を追加

- プロフィール情報の表示と編集フォームを実装
- バリデーション機能を追加
- 画像アップロード機能を実装
- 対応するテストケースを作成"

git commit -m "fix: 設計図エディタの保存時にエラーが発生する問題を修正

- React Flowのデータ形式検証を追加
- 空のノードデータに対する例外処理を実装
- 関連するテストケースを更新"

# ❌ 悪い例
git commit -m "add profile edit"
git commit -m "fix editor bug"
```

**ブランチ名:**
```bash
# ✅ 良い例
git checkout -b feature/user-profile-edit
git checkout -b fix/editor-save-error
git checkout -b refactor/topic-card-component

# ❌ 悪い例
git checkout -b profile
git checkout -b bug-fix
```

### 📋 Issue作成時の日本語テンプレート

**新機能Issue:**
```markdown
## 機能概要
[実装したい機能の概要を日本語で説明]

## 背景・目的
なぜこの機能が必要なのかを説明

## 詳細仕様
### 画面・UI要件
- [ ] 項目1の説明
- [ ] 項目2の説明

### 機能要件
- [ ] 機能1の詳細
- [ ] 機能2の詳細

### 技術要件
- [ ] 使用する技術・ライブラリ
- [ ] パフォーマンス要件
- [ ] セキュリティ要件

## 受け入れ基準
- [ ] 基準1
- [ ] 基準2

## 実装時の注意点
- 注意点1
- 注意点2

## 関連Issue・PR
- 関連するIssue番号やPR番号
```

**バグ報告Issue:**
```markdown
## バグの概要
[発生している問題を日本語で簡潔に説明]

## 再現手順
1. 手順1
2. 手順2
3. 手順3

## 期待する動作
[本来どのような動作をするべきか]

## 実際の動作
[現在発生している問題の詳細]

## 環境情報
- OS: 
- ブラウザ: 
- Node.js バージョン:
- その他関連する環境情報

## エラーログ・スクリーンショット
```console
[エラーログがあれば記載]
```

## 影響範囲
- [ ] 機能Aに影響
- [ ] 機能Bに影響

## 優先度
- [ ] 緊急 (サービス停止レベル)
- [ ] 高 (主要機能に影響)
- [ ] 中 (一部機能に影響)
- [ ] 低 (改善要望レベル)
```

### 🔄 PR作成時の日本語テンプレート

```markdown
## 変更内容
[実装・修正した内容を日本語で説明]

## 関連Issue
- Closes #[Issue番号]
- Related to #[Issue番号]

## 変更種別
- [ ] 新機能 (feature)
- [ ] バグ修正 (bugfix)
- [ ] リファクタリング (refactor)
- [ ] ドキュメント更新 (docs)
- [ ] スタイル修正 (style)
- [ ] テスト追加・修正 (test)
- [ ] 設定変更 (chore)

## 詳細説明
### 実装内容
- 実装した機能1の詳細
- 実装した機能2の詳細

### 技術的な変更点
- 使用した技術・ライブラリ
- アーキテクチャ的な変更
- パフォーマンスへの影響

## テスト
### 追加したテスト
- [ ] テストケース1
- [ ] テストケース2

### 実行結果
```bash
npm run lint     # ✅ エラー0件
npm run type-check # ✅ エラー0件  
npm run test     # ✅ すべてPASS
npm run build    # ✅ 成功
```

## 動作確認
### 確認項目
- [ ] 確認項目1
- [ ] 確認項目2

### スクリーンショット・デモ
[必要に応じて画像や動画を添付]

## レビュー観点
- レビューしてほしいポイント1
- レビューしてほしいポイント2

## 破壊的変更
- [ ] 破壊的変更あり
- [ ] 破壊的変更なし

### 破壊的変更の詳細 (該当する場合)
[APIの変更、設定ファイルの変更など]

## デプロイ時の注意点
- 注意点1
- 注意点2
```

## 必須チェック項目

### 🔍 コード品質チェック

**すべてのコード変更後に必ず実行すること:**

```bash
# 1. Lintチェックと自動修正
npm run lint

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
【作業開始】
まず以下を実行してください:
git checkout main && git pull origin main && npm install

【依頼内容】
[具体的な機能の説明]

【必須要件】
1. TypeScriptで型安全な実装
2. 対応するテストコードの作成
3. Biome lintルールの完全遵守
4. エラーハンドリングの実装
5. すべてのコメントを日本語で記述
6. 適切なJSDocコメントの追加

【完了チェック】
以下をすべて実行し、エラー0件で完了すること:
- npm run lint
- npm run type-check
- npm run test
- npm run build

【レポート要求】
完了時に以下を報告すること:
- git status の結果
- 作成・変更したファイル一覧
- 追加したテスト内容
- コメント・JSDocの記述状況
- Lint/型チェック/テスト/ビルドの実行結果
```

### バグ修正時

```
【作業開始】
まず以下を実行してください:
git checkout main && git pull origin main && npm install

【修正内容】
[バグの詳細説明]

【修正要件】
1. 根本原因の特定と修正
2. 再現テストケースの追加
3. 関連する既存テストの更新
4. リグレッション防止策

【完了チェック】
- npm run lint
- npm run type-check (エラー0件)
- npm run test (すべてPASS、新規テスト含む)
- npm run build (成功)

【レポート要求】
- git status の結果
- 修正内容の詳細
- 追加したテストの説明
- 実行結果のスクリーンショット
```

### Lintエラー修正時

```
【作業開始】
まず以下を実行してください:
git checkout main && git pull origin main && npm install

【修正指示】
現在のLintエラーをすべて修正してください。

【修正方針】
1. 一つずつエラーを確認し、適切に修正
2. 手動修正が必要なものは、コードの意図を保ちながら修正
3. どうしても修正困難な場合のみ、理由とともにdisableコメントを使用

【完全修正の確認】
以下を順次実行し、すべてクリアするまで継続:
1. npm run lint
2. npm run type-check
3. npm run test
4. npm run build

【必須報告事項】
- git status の結果
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
# 1. 残りのエラーを確認
npm run lint

# 2. 一つずつ手動修正
# ファイル名とエラー内容を確認し、適切に修正

# 3. 修正後再確認
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
【作業開始】
git checkout main && git pull origin main && npm install

新規コンポーネント「TopicCard」を作成してください。

【機能】
- お題情報を表示するカードコンポーネント
- カテゴリバッジ、難易度表示、クリックイベント対応

【技術要件】
- TypeScript interface定義
- Tailwind CSSでスタイリング
- React Testing Libraryでテスト
- 日本語でのコメント・JSDoc記述
- Storybookでドキュメント（任意）

【ファイル構成】
- components/molecules/TopicCard/TopicCard.tsx
- components/molecules/TopicCard/index.ts
- __tests__/components/molecules/TopicCard.test.tsx

【完了確認】
すべてのチェックコマンドがエラー0件で通ること

【レポート要求】
- git status の結果
- コメント・JSDocの記述内容
- 実行結果の詳細
```

### 悪い依頼例

```
TopicCardを作って
```

## チェックリスト

開発完了前に以下を確認:

**Git状態確認:**
- [ ] 最新mainブランチから作業開始
- [ ] 変更ファイルが意図したもののみ
- [ ] git status で確認済み

**コード品質:**
- [ ] TypeScript型定義が適切
- [ ] Lintルール準拠
- [ ] 命名規則準拠
- [ ] 日本語コメント・JSDoc適切
- [ ] 分かりやすい変数・関数名

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