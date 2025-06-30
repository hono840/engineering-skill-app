'use client'

import { useRouter } from 'next/navigation'
import { SuccessDialog } from '@/components/molecules/SuccessDialog'
import { useAuth } from '@/lib/auth-context'

/**
 * ログアウト完了モーダルコンポーネント
 * ログアウト処理完了後に表示される成功モーダル
 */
export function LogoutSuccessModal() {
  const { showLogoutSuccess, setShowLogoutSuccess } = useAuth()
  const router = useRouter()

  const handleClose = () => {
    setShowLogoutSuccess(false)
    // ログイン画面にリダイレクト
    router.push('/auth/login')
  }

  return (
    <SuccessDialog
      isOpen={showLogoutSuccess}
      onClose={handleClose}
      title="ログアウト完了"
      message="ログアウトが完了しました"
      okText="OK"
      autoCloseMs={3000} // 3秒後に自動閉じ
      iconType="check"
    />
  )
}
