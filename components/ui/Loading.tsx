import { type VariantProps, cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// ローディングコンポーネントのバリアント定義
const loadingVariants = cva(
  'animate-spin rounded-full border-solid border-r-transparent',
  {
    variants: {
      size: {
        sm: 'h-4 w-4 border-2',
        md: 'h-8 w-8 border-3',
        lg: 'h-12 w-12 border-4',
        xl: 'h-16 w-16 border-4',
      },
      color: {
        primary: 'border-dark-purple-400',
        secondary: 'border-night-400',
        white: 'border-white',
        accent: 'border-dark-purple-300',
      },
    },
    defaultVariants: {
      size: 'md',
      color: 'primary',
    },
  }
)

export interface LoadingProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color'>,
    VariantProps<typeof loadingVariants> {
  /**
   * ローディング表示時のテキスト
   */
  text?: string
  /**
   * 中央寄せ表示するかどうか
   */
  centered?: boolean
  /**
   * 全画面表示するかどうか
   */
  fullscreen?: boolean
}

/**
 * ローディング表示用コンポーネント
 * 黒紫テーマに適合したスピナーアニメーション
 */
export function Loading({
  size,
  color,
  text,
  centered = false,
  fullscreen = false,
  className,
  ...props
}: LoadingProps) {
  const spinner = (
    <div
      className={cn(loadingVariants({ size, color }), className)}
      role="status"
      aria-label={text || 'ローディング中'}
      {...props}
    />
  )

  const content = (
    <div className={cn('flex flex-col items-center gap-3', centered && 'justify-center')}>
      {spinner}
      {text && (
        <span className="text-sm text-night-300 animate-pulse">{text}</span>
      )}
    </div>
  )

  if (fullscreen) {
    return (
      <div className="fixed inset-0 bg-night-950 flex items-center justify-center z-50">
        {content}
      </div>
    )
  }

  if (centered) {
    return (
      <div className="flex items-center justify-center min-h-32">
        {content}
      </div>
    )
  }

  return content
}

/**
 * ページローディング用の統一コンポーネント
 */
export function PageLoading({ text = '読み込み中...' }: { text?: string }) {
  return (
    <div className="min-h-screen bg-night-950 flex items-center justify-center">
      <Loading size="lg" text={text} color="primary" />
    </div>
  )
}

/**
 * ボタン内で使用する小さなローディング
 */
export function ButtonLoading({ className }: { className?: string }) {
  return (
    <Loading
      size="sm"
      color="white"
      className={cn('mr-2', className)}
    />
  )
}

/**
 * カード内で使用するローディング
 */
export function CardLoading({ text }: { text?: string }) {
  return (
    <div className="flex items-center justify-center py-8">
      <Loading size="md" text={text} color="primary" />
    </div>
  )
}