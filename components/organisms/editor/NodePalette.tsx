interface NodeType {
  label: string
  icon: string
  type: string
}

const nodeTypes: NodeType[] = [
  { label: 'ユーザー', icon: '👤', type: 'user' },
  { label: 'Webサーバー', icon: '🖥️', type: 'server' },
  { label: 'APIサーバー', icon: '🔌', type: 'api' },
  { label: 'データベース', icon: '🗄️', type: 'database' },
  { label: 'キャッシュ', icon: '💾', type: 'cache' },
  { label: 'キュー', icon: '📋', type: 'queue' },
  { label: 'ストレージ', icon: '📦', type: 'storage' },
  { label: '外部サービス', icon: '🌐', type: 'external' },
  { label: 'ロードバランサー', icon: '⚖️', type: 'loadbalancer' },
  { label: 'CDN', icon: '🌍', type: 'cdn' },
  { label: 'マイクロサービス', icon: '🔧', type: 'microservice' },
  { label: 'コンテナ', icon: '📦', type: 'container' },
]

export default function NodePalette() {
  const onDragStart = (event: React.DragEvent, nodeData: NodeType) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(nodeData))
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      {nodeTypes.map((node) => (
        <button
          key={node.type}
          type="button"
          className="bg-gray-50 border border-gray-200 rounded-lg p-3 cursor-move hover:bg-gray-100 transition-colors w-full"
          draggable
          onDragStart={(e) => onDragStart(e, node)}
        >
          <div className="text-xl text-center mb-1">{node.icon}</div>
          <div className="text-xs text-center text-gray-600">{node.label}</div>
        </button>
      ))}
    </div>
  )
}
