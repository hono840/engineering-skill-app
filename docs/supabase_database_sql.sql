-- ================================================
-- エンジニアスキル向上アプリ データベース作成SQL
-- ================================================

-- 1. 拡張機能の有効化
-- UUIDの生成に必要
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================
-- 2. テーブル作成
-- ================================================

-- 2.1 ユーザープロフィールテーブル
-- Supabase Authと連携するためのプロフィール情報
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL CHECK (length(username) >= 3 AND length(username) <= 30),
    display_name TEXT NOT NULL CHECK (length(display_name) >= 1 AND length(display_name) <= 50),
    avatar_url TEXT,
    bio TEXT CHECK (length(bio) <= 500),
    github_url TEXT,
    portfolio_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 2.2 お題テーブル
CREATE TABLE topics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL CHECK (length(title) >= 1 AND length(title) <= 100),
    description TEXT NOT NULL CHECK (length(description) >= 1 AND length(description) <= 2000),
    category TEXT NOT NULL CHECK (category IN ('SaaS', 'ECサイト', 'チャットアプリ', 'MaaS', '認証システム', '決済システム', 'SNS', 'ブログ', 'タスク管理', 'その他')),
    difficulty_level INTEGER NOT NULL CHECK (difficulty_level >= 1 AND difficulty_level <= 5),
    estimated_time TEXT NOT NULL DEFAULT '1時間',
    requirements JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 2.3 設計図投稿テーブル
CREATE TABLE submissions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    topic_id UUID REFERENCES topics(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL CHECK (length(title) >= 1 AND length(title) <= 100),
    design_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    description TEXT NOT NULL CHECK (length(description) >= 1 AND length(description) <= 2000),
    technical_reasoning TEXT CHECK (length(technical_reasoning) <= 2000),
    challenges_and_solutions TEXT CHECK (length(challenges_and_solutions) <= 2000),
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 2.4 フィードバックテーブル
CREATE TABLE feedbacks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    submission_id UUID REFERENCES submissions(id) ON DELETE CASCADE NOT NULL,
    scalability_score INTEGER NOT NULL CHECK (scalability_score >= 1 AND scalability_score <= 5),
    security_score INTEGER NOT NULL CHECK (security_score >= 1 AND security_score <= 5),
    performance_score INTEGER NOT NULL CHECK (performance_score >= 1 AND performance_score <= 5),
    maintainability_score INTEGER NOT NULL CHECK (maintainability_score >= 1 AND maintainability_score <= 5),
    design_validity_score INTEGER NOT NULL CHECK (design_validity_score >= 1 AND design_validity_score <= 5),
    comment TEXT NOT NULL CHECK (length(comment) >= 1 AND length(comment) <= 1000),
    is_helpful BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- 同じユーザーが同じ投稿に複数回フィードバックできないように制約
    UNIQUE(user_id, submission_id)
);

-- 2.5 いいねテーブル（投稿へのいいね）
CREATE TABLE submission_likes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    submission_id UUID REFERENCES submissions(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- 同じユーザーが同じ投稿に複数回いいねできないように制約
    UNIQUE(user_id, submission_id)
);

-- ================================================
-- 3. インデックス作成（パフォーマンス向上）
-- ================================================

-- よく検索されるカラムにインデックスを作成
CREATE INDEX idx_topics_category ON topics(category);
CREATE INDEX idx_topics_difficulty ON topics(difficulty_level);
CREATE INDEX idx_topics_active ON topics(is_active);

CREATE INDEX idx_submissions_user_id ON submissions(user_id);
CREATE INDEX idx_submissions_topic_id ON submissions(topic_id);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_created_at ON submissions(created_at DESC);

CREATE INDEX idx_feedbacks_submission_id ON feedbacks(submission_id);
CREATE INDEX idx_feedbacks_user_id ON feedbacks(user_id);

CREATE INDEX idx_profiles_username ON profiles(username);

-- 複合インデックス（複数条件での検索用）
CREATE INDEX idx_submissions_topic_status ON submissions(topic_id, status);
CREATE INDEX idx_submissions_user_status ON submissions(user_id, status);

-- ================================================
-- 4. 関数とトリガー（自動更新）
-- ================================================

