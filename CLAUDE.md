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
- 環境変数: `NEXT_PUBLIC_SUPABASE_URL`、`NEXT_PUBLIC_SUPABASE_ANON_KEY`、`SUPABASE_SERVICE_ROLE_KEY`
- 複雑なクエリには統計ビュー（`submissions_with_stats`等）を使用
- 管理者権限が必要な操作（アカウント削除等）は`createSupabaseAdmin()`を使用


## 作業時の必須手順

詳細な作業手順、コミット規則、テンプレートについては `docs/claude_code_guidelines.md` を参照してください。

**⚠️ 重要**: すべての作業前に最新コードの取得と状態確認を実行すること：
```bash
git checkout main && git pull origin main && npm install
npm run lint && npm run build
```

## ドキュメント更新規則

**重要**: コード変更を行った際は、関連するドキュメントを必ず同時に更新すること。

### 更新が必要なケース

1. **新しいAPI追加時**
   - `docs/api_design_document.md` にエンドポイント仕様を追加
   - リクエスト/レスポンス形式、エラーハンドリングを詳細に記載

2. **環境変数追加時**
   - `docs/project_requirements_doc.md` の環境変数セクションを更新
   - セキュリティ注意事項があれば併せて記載

3. **データベーススキーマ変更時**
   - `docs/supabase_database_sql.sql` の更新
   - 新しいテーブル、カラム、RLS ポリシーの追加

4. **認証・認可システム変更時**
   - `docs/api_design_document.md` のセキュリティセクション更新
   - 新しい権限レベルやセキュリティ考慮事項を追加

5. **新機能追加時**
   - `docs/project_requirements_doc.md` の機能仕様を更新
   - 必要に応じて技術スタックセクションも更新

### 更新手順

```bash
# 1. コード変更後、関連ドキュメントを特定
# 2. ドキュメントを更新
# 3. コードとドキュメントを同一コミットで更新
git add . && git commit -m "feat: 新機能追加とドキュメント更新"
```

### 必須チェックポイント

- [ ] API変更時は`docs/api_design_document.md`を更新
- [ ] 環境変数追加時は`docs/project_requirements_doc.md`を更新
- [ ] セキュリティ関連変更時は関連セクションを更新
- [ ] 新機能追加時は機能仕様を更新
- [ ] データベース変更時はSQLファイルを更新

**⚠️ ドキュメント更新を忘れると、チーム内で情報齟齬が発生し、開発効率が低下します。**
