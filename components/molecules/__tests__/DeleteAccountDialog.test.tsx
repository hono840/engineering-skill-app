import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, beforeEach, describe, test, expect } from 'vitest'
import { DeleteAccountDialog } from '../DeleteAccountDialog'

// モックプロップス
const mockProps = {
  isOpen: true,
  onClose: vi.fn(),
  onConfirm: vi.fn(),
  username: 'testuser',
  loading: false,
  deletionPreview: {
    submissionCount: 5,
    feedbackCount: 10,
    likeCount: 3,
  },
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('DeleteAccountDialog', () => {
  test('ダイアログが正しく表示される', () => {
    render(<DeleteAccountDialog {...mockProps} />)

    expect(screen.getByText('アカウントを削除')).toBeInTheDocument()
    expect(screen.getByText('この操作は取り消すことができません。以下の内容が完全に削除されます：')).toBeInTheDocument()
  })

  test('削除プレビューデータが表示される', () => {
    render(<DeleteAccountDialog {...mockProps} />)

    expect(screen.getByText('投稿した設計図: 5件')).toBeInTheDocument()
    expect(screen.getByText('投稿したフィードバック: 10件')).toBeInTheDocument()
    expect(screen.getByText('いいね: 3件')).toBeInTheDocument()
  })

  test('確認テキストの入力が正しく動作する', async () => {
    render(<DeleteAccountDialog {...mockProps} />)

    const input = screen.getByPlaceholderText('testuser/delete')
    const nextButton = screen.getByText('次へ')

    // 初期状態では次へボタンが無効
    expect(nextButton).toBeDisabled()

    // 正しいテキストを入力
    fireEvent.change(input, { target: { value: 'testuser/delete' } })

    // 次へボタンが有効になる
    expect(nextButton).not.toBeDisabled()
  })

  test('パスワード入力画面に遷移する', async () => {
    render(<DeleteAccountDialog {...mockProps} />)

    const input = screen.getByPlaceholderText('testuser/delete')
    const nextButton = screen.getByText('次へ')

    fireEvent.change(input, { target: { value: 'testuser/delete' } })
    fireEvent.click(nextButton)

    await waitFor(() => {
      expect(screen.getByText('最後の確認として、現在のパスワードを入力してください。')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('現在のパスワード')).toBeInTheDocument()
    })
  })

  test('パスワード入力から戻ることができる', async () => {
    render(<DeleteAccountDialog {...mockProps} />)

    // 確認画面から次へ
    const input = screen.getByPlaceholderText('testuser/delete')
    fireEvent.change(input, { target: { value: 'testuser/delete' } })
    fireEvent.click(screen.getByText('次へ'))

    await waitFor(() => {
      const backButton = screen.getByText('戻る')
      fireEvent.click(backButton)
    })

    await waitFor(() => {
      expect(screen.getByText(/続行するには、/)).toBeInTheDocument()
    })
  })

  test('アカウント削除が実行される', async () => {
    const mockOnConfirm = vi.fn().mockResolvedValue(undefined)
    render(<DeleteAccountDialog {...mockProps} onConfirm={mockOnConfirm} />)

    // 確認画面から次へ
    const confirmInput = screen.getByPlaceholderText('testuser/delete')
    fireEvent.change(confirmInput, { target: { value: 'testuser/delete' } })
    fireEvent.click(screen.getByText('次へ'))

    await waitFor(() => {
      // パスワード入力
      const passwordInput = screen.getByPlaceholderText('現在のパスワード')
      fireEvent.change(passwordInput, { target: { value: 'password123' } })

      const deleteButton = screen.getByRole('button', { name: 'アカウントを削除' })
      fireEvent.click(deleteButton)
    })

    expect(mockOnConfirm).toHaveBeenCalledWith('password123')
  })

  test('キャンセルボタンが動作する', () => {
    render(<DeleteAccountDialog {...mockProps} />)

    const cancelButton = screen.getByText('キャンセル')
    fireEvent.click(cancelButton)

    expect(mockProps.onClose).toHaveBeenCalled()
  })

  test('ローディング状態が正しく表示される', () => {
    render(<DeleteAccountDialog {...mockProps} loading={true} />)

    // ローディング中はボタンが無効になる
    const cancelButton = screen.getByText('キャンセル')
    const nextButton = screen.getByText('次へ')

    expect(cancelButton).toBeDisabled()
    expect(nextButton).toBeDisabled()
  })

  test('削除プレビューがない場合でも正常に表示される', () => {
    const propsWithoutPreview = { ...mockProps, deletionPreview: undefined }
    render(<DeleteAccountDialog {...propsWithoutPreview} />)

    expect(screen.getByText('アカウントを削除')).toBeInTheDocument()
    expect(screen.queryByText('削除されるデータ')).not.toBeInTheDocument()
  })

  test('不正な確認テキストでは次に進めない', () => {
    render(<DeleteAccountDialog {...mockProps} />)

    const input = screen.getByPlaceholderText('testuser/delete')
    const nextButton = screen.getByText('次へ')

    fireEvent.change(input, { target: { value: 'wrong/text' } })

    expect(nextButton).toBeDisabled()
  })

  test('短すぎるパスワードでは削除できない', async () => {
    render(<DeleteAccountDialog {...mockProps} />)

    // 確認画面から次へ
    const confirmInput = screen.getByPlaceholderText('testuser/delete')
    fireEvent.change(confirmInput, { target: { value: 'testuser/delete' } })
    fireEvent.click(screen.getByText('次へ'))

    await waitFor(() => {
      const passwordInput = screen.getByPlaceholderText('現在のパスワード')
      fireEvent.change(passwordInput, { target: { value: '123' } })

      const deleteButton = screen.getByRole('button', { name: 'アカウントを削除' })
      expect(deleteButton).toBeDisabled()
    })
  })
})