-- updated_at自動更新関数
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- updated_atトリガー作成
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_topics_updated_at
    BEFORE UPDATE ON topics
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_submissions_updated_at
    BEFORE UPDATE ON submissions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_feedbacks_updated_at
    BEFORE UPDATE ON feedbacks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- ================================================
-- 5. Row Level Security (RLS) 設定
-- ================================================

-- RLSを有効化
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE submission_likes ENABLE ROW LEVEL SECURITY;

-- プロフィールのポリシー
CREATE POLICY "プロフィールは誰でも閲覧可能" ON profiles
    FOR SELECT USING (true);

CREATE POLICY "自分のプロフィールのみ更新可能" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "認証済みユーザーはプロフィール作成可能" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- お題のポリシー
CREATE POLICY "アクティブなお題は誰でも閲覧可能" ON topics
    FOR SELECT USING (is_active = true);

CREATE POLICY "認証済みユーザーはお題作成可能" ON topics
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 投稿のポリシー
CREATE POLICY "公開投稿は誰でも閲覧可能" ON submissions
    FOR SELECT USING (status = 'published' OR user_id = auth.uid());

CREATE POLICY "認証済みユーザーは投稿作成可能" ON submissions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "自分の投稿のみ更新可能" ON submissions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "自分の投稿のみ削除可能" ON submissions
    FOR DELETE USING (auth.uid() = user_id);

-- フィードバックのポリシー
CREATE POLICY "公開投稿のフィードバックは誰でも閲覧可能" ON feedbacks
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM submissions 
            WHERE submissions.id = feedbacks.submission_id 
            AND submissions.status = 'published'
        )
    );

CREATE POLICY "認証済みユーザーはフィードバック作成可能" ON feedbacks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "自分のフィードバックのみ更新可能" ON feedbacks
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "自分のフィードバックのみ削除可能" ON feedbacks
    FOR DELETE USING (auth.uid() = user_id);

-- いいねのポリシー
CREATE POLICY "いいねは誰でも閲覧可能" ON submission_likes
    FOR SELECT USING (true);

CREATE POLICY "認証済みユーザーはいいね可能" ON submission_likes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "自分のいいねのみ削除可能" ON submission_likes
    FOR DELETE USING (auth.uid() = user_id);

-- ================================================
-- 6. ビュー作成（複雑なクエリの簡素化）
-- ================================================

-- 投稿に統計情報を含むビュー
CREATE VIEW submissions_with_stats AS
SELECT 
    s.*,
    t.title as topic_title,
    t.category as topic_category,
    p.username,
    p.display_name,
    p.avatar_url,
    COALESCE(f.feedback_count, 0) as feedback_count,
    COALESCE(f.avg_scalability, 0) as avg_scalability,
    COALESCE(f.avg_security, 0) as avg_security,
    COALESCE(f.avg_performance, 0) as avg_performance,
    COALESCE(f.avg_maintainability, 0) as avg_maintainability,
    COALESCE(f.avg_design_validity, 0) as avg_design_validity,
    COALESCE(f.total_average, 0) as total_average,
    COALESCE(l.like_count, 0) as actual_like_count
FROM submissions s
LEFT JOIN topics t ON s.topic_id = t.id
LEFT JOIN profiles p ON s.user_id = p.id
LEFT JOIN (
    SELECT 
        submission_id,
        COUNT(*) as feedback_count,
        ROUND(AVG(scalability_score::numeric), 1) as avg_scalability,
        ROUND(AVG(security_score::numeric), 1) as avg_security,
        ROUND(AVG(performance_score::numeric), 1) as avg_performance,
        ROUND(AVG(maintainability_score::numeric), 1) as avg_maintainability,
        ROUND(AVG(design_validity_score::numeric), 1) as avg_design_validity,
        ROUND(AVG((scalability_score + security_score + performance_score + maintainability_score + design_validity_score)::numeric / 5), 1) as total_average
    FROM feedbacks
    GROUP BY submission_id
) f ON s.id = f.submission_id
LEFT JOIN (
    SELECT 
        submission_id,
        COUNT(*) as like_count
    FROM submission_likes
    GROUP BY submission_id
) l ON s.id = l.submission_id;

-- お題に統計情報を含むビュー
CREATE VIEW topics_with_stats AS
SELECT 
    t.*,
    COALESCE(s.submission_count, 0) as submission_count,
    COALESCE(s.avg_rating, 0) as average_rating
