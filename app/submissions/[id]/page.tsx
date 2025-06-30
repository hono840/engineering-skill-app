'use client'

import { useCallback, useEffect, useState } from 'react'
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import type { Feedback, FeedbackData, Submission } from '@/lib/types'
import 'reactflow/dist/style.css'
import CustomNode from '@/components/organisms/editor/CustomNode'
import FeedbackForm from '@/components/organisms/FeedbackForm'
import FeedbackList from '@/components/organisms/FeedbackList'

const nodeTypes = {
  custom: CustomNode,
}

export default function SubmissionDetailPage({ params }: { params: { id: string } }) {
  const [submission, setSubmission] = useState<Submission | null>(null)
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const [userFeedback, setUserFeedback] = useState<Feedback | null>(null)
  const { user } = useAuth()

  const fetchSubmissionAndFeedbacks = useCallback(async () => {
    try {
      // 投稿の詳細を取得
      const { data: submissionData, error: submissionError } = await supabase
        .from('submissions')
        .select(`
          *,
          profiles!user_id (
            username,
            display_name,
            avatar_url
          ),
          topics!topic_id (
            title,
            category
          )
        `)
        .eq('id', params.id)
        .single()

      if (submissionError) throw submissionError

      const submissionWithUser = {
        ...submissionData,
        user: submissionData.profiles,
        topic: submissionData.topics,
      }

      setSubmission(submissionWithUser)

      // フィードバック一覧を取得
      const { data: feedbacksData, error: feedbacksError } = await supabase
        .from('feedbacks')
        .select(`
          *,
          profiles!user_id (
            username,
            display_name,
            avatar_url
          )
        `)
        .eq('submission_id', params.id)
        .order('created_at', { ascending: false })

      if (feedbacksError) throw feedbacksError

      const feedbacksWithUser =
        feedbacksData?.map((feedback) => ({
          ...feedback,
          user: feedback.profiles,
        })) || []

      setFeedbacks(feedbacksWithUser)

      // ログインユーザーのフィードバックを確認
      if (user) {
        const userFeedbackData = feedbacksWithUser.find((f) => f.user_id === user.id)
        setUserFeedback(userFeedbackData || null)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }, [params.id, user])

  useEffect(() => {
    fetchSubmissionAndFeedbacks()
  }, [fetchSubmissionAndFeedbacks])

  const handleFeedbackSubmit = async (feedbackData: FeedbackData) => {
    try {
      const { data, error } = await supabase
        .from('feedbacks')
        .insert({
          ...feedbackData,
          user_id: user?.id,
          submission_id: params.id,
        })
        .select(`
          *,
          profiles!user_id (
            username,
            display_name,
            avatar_url
          )
        `)
        .single()

      if (error) throw error

      const newFeedback = {
        ...data,
        user: data.profiles,
      }

      setFeedbacks([newFeedback, ...feedbacks])
      setUserFeedback(newFeedback)
    } catch (error) {
      console.error('Error submitting feedback:', error)
      alert('フィードバックの投稿に失敗しました')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">読み込み中...</div>
      </div>
    )
  }

  if (!submission) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">投稿が見つかりません</div>
      </div>
    )
  }

  const averageScores =
    feedbacks.length > 0
      ? {
          scalability:
            feedbacks.reduce((sum, f) => sum + f.scalability_score, 0) / feedbacks.length,
          security: feedbacks.reduce((sum, f) => sum + f.security_score, 0) / feedbacks.length,
          performance:
            feedbacks.reduce((sum, f) => sum + f.performance_score, 0) / feedbacks.length,
          maintainability:
            feedbacks.reduce((sum, f) => sum + f.maintainability_score, 0) / feedbacks.length,
          design_validity:
            feedbacks.reduce((sum, f) => sum + f.design_validity_score, 0) / feedbacks.length,
        }
      : null

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ヘッダー */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{submission.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>お題: {submission.topic?.title}</span>
              <span>投稿者: {submission.user?.display_name}</span>
              <span>{new Date(submission.created_at).toLocaleDateString('ja-JP')}</span>
            </div>
          </div>

          {averageScores && (
            <div className="grid grid-cols-5 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {averageScores.scalability.toFixed(1)}
                </div>
                <div className="text-sm text-gray-500">スケーラビリティ</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {averageScores.security.toFixed(1)}
                </div>
                <div className="text-sm text-gray-500">セキュリティ</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {averageScores.performance.toFixed(1)}
                </div>
                <div className="text-sm text-gray-500">パフォーマンス</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {averageScores.maintainability.toFixed(1)}
                </div>
                <div className="text-sm text-gray-500">保守性</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {averageScores.design_validity.toFixed(1)}
                </div>
                <div className="text-sm text-gray-500">設計の妥当性</div>
              </div>
            </div>
          )}

          <div className="prose max-w-none">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">説明</h3>
            <p className="text-gray-600 whitespace-pre-wrap">{submission.description}</p>

            {submission.technical_reasoning && (
              <>
                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">技術選定の理由</h3>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {submission.technical_reasoning}
                </p>
              </>
            )}

            {submission.challenges_and_solutions && (
              <>
                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">課題と解決策</h3>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {submission.challenges_and_solutions}
                </p>
              </>
            )}
          </div>
        </div>

        {/* 設計図 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">システム設計図</h2>
          <div className="h-[500px] border border-gray-200 rounded">
            <ReactFlow
              nodes={submission.design_data.nodes}
              edges={submission.design_data.edges}
              nodeTypes={nodeTypes}
              fitView
              nodesDraggable={false}
              nodesConnectable={false}
              elementsSelectable={false}
            >
              <Background />
              <Controls />
              <MiniMap />
            </ReactFlow>
          </div>
        </div>

        {/* フィードバック */}
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              フィードバック ({feedbacks.length}件)
            </h2>
            <FeedbackList feedbacks={feedbacks} />
          </div>

          <div>
            {user && !userFeedback && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">フィードバックを投稿</h3>
                <FeedbackForm onSubmit={handleFeedbackSubmit} />
              </div>
            )}

            {userFeedback && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800">
                  あなたは既にこの設計図にフィードバックを投稿しています
                </p>
              </div>
            )}

            {!user && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-gray-600">フィードバックを投稿するにはログインが必要です</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
