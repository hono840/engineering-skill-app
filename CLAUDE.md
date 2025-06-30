# CLAUDE.md

このファイルは、Claude Code (claude.ai/code) がこのリポジトリで作業する際のガイダンスを提供します。

## 必須ドキュメント参照

以下のドキュメントを作業前に必ず参照してください：

- **開発ガイドライン**: @docs/claude_code_guidelines.md - 作業開始手順、コード品質基準、Git規則など
- **プロジェクト要件定義**: @docs/project_requirements_doc.md - システム概要、技術スタック、機能仕様
- **API設計書**: @docs/api_design_document.md - エンドポイント仕様、認証、エラーハンドリング
- **データベース定義**: @docs/supabase_database_sql.sql - テーブル構造、RLS設定、初期データ

## プロジェクト概要

エンジニアが様々なお題に対してシステム設計図を作成し、他の開発者からフィードバックを受けられるスキル向上プラットフォームです。

### データベース操作
- Supabaseクライアントは`lib/supabase.ts`で設定
- 環境変数: `NEXT_PUBLIC_SUPABASE_URL`、`NEXT_PUBLIC_SUPABASE_ANON_KEY`
- 複雑なクエリには統計ビュー（`submissions_with_stats`等）を使用


## 作業時の必須手順

詳細な作業手順、コミット規則、テンプレートについては `docs/claude_code_guidelines.md` を参照してください。

**⚠️ 重要**: すべての作業前に最新コードの取得と状態確認を実行すること：
```bash
git checkout main && git pull origin main && npm install
npm run lint && npm run build
```
