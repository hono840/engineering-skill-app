'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import { supabase } from '@/lib/supabase'

function VerifyEmailContent() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState<string | null>(null)
  const _router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // URLパラメータからメールアドレスを取得
    const emailParam = searchParams.get('email')
    if (emailParam) {
      setEmail(emailParam)
    }
  }, [searchParams])

  const handleResendEmail = async () => {
    if (!email) {
      setError('メールアドレスを入力してください')
      return
    }

    setLoading(true)
    setError(null)
    setMessage('')

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      })

      if (error) throw error

      setMessage('確認メールを再送信しました。メールボックスをご確認ください。')
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'メールの再送信に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {/* メールアイコン */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
            <svg
              className="h-8 w-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="メールアイコン"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>

          <h2 className="text-3xl font-extrabold text-gray-900">メール確認</h2>
          <p className="mt-2 text-sm text-gray-600">登録確認のメールを送信しました</p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-gray-700">
                {email && (
                  <>
                    <span className="font-medium">{email}</span> に
                  </>
                )}
                確認メールを送信しました。
              </p>
              <p className="text-sm text-gray-500 mt-2">
                メール内のリンクをクリックして、アカウントの確認を完了してください。
              </p>
            </div>

            {/* メール確認の手順 */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">確認手順：</h3>
              <ol className="text-sm text-gray-600 space-y-1">
                <li>1. メールボックス（迷惑メールフォルダも含む）を確認</li>
                <li>2. 「アカウント確認」メールを開く</li>
                <li>3. メール内の「確認」ボタンまたはリンクをクリック</li>
                <li>4. 確認完了後、ログインページに移動</li>
              </ol>
            </div>

            {/* メール再送信セクション */}
            <div className="border-t border-gray-200 pt-4">
              <p className="text-sm text-gray-600 mb-3">メールが届かない場合は、再送信できます：</p>

              <div className="space-y-3">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    メールアドレス
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <button
                  type="button"
                  onClick={handleResendEmail}
                  disabled={loading || !email}
                  className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-50 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? '送信中...' : '確認メールを再送信'}
                </button>
              </div>
            </div>

            {/* メッセージ表示 */}
            {message && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded text-sm">
                {message}
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded text-sm">
                {error}
              </div>
            )}

            {/* アクション */}
            <div className="flex flex-col space-y-2 pt-4">
              <Link
                href="/auth/login"
                className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                ログインページに戻る
              </Link>

              <Link
                href="/topics"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                お題一覧を見る
              </Link>
            </div>
          </div>
        </div>

        {/* 注意事項 */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            メールが届かない場合は、迷惑メールフォルダもご確認ください。
            <br />
            それでも届かない場合は、メールアドレスが正しいかご確認の上、再送信してください。
          </p>
        </div>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">読み込み中...</div>}>
      <VerifyEmailContent />
    </Suspense>
  )
}
