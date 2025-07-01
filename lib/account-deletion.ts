import { supabase } from '@/lib/supabase'

interface AccountDeletionErrorInterface {
  message: string
  code?: string
  details?: string
}

/**
 * ユーザーのパスワードを検証する
 */
export async function verifyPassword(email: string, password: string): Promise<boolean> {
  try {
    // 一時的なサインインでパスワードを検証
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      // 認証エラーの詳細をログに記録
      if (error.message === 'Invalid login credentials') {
        throw new AccountDeletionErrorClass({
          message: 'パスワードが正しくありません',
          code: 'INVALID_CREDENTIALS',
        })
      }
      throw new AccountDeletionErrorClass({
        message: 'パスワードの検証に失敗しました',
        code: 'VERIFICATION_FAILED',
        details: error.message,
      })
    }

    return true
  } catch (error) {
    if (error instanceof AccountDeletionErrorClass) {
      throw error
    }
    console.error('Password verification error:', error)
    throw new AccountDeletionErrorClass({
      message: 'パスワードの検証でエラーが発生しました',
      code: 'VERIFICATION_ERROR',
    })
  }
}

/**
 * ユーザーアカウントと関連データを削除する
 * データベースのCASCADE設定により、関連データは自動的に削除される
 */
export async function deleteUserAccount(userId: string): Promise<void> {
  try {
    // Supabase Authからユーザーを削除
    // これにより、データベースのCASCADE設定で関連するprofilesレコードと
    // その関連データ（submissions, feedbacks, submission_likes）も自動削除される
    const { error: authError } = await supabase.auth.admin.deleteUser(userId)
    
    if (authError) {
      throw new AccountDeletionErrorClass({
        message: 'アカウントの削除に失敗しました',
        code: authError.message,
        details: authError.message,
      })
    }

    // 成功時のログ出力
    console.log(`User account ${userId} has been successfully deleted`)
  } catch (error) {
    console.error('Account deletion failed:', error)
    throw error
  }
}

/**
 * アカウント削除の完全なフロー
 */
export async function performAccountDeletion(
  email: string,
  password: string,
  userId: string
): Promise<void> {
  try {
    // 1. パスワード検証
    await verifyPassword(email, password)

    // 2. アカウント削除実行
    await deleteUserAccount(userId)
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