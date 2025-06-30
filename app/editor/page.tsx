'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useCallback, useEffect, useState } from 'react'
import DesignEditor from '@/components/organisms/editor/DesignEditor'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import type { Topic } from '@/lib/types'

function EditorPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const topicId = searchParams.get('topic')
  const { user, loading: authLoading } = useAuth()
  const [topic, setTopic] = useState<Topic | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchTopic = useCallback(async () => {
    try {
      const { data, error } = await supabase.from('topics').select('*').eq('id', topicId).single()

      if (error) throw error
      setTopic(data)
    } catch (error) {
      console.error('Error fetching topic:', error)
    } finally {
      setLoading(false)
    }
  }, [topicId])

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
      return
    }

    if (topicId) {
      fetchTopic()
    }
  }, [topicId, user, authLoading, router, fetchTopic])

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">読み込み中...</div>
      </div>
    )
  }

  if (!topic) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">お題が見つかりません</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DesignEditor topic={topic} />
    </div>
  )
}

export default function EditorPage() {
  return (
    <Suspense
      fallback={<div className="flex justify-center items-center min-h-screen">読み込み中...</div>}
    >
      <EditorPageContent />
    </Suspense>
  )
}
