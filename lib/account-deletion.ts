import { supabase } from '@/lib/supabase'

interface AccountDeletionErrorInterface {
  message: string
  code?: string
  details?: string
}

/**
 * アカウント削除APIを呼び出してユーザーアカウントを削除する
 */
export async function deleteUserAccount(email: string, password: string): Promise<void> {
  try {
    const response = await fetch('/api/account/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new AccountDeletionErrorClass({
        message: data.error || 'アカウントの削除に失敗しました',
        code: 'DELETION_FAILED',
      })
    }

    if (!data.success) {
      throw new AccountDeletionErrorClass({
        message: 'アカウントの削除に失敗しました',
        code: 'DELETION_FAILED',
      })
    }
  } catch (error) {
    if (error instanceof AccountDeletionErrorClass) {
      throw error
    }
    console.error('Account deletion error:', error)
    throw new AccountDeletionErrorClass({
      message: 'アカウント削除処理でエラーが発生しました',
      code: 'DELETION_ERROR',
    })
  }
}


/**
 * アカウント削除の完全なフロー
 */
export async function performAccountDeletion(
  email: string,
  password: string
): Promise<void> {
  try {
    // アカウント削除実行（パスワード検証も含む）
    await deleteUserAccount(email, password)
  } catch (error) {
    if (error instanceof AccountDeletionErrorClass) {
      throw error
    }
    
    console.error('Account deletion process failed:', error)
    throw new AccountDeletionErrorClass({
      message: 'アカウント削除処理でエラーが発生しました',
      code: 'DELETION_PROCESS_ERROR',
    })
  }
}

/**
 * アカウント削除前のデータ確認
 */
export async function getAccountDeletionPreview(userId: string) {
  try {
    // 投稿数の取得
    const { count: submissionCount, error: submissionError } = await supabase
      .from('submissions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)

    if (submissionError) {
      console.warn('Could not fetch submission count:', submissionError)
    }

    // フィードバック数の取得
    const { count: feedbackCount, error: feedbackError } = await supabase
      .from('feedbacks')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)

    if (feedbackError) {
      console.warn('Could not fetch feedback count:', feedbackError)
    }

    // いいね数の取得
    const { count: likeCount, error: likeError } = await supabase
      .from('submission_likes')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)

    if (likeError) {
      console.warn('Could not fetch like count:', likeError)
    }

    return {
      submissionCount: submissionCount || 0,
      feedbackCount: feedbackCount || 0,
      likeCount: likeCount || 0,
    }
  } catch (error) {
    console.error('Error fetching account deletion preview:', error)
    return {
      submissionCount: 0,
      feedbackCount: 0,
      likeCount: 0,
    }
  }
}

// カスタムエラークラス
export class AccountDeletionErrorClass extends Error {
  code?: string
  details?: string

  constructor({ message, code, details }: AccountDeletionErrorInterface) {
    super(message)
    this.name = 'AccountDeletionError'
    this.code = code
    this.details = details
  }
}