FROM topics t
LEFT JOIN (
    SELECT 
        topic_id,
        COUNT(*) as submission_count,
        ROUND(AVG(
            CASE 
                WHEN f.total_average > 0 THEN f.total_average
                ELSE NULL
            END
        ), 1) as avg_rating
    FROM submissions sub
    LEFT JOIN (
        SELECT 
            submission_id,
            AVG((scalability_score + security_score + performance_score + maintainability_score + design_validity_score)::numeric / 5) as total_average
        FROM feedbacks
        GROUP BY submission_id
    ) f ON sub.id = f.submission_id
    WHERE sub.status = 'published'
    GROUP BY topic_id
) s ON t.id = s.topic_id
WHERE t.is_active = true;

-- ================================================
-- 7. 初期データ投入
-- ================================================

-- サンプルお題データ
INSERT INTO topics (title, description, category, difficulty_level, estimated_time, requirements) VALUES
('ECサイトの基本設計', 
 '商品管理、カート機能、決済システムを含む基本的なECサイトのシステム設計を行います。以下の要件を満たすシステムを設計してください。',
 'ECサイト', 
 1, 
 '1時間',
 '["ユーザー登録・ログイン機能", "商品カタログ管理", "ショッピングカート", "決済処理", "注文管理", "在庫管理"]'::jsonb),

('リアルタイムチャットアプリ',
 'WebSocketを使ったリアルタイム通信、メッセージ履歴、ファイル共有機能を含むチャットアプリケーションを設計してください。',
 'チャットアプリ',
 2,
 '1.5時間',
 '["リアルタイムメッセージング", "ユーザー認証", "チャンネル管理", "ファイル共有", "メッセージ履歴", "通知機能"]'::jsonb),

('マルチテナントSaaS基盤',
 '複数企業が利用できるSaaSの基盤設計。データ分離、認証、課金システム、マルチテナント対応を考慮してください。',
 'SaaS',
 4,
 '3時間',
 '["マルチテナント対応", "データ分離", "認証・認可", "課金システム", "API管理", "監視・ログ", "スケーラビリティ"]'::jsonb),

('配車アプリシステム',
 'ドライバーとユーザーのマッチング、リアルタイム位置情報管理、料金計算システムを設計してください。',
 'MaaS',
 3,
 '2時間',
 '["位置情報管理", "マッチングアルゴリズム", "料金計算", "決済処理", "ルート最適化", "リアルタイム通信"]'::jsonb),

('SNSプラットフォーム',
 'ユーザー間のフォロー関係、投稿・コメント機能、タイムライン表示を含むSNSプラットフォームを設計してください。',
 'SNS',
 2,
 '2時間',
 '["ユーザー管理", "フォロー機能", "投稿・コメント", "タイムライン", "通知システム", "検索機能"]'::jsonb),

('タスク管理システム',
 'チーム向けのタスク管理システム。プロジェクト管理、担当者割り当て、進捗管理機能を設計してください。',
 'タスク管理',
 2,
 '1.5時間',
 '["プロジェクト管理", "タスク作成・編集", "担当者管理", "進捗追跡", "締切管理", "レポート機能"]'::jsonb),

('認証・認可システム',
 'OAuth 2.0、SAML、多要素認証に対応した認証・認可システムを設計してください。',
 '認証システム',
 4,
 '2.5時間',
 '["OAuth 2.0対応", "多要素認証", "SAML対応", "セッション管理", "権限管理", "セキュリティ監査"]'::jsonb),

('決済プラットフォーム',
 '複数の決済手段に対応した決済プラットフォーム。セキュリティとPCI DSS準拠を考慮して設計してください。',
 '決済システム',
 5,
 '3時間以上',
 '["複数決済手段対応", "PCI DSS準拠", "不正検知", "返金処理", "定期課金", "レポート機能", "API設計"]'::jsonb);

-- データベース作成完了のコメント
-- 上記SQLを実行すると、以下が作成されます：
-- ✅ 5つのメインテーブル（profiles, topics, submissions, feedbacks, submission_likes）
-- ✅ パフォーマンス向上のためのインデックス
-- ✅ セキュリティのためのRow Level Security設定
-- ✅ 統計情報を効率的に取得するためのビュー
-- ✅ 初期データとしての8つのサンプルお題