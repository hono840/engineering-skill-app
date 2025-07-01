import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { 
  Loading, 
  PageLoading, 
  ButtonLoading, 
  CardLoading 
} from '../Loading'

describe('Loading コンポーネント', () => {
  it('デフォルトサイズでレンダリングされる', () => {
    render(<Loading />)
    const loadingElement = screen.getByRole('status')
    expect(loadingElement).toBeInTheDocument()
    expect(loadingElement).toHaveClass('h-8', 'w-8')
  })

  it('テキストが表示される', () => {
    render(<Loading text="読み込み中..." />)
    expect(screen.getByText('読み込み中...')).toBeInTheDocument()
  })

  it('サイズプロパティが適用される', () => {
    render(<Loading size="lg" />)
    const loadingElement = screen.getByRole('status')
    expect(loadingElement).toHaveClass('h-12', 'w-12')
  })

  it('フルスクリーンモードで表示される', () => {
    render(<Loading fullscreen />)
    const container = screen.getByRole('status').parentElement?.parentElement
    expect(container).toHaveClass('fixed', 'inset-0')
  })

  it('中央寄せで表示される', () => {
    render(<Loading centered />)
    const container = screen.getByRole('status').parentElement?.parentElement
    expect(container).toHaveClass('justify-center')
  })
})

describe('PageLoading コンポーネント', () => {
  it('ページローディングが表示される', () => {
    render(<PageLoading />)
    expect(screen.getByText('読み込み中...')).toBeInTheDocument()
  })

  it('カスタムテキストが表示される', () => {
    render(<PageLoading text="データを取得中..." />)
    expect(screen.getByText('データを取得中...')).toBeInTheDocument()
  })
})

describe('ButtonLoading コンポーネント', () => {
  it('ボタン用ローディングが表示される', () => {
    render(<ButtonLoading />)
    const loadingElement = screen.getByRole('status')
    expect(loadingElement).toHaveClass('h-4', 'w-4')
  })
})

describe('CardLoading コンポーネント', () => {
  it('カード用ローディングが表示される', () => {
    render(<CardLoading />)
    const loadingElement = screen.getByRole('status')
    expect(loadingElement).toBeInTheDocument()
  })

  it('テキスト付きで表示される', () => {
    render(<CardLoading text="データ読み込み中..." />)
    expect(screen.getByText('データ読み込み中...')).toBeInTheDocument()
  })
})