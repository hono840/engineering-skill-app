'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import type { Submission, Feedback } from '@/lib/types'

export default function ProfilePage() {
  const { user, profile, loading: authLoading } = useAuth()
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [stats, setStats] = useState({
    submissionCount: 0,
    feedbackCount: 0,
    averageRating: 0,
  })
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchUserData = useCallback(async () => {
    try {
      // ユーザーの投稿を取得
      const { data: submissionsData, error: submissionsError } = await supabase
        .from('submissions')
        .select(`
          *,
          topics!topic_id (
            title,
            category
          ),
          feedbacks (
            scalability_score,
            security_score,
            performance_score,
            maintainability_score,
            design_validity_score
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (submissionsError) throw submissionsError

      // 統計情報を計算
      let totalFeedbacks = 0
      let totalScore = 0

      const submissionsWithStats =
        submissionsData?.map((submission) => {
          const feedbacks = submission.feedbacks || []
          const feedbackCount = feedbacks.length
          totalFeedbacks += feedbackCount

          if (feedbackCount > 0) {
            const avgScore =
              feedbacks.reduce((sum: number, f: Feedback) => {
                const score =
                  (f.scalability_score +
                    f.security_score +
                    f.performance_score +
                    f.maintainability_score +
                    f.design_validity_score) /
                  5
                return sum + score
              }, 0) / feedbackCount
            totalScore += avgScore * feedbackCount
          }

          return {
            ...submission,
            topic: submission.topics,
            feedback_count: feedbackCount,
          }
        }) || []

      setSubmissions(submissionsWithStats)

      // ユーザーが投稿したフィードバック数を取得
      const { count: feedbackCount } = await supabase
        .from('feedbacks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id)

      setStats({
        submissionCount: submissionsWithStats.length,
        feedbackCount: feedbackCount || 0,
        averageRating: totalFeedbacks > 0 ? totalScore / totalFeedbacks : 0,
      })
    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
      return
    }

    if (user) {
      fetchUserData()
    }
  }, [user, authLoading, router, fetchUserData])

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">読み込み中...</div>
      </div>
    )
  }

  if (!profile) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* プロフィール情報 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <div className="w-20 h-20 bg-gray-300 rounded-full mr-6" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{profile.display_name}</h1>
                <p className="text-gray-600">@{profile.username}</p>
                {profile.bio && <p className="mt-2 text-gray-700">{profile.bio}</p>}
                <div className="mt-2 flex gap-4">
                  {profile.github_url && (
                    <a
                      href={profile.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-900"
                    >
                      GitHub
                    </a>
                  )}
                  {profile.portfolio_url && (
                    <a
                      href={profile.portfolio_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Portfolio
                    </a>
                  )}
                </div>
              </div>
            </div>
            <Link
              href="/profile/edit"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              プロフィール編集
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.submissionCount}</div>
              <div className="text-sm text-gray-500">投稿数</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.feedbackCount}</div>
              <div className="text-sm text-gray-500">フィードバック数</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : '-'}
              </div>
              <div className="text-sm text-gray-500">平均評価</div>
            </div>
          </div>
        </div>

        {/* 投稿一覧 */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">投稿した設計図</h2>

          {submissions.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-500">まだ設計図を投稿していません</p>
              <Link
                href="/topics"
                className="mt-4 inline-block px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                お題を見る
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {submissions.map((submission) => (
                <Link
                  key={submission.id}
                  href={`/submissions/${submission.id}`}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{submission.title}</h3>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        submission.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {submission.status === 'published' ? '公開' : '下書き'}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-2">お題: {submission.topic?.title}</p>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {submission.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{new Date(submission.created_at).toLocaleDateString('ja-JP')}</span>
                    <span>{submission.feedback_count || 0}件のフィードバック</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
