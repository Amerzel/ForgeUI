import type { Meta, StoryObj } from '@storybook/react'
import { useState, useCallback } from 'react'
import { NodeEditor, Text, Badge } from '@forgeui/components'
import type { FlowNode, FlowEdge } from '@forgeui/components'
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  type OnConnect,
  type OnNodesChange,
  type OnEdgesChange,
  type NodeChange,
  type EdgeChange,
  type Connection,
} from '@xyflow/react'

const meta: Meta = {
  title: 'Domain/NodeEditor',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Node-based graph editor built on ReactFlow. For shader graphs, behaviour trees, quest flows.',
      },
    },
    layout: 'fullscreen',
  },
}
export default meta
type Story = StoryObj

const INITIAL_NODES: FlowNode[] = [
  {
    id: 'tex-albedo',
    type: 'default',
    position: { x: 60, y: 80 },
    data: { label: '🖼 Albedo Texture' },
  },
  {
    id: 'tex-normal',
    type: 'default',
    position: { x: 60, y: 200 },
    data: { label: '🗺 Normal Map' },
  },
  {
    id: 'tex-roughness',
    type: 'default',
    position: { x: 60, y: 320 },
    data: { label: '◻ Roughness Map' },
  },
  { id: 'pbr', type: 'default', position: { x: 320, y: 180 }, data: { label: '⬡ PBR Material' } },
  { id: 'multiply', type: 'default', position: { x: 560, y: 120 }, data: { label: '✕ Multiply' } },
  { id: 'output', type: 'output', position: { x: 780, y: 180 }, data: { label: '◉ Output' } },
]

const INITIAL_EDGES: FlowEdge[] = [
  { id: 'e1', source: 'tex-albedo', target: 'pbr', animated: false },
  { id: 'e2', source: 'tex-normal', target: 'pbr', animated: false },
  { id: 'e3', source: 'tex-roughness', target: 'pbr', animated: false },
  { id: 'e4', source: 'pbr', target: 'multiply', animated: true },
  { id: 'e5', source: 'multiply', target: 'output', animated: true },
]

export const ShaderGraph: Story = {
  name: 'Shader Graph',
  render: function NodeEditorDemo() {
    const [nodes, setNodes] = useState<FlowNode[]>(INITIAL_NODES)
    const [edges, setEdges] = useState<FlowEdge[]>(INITIAL_EDGES)
    const onNodesChange: OnNodesChange = useCallback(
      (c: NodeChange[]) => setNodes((n) => applyNodeChanges(c, n)),
      [],
    )
    const onEdgesChange: OnEdgesChange = useCallback(
      (c: EdgeChange[]) => setEdges((e) => applyEdgeChanges(c, e)),
      [],
    )
    const onConnect: OnConnect = useCallback((c: Connection) => setEdges((e) => addEdge(c, e)), [])

    return (
      <div
        style={{
          height: '520px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Text size="sm" style={{ fontWeight: 500 }}>
            Shader Graph — water_surface.mat
          </Text>
          <Badge>PBR</Badge>
          <Text size="xs" style={{ color: 'var(--forge-text-muted)', marginLeft: 'auto' }}>
            Drag nodes · Connect ports · Scroll to zoom
          </Text>
        </div>
        <NodeEditor
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          aria-label="Shader graph editor"
          style={{ flex: 1 }}
        />
      </div>
    )
  },
}

export const BehaviourTree: Story = {
  name: 'Behaviour Tree',
  render: function NodeEditorMinimal() {
    const [nodes, setNodes] = useState<FlowNode[]>([
      { id: 'in', type: 'input', position: { x: 60, y: 120 }, data: { label: '▶ Start' } },
      { id: 'cond', type: 'default', position: { x: 240, y: 80 }, data: { label: '? Check HP' } },
      { id: 'atk', type: 'default', position: { x: 240, y: 200 }, data: { label: '⚔ Attack' } },
      { id: 'end', type: 'output', position: { x: 440, y: 140 }, data: { label: '⏹ End' } },
    ])
    const [edges, setEdges] = useState<FlowEdge[]>([
      { id: 'e1', source: 'in', target: 'cond', label: 'enter' },
      { id: 'e2', source: 'cond', target: 'atk', label: 'HP < 50%' },
      { id: 'e3', source: 'cond', target: 'end', label: 'HP ≥ 50%' },
      { id: 'e4', source: 'atk', target: 'end' },
    ])
    const onNodesChange: OnNodesChange = useCallback(
      (c: NodeChange[]) => setNodes((n) => applyNodeChanges(c, n)),
      [],
    )
    const onEdgesChange: OnEdgesChange = useCallback(
      (c: EdgeChange[]) => setEdges((e) => applyEdgeChanges(c, e)),
      [],
    )
    const onConnect: OnConnect = useCallback((c: Connection) => setEdges((e) => addEdge(c, e)), [])
    return (
      <div style={{ height: '380px', padding: '16px' }}>
        <NodeEditor
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          minimap={false}
          aria-label="Behaviour tree editor"
        />
      </div>
    )
  },
}
