# エンジニアスキル向上Webアプリ - プロジェクト要件定義書

## プロジェクト概要

AIの進化により単純なコーディング作業が自動化される中で、エンジニアがより高次元のスキル（システム設計、問題解決、AI協働など）を鍛えるためのWebアプリケーションを開発する。

## 学習目標

開発者（フロントエンドエンジニア）が本プロジェクトを通じて習得するスキル：
- システム設計の経験
- フルスタック開発
- ユーザー体験設計

## 開発者スキルレベル

- **フロントエンド**: Next.js経験あり
- **バックエンド**: 未経験
- **データベース**: 未経験
- **個人プロジェクト**: 経験あり

## 開発アプローチ

### 基本方針
- MVP（最小viable product）から開始
- 段階的な機能拡張
- 作りながら学ぶスタイル

### 開発順序の基準
1. リスクの高いものから検証
2. 学習効果の高いものを優先
3. 依存関係を考慮した順序

## 技術スタック（確定）

### フロントエンド
- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **ドラッグ&ドロップエディタ**: React Flow
- **状態管理**: React Hook (useState, useReducer)

### バックエンド
- **BaaS**: Supabase
- **認証**: Supabase Auth
- **API**: Supabase REST API
- **リアルタイム**: Supabase Realtime (将来の拡張用)

### データベース
- **DB**: PostgreSQL (Supabase)
- **ORM**: Supabase Client

### 開発・デプロイ
- **開発環境**: Vercel (Next.js最適化)
- **バージョン管理**: Git
- **パッケージ管理**: npm

### React Flow選定理由
- システム設計図作成に特化
- ユーザビリティが高い
- カスタマイズしやすい
- 将来の拡張性が豊富
- TypeScript完全対応

## プロジェクト構成

### ディレクトリ構造（推奨）
```
engineering-skill-app/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── (auth)/         # 認証関連ページ
│   │   ├── topics/         # お題関連ページ
│   │   ├── editor/         # 設計図作成ページ
│   │   ├── submissions/    # 投稿詳細ページ
│   │   └── globals.css
│   ├── components/         # 再利用可能コンポーネント
│   │   ├── ui/            # 基本UIコンポーネント
│   │   ├── editor/        # エディタ関連コンポーネント
│   │   └── layout/        # レイアウトコンポーネント
│   ├── lib/               # ユーティリティ・設定
│   │   ├── supabase.ts    # Supabase設定
│   │   ├── types.ts       # 型定義
│   │   └── utils.ts       # ヘルパー関数
│   └── hooks/             # カスタムフック
├── public/                # 静的ファイル
├── types/                 # グローバル型定義
└── package.json
```

### 主要パッケージ
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.0.0",
    "reactflow": "^11.0.0",
    "@supabase/supabase-js": "^2.0.0",
    "@supabase/auth-ui-react": "^0.4.0"
  }
}
```

### 環境変数設定

アプリケーションの動作に必要な環境変数一覧：

#### 必須環境変数
```env
# Supabase 基本設定
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Supabase 管理者権限（アカウント削除等のサーバーサイド処理用）
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

#### 環境変数の取得方法

