'use client'

import type { User } from '@supabase/supabase-js'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Profile } from '@/lib/types'

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  signOut: () => Promise<void>
  showLogoutSuccess: boolean
  setShowLogoutSuccess: (show: boolean) => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  showLogoutSuccess: false,
  setShowLogoutSuccess: () => {},
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [showLogoutSuccess, setShowLogoutSuccess] = useState(false)

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId)
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()

      console.log('Profile data:', data)
      console.log('Profile error:', error)

      if (error && error.code === 'PGRST116') {
        // プロフィールが存在しない場合、ユーザーメタデータから作成
        console.log('Profile not found, creating from user metadata')
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user?.user_metadata) {
          const { username, display_name } = user.user_metadata
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              id: userId,
              email: user.email || '',
              username: username || `user_${userId.slice(0, 8)}`,
              display_name: display_name || 'ユーザー',
            })
            .select()
            .single()

          if (createError) throw createError
          setProfile(newProfile)
        } else {
          // メタデータがない場合はnullのまま
          setProfile(null)
        }
      } else if (error) {
        throw error
      } else {
        setProfile(data)
      }
    } catch (error) {
      console.error('Error fetching/creating profile:', error)
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // 初期セッション確認
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // 認証状態の変更を監視
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [fetchProfile])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    setShowLogoutSuccess(true)
  }

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, signOut, showLogoutSuccess, setShowLogoutSuccess }}
    >
      {children}
    </AuthContext.Provider>
  )
}
