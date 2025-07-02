import { vi, beforeEach, describe, test, expect } from 'vitest'

// 環境変数をモック
const mockEnv = vi.hoisted(() => ({
  NEXT_PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test-anon-key',
}))

vi.stubGlobal('process', {
  env: mockEnv,
})

// Supabaseクライアントをモック
const mockSupabase = {
  auth: {
    signInWithPassword: vi.fn(),
    admin: {
      deleteUser: vi.fn(),
    },
  },
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => Promise.resolve({
        count: 5,
        error: null,
      })),
    })),
  })),
}

vi.mock('../supabase', () => ({
  supabase: mockSupabase,
}))

const { 
  verifyPassword, 
  deleteUserAccount, 
  performAccountDeletion, 
  getAccountDeletionPreview,
  AccountDeletionErrorClass 
} = await import('../account-deletion')

beforeEach(() => {
  vi.clearAllMocks()
})

describe('account-deletion', () => {
  describe('verifyPassword', () => {
    test('正しいパスワードで認証が成功する', async () => {
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: { id: 'user-id' } },
        error: null,
      })

      const result = await verifyPassword('test@example.com', 'password123')
      expect(result).toBe(true)
      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
    })

    test('間違ったパスワードでエラーがスローされる', async () => {
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: null,
        error: { message: 'Invalid login credentials' },
      })

      await expect(verifyPassword('test@example.com', 'wrongpassword'))
        .rejects.toThrow('パスワードが正しくありません')
    })

    test('認証サービスエラーでエラーがスローされる', async () => {
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: null,
        error: { message: 'Service unavailable' },
      })

      await expect(verifyPassword('test@example.com', 'password123'))
        .rejects.toThrow('パスワードの検証に失敗しました')
    })

    test('ネットワークエラーでエラーがスローされる', async () => {
      mockSupabase.auth.signInWithPassword.mockRejectedValue(new Error('Network error'))

      await expect(verifyPassword('test@example.com', 'password123'))
        .rejects.toThrow('パスワードの検証でエラーが発生しました')
    })
  })

  describe('deleteUserAccount', () => {
    test('ユーザーアカウントが正常に削除される', async () => {
      mockSupabase.auth.admin.deleteUser.mockResolvedValue({
        data: {},
        error: null,
      })

      await expect(deleteUserAccount('user-id')).resolves.toBeUndefined()
      expect(mockSupabase.auth.admin.deleteUser).toHaveBeenCalledWith('user-id')
    })

    test('削除でエラーが発生した場合にエラーがスローされる', async () => {
      mockSupabase.auth.admin.deleteUser.mockResolvedValue({
        data: null,
        error: { message: 'User not found' },
      })

      await expect(deleteUserAccount('user-id'))
        .rejects.toThrow('アカウントの削除に失敗しました')
    })
  })

  describe('performAccountDeletion', () => {
    test('完全な削除フローが正常に実行される', async () => {
      // パスワード検証をモック
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: { id: 'user-id' } },
        error: null,
      })

      // アカウント削除をモック
      mockSupabase.auth.admin.deleteUser.mockResolvedValue({
        data: {},
        error: null,
      })

      await expect(performAccountDeletion('test@example.com', 'password123', 'user-id'))
        .resolves.toBeUndefined()
    })

    test('パスワード検証失敗でエラーがスローされる', async () => {
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: null,
        error: { message: 'Invalid login credentials' },
      })

      await expect(performAccountDeletion('test@example.com', 'wrongpassword', 'user-id'))
        .rejects.toThrow('パスワードが正しくありません')
    })
  })

  describe('getAccountDeletionPreview', () => {
    test('削除プレビューデータが正常に取得される', async () => {
      const mockFrom = jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => Promise.resolve({
            count: 5,
            error: null,
          })),
        })),
      }))

      mockSupabase.from.mockImplementation(mockFrom)

      const result = await getAccountDeletionPreview('user-id')

      expect(result).toEqual({
        submissionCount: 5,
        feedbackCount: 5,
        likeCount: 5,
      })
    })

    test('データ取得エラーでもデフォルト値が返される', async () => {
      const mockFrom = jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => Promise.resolve({
            count: null,
            error: { message: 'Database error' },
          })),
        })),
      }))

      mockSupabase.from.mockImplementation(mockFrom)

      const result = await getAccountDeletionPreview('user-id')

      expect(result).toEqual({
        submissionCount: 0,
        feedbackCount: 0,
        likeCount: 0,
      })
    })

    test('ネットワークエラーでデフォルト値が返される', async () => {
      const mockFrom = jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => Promise.reject(new Error('Network error'))),
        })),
      }))

      mockSupabase.from.mockImplementation(mockFrom)

      const result = await getAccountDeletionPreview('user-id')

      expect(result).toEqual({
        submissionCount: 0,
        feedbackCount: 0,
        likeCount: 0,
      })
    })
  })

  describe('AccountDeletionErrorClass', () => {
    test('カスタムエラーが正しく作成される', () => {
      const error = new AccountDeletionErrorClass({
        message: 'Test error',
        code: 'TEST_ERROR',
        details: 'Test details',
      })

      expect(error.message).toBe('Test error')
      expect(error.code).toBe('TEST_ERROR')
      expect(error.details).toBe('Test details')
      expect(error.name).toBe('AccountDeletionError')
    })
  })
})