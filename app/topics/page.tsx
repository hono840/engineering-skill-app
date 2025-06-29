'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Topic } from '@/lib/types'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'

const DIFFICULTY_LABELS = {
  1: '初級',
  2: '中級',
  3: '上級',
  4: 'エキスパート',
  5: 'マスター'
}

const DIFFICULTY_COLORS = {
  1: 'bg-green-100 text-green-800',
  2: 'bg-blue-100 text-blue-800',
  3: 'bg-yellow-100 text-yellow-800',
  4: 'bg-orange-100 text-orange-800',
  5: 'bg-red-100 text-red-800'
}

export default function TopicsPage() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  const { user } = useAuth()

  useEffect(() => {
    fetchTopics()
  }, [selectedCategory, selectedDifficulty])

  const fetchTopics = async () => {
    try {
      let query = supabase
        .from('topics')
        .select(`
          *,
          submissions!inner(
            id,
            status
          )
        `)
        .eq('is_active', true)
        .eq('submissions.status', 'published')

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory)
      }

      if (selectedDifficulty !== 'all') {
        query = query.eq('difficulty_level', parseInt(selectedDifficulty))
      }

      const { data, error } = await query

      if (error) throw error

      // 投稿数を集計
      const topicsWithStats = data?.map(topic => {
        const submissionCount = topic.submissions?.length || 0
        const { submissions, ...topicData } = topic
        return {
          ...topicData,
          submission_count: submissionCount
        }
      }) || []

      setTopics(topicsWithStats)
    } catch (error) {
      console.error('Error fetching topics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">読み込み中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">システム設計のお題</h1>
          <p className="mt-2 text-gray-600">
            実践的なシステム設計スキルを身につけましょう
          </p>
        </div>

        {/* フィルター */}
        <div className="mb-8 flex flex-wrap gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              カテゴリ
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
            <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
              難易度
            </label>
            <select
              id="difficulty"
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {topic.title}
                  </h3>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      DIFFICULTY_COLORS[topic.difficulty_level as keyof typeof DIFFICULTY_COLORS]
                    }`}
                  >
                    {DIFFICULTY_LABELS[topic.difficulty_level as keyof typeof DIFFICULTY_LABELS]}
                  </span>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-3">
                  {topic.description}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {topic.category}
                  </span>
                  <span>目安時間: {topic.estimated_time}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {topic.submission_count || 0}件の投稿
                  </span>
                  <Link
                    href={`/topics/${topic.id}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
            <p className="text-gray-500">該当するお題がありません</p>
          </div>
        )}
      </div>
    </div>
  )
}