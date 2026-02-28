'use client'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
  type OnConnect,
  type OnNodesChange,
  type OnEdgesChange,
  type NodeTypes,
  type EdgeTypes,
  BackgroundVariant,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { cn } from '../lib/cn.js'

export type { Node as FlowNode, Edge as FlowEdge }

interface NodeEditorProps {
  nodes: Node[]
  edges: Edge[]
  onConnect?: OnConnect
  onNodesChange?: OnNodesChange
  onEdgesChange?: OnEdgesChange
  onNodeClick?: (event: React.MouseEvent, node: Node) => void
  /** Custom node type renderers */
  nodeTypes?: NodeTypes
  /** Custom edge type renderers */
  edgeTypes?: EdgeTypes
  /** Show the minimap. Default: true */
  minimap?: boolean
  /** Show zoom/fit controls. Default: true */
  controls?: boolean
  /** Show dot grid background. Default: true */
  background?: boolean
  /** Accessible label for the canvas */
  'aria-label'?: string
  className?: string
  style?: React.CSSProperties
}

export function NodeEditor({
  nodes,
  edges,
  onConnect,
  onNodesChange,
  onEdgesChange,
  onNodeClick,
  nodeTypes,
  edgeTypes,
  minimap = true,
  controls = true,
  background = true,
  'aria-label': ariaLabel = 'Node editor canvas',
  className,
  style,
}: NodeEditorProps) {
  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className={cn('forge-node-editor', className)}
      style={{
        width: '100%',
        height: '100%',
        minHeight: '400px',
        backgroundColor: 'var(--forge-bg)',
        borderRadius: 'var(--forge-radius-lg)',
        border: '1px solid var(--forge-border)',
        overflow: 'hidden',
        ...style,
      }}
    >
      <style>{`
        /* Adapt ReactFlow tokens to ForgeUI palette */
        .forge-node-editor .react-flow__node {
          font-family: var(--forge-font-sans);
          font-size: var(--forge-font-size-sm);
          color: var(--forge-text);
          background-color: var(--forge-surface);
          border: 1px solid var(--forge-border);
          border-radius: var(--forge-radius-md);
          box-shadow: var(--forge-shadow-sm);
        }
        .forge-node-editor .react-flow__node.selected {
          border-color: var(--forge-accent);
          box-shadow: 0 0 0 2px color-mix(in srgb, var(--forge-accent) 30%, transparent);
        }
        .forge-node-editor .react-flow__edge-path {
          stroke: var(--forge-border);
        }
        .forge-node-editor .react-flow__edge.selected .react-flow__edge-path {
          stroke: var(--forge-accent);
        }
        .forge-node-editor .react-flow__handle {
          background-color: var(--forge-accent);
          border: 2px solid var(--forge-bg);
          width: 8px;
          height: 8px;
        }
        .forge-node-editor .react-flow__controls {
          background-color: var(--forge-surface);
          border: 1px solid var(--forge-border);
          border-radius: var(--forge-radius-md);
          box-shadow: var(--forge-shadow-sm);
        }
        .forge-node-editor .react-flow__controls-button {
          background-color: transparent;
          border-bottom: 1px solid var(--forge-border);
          color: var(--forge-text-muted);
          fill: var(--forge-text-muted);
        }
        .forge-node-editor .react-flow__controls-button:hover {
          background-color: var(--forge-surface-hover);
        }
        .forge-node-editor .react-flow__minimap {
          background-color: var(--forge-surface);
          border: 1px solid var(--forge-border);
          border-radius: var(--forge-radius-md);
        }
      `}</style>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onConnect={onConnect}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        deleteKeyCode="Delete"
        multiSelectionKeyCode="Shift"
      >
        {background && (
          <Background
            variant={BackgroundVariant.Dots}
            color="var(--forge-border)"
            gap={16}
            size={1}
          />
        )}
        {controls && <Controls />}
        {minimap && (
          <MiniMap
            nodeColor="var(--forge-surface)"
            nodeStrokeColor="var(--forge-border)"
            maskColor="color-mix(in srgb, var(--forge-bg) 60%, transparent)"
          />
        )}
      </ReactFlow>
    </div>
  )
}
