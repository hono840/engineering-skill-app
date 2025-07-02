'use client'

import { useState } from 'react'
import { Modal } from '@/components/atoms/Modal'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'

interface DeleteAccountDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (password: string) => Promise<void>
  username: string
  loading?: boolean
  deletionPreview?: {
    submissionCount: number
    feedbackCount: number
    likeCount: number
  }
}

export function DeleteAccountDialog({
  isOpen,
  onClose,
  onConfirm,
  username,
  loading = false,
  deletionPreview,
}: DeleteAccountDialogProps) {
  const [confirmText, setConfirmText] = useState('')
  const [password, setPassword] = useState('')
  const [step, setStep] = useState<'confirm' | 'password'>('confirm')

  const expectedText = `${username}/delete`
  const isConfirmValid = confirmText === expectedText
  const isPasswordValid = password.length >= 6

  const handleNext = () => {
    if (step === 'confirm' && isConfirmValid) {
      setStep('password')
    }
  }

  const handleConfirm = async () => {
    if (step === 'password' && isPasswordValid) {
      await onConfirm(password)
    }
  }

  const handleClose = () => {
    setConfirmText('')
    setPassword('')
    setStep('confirm')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
          <svg
            className="w-6 h-6 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <title>警告アイコン</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.96-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
          アカウントを削除
        </h3>

        {step === 'confirm' && (
          <>
            <div className="text-sm text-gray-600 mb-6 space-y-3">
              <p>この操作は取り消すことができません。以下の内容が完全に削除されます：</p>
              
              {deletionPreview && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <h4 className="font-medium text-red-800 mb-2">削除されるデータ</h4>
                  <ul className="list-disc list-inside ml-2 space-y-1 text-red-700">
                    <li>プロフィール情報</li>
                    <li>投稿した設計図: {deletionPreview.submissionCount}件</li>
                    <li>投稿したフィードバック: {deletionPreview.feedbackCount}件</li>
                    <li>いいね: {deletionPreview.likeCount}件</li>
                    <li>その他すべてのアカウントデータ</li>
                  </ul>
                </div>
              )}
              
              <p className="font-medium text-red-600">
                続行するには、<code className="bg-gray-100 px-1 rounded">{expectedText}</code> と入力してください。
              </p>
            </div>

            <Input
              type="text"
              placeholder={expectedText}
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="mb-4"
            />

            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={handleClose}
                className="flex-1"
                disabled={loading}
              >
                キャンセル
              </Button>
              <Button
                variant="danger"
                onClick={handleNext}
                className="flex-1"
                disabled={!isConfirmValid || loading}
              >
                次へ
              </Button>
            </div>
          </>
        )}

        {step === 'password' && (
          <>
            <div className="text-sm text-gray-600 mb-6">
              <p>最後の確認として、現在のパスワードを入力してください。</p>
            </div>

            <Input
              type="password"
              placeholder="現在のパスワード"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-4"
            />

            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => setStep('confirm')}
                className="flex-1"
                disabled={loading}
              >
                戻る
              </Button>
              <Button
                variant="danger"
                onClick={handleConfirm}
                className="flex-1"
                disabled={!isPasswordValid}
                loading={loading}
              >
                アカウントを削除
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  )
}