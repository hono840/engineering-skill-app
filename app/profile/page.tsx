'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import type { Submission } from '@/lib/types'
import { DeleteAccountDialog } from '@/components/molecules/DeleteAccountDialog'
import { Button } from '@/components/atoms/Button'
import { performAccountDeletion, getAccountDeletionPreview } from '@/lib/account-deletion'

export default function ProfilePage() {
  const { user, profile, loading: authLoading } = useAuth()
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [stats, setStats] = useState({
    submissionCount: 0,
    feedbackCount: 0,
    averageRating: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deletionPreview, setDeletionPreview] = useState({
    submissionCount: 0,
    feedbackCount: 0,
    likeCount: 0,
  })
  const router = useRouter()

  const fetchUserData = useCallback(async () => {
    try {
      setError(null)
      console.log('Fetching user data for user:', user?.id)

      // 投稿データを統計情報と共に取得
      const { data: submissionsData, error: submissionsError } = await supabase
        .from('submissions_with_stats')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      console.log('Submissions data:', submissionsData)
      console.log('Submissions error:', submissionsError)

      if (submissionsError) {
        console.error('Submissions error details:', submissionsError)
        throw submissionsError
      }

      // 投稿データをそのまま設定
      setSubmissions(submissionsData || [])

      // ユーザーが投稿したフィードバック数を取得
      const { count: feedbackCount, error: feedbackError } = await supabase
        .from('feedbacks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id)

      console.log('Feedback count:', feedbackCount)
      console.log('Feedback error:', feedbackError)

      if (feedbackError) {
        console.error('Feedback error details:', feedbackError)
        // フィードバック取得エラーは非致命的なので警告のみ
        console.warn('Could not fetch feedback count, using 0')
      }

      setStats({
        submissionCount: submissionsData?.length || 0,
        feedbackCount: feedbackCount || 0,
        averageRating: 0, // 一時的に0に設定
      })
    } catch (error) {
      console.error('Error fetching user data:', error)
      setError(error instanceof Error ? error.message : 'データの取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }, [user])

  const handleDeleteAccount = async () => {
    if (!user || !profile) return

    // 削除前データ確認
    const preview = await getAccountDeletionPreview(user.id)
    setDeletionPreview(preview)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDeletion = async (password: string) => {
    if (!user || !profile) return

    try {
      setIsDeleting(true)
      await performAccountDeletion(profile.email, password, user.id)
      
      // 削除成功後、ログアウトしてホームページにリダイレクト
      await supabase.auth.signOut()
      router.push('/')
    } catch (error) {
      console.error('Account deletion failed:', error)
      setError(error instanceof Error ? error.message : 'アカウントの削除に失敗しました')
      setIsDeleteDialogOpen(false)
    } finally {
      setIsDeleting(false)
    }
  }

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
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">プロフィールが見つかりません</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
          <div className="text-red-600 mb-4">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-label="エラーアイコン"
            >
              <title>エラーアイコン</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.96-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">データの読み込みに失敗しました</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            type="button"
            onClick={() => {
              setError(null)
              fetchUserData()
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            再試行
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* プロフィール情報 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <div className="w-20 h-20 bg-gray-300 rounded-full mr-6" />
              <div className="flex-1">
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
            
            {/* プロフィール設定ボタン */}
            <div className="flex gap-2">
              <Button variant="secondary" size="sm">
                プロフィール編集
              </Button>
              <Button 
                variant="danger" 
                size="sm"
                onClick={handleDeleteAccount}
                disabled={isDeleting}
              >
                アカウント削除
              </Button>
            </div>
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

                  <p className="text-sm text-gray-600 mb-2">お題: {submission.topic_title}</p>

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

        {/* アカウント削除ダイアログ */}
        <DeleteAccountDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleConfirmDeletion}
          username={profile?.username || ''}
          loading={isDeleting}
          deletionPreview={deletionPreview}
        />
      </div>
    </div>
  )
}
