'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ConfirmDialog } from '@/components/molecules/ConfirmDialog'
import { useAuth } from '@/lib/auth-context'

export default function Header() {
  const { user, profile, signOut } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const _router = useRouter()

  const handleSignOutClick = () => {
    setIsMenuOpen(false)
    setIsLogoutConfirmOpen(true)
  }

  const handleSignOutConfirm = async () => {
    setIsLoggingOut(true)
    try {
      await signOut()
      setIsLogoutConfirmOpen(false)
      // ログアウト完了モーダルが表示されるため、ここでのリダイレクトは不要
    } catch (error) {
      console.error('ログアウト処理でエラーが発生しました:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  const handleSignOutCancel = () => {
    setIsLogoutConfirmOpen(false)
  }

  return (
    <header className="bg-night-950 border-b border-night-800 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-dark-purple-400">ArchFlow</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/topics"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-white hover:text-dark-purple-400"
              >
                お題一覧
              </Link>
              {user && (
                <Link
                  href="/profile"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-white hover:text-dark-purple-400"
                >
                  マイページ
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center">
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dark-purple-500 focus:ring-offset-night-950"
                >
                  <div className="w-8 h-8 bg-night-700 rounded-full mr-2" />
                  <span className="hidden sm:block text-white">
                    {profile?.display_name || profile?.username}
                  </span>
                </button>

                {isMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-night-900 ring-1 ring-night-700 ring-opacity-50">
                    <div className="py-1">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-white hover:bg-night-800"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        プロフィール
                      </Link>
                      <button
                        type="button"
                        onClick={handleSignOutClick}
                        className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-night-800"
                      >
                        ログアウト
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/auth/login"
                  className="text-white hover:text-dark-purple-400 text-sm font-medium"
                >
                  ログイン
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-dark-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-dark-purple-700"
                >
                  新規登録
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ログアウト確認モーダル */}
      <ConfirmDialog
        isOpen={isLogoutConfirmOpen}
        onClose={handleSignOutCancel}
        onConfirm={handleSignOutConfirm}
        title="ログアウトの確認"
        message="ログアウトしますか？"
        confirmText="はい"
        cancelText="いいえ"
        confirmStyle="danger"
        loading={isLoggingOut}
      />
    </header>
  )
}
