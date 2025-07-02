# API設計書

## 概要

エンジニアスキル向上WebアプリのAPI仕様書。SupabaseのREST APIを使用し、フロントエンド（Next.js）とバックエンド（Supabase）間の通信仕様を定義する。

## 基本仕様

### ベースURL
- **開発環境**: `https://[project-id].supabase.co/rest/v1`
- **認証**: Bearer Token (Supabase JWT)
- **Content-Type**: `application/json`

### 共通レスポンス形式

#### 成功時
```json
{
  "data": [...], // 取得したデータ
  "count": 10,   // 総件数（リスト系APIのみ）
  "error": null
}
```

#### エラー時
```json
{
  "error": {
    "message": "エラーメッセージ",
    "code": "ERROR_CODE",
    "details": "詳細情報"
  }
}
```

## エンドポイント一覧

### 1. お題管理 API

#### GET /topics
お題一覧を取得する

**用途**: お題一覧画面での表示

**クエリパラメータ**:
```
?category=SaaS          # カテゴリフィルタ
&difficulty=1           # 難易度フィルタ (1-5)
&limit=20              # 取得件数制限
&offset=0              # オフセット（ページネーション）
```

**レスポンス例**:
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "ECサイトの基本設計",
      "description": "商品管理、カート機能、決済システムを含む...",
      "category": "ECサイト",
      "difficulty_level": 1,
      "created_at": "2025-01-01T00:00:00Z",
      "updated_at": "2025-01-01T00:00:00Z",
      "submission_count": 24,    # 投稿数
      "average_rating": 4.2      # 平均評価
    }
  ],
  "count": 50
}
```

#### GET /topics/{id}
特定お題の詳細を取得する

**用途**: 設計図作成画面での表示

**レスポンス例**:
```json
{
  "data": {
    "id": "uuid",
    "title": "ECサイトの基本設計",
    "description": "商品管理、カート機能、決済システムを含む基本的なECサイトのシステム設計を行います。以下の要件を満たすシステムを設計してください：\n\n- ユーザー登録・ログイン機能\n- 商品カタログ管理\n- ショッピングカート\n- 決済処理\n- 注文管理",
    "category": "ECサイト",
    "difficulty_level": 1,
    "estimated_time": "1時間",
    "requirements": [
      "ユーザー登録・ログイン機能",
      "商品カタログ管理",
      "ショッピングカート",
      "決済処理",
      "注文管理"
    ],
    "created_at": "2025-01-01T00:00:00Z"
  }
}
```

### 2. 設計図投稿管理 API

#### POST /submissions
設計図を投稿する

**用途**: 設計図作成画面での投稿

**リクエストボディ**:
```json
{
  "topic_id": "uuid",
  "title": "マイクロサービス型ECサイト設計",
  "design_data": {
    "nodes": [
      {
        "id": "node-1",
        "type": "custom",
        "position": { "x": 100, "y": 100 },
        "data": {
          "label": "ユーザー",
          "icon": "👤",
          "type": "user"
        }
      }
    ],
    "edges": [
      {
        "id": "edge-1",
        "source": "node-1",
        "target": "node-2",
        "type": "smoothstep"
      }
    ]
  },
  "description": "マイクロサービスアーキテクチャを採用したECサイトの設計です...",
  "technical_reasoning": "マイクロサービスを選択した理由は...",
  "challenges_and_solutions": "スケーラビリティの課題に対しては...",
  "status": "published" // "draft" or "published"
}
```

**レスポンス例**:
```json
{
  "data": {
    "id": "uuid",
    "user_id": "uuid",
    "topic_id": "uuid",
    "title": "マイクロサービス型ECサイト設計",
    "status": "published",
    "created_at": "2025-01-01T00:00:00Z"
  }
}
```

#### GET /submissions/{id}
設計図詳細を取得する

**用途**: 設計図詳細画面での表示

**レスポンス例**:
```json
{
  "data": {
    "id": "uuid",
    "user_id": "uuid",
    "topic_id": "uuid",
    "title": "マイクロサービス型ECサイト設計",
    "design_data": { /* React Flow形式のデータ */ },
    "description": "設計の概要説明",
    "technical_reasoning": "技術選定の理由",
    "challenges_and_solutions": "課題と解決策",
    "status": "published",
    "created_at": "2025-01-01T00:00:00Z",
    "updated_at": "2025-01-01T00:00:00Z",
    "topic": {
      "id": "uuid",
      "title": "ECサイトの基本設計",
      "category": "ECサイト"
    },
    "user": {
      "id": "uuid",
      "username": "engineer_taro",
      "display_name": "エンジニア太郎",
      "avatar_url": "https://..."
    },
    "feedback_summary": {
      "total_count": 3,
      "average_scores": {
        "scalability_score": 4.0,
        "security_score": 3.7,
        "performance_score": 4.3,
        "maintainability_score": 4.0,
        "design_validity_score": 4.2
      }
    }
  }
}
```

#### GET /submissions
設計図一覧を取得する

**用途**: ユーザープロフィール、お題詳細での投稿一覧

**クエリパラメータ**:
```
?topic_id=uuid         # 特定お題の投稿のみ
&user_id=uuid          # 特定ユーザーの投稿のみ
&status=published      # 公開状態フィルタ
&sort=created_at       # ソート項目
&order=desc            # ソート順序
&limit=20
&offset=0
```

### 3. フィードバック管理 API

#### POST /feedbacks
フィードバックを投稿する

**用途**: 設計図詳細画面でのフィードバック投稿

**リクエストボディ**:
```json
{
  "submission_id": "uuid",
  "scalability_score": 4,
  "security_score": 3,
  "performance_score": 5,
  "maintainability_score": 4,
  "design_validity_score": 4,
  "comment": "とても良い設計だと思います。特にマイクロサービス間の通信方法がよく考えられています。ただし、データ整合性の担保についてもう少し詳しく説明があると良いと思います。"
}
```

#### GET /feedbacks
フィードバック一覧を取得する

**用途**: 設計図詳細画面でのフィードバック表示

**クエリパラメータ**:
```
?submission_id=uuid    # 特定投稿のフィードバック
&user_id=uuid          # 特定ユーザーのフィードバック
&limit=20
&offset=0
```

**レスポンス例**:
```json
{
  "data": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "submission_id": "uuid",
      "scalability_score": 4,
      "security_score": 3,
      "performance_score": 5,
      "maintainability_score": 4,
      "design_validity_score": 4,
      "comment": "とても良い設計だと思います...",
      "created_at": "2025-01-01T00:00:00Z",
      "user": {
        "username": "reviewer_hanako",
        "display_name": "レビュー花子",
        "avatar_url": "https://..."
      }
    }
  ]
}
```

### 4. ユーザー管理 API

#### GET /users/me
現在のユーザー情報を取得する

**用途**: ユーザー情報表示、認証状態確認

**レスポンス例**:
```json
{
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "engineer_taro",
    "display_name": "エンジニア太郎",
    "avatar_url": "https://...",
    "created_at": "2025-01-01T00:00:00Z",
    "stats": {
      "submission_count": 5,
      "feedback_count": 12,
      "average_received_rating": 4.2
    }
  }
}
```

#### PUT /users/me
ユーザー情報を更新する

**リクエストボディ**:
```json
{
  "username": "new_username",
  "display_name": "新しい表示名",
  "avatar_url": "https://new-avatar-url.com"
}
```

#### POST /api/account/delete
ユーザーアカウントを削除する

**用途**: プロフィール画面でのアカウント削除機能

**認証**: 必須（認証済みユーザーのみ）

**リクエストボディ**:
```json
{
  "email": "user@example.com",
  "password": "current_password"
}
```

**レスポンス例（成功時）**:
```json
{
  "success": true
}
```

**レスポンス例（エラー時）**:
```json
{
  "error": "パスワードが正しくありません"
}
```

**エラーパターン**:
- `400`: リクエストパラメータが不正
- `401`: パスワードが間違っている
- `500`: サーバーエラー（削除処理失敗）

**仕様詳細**:
- パスワード検証と削除処理を一つのAPI呼び出しで実行
- 削除時はSupabase Auth admin APIを使用してサーバーサイドで実行
- データベースのCASCADE設定により関連データ（投稿、フィードバック、いいね）も自動削除
- 成功時は直ちにユーザーセッションが無効化される

## 認証・認可

### 認証方式
- **Supabase Auth**を使用
- JWTトークンによるBearer認証
- リフレッシュトークンによる自動更新

### 認可レベル
- **公開**: お題一覧・詳細、設計図詳細（認証不要）
- **認証済み**: 設計図投稿、フィードバック投稿
- **所有者のみ**: 自分の設計図編集・削除
- **管理者権限**: アカウント削除（Service Role使用）

### セキュリティ考慮事項

#### Service Role Key の管理
- **用途**: アカウント削除等の管理者権限が必要な操作
- **保管**: サーバーサイドの環境変数でのみ管理
- **アクセス制限**: API Routes内でのみ使用、クライアントサイドでは一切使用禁止
- **権限**: Supabase Auth admin API の完全アクセス権限を持つ

#### アカウント削除のセキュリティ
- **二段階認証**: ユーザー名確認 → パスワード検証
- **パスワード検証**: 現在のパスワードによる本人確認
- **サーバーサイド実行**: Service Role を使用してサーバーサイドで削除実行
- **データ整合性**: データベースCASCADE設定による関連データの自動削除
- **監査ログ**: 削除操作のログ記録

#### 環境変数セキュリティ
```env
# クライアントサイド（Next.js public）
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ... # 公開されても安全

