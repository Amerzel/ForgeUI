import type { Meta, StoryObj } from '@storybook/react'
import { useState, useCallback } from 'react'
import {
  NodeEditor, Timeline, VirtualCanvas, Button, Text, Badge,
} from '@forgeui/components'
import type {
  FlowNode, FlowEdge, TimelineTrack,
  CanvasItem, CanvasViewport,
} from '@forgeui/components'
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
  title: 'Domain/Gallery',
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'ForgeUI Phase 3 — domain-specific editors for game development.' } },
    layout: 'fullscreen',
  },
}
export default meta
type Story = StoryObj

// ---------------------------------------------------------------------------
// NodeEditor
// ---------------------------------------------------------------------------
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
  {
    id: 'pbr',
    type: 'default',
    position: { x: 320, y: 180 },
    data: { label: '⬡ PBR Material' },
  },
  {
    id: 'multiply',
    type: 'default',
    position: { x: 560, y: 120 },
    data: { label: '✕ Multiply' },
  },
  {
    id: 'output',
    type: 'output',
    position: { x: 780, y: 180 },
    data: { label: '◉ Output' },
  },
]

const INITIAL_EDGES: FlowEdge[] = [
  { id: 'e1', source: 'tex-albedo',    target: 'pbr',      animated: false },
  { id: 'e2', source: 'tex-normal',    target: 'pbr',      animated: false },
  { id: 'e3', source: 'tex-roughness', target: 'pbr',      animated: false },
  { id: 'e4', source: 'pbr',           target: 'multiply', animated: true  },
  { id: 'e5', source: 'multiply',      target: 'output',   animated: true  },
]

