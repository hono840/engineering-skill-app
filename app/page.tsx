import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">ArchFlow</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              実践的なシステム設計スキルを身につけ、
              <br />
              他のエンジニアからフィードバックをもらえるプラットフォーム
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/topics"
                className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                お題を見る
              </Link>
              <Link
                href="/auth/signup"
                className="bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-800 transition-colors"
              >
                新規登録
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-night-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">このアプリでできること</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-night-800 border border-night-700 p-8 rounded-lg shadow-md">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-3 text-white">実践的なお題に挑戦</h3>
              <p className="text-gray-300">
                ECサイト、SaaS、チャットアプリなど、実際のプロジェクトで求められるシステム設計に挑戦できます。
              </p>
            </div>
            <div className="bg-night-800 border border-night-700 p-8 rounded-lg shadow-md">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold mb-3 text-white">直感的な設計図作成</h3>
              <p className="text-gray-300">
                ドラッグ&ドロップで簡単にシステム構成図を作成。視覚的にわかりやすい設計図が作れます。
              </p>
            </div>
            <div className="bg-night-800 border border-night-700 p-8 rounded-lg shadow-md">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-semibold mb-3 text-white">建設的なフィードバック</h3>
              <p className="text-gray-300">
                スケーラビリティ、セキュリティ、パフォーマンスなど、多角的な観点からフィードバックをもらえます。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 bg-night-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">使い方</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-semibold mb-2">お題を選ぶ</h3>
              <p className="text-white text-sm">
                難易度別に用意されたお題から挑戦したいものを選択
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-semibold mb-2">設計図を作成</h3>
              <p className="text-white text-sm">
                ドラッグ&ドロップで直感的にシステム構成図を作成
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-semibold mb-2">投稿する</h3>
              <p className="text-white text-sm">設計の説明や技術選定の理由を添えて投稿</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="font-semibold mb-2">フィードバックを受ける</h3>
              <p className="text-white text-sm">
                他のエンジニアから建設的なフィードバックをもらって成長
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-700">今すぐ始めよう</h2>
          <p className="text-xl text-gray-700 mb-8">
            システム設計スキルを実践的に身につけて、
            <br />
            より高いレベルのエンジニアを目指しましょう
          </p>
          <Link
            href="/auth/signup"
            className="inline-block bg-indigo-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-indigo-700 transition-colors"
          >
            無料で始める
          </Link>
        </div>
      </section>
    </div>
  )
}
