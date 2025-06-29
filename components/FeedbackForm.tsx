'use client'

import { useState } from 'react'

interface FeedbackFormProps {
  onSubmit: (feedback: {
    scalability_score: number
    security_score: number
    performance_score: number
    maintainability_score: number
    design_validity_score: number
    comment: string
  }) => void
}

export default function FeedbackForm({ onSubmit }: FeedbackFormProps) {
  const [scores, setScores] = useState({
    scalability_score: 3,
    security_score: 3,
    performance_score: 3,
    maintainability_score: 3,
    design_validity_score: 3,
  })
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!comment.trim()) {
      alert('コメントを入力してください')
      return
    }

    setSubmitting(true)
    await onSubmit({
      ...scores,
      comment: comment.trim(),
    })
    setSubmitting(false)
  }

  const scoreLabels = {
    scalability_score: 'スケーラビリティ',
    security_score: 'セキュリティ',
    performance_score: 'パフォーマンス',
    maintainability_score: '保守性',
    design_validity_score: '設計の妥当性',
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {Object.entries(scoreLabels).map(([key, label]) => (
        <div key={key}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setScores({ ...scores, [key]: value })}
                className={`text-2xl transition-colors ${
                  scores[key as keyof typeof scores] >= value
                    ? 'text-yellow-400'
                    : 'text-gray-300'
                }`}
              >
                ★
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-600">
              {scores[key as keyof typeof scores]}点
            </span>
          </div>
        </div>
      ))}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          コメント *
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="設計の良い点、改善点、アドバイスなどを記入してください"
          required
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
      >
        {submitting ? '投稿中...' : 'フィードバックを投稿'}
      </button>
    </form>
  )
}