import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Modal } from '../Modal'

describe('Modal', () => {
  it('モーダルが開いている時に正しく表示される', () => {
    const onClose = vi.fn()

    render(
      <Modal isOpen={true} onClose={onClose}>
        <div>テストコンテンツ</div>
      </Modal>
    )

    expect(screen.getByText('テストコンテンツ')).toBeInTheDocument()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('モーダルが閉じている時は表示されない', () => {
    const onClose = vi.fn()

    render(
      <Modal isOpen={false} onClose={onClose}>
        <div>テストコンテンツ</div>
      </Modal>
    )

    expect(screen.queryByText('テストコンテンツ')).not.toBeInTheDocument()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('ESCキーを押すとonCloseが呼ばれる', () => {
    const onClose = vi.fn()

    render(
      <Modal isOpen={true} onClose={onClose}>
        <div>テストコンテンツ</div>
      </Modal>
    )

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('オーバーレイをクリックするとonCloseが呼ばれる', () => {
    const onClose = vi.fn()

    render(
      <Modal isOpen={true} onClose={onClose}>
        <div>テストコンテンツ</div>
      </Modal>
    )

    // オーバーレイ要素を特定して直接クリック
    const overlay = document.querySelector('.fixed.inset-0.bg-gray-500')
    if (overlay?.parentElement) {
      fireEvent.click(overlay.parentElement)
    }

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('closeOnEscapeがfalseの時はESCキーでonCloseが呼ばれない', () => {
    const onClose = vi.fn()

    render(
      <Modal isOpen={true} onClose={onClose} closeOnEscape={false}>
        <div>テストコンテンツ</div>
      </Modal>
    )

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).not.toHaveBeenCalled()
  })

  it('closeOnOverlayClickがfalseの時はオーバーレイクリックでonCloseが呼ばれない', () => {
    const onClose = vi.fn()

    render(
      <Modal isOpen={true} onClose={onClose} closeOnOverlayClick={false}>
        <div>テストコンテンツ</div>
      </Modal>
    )

    const overlay = document.querySelector('.fixed.inset-0.bg-gray-500')
    if (overlay?.parentElement) {
      fireEvent.click(overlay.parentElement)
    }

    expect(onClose).not.toHaveBeenCalled()
  })
})
