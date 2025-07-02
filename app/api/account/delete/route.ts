import { NextRequest, NextResponse } from 'next/server'
import { supabase, createSupabaseAdmin } from '@/lib/supabase'

/**
 * アカウント削除API
 * POST /api/account/delete
 */
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'メールアドレスとパスワードが必要です' },
        { status: 400 }
      )
    }

    // 1. パスワード検証
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError || !authData.user) {
      return NextResponse.json(
        { error: 'パスワードが正しくありません' },
        { status: 401 }
      )
    }

    const userId = authData.user.id

    // 2. Service Role を使用してユーザーを削除
    const supabaseAdmin = createSupabaseAdmin()
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId)

    if (deleteError) {
      console.error('Account deletion error:', deleteError)
      return NextResponse.json(
        { error: 'アカウントの削除に失敗しました' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Account deletion API error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}