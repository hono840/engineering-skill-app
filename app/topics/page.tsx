'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Topic } from '@/lib/types'
import { PageLoading } from '@/components/ui/Loading'

const DIFFICULTY_LABELS = {
  1: '初級',
  2: '中級',
  3: '上級',
  4: 'エキスパート',
  5: 'マスター',
}

const DIFFICULTY_COLORS = {
  1: 'bg-green-100 text-green-800',
  2: 'bg-blue-100 text-blue-800',
  3: 'bg-yellow-100 text-yellow-800',
  4: 'bg-orange-100 text-orange-800',
  5: 'bg-red-100 text-red-800',
}

export default function TopicsPage() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  // const { user } = useAuth() // 現在未使用

  const fetchTopics = useCallback(async () => {
    try {
      console.log('Fetching topics...', { selectedCategory, selectedDifficulty })
      
      // topics_with_statsビューを使用してお題と統計情報を取得
      let query = supabase
        .from('topics_with_stats')
        .select('*')

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory)
      }

      if (selectedDifficulty !== 'all') {
        query = query.eq('difficulty_level', Number.parseInt(selectedDifficulty))
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      console.log('Topics fetched:', data?.length || 0, 'topics')
      console.log('Topics data:', data)
      
      setTopics(data || [])
    } catch (error) {
      console.error('Error fetching topics:', error)
      // フォールバックとして基本のtopicsテーブルから取得を試みる
      try {
        console.log('Falling back to basic topics table...')
        let fallbackQuery = supabase
          .from('topics')
          .select('*')
          .eq('is_active', true)

        if (selectedCategory !== 'all') {
          fallbackQuery = fallbackQuery.eq('category', selectedCategory)
        }

        if (selectedDifficulty !== 'all') {
          fallbackQuery = fallbackQuery.eq('difficulty_level', Number.parseInt(selectedDifficulty))
        }

        const { data: fallbackData, error: fallbackError } = await fallbackQuery.order('created_at', { ascending: false })

        if (fallbackError) {
          console.error('Fallback query error:', fallbackError)
        } else {
          console.log('Fallback topics fetched:', fallbackData?.length || 0, 'topics')
          // submission_countフィールドを0で初期化
          const topicsWithCounts = (fallbackData || []).map(topic => ({
            ...topic,
            submission_count: 0,
            average_rating: 0
          }))
          setTopics(topicsWithCounts)
        }
      } catch (fallbackError) {
        console.error('Fallback fetch failed:', fallbackError)
      }
    } finally {
      setLoading(false)
    }
  }, [selectedCategory, selectedDifficulty])

  useEffect(() => {
    fetchTopics()
  }, [fetchTopics])

  if (loading) {
    return <PageLoading text="お題を読み込み中..." />
  }

  return (
    <div className="min-h-screen bg-night-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">システム設計のお題</h1>
          <p className="mt-2 text-night-300">実践的なシステム設計スキルを身につけましょう</p>
        </div>

        {/* フィルター */}
        <div className="mb-8 flex flex-wrap gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-white mb-1">
              カテゴリ
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-full px-3 py-2 border border-night-700 bg-night-900 text-white rounded-md shadow-sm focus:outline-none focus:ring-dark-purple-500 focus:border-dark-purple-500"
            >
              <option value="all">すべて</option>
              <option value="SaaS">SaaS</option>
              <option value="ECサイト">ECサイト</option>
              <option value="チャットアプリ">チャットアプリ</option>
              <option value="MaaS">MaaS</option>
              <option value="認証システム">認証システム</option>
              <option value="決済システム">決済システム</option>
              <option value="SNS">SNS</option>
              <option value="ブログ">ブログ</option>
              <option value="タスク管理">タスク管理</option>
              <option value="その他">その他</option>
            </select>
          </div>

          <div>
            <label htmlFor="difficulty" className="block text-sm font-medium text-white mb-1">
              難易度
            </label>
            <select
              id="difficulty"
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="block w-full px-3 py-2 border border-night-700 bg-night-900 text-white rounded-md shadow-sm focus:outline-none focus:ring-dark-purple-500 focus:border-dark-purple-500"
            >
              <option value="all">すべて</option>
              <option value="1">初級</option>
              <option value="2">中級</option>
              <option value="3">上級</option>
              <option value="4">エキスパート</option>
              <option value="5">マスター</option>
            </select>
          </div>
        </div>

        {/* お題一覧 */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic) => (
            <div
              key={topic.id}
              className="bg-night-900 border border-night-800 rounded-lg shadow-md hover:shadow-lg hover:shadow-dark-purple-500/20 hover:scale-105 hover:border-dark-purple-600 transition-all duration-300 ease-in-out motion-reduce:hover:scale-100 motion-reduce:transition-none cursor-pointer group"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white group-hover:text-dark-purple-300 transition-colors duration-300">{topic.title}</h3>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      DIFFICULTY_COLORS[topic.difficulty_level as keyof typeof DIFFICULTY_COLORS]
                    }`}
                  >
                    {DIFFICULTY_LABELS[topic.difficulty_level as keyof typeof DIFFICULTY_LABELS]}
                  </span>
                </div>

                <p className="text-night-300 mb-4 line-clamp-3">{topic.description}</p>

                <div className="flex items-center justify-between text-sm text-night-400 mb-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-night-800 text-night-200">
                    {topic.category}
                  </span>
                  <span>目安時間: {topic.estimated_time}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-night-400">
                    {topic.submission_count || 0}件の投稿
                  </span>
                  <Link
                    href={`/topics/${topic.id}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-dark-purple-600 hover:bg-dark-purple-700 group-hover:bg-dark-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dark-purple-500 focus:ring-offset-night-900 transition-colors duration-300"
                  >
                    詳細を見る
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {topics.length === 0 && (
          <div className="text-center py-12">
            <p className="text-night-400">該当するお題がありません</p>
          </div>
        )}
      </div>
    </div>
  )
}
