export interface Profile {
  id: string
  email: string
  username: string
  display_name: string
  avatar_url?: string
  bio?: string
  github_url?: string
  portfolio_url?: string
  created_at: string
  updated_at: string
}

export interface Topic {
  id: string
  title: string
  description: string
  category:
    | 'SaaS'
    | 'ECサイト'
    | 'チャットアプリ'
    | 'MaaS'
    | '認証システム'
    | '決済システム'
    | 'SNS'
    | 'ブログ'
    | 'タスク管理'
    | 'その他'
  difficulty_level: 1 | 2 | 3 | 4 | 5
  estimated_time: string
  requirements: string[]
  is_active: boolean
  created_by?: string
  created_at: string
  updated_at: string
  submission_count?: number
  average_rating?: number
}

export interface Submission {
  id: string
  user_id: string
  topic_id: string
  title: string
  design_data: ReactFlowJsonObject
  description: string
  technical_reasoning?: string
  challenges_and_solutions?: string
  status: 'draft' | 'published'
  view_count: number
  like_count: number
  created_at: string
  updated_at: string
  topic?: Topic
  user?: Profile
  feedback_summary?: FeedbackSummary
  feedback_count?: number
  // Fields from submissions_with_stats view
  topic_title?: string
  topic_category?: string
  username?: string
  display_name?: string
  avatar_url?: string
  avg_scalability?: number
  avg_security?: number
  avg_performance?: number
  avg_maintainability?: number
  avg_design_validity?: number
  total_average?: number
  actual_like_count?: number
}

export interface Feedback {
  id: string
  user_id: string
  submission_id: string
  scalability_score: number
  security_score: number
  performance_score: number
  maintainability_score: number
  design_validity_score: number
  comment: string
  is_helpful: boolean
  created_at: string
  updated_at: string
  user?: Profile
}

export interface FeedbackData {
  scalability_score: number
  security_score: number
  performance_score: number
  maintainability_score: number
  design_validity_score: number
  comment: string
}

export interface FeedbackSummary {
  total_count: number
  average_scores: {
    scalability_score: number
    security_score: number
    performance_score: number
    maintainability_score: number
    design_validity_score: number
  }
}

export interface SubmissionLike {
  id: string
  user_id: string
  submission_id: string
  created_at: string
}

export interface ReactFlowJsonObject {
  nodes: Array<{
    id: string
    position: { x: number; y: number }
    data: Record<string, unknown>
    type?: string
  }>
  edges: Array<{
    id: string
    source: string
    target: string
    [key: string]: unknown
  }>
}
