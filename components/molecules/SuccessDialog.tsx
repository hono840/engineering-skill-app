'use client'

import { useEffect } from 'react'
import { Modal } from '@/components/atoms/Modal'

interface SuccessDialogProps {
  /**
   * ダイアログの表示状態
   */
  isOpen: boolean
  /**
   * ダイアログを閉じるためのコールバック関数
   */
  onClose: () => void
  /**
   * ダイアログのタイトル
   */
  title: string
  /**
   * ダイアログのメッセージ
   */
  message: string
  /**
   * OKボタンのテキスト（デフォルト: "OK"）
   */
  okText?: string
  /**
   * 自動で閉じるまでの時間（ミリ秒）。設定しない場合は自動で閉じない
   */
  autoCloseMs?: number
  /**
   * 成功アイコンの種類
   */
  iconType?: 'check' | 'thumbs-up' | 'celebration'
}

/**
 * 成功ダイアログコンポーネント
 * 操作完了の通知に使用する汎用的なダイアログ
 */
export function SuccessDialog({
  isOpen,
  onClose,
  title,
  message,
  okText = 'OK',
  autoCloseMs,
  iconType = 'check',
}: SuccessDialogProps) {
  // 自動閉じ機能
  useEffect(() => {
    if (!isOpen || !autoCloseMs) return

    const timer = setTimeout(() => {
      onClose()
    }, autoCloseMs)

    return () => clearTimeout(timer)
  }, [isOpen, autoCloseMs, onClose])

  // アイコンの選択
  const renderIcon = () => {
    const baseClasses = 'h-6 w-6 text-green-600'

    switch (iconType) {
      case 'check':
        return (
          <svg
            className={baseClasses}
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        )
      case 'thumbs-up':
        return (
          <svg
            className={baseClasses}
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5.25 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z"
            />
          </svg>
        )
      case 'celebration':
        return (
          <svg
            className={baseClasses}
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
            />
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="sm:flex sm:items-start">
        {/* アイコン */}
        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
          {renderIcon()}
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

          {/* 自動閉じのカウントダウン表示 */}
          {autoCloseMs && (
            <div className="mt-2">
              <p className="text-xs text-gray-400">
                {Math.ceil(autoCloseMs / 1000)}秒後に自動的に閉じます
              </p>
            </div>
          )}
        </div>
      </div>

      {/* OKボタン */}
      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
        <button
          type="button"
          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
          onClick={onClose}
        >
          {okText}
        </button>
      </div>
    </Modal>
  )
}
