import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { SuccessDialog } from '../SuccessDialog'

describe('SuccessDialog', () => {
  it('ダイアログが正しく表示される', () => {
    const onClose = vi.fn()

    render(
      <SuccessDialog isOpen={true} onClose={onClose} title="成功" message="操作が完了しました" />
    )

    expect(screen.getByText('成功')).toBeInTheDocument()
    expect(screen.getByText('操作が完了しました')).toBeInTheDocument()
    expect(screen.getByText('OK')).toBeInTheDocument()
  })

  it('OKボタンをクリックするとonCloseが呼ばれる', () => {
    const onClose = vi.fn()

    render(
      <SuccessDialog isOpen={true} onClose={onClose} title="成功" message="操作が完了しました" />
    )

    fireEvent.click(screen.getByText('OK'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('カスタムOKボタンテキストが表示される', () => {
    const onClose = vi.fn()

    render(
      <SuccessDialog
        isOpen={true}
        onClose={onClose}
        title="完了"
        message="保存しました"
        okText="閉じる"
      />
    )

    expect(screen.getByText('閉じる')).toBeInTheDocument()
  })

  it('自動閉じのメッセージが表示される', () => {
    const onClose = vi.fn()

    render(
      <SuccessDialog
        isOpen={true}
        onClose={onClose}
        title="成功"
        message="操作が完了しました"
        autoCloseMs={3000}
      />
    )

    expect(screen.getByText('3秒後に自動的に閉じます')).toBeInTheDocument()
  })

  it('checkアイコンが表示される', () => {
    const onClose = vi.fn()

    render(
      <SuccessDialog
        isOpen={true}
        onClose={onClose}
        title="成功"
        message="操作が完了しました"
        iconType="check"
      />
    )

    // SVGアイコンが存在することを確認
    const svgIcon = document.querySelector('svg')
    expect(svgIcon).toBeInTheDocument()
  })

  it('autoCloseMsが設定されている場合、指定時間後にonCloseが呼ばれる', async () => {
    vi.useFakeTimers()
    const onClose = vi.fn()

    render(
      <SuccessDialog
        isOpen={true}
        onClose={onClose}
        title="成功"
        message="操作が完了しました"
        autoCloseMs={1000}
      />
    )

    // 1秒後にonCloseが呼ばれることを確認
    vi.advanceTimersByTime(1000)
    expect(onClose).toHaveBeenCalledTimes(1)

    vi.useRealTimers()
  })
})
