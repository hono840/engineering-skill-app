'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Topic, Submission } from '@/lib/types'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'

const DIFFICULTY_LABELS = {
  1: '初級',
  2: '中級',
  3: '上級',
  4: 'エキスパート',
  5: 'マスター'
}

const DIFFICULTY_COLORS = {
  1: 'bg-green-100 text-green-800',
  2: 'bg-blue-100 text-blue-800',
  3: 'bg-yellow-100 text-yellow-800',
  4: 'bg-orange-100 text-orange-800',
  5: 'bg-red-100 text-red-800'
}

export default function TopicDetailPage({ params }: { params: { id: string } }) {
  const [topic, setTopic] = useState<Topic | null>(null)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    fetchTopicAndSubmissions()
  }, [params.id])

  const fetchTopicAndSubmissions = async () => {
    try {
      // お題の詳細を取得
      const { data: topicData, error: topicError } = await supabase
        .from('topics')
        .select('*')
        .eq('id', params.id)
        .single()

      if (topicError) throw topicError
      setTopic(topicData)

      // 投稿一覧を取得
      const { data: submissionsData, error: submissionsError } = await supabase
        .from('submissions')
        .select(`
          *,
          profiles!user_id (
            username,
            display_name,
            avatar_url
          ),
          feedbacks (
            scalability_score,
            security_score,
            performance_score,
            maintainability_score,
            design_validity_score
          )
        `)
        .eq('topic_id', params.id)
        .eq('status', 'published')
        .order('created_at', { ascending: false })

      if (submissionsError) throw submissionsError

      // フィードバックの平均スコアを計算
      const submissionsWithStats = submissionsData?.map(submission => {
        const feedbacks = submission.feedbacks || []
        const totalCount = feedbacks.length

        if (totalCount === 0) {
          return {
            ...submission,
            feedback_summary: {
              total_count: 0,
              average_scores: {
                scalability_score: 0,
                security_score: 0,
                performance_score: 0,
                maintainability_score: 0,
                design_validity_score: 0
              }
            }
          }
        }

        const averageScores = {
          scalability_score: feedbacks.reduce((sum: number, f: any) => sum + f.scalability_score, 0) / totalCount,
          security_score: feedbacks.reduce((sum: number, f: any) => sum + f.security_score, 0) / totalCount,
          performance_score: feedbacks.reduce((sum: number, f: any) => sum + f.performance_score, 0) / totalCount,
          maintainability_score: feedbacks.reduce((sum: number, f: any) => sum + f.maintainability_score, 0) / totalCount,
          design_validity_score: feedbacks.reduce((sum: number, f: any) => sum + f.design_validity_score, 0) / totalCount
        }

        return {
          ...submission,
          user: submission.profiles,
          feedback_summary: {
            total_count: totalCount,
            average_scores: averageScores
          }
        }
      }) || []

      setSubmissions(submissionsWithStats)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStartDesign = () => {
    if (!user) {
      router.push('/auth/login')
      return
    }
    router.push(`/editor?topic=${params.id}`)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">読み込み中...</div>
      </div>
    )
  }

  if (!topic) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">お題が見つかりません</div>
      </div>
    )
  }

  const overallAverage = submissions.length > 0
    ? submissions.reduce((sum, s) => {
        const scores = s.feedback_summary?.average_scores
        if (!scores) return sum
        const avg = (scores.scalability_score + scores.security_score + scores.performance_score + 
                    scores.maintainability_score + scores.design_validity_score) / 5
        return sum + avg
      }, 0) / submissions.length
    : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* お題の詳細 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {topic.title}
              </h1>
              <div className="flex items-center gap-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {topic.category}
                </span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    DIFFICULTY_COLORS[topic.difficulty_level as keyof typeof DIFFICULTY_COLORS]
                  }`}
                >
                  {DIFFICULTY_LABELS[topic.difficulty_level as keyof typeof DIFFICULTY_LABELS]}
                </span>
                <span className="text-sm text-gray-500">
                  目安時間: {topic.estimated_time}
                </span>
              </div>
            </div>
            <button
              onClick={handleStartDesign}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              設計を始める
            </button>
          </div>

          <div className="prose max-w-none">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">説明</h3>
            <p className="text-gray-600 whitespace-pre-wrap">{topic.description}</p>

            {topic.requirements && topic.requirements.length > 0 && (
              <>
                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">要件</h3>
                <ul className="list-disc list-inside text-gray-600">
                  {topic.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {submissions.length}
                </div>
                <div className="text-sm text-gray-500">投稿数</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {overallAverage > 0 ? overallAverage.toFixed(1) : '-'}
                </div>
                <div className="text-sm text-gray-500">平均評価</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {submissions.reduce((sum, s) => sum + (s.feedback_summary?.total_count || 0), 0)}
                </div>
                <div className="text-sm text-gray-500">総フィードバック数</div>
              </div>
            </div>
          </div>
        </div>

        {/* 投稿一覧 */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            みんなの設計図
          </h2>

          {submissions.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-500">まだ投稿がありません。最初の投稿者になりましょう！</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {submissions.map((submission) => {
                const totalScore = submission.feedback_summary?.average_scores
                  ? (submission.feedback_summary.average_scores.scalability_score +
                     submission.feedback_summary.average_scores.security_score +
                     submission.feedback_summary.average_scores.performance_score +
                     submission.feedback_summary.average_scores.maintainability_score +
                     submission.feedback_summary.average_scores.design_validity_score) / 5
                  : 0

                return (
                  <Link
                    key={submission.id}
                    href={`/submissions/${submission.id}`}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {submission.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {submission.description}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <span>{submission.user?.display_name}</span>
                      <span>{new Date(submission.created_at).toLocaleDateString('ja-JP')}</span>
                    </div>

                    {submission.feedback_summary && submission.feedback_summary.total_count > 0 && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-yellow-400 mr-1">★</span>
                          <span className="font-medium">{totalScore.toFixed(1)}</span>
                          <span className="text-gray-500 ml-1">
                            ({submission.feedback_summary.total_count}件)
                          </span>
                        </div>
                      </div>
                    )}
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}