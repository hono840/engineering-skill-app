'use client'

import { type ReactNode, useEffect } from 'react'

interface ModalProps {
  /**
   * モーダルの表示状態
   */
  isOpen: boolean
  /**
   * モーダルを閉じるためのコールバック関数
   */
  onClose: () => void
  /**
   * モーダル内に表示するコンテンツ
   */
  children: ReactNode
  /**
   * オーバーレイクリックでモーダルを閉じるかどうか（デフォルト: true）
   */
  closeOnOverlayClick?: boolean
  /**
   * ESCキーでモーダルを閉じるかどうか（デフォルト: true）
   */
  closeOnEscape?: boolean
  /**
   * モーダルのサイズ
   */
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

/**
 * 汎用的なモーダルコンポーネント
 * アクセシビリティ対応とキーボード操作に対応
 */
export function Modal({
  isOpen,
  onClose,
  children,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  size = 'md',
}: ModalProps) {
  // ESCキーでモーダルを閉じる処理
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, closeOnEscape, onClose])

  // モーダルが開いている間はスクロールを無効化
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = 'unset'
      }
    }
  }, [isOpen])

  // フォーカス管理：モーダルが開いた時に最初のフォーカス可能な要素にフォーカス
  useEffect(() => {
    if (!isOpen) return

    const modalElement = document.querySelector('[role="dialog"]')
    if (modalElement) {
      const focusableElements = modalElement.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      const firstElement = focusableElements[0] as HTMLElement
      if (firstElement) {
        firstElement.focus()
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  // サイズに応じたCSSクラス
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      {/* オーバーレイ */}
      {/* biome-ignore lint/a11y/noStaticElementInteractions: モーダルオーバーレイのクリック機能に必要 */}
      <div
        className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
        onClick={handleOverlayClick}
        onKeyDown={(event) => {
          if (closeOnEscape && event.key === 'Escape') {
            onClose()
          }
        }}
        role="presentation"
        tabIndex={-1}
      >
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
        />

        {/* モーダルの中央配置のためのスペーサー */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        {/* モーダルコンテンツ */}
        <div
          className={`relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:w-full sm:p-6 ${sizeClasses[size]}`}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
