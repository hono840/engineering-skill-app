import type { Feedback } from '@/lib/types'

interface FeedbackListProps {
  feedbacks: Feedback[]
}

export default function FeedbackList({ feedbacks }: FeedbackListProps) {
  if (feedbacks.length === 0) {
    return (
      <div className="text-center py-8 bg-white rounded-lg">
        <p className="text-gray-500">まだフィードバックがありません</p>
      </div>
    )
  }

  const scoreLabels = {
    scalability_score: 'スケーラビリティ',
    security_score: 'セキュリティ',
    performance_score: 'パフォーマンス',
    maintainability_score: '保守性',
    design_validity_score: '設計の妥当性',
  }

  return (
    <div className="space-y-6">
      {feedbacks.map((feedback) => {
        const totalScore =
          (feedback.scalability_score +
            feedback.security_score +
            feedback.performance_score +
            feedback.maintainability_score +
            feedback.design_validity_score) /
          5

        return (
          <div key={feedback.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-3" />
                <div>
                  <h4 className="font-medium text-gray-900">{feedback.user?.display_name}</h4>
                  <p className="text-sm text-gray-500">
                    {new Date(feedback.created_at).toLocaleDateString('ja-JP')}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-yellow-400 mr-1">★</span>
                <span className="font-medium">{totalScore.toFixed(1)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-4 text-sm">
              {Object.entries(scoreLabels).map(([key, label]) => (
                <div key={key}>
                  <div className="text-gray-500">{label}</div>
                  <div className="font-medium">{feedback[key as keyof typeof scoreLabels]}点</div>
                </div>
              ))}
            </div>

            <p className="text-gray-700 whitespace-pre-wrap">{feedback.comment}</p>
          </div>
        )
      })}
    </div>
  )
}
