import { memo } from 'react'
import { Handle, Position } from 'reactflow'

interface CustomNodeProps {
  data: {
    label: string
    icon: string
    type: string
  }
}

const CustomNode = memo(({ data }: CustomNodeProps) => {
  const getNodeStyle = () => {
    switch (data.type) {
      case 'user':
        return 'bg-blue-100 border-blue-300'
      case 'server':
        return 'bg-green-100 border-green-300'
      case 'database':
        return 'bg-purple-100 border-purple-300'
      case 'api':
        return 'bg-yellow-100 border-yellow-300'
      case 'external':
        return 'bg-orange-100 border-orange-300'
      case 'cache':
        return 'bg-red-100 border-red-300'
      case 'queue':
        return 'bg-indigo-100 border-indigo-300'
      case 'storage':
        return 'bg-pink-100 border-pink-300'
      default:
        return 'bg-gray-100 border-gray-300'
    }
  }

  return (
    <div className={`px-4 py-3 rounded-lg border-2 ${getNodeStyle()} min-w-[120px] text-center`}>
      <Handle type="target" position={Position.Top} />
      <div className="text-2xl mb-1">{data.icon}</div>
      <div className="text-sm font-medium">{data.label}</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
})

CustomNode.displayName = 'CustomNode'

export default CustomNode
