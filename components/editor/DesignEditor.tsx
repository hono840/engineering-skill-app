'use client'

import { useState, useCallback } from 'react'
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  MiniMap,
  Panel,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { Topic } from '@/lib/types'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import CustomNode from './CustomNode'
import NodePalette from './NodePalette'

const nodeTypes = {
  custom: CustomNode,
}

interface DesignEditorProps {
  topic: Topic
}

export default function DesignEditor({ topic }: DesignEditorProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [technicalReasoning, setTechnicalReasoning] = useState('')
  const [challengesAndSolutions, setChallengesAndSolutions] = useState('')
  const [saving, setSaving] = useState(false)
  const { user } = useAuth()
  const router = useRouter()

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      const reactFlowBounds = event.currentTarget.getBoundingClientRect()
      const type = event.dataTransfer.getData('application/reactflow')

      if (typeof type === 'undefined' || !type) {
        return
      }

      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      }

      const nodeData = JSON.parse(type)
      const newNode: Node = {
        id: `${nodes.length + 1}`,
        type: 'custom',
        position,
        data: nodeData,
      }

      setNodes((nds) => nds.concat(newNode))
    },
    [nodes, setNodes]
  )

  const handleSave = async (status: 'draft' | 'published') => {
    if (!title.trim()) {
      alert('タイトルを入力してください')
      return
    }

    if (!description.trim()) {
      alert('説明を入力してください')
      return
    }

    if (nodes.length === 0) {
      alert('設計図を作成してください')
      return
    }

    setSaving(true)

    try {
      const designData = {
        nodes,
        edges,
      }

      const { data, error } = await supabase
        .from('submissions')
        .insert({
          user_id: user?.id,
          topic_id: topic.id,
          title,
          design_data: designData,
          description,
          technical_reasoning: technicalReasoning,
          challenges_and_solutions: challengesAndSolutions,
          status,
        })
        .select()
        .single()

      if (error) throw error

      router.push(`/submissions/${data.id}`)
    } catch (error: any) {
      console.error('Error saving submission:', error)
      alert('保存中にエラーが発生しました: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="h-screen flex">
      {/* 左サイドバー */}
      <div className="w-80 bg-white shadow-lg overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">{topic.title}</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                設計タイトル *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="例: マイクロサービス型ECサイト設計"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                設計の説明 *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="設計の概要を説明してください"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                技術選定の理由
              </label>
              <textarea
                value={technicalReasoning}
                onChange={(e) => setTechnicalReasoning(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="なぜこの技術・アーキテクチャを選んだか"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                課題と解決策
              </label>
              <textarea
                value={challengesAndSolutions}
                onChange={(e) => setChallengesAndSolutions(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="想定される課題とその解決策"
              />
            </div>

            <div className="pt-4 space-y-2">
              <button
                onClick={() => handleSave('published')}
                disabled={saving}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {saving ? '保存中...' : '投稿する'}
              </button>
              <button
                onClick={() => handleSave('draft')}
                disabled={saving}
                className="w-full px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50"
              >
                下書き保存
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">コンポーネント</h3>
          <NodePalette />
        </div>
      </div>

      {/* エディタエリア */}
      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
          <Panel position="top-right" className="bg-white p-2 rounded shadow">
            <div className="text-sm text-gray-600">
              コンポーネントをドラッグ&ドロップして配置し、接続してください
            </div>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  )
}