export const NodeEditorStory: Story = {
  name: 'NodeEditor — Shader Graph',
  render: function NodeEditorDemo() {
    const [nodes, setNodes] = useState<FlowNode[]>(INITIAL_NODES)
    const [edges, setEdges] = useState<FlowEdge[]>(INITIAL_EDGES)

    const onNodesChange: OnNodesChange = useCallback(
      (changes: NodeChange[]) => setNodes(nds => applyNodeChanges(changes, nds)),
      [],
    )
    const onEdgesChange: OnEdgesChange = useCallback(
      (changes: EdgeChange[]) => setEdges(eds => applyEdgeChanges(changes, eds)),
      [],
    )
    const onConnect: OnConnect = useCallback(
      (connection: Connection) => setEdges(eds => addEdge(connection, eds)),
      [],
    )

    return (
      <div style={{ height: '520px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Text size="sm" style={{ fontWeight: 500 }}>Shader Graph — water_surface.mat</Text>
          <Badge>PBR</Badge>
          <Text size="xs" style={{ color: 'var(--forge-text-muted)', marginLeft: 'auto' }}>Drag nodes · Connect ports · Scroll to zoom</Text>
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

export const NodeEditorMinimal: Story = {
  name: 'NodeEditor — minimal (no minimap)',
  render: function NodeEditorMinimal() {
    const [nodes, setNodes] = useState<FlowNode[]>([
      { id: 'in',  type: 'input',  position: { x: 60,  y: 120 }, data: { label: '▶ Start' } },
      { id: 'cond', type: 'default', position: { x: 240, y: 80 },  data: { label: '? Check HP' } },
      { id: 'atk', type: 'default', position: { x: 240, y: 200 }, data: { label: '⚔ Attack' } },
      { id: 'end', type: 'output', position: { x: 440, y: 140 }, data: { label: '⏹ End' } },
    ])
    const [edges, setEdges] = useState<FlowEdge[]>([
      { id: 'e1', source: 'in',   target: 'cond', label: 'enter' },
      { id: 'e2', source: 'cond', target: 'atk',  label: 'HP < 50%' },
      { id: 'e3', source: 'cond', target: 'end',  label: 'HP ≥ 50%' },
      { id: 'e4', source: 'atk',  target: 'end' },
    ])
    const onNodesChange: OnNodesChange = useCallback((c: NodeChange[]) => setNodes(n => applyNodeChanges(c, n)), [])
    const onEdgesChange: OnEdgesChange = useCallback((c: EdgeChange[]) => setEdges(e => applyEdgeChanges(c, e)), [])
    const onConnect: OnConnect = useCallback((c: Connection) => setEdges(e => addEdge(c, e)), [])
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

// ---------------------------------------------------------------------------
// Timeline
// ---------------------------------------------------------------------------
const ANIMATION_TRACKS: TimelineTrack[] = [
  {
    id: 'camera',
    label: '🎥 Camera',
    clips: [
      { id: 'cam-intro', start: 0,   duration: 3.5,  label: 'Intro dolly',   color: 'var(--forge-accent)' },
      { id: 'cam-pan',   start: 4,   duration: 2.0,  label: 'Pan right',     color: 'var(--forge-accent)' },
      { id: 'cam-close', start: 7,   duration: 3.0,  label: 'Close-up',      color: 'var(--forge-accent)' },
    ],
  },
  {
    id: 'player',
    label: '🧑 Player Anim',
    clips: [
      { id: 'ply-idle',  start: 0,   duration: 1.5,  label: 'Idle',          color: 'var(--forge-success)' },
      { id: 'ply-walk',  start: 1.5, duration: 3.0,  label: 'Walk forward',  color: 'var(--forge-success)' },
      { id: 'ply-atk',   start: 5,   duration: 2.5,  label: 'Attack combo',  color: 'var(--forge-warning)' },
      { id: 'ply-idle2', start: 8,   duration: 2.0,  label: 'Idle',          color: 'var(--forge-success)' },
    ],
  },
  {
    id: 'vfx',
    label: '✨ VFX',
    clips: [
      { id: 'vfx-dust',  start: 1.5, duration: 1.0,  label: 'Footstep dust', color: 'var(--forge-text-muted)' },
      { id: 'vfx-spark', start: 5.2, duration: 0.8,  label: 'Sword sparks',  color: 'var(--forge-warning)' },
      { id: 'vfx-blood', start: 5.8, duration: 1.5,  label: 'Hit impact',    color: 'var(--forge-danger)' },
    ],
  },
  {
    id: 'audio',
    label: '🔊 Audio',
    clips: [
      { id: 'sfx-amb',   start: 0,   duration: 10.0, label: 'Ambience loop', color: 'var(--forge-surface-raised)' },
      { id: 'sfx-foot',  start: 1.5, duration: 3.0,  label: 'Footsteps',     color: 'var(--forge-text-muted)' },
      { id: 'sfx-sword', start: 5.0, duration: 2.0,  label: 'Sword swing',   color: 'var(--forge-text-muted)' },
    ],
  },
]

export const TimelineStory: Story = {
  name: 'Timeline — Animation Sequence',
  render: function TimelineDemo() {
    const [currentTime, setCurrentTime] = useState(0)
    const [tracks, setTracks] = useState(ANIMATION_TRACKS)
    const [playing, setPlaying] = useState(false)
    const duration = 10

    // Simulate playback
    const togglePlay = () => {
      setPlaying(p => !p)
      if (!playing) {
        const start = Date.now() - currentTime * 1000
        const tick = () => {
          const elapsed = (Date.now() - start) / 1000
          if (elapsed >= duration) { setCurrentTime(duration); setPlaying(false); return }
          setCurrentTime(elapsed)
          requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }
    }

    return (
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Button variant={playing ? 'danger' : 'primary'} size="sm" onClick={togglePlay}>
            {playing ? '⏹ Stop' : '▶ Play'}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setCurrentTime(0)}>⏮ Reset</Button>
          <Text size="sm" style={{ color: 'var(--forge-text-muted)', fontFamily: 'var(--forge-font-mono)' }}>
            {String(Math.floor(currentTime / 60)).padStart(1, '0')}:{String(Math.floor(currentTime % 60)).padStart(2, '0')}.{String(Math.floor((currentTime % 1) * 10))}
            <span style={{ color: 'var(--forge-border)' }}> / 0:10.0</span>
          </Text>
          <Badge style={{ marginLeft: 'auto' }}>4 tracks · 11 clips</Badge>
        </div>
        <div style={{ height: '240px' }}>
          <Timeline
            tracks={tracks}
            currentTime={currentTime}
            duration={duration}
            onSeek={setCurrentTime}
            onClipChange={(trackId, clip) => {
              setTracks(prev => prev.map(t =>
                t.id === trackId
                  ? { ...t, clips: t.clips.map(c => c.id === clip.id ? clip : c) }
                  : t
              ))
            }}
          />
        </div>
        <Text size="xs" style={{ color: 'var(--forge-text-muted)' }}>
          Drag clips to reposition · Drag clip edges to resize · Drag ruler to seek
        </Text>
      </div>
    )
  },
}

// ---------------------------------------------------------------------------
// VirtualCanvas
// ---------------------------------------------------------------------------
const MAP_ITEMS: CanvasItem[] = [
  { id: 'spawn',    x: 100,  y: 100, width: 120, height: 80,  children: <div style={{ padding: '8px', fontSize: '11px', color: 'var(--forge-text)' }}>🚩 Spawn Zone</div> },
  { id: 'boss',     x: 600,  y: 80,  width: 160, height: 120, children: <div style={{ padding: '8px', fontSize: '11px', color: 'var(--forge-danger)' }}>💀 Boss Arena</div> },
  { id: 'village',  x: 200,  y: 280, width: 200, height: 140, children: <div style={{ padding: '8px', fontSize: '11px', color: 'var(--forge-success)' }}>🏘 Village</div> },
  { id: 'dungeon',  x: 500,  y: 260, width: 140, height: 100, children: <div style={{ padding: '8px', fontSize: '11px', color: 'var(--forge-warning)' }}>⚔ Dungeon Entrance</div> },
  { id: 'forest',   x: -80,  y: 200, width: 180, height: 160, children: <div style={{ padding: '8px', fontSize: '11px', color: 'var(--forge-accent)' }}>🌲 Dark Forest</div> },
  { id: 'castle',   x: 360,  y: 420, width: 180, height: 130, children: <div style={{ padding: '8px', fontSize: '11px', color: 'var(--forge-text)' }}>🏰 Castle</div> },
]

export const VirtualCanvasStory: Story = {
  name: 'VirtualCanvas — Level Editor',
  render: function VirtualCanvasDemo() {
    const [viewport, setViewport] = useState<CanvasViewport>({ x: 120, y: 80, zoom: 0.9 })
    const [items, setItems] = useState(MAP_ITEMS)

    const handleItemChange = (updated: CanvasItem) => {
      setItems(prev => prev.map(item => item.id === updated.id ? updated : item))
    }

    return (
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Text size="sm" style={{ fontWeight: 500 }}>Level Editor — world_01.level</Text>
          <Badge>{items.length} zones</Badge>
          <Text size="xs" style={{ color: 'var(--forge-text-muted)', marginLeft: 'auto' }}>
            Pan: middle-click or alt+drag · Zoom: scroll
          </Text>
          <Button variant="ghost" size="sm" onClick={() => setViewport({ x: 120, y: 80, zoom: 0.9 })}>
            Reset view
          </Button>
        </div>
        <VirtualCanvas
          items={items}
          viewport={viewport}
          onViewportChange={setViewport}
          onItemChange={handleItemChange}
          grid
          gridSize={40}
          style={{ height: '460px', border: '1px solid var(--forge-border)', borderRadius: 'var(--forge-radius-md)' }}
        />
        <Text size="xs" style={{ color: 'var(--forge-text-muted)' }}>
          Zoom: {Math.round(viewport.zoom * 100)}% · Offset: ({Math.round(viewport.x)}, {Math.round(viewport.y)}) · Click zones to select · Drag zones to reposition
        </Text>
      </div>
    )
  },
}