1. **Supabaseダッシュボードにアクセス**
   - [https://supabase.com](https://supabase.com) にログイン
   - プロジェクトを選択

2. **API Keys の取得**
   - Settings → API
   - **Project URL**: `NEXT_PUBLIC_SUPABASE_URL` に設定
   - **anon public**: `NEXT_PUBLIC_SUPABASE_ANON_KEY` に設定
   - **service_role**: `SUPABASE_SERVICE_ROLE_KEY` に設定

3. **ローカル環境での設定**
   ```bash
   # プロジェクトルートに .env.local ファイルを作成
   cp .env.example .env.local
   # 上記の環境変数を設定
   ```

#### セキュリティ注意事項

- **Service Role Key**: 管理者権限を持つため、**絶対にクライアントサイドで使用しない**
- **Service Role Key**: `.env.local` に保存し、GitHubにコミットしない
- **本番環境**: VercelやNetlifyの環境変数設定で管理

## MVP機能仕様（現在検討中）

### メインユーザー
システム設計スキルを向上させたいエンジニア

### 想定ユーザー像
- 2-4年目のエンジニア
- コーディングはできるが、システム全体の設計経験が少ない
- 実際のプロジェクトで設計を任される前に練習したい
- 他の人の設計から学びたい

### ユーザーが抱える課題
- 設計の良し悪しが分からない
- 練習する場がない
- フィードバックをもらえる環境がない

### コア機能
システム設計のお題に対して設計図を投稿し、他のユーザーからフィードバックをもらえる機能

## 機能仕様詳細

### 1. システム設計のお題
**確定事項:**
- SaaS（Software as a Service）
- MaaS（Mobility as a Service）
- チャットアプリ
- ECサイト
- その他多数のカテゴリを用意

**検討事項:**
- 難易度別の設定方法
- お題の更新頻度
- カテゴリ別の整理方法

### 2. 設計図の投稿方法
**確定事項:**
- ドラッグ&ドロップ式の図作成ツール
- テキスト説明

**ドラッグ&ドロップ図作成の仕様:**
- 事前定義コンポーネント: サーバー、データベース、ユーザー、API、外部サービスなど
- 直感的な操作: コンポーネントをドラッグして配置、線で接続
- リアルタイムプレビュー: 編集中も図が即座に反映
- 保存形式: JSON形式で座標・接続情報を保存

**技術的メリット:**
- 学習コストが低く、初心者でも使いやすい
- 直感的な操作でユーザビリティが高い
- Reactライブラリが豊富で実装しやすい
- 視覚的にわかりやすい設計図が作成可能

### 3. フィードバック機能
**確定事項:**

**フィードバックの種類:**
- 感想・褒めコメント
- 具体的改善提案
- 観点別評価（スケーラビリティ、セキュリティ、パフォーマンス、保守性など）

**フィードバック形式:**
- 評価項目別の評価（5段階評価など）
- 自由記述コメント
- いいね機能

**評価観点（案）:**
- スケーラビリティ: 将来の拡張性
- セキュリティ: セキュリティ考慮
- パフォーマンス: 応答速度・処理効率
- 保守性: コードの可読性・変更しやすさ
- 設計の妥当性: 要件に対する適切性

**ユーザビリティ設計:**
- 書く側: 項目が決まっているので迷わない
- 受ける側: 多角的なフィードバックで学習効果大

## データベース設計

### テーブル構成

#### 1. users（ユーザーテーブル）
```sql
- id: UUID (主キー)
- email: TEXT (一意制約)
- username: TEXT (一意制約)
- display_name: TEXT
- avatar_url: TEXT
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### 2. topics（お題テーブル）
```sql
- id: UUID (主キー)
- title: TEXT (例: "ECサイトの設計")
- description: TEXT (お題の詳細説明)
- category: TEXT (例: "SaaS", "MaaS", "チャットアプリ")
- difficulty_level: INTEGER (1-5の難易度)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### 3. submissions（設計図テーブル）
```sql
- id: UUID (主キー)
- user_id: UUID (外部キー -> users.id)
- topic_id: UUID (外部キー -> topics.id)
- title: TEXT (投稿タイトル)
- mermaid_code: TEXT (Mermaid記法のコード)
- description: TEXT (テキスト説明)
- status: TEXT (draft/published)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### 4. feedbacks（フィードバックテーブル）
```sql
- id: UUID (主キー)
- user_id: UUID (外部キー -> users.id, 評価者)
- submission_id: UUID (外部キー -> submissions.id, 評価対象)
- scalability_score: INTEGER (1-5点)
- security_score: INTEGER (1-5点)
- performance_score: INTEGER (1-5点)
- maintainability_score: INTEGER (1-5点)
- design_validity_score: INTEGER (1-5点, 設計の妥当性)
- comment: TEXT (自由記述コメント)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### 設計の特徴
- **シンプル性重視**: 横並びの評価項目で実装・理解が容易
- **拡張性考慮**: 各テーブルにupdated_atを設け将来の機能追加に対応
- **Supabase対応**: UUID主キーでSupabaseの標準に準拠

## 次のステップ

1. システム構成図の作成
2. 画面設計・ワイヤーフレーム作成
3. 開発環境の構築
4. MVP機能の実装開始

---

*このドキュメントは要件定義の進行に伴い随時更新される*