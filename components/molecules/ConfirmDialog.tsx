'use client'

import { Modal } from '@/components/atoms/Modal'

interface ConfirmDialogProps {
  /**
   * ダイアログの表示状態
   */
  isOpen: boolean
  /**
   * ダイアログを閉じるためのコールバック関数
   */
  onClose: () => void
  /**
   * 確認時のコールバック関数
   */
  onConfirm: () => void
  /**
   * ダイアログのタイトル
   */
  title: string
  /**
   * ダイアログのメッセージ
   */
  message: string
  /**
   * 確認ボタンのテキスト（デフォルト: "はい"）
   */
  confirmText?: string
  /**
   * キャンセルボタンのテキスト（デフォルト: "いいえ"）
   */
  cancelText?: string
  /**
   * 確認ボタンのスタイル（デフォルト: "danger"）
   */
  confirmStyle?: 'primary' | 'danger' | 'warning'
  /**
   * 確認処理中のローディング状態
   */
  loading?: boolean
}

/**
 * 確認ダイアログコンポーネント
 * ユーザーの操作確認に使用する汎用的なダイアログ
 */
export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'はい',
  cancelText = 'いいえ',
  confirmStyle = 'danger',
  loading = false,
}: ConfirmDialogProps) {
  // 確認ボタンのスタイルクラス
  const confirmButtonStyles = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500',
    danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    warning: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
  }

  // アイコンの選択
  const iconStyles = {
    primary: 'text-indigo-600',
    danger: 'text-red-600',
    warning: 'text-yellow-600',
  }

  const handleConfirm = () => {
    if (!loading) {
      onConfirm()
    }
  }

  const handleCancel = () => {
    if (!loading) {
      onClose()
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} size="sm">
      <div className="sm:flex sm:items-start">
        {/* アイコン */}
        <div
          className={
            'mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10'
          }
        >
          {confirmStyle === 'danger' && (
            <svg
              className={`h-6 w-6 ${iconStyles[confirmStyle]}`}
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          )}
          {confirmStyle === 'warning' && (
            <svg
              className={`h-6 w-6 ${iconStyles[confirmStyle]}`}
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
          )}
          {confirmStyle === 'primary' && (
            <svg
              className={`h-6 w-6 ${iconStyles[confirmStyle]}`}
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
              />
            </svg>
          )}
        </div>

        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
          {/* タイトル */}
          <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
            {title}
          </h3>

          {/* メッセージ */}
          <div className="mt-2">
            <p className="text-sm text-gray-500">{message}</p>
          </div>
        </div>
      </div>

      {/* ボタン */}
      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
        <button
          type="button"
          className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed ${confirmButtonStyles[confirmStyle]}`}
          onClick={handleConfirm}
          disabled={loading}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                role="img"
                aria-label="読み込み中"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              処理中...
            </>
          ) : (
            confirmText
          )}
        </button>

        <button
          type="button"
          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleCancel}
          disabled={loading}
        >
          {cancelText}
        </button>
      </div>
    </Modal>
  )
}
