# エンジニアスキル向上アプリ

実践的なシステム設計スキルを身につけ、他のエンジニアからフィードバックをもらえるWebアプリケーション

## 概要

このアプリケーションは、エンジニアがシステム設計スキルを向上させるためのプラットフォームです。様々なお題に対して設計図を作成し、他のユーザーからフィードバックを受けることで、実践的な設計スキルを身につけることができます。

## 主な機能

- 🎯 **実践的なお題**: ECサイト、SaaS、チャットアプリなど、実際のプロジェクトで求められるシステム設計のお題
- 🎨 **直感的な設計図エディタ**: React Flowを使用したドラッグ&ドロップ式の設計図作成ツール
- 💬 **多角的なフィードバック**: スケーラビリティ、セキュリティ、パフォーマンスなどの観点からの評価
- 👤 **ユーザー管理**: プロフィール管理、投稿履歴、フィードバック管理

## 技術スタック

- **フロントエンド**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **設計図エディタ**: React Flow
- **バックエンド**: Supabase (PostgreSQL, Auth, REST API)
- **デプロイ**: Vercel

## セットアップ手順

### 1. リポジトリのクローン

```bash
git clone [repository-url]
cd engineering-skill-app
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. Supabaseプロジェクトのセットアップ

1. [Supabase](https://supabase.com)でプロジェクトを作成
2. `supabase_database_sql.sql`のSQLを実行してデータベースを構築
3. 環境変数を設定

### 4. 環境変数の設定

`.env.local`ファイルを作成し、以下の環境変数を設定：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` を開きます。

## プロジェクト構成

```
engineering-skill-app/
├── app/                 # Next.js App Router
│   ├── (auth)/         # 認証関連ページ
│   ├── topics/         # お題関連ページ
│   ├── editor/         # 設計図作成ページ
│   ├── submissions/    # 投稿詳細ページ
│   └── profile/        # プロフィールページ
├── components/         # 再利用可能コンポーネント
│   ├── ui/            # 基本UIコンポーネント
│   ├── editor/        # エディタ関連コンポーネント
│   └── layout/        # レイアウトコンポーネント
├── lib/               # ユーティリティ・設定
│   ├── supabase.ts    # Supabase設定
│   ├── types.ts       # 型定義
│   └── auth-context.tsx # 認証コンテキスト
└── types/             # グローバル型定義
```

## デプロイ

### Vercelへのデプロイ

1. [Vercel](https://vercel.com)でアカウントを作成
2. GitHubリポジトリと連携
3. 環境変数を設定
4. デプロイ

## 開発ガイドライン

- TypeScriptを使用し、型安全性を保つ
- Tailwind CSSでスタイリング
- React Flowでシステム設計図を実装
- Supabase Row Level Securityでデータ保護

## ライセンス

MIT