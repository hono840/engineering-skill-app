import { type ClassValue, clsx } from 'clsx'

/**
 * クラス名を結合するユーティリティ関数
 * Tailwind CSSのクラス名を条件付きで結合する際に使用
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}