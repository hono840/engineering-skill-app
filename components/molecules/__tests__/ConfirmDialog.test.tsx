import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ConfirmDialog } from '../ConfirmDialog'

describe('ConfirmDialog', () => {
  it('ダイアログが正しく表示される', () => {
    const onClose = vi.fn()
    const onConfirm = vi.fn()

    render(
      <ConfirmDialog
        isOpen={true}
        onClose={onClose}
        onConfirm={onConfirm}
        title="確認"
        message="この操作を実行しますか？"
      />
    )

    expect(screen.getByText('確認')).toBeInTheDocument()
    expect(screen.getByText('この操作を実行しますか？')).toBeInTheDocument()
    expect(screen.getByText('はい')).toBeInTheDocument()
    expect(screen.getByText('いいえ')).toBeInTheDocument()
  })

  it('確認ボタンをクリックするとonConfirmが呼ばれる', () => {
    const onClose = vi.fn()
    const onConfirm = vi.fn()

    render(
      <ConfirmDialog
        isOpen={true}
        onClose={onClose}
        onConfirm={onConfirm}
        title="確認"
        message="この操作を実行しますか？"
      />
    )

    fireEvent.click(screen.getByText('はい'))
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('キャンセルボタンをクリックするとonCloseが呼ばれる', () => {
    const onClose = vi.fn()
    const onConfirm = vi.fn()

    render(
      <ConfirmDialog
        isOpen={true}
        onClose={onClose}
        onConfirm={onConfirm}
        title="確認"
        message="この操作を実行しますか？"
      />
    )

    fireEvent.click(screen.getByText('いいえ'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('カスタムボタンテキストが表示される', () => {
    const onClose = vi.fn()
    const onConfirm = vi.fn()

    render(
      <ConfirmDialog
        isOpen={true}
        onClose={onClose}
        onConfirm={onConfirm}
        title="削除確認"
        message="データを削除しますか？"
        confirmText="削除"
        cancelText="キャンセル"
      />
    )

    expect(screen.getByText('削除')).toBeInTheDocument()
    expect(screen.getByText('キャンセル')).toBeInTheDocument()
  })

  it('ローディング中はボタンが無効化される', () => {
    const onClose = vi.fn()
    const onConfirm = vi.fn()

    render(
      <ConfirmDialog
        isOpen={true}
        onClose={onClose}
        onConfirm={onConfirm}
        title="確認"
        message="この操作を実行しますか？"
        loading={true}
      />
    )

    const confirmButton = screen.getByText('処理中...')
    const cancelButton = screen.getByText('いいえ')

    expect(confirmButton).toBeDisabled()
    expect(cancelButton).toBeDisabled()
  })

  it('dangerスタイルの時は警告アイコンが表示される', () => {
    const onClose = vi.fn()
    const onConfirm = vi.fn()

    render(
      <ConfirmDialog
        isOpen={true}
        onClose={onClose}
        onConfirm={onConfirm}
        title="削除確認"
        message="データを削除しますか？"
        confirmStyle="danger"
      />
    )

    // SVGアイコンが存在することを確認
    const svgIcon = document.querySelector('svg')
    expect(svgIcon).toBeInTheDocument()
  })
})