# サーバーサイドのみ（絶対に公開しない）
SUPABASE_SERVICE_ROLE_KEY=eyJ... # 管理者権限、厳重管理必須
```

## エラーハンドリング

### 主要なエラーコード
- `400`: リクエストエラー（バリデーション失敗等）
- `401`: 認証エラー
- `403`: 認可エラー（権限不足）
- `404`: リソースが存在しない
- `422`: データ処理エラー
- `500`: サーバーエラー

### バリデーションルール
- **title**: 1-100文字、必須
- **description**: 1-2000文字、必須
- **comment**: 1-1000文字、必須
- **scores**: 1-5の整数、必須
- **username**: 3-30文字、英数字とアンダースコアのみ

## パフォーマンス考慮事項

### キャッシュ戦略
- お題一覧: 5分間キャッシュ
- 設計図詳細: 1分間キャッシュ
- ユーザー情報: 10分間キャッシュ

### ページネーション
- デフォルト制限: 20件
- 最大制限: 100件
- オフセットベースのページネーション使用

## 型定義（TypeScript）

```typescript
// 基本的な型定義例
interface Topic {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty_level: number;
  created_at: string;
  updated_at: string;
}

interface Submission {
  id: string;
  user_id: string;
  topic_id: string;
  title: string;
  design_data: ReactFlowJsonObject;
  description: string;
  technical_reasoning: string;
  challenges_and_solutions: string;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

interface Feedback {
  id: string;
  user_id: string;
  submission_id: string;
  scalability_score: number;
  security_score: number;
  performance_score: number;
  maintainability_score: number;
  design_validity_score: number;
  comment: string;
  created_at: string;
  updated_at: string;
}
```