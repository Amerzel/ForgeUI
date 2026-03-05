import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { ThemeProvider } from '../ThemeProvider/index.js'
import {
  Timeline,
  VirtualCanvas,
  DrawingCanvas,
  ImageViewer,
  ComparisonSlider,
  LayerStack,
  NodeEditor,
  AnimationPreview,
  TilePreview,
  TilingGrid,
  PipelineStepViewer,
  HeatMapOverlay,
  renderHeatMap,
  VerdictWidget,
  GenerationQueue,
  WizardDialog,
} from '../index.js'
import type { PipelineStep, GenerationJob, WizardStep } from '../index.js'
import type {
  TimelineTrack,
  CanvasItem,
  Layer,
  FlowNode,
  FlowEdge,
  AnimationFrame,
} from '../index.js'

// Mock @xyflow/react — ReactFlow uses canvas/ResizeObserver APIs unavailable in JSDOM
vi.mock('@xyflow/react', () => {
  const ReactFlow = ({ children, ...props }: Record<string, unknown>) => (
    <div
      data-testid="mock-reactflow"
      data-nodes={JSON.stringify(props.nodes)}
      data-edges={JSON.stringify(props.edges)}
    >
      {children as React.ReactNode}
    </div>
  )
  const Background = () => <div data-testid="mock-background" />
  const Controls = () => <div data-testid="mock-controls" />
  const MiniMap = () => <div data-testid="mock-minimap" />
  const BackgroundVariant = { Dots: 'dots', Lines: 'lines', Cross: 'cross' }
  return { ReactFlow, Background, Controls, MiniMap, BackgroundVariant }
})

function Themed({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>
}

// ---------------------------------------------------------------------------
// NodeEditor
// ---------------------------------------------------------------------------
describe('NodeEditor', () => {
  const NODES: FlowNode[] = [
    { id: '1', position: { x: 0, y: 0 }, data: { label: 'Start' } },
    { id: '2', position: { x: 200, y: 100 }, data: { label: 'End' } },
  ]
  const EDGES: FlowEdge[] = [{ id: 'e1-2', source: '1', target: '2' }]

  it('renders with default aria-label and forwards className', () => {
    render(
      <Themed>
        <NodeEditor nodes={NODES} edges={EDGES} className="custom" />
      </Themed>,
    )
    const el = screen.getByLabelText('Node editor canvas')
    expect(el).toBeInTheDocument()
    expect(el.className).toContain('custom')
  })

  it('forwards custom aria-label and style', () => {
    render(
      <Themed>
        <NodeEditor nodes={NODES} edges={EDGES} aria-label="My graph" style={{ height: '600px' }} />
      </Themed>,
    )
    const el = screen.getByLabelText('My graph')
    expect(el.style.height).toBe('600px')
  })

  it('renders minimap, controls, and background by default', () => {
    render(
      <Themed>
        <NodeEditor nodes={NODES} edges={EDGES} />
      </Themed>,
    )
    expect(screen.getByTestId('mock-minimap')).toBeInTheDocument()
    expect(screen.getByTestId('mock-controls')).toBeInTheDocument()
    expect(screen.getByTestId('mock-background')).toBeInTheDocument()
  })

  it('hides minimap, controls, and background when disabled', () => {
    render(
      <Themed>
        <NodeEditor
          nodes={NODES}
          edges={EDGES}
          minimap={false}
          controls={false}
          background={false}
        />
      </Themed>,
    )
    expect(screen.queryByTestId('mock-minimap')).not.toBeInTheDocument()
    expect(screen.queryByTestId('mock-controls')).not.toBeInTheDocument()
    expect(screen.queryByTestId('mock-background')).not.toBeInTheDocument()
  })

  it('passes nodes and edges to ReactFlow', () => {
    render(
      <Themed>
        <NodeEditor nodes={NODES} edges={EDGES} />
      </Themed>,
    )
    const rf = screen.getByTestId('mock-reactflow')
    expect(JSON.parse(rf.getAttribute('data-nodes') ?? '[]')).toHaveLength(2)
    expect(JSON.parse(rf.getAttribute('data-edges') ?? '[]')).toHaveLength(1)
  })

  it('passes axe accessibility audit', async () => {
    const { container } = render(
      <Themed>
        <NodeEditor nodes={NODES} edges={EDGES} />
      </Themed>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// Timeline
// ---------------------------------------------------------------------------
describe('Timeline', () => {
  const TRACKS: TimelineTrack[] = [
    {
      id: 'track1',
      label: 'Character Rig',
      clips: [
        { id: 'clip1', start: 0, duration: 2, label: 'Walk Cycle', color: '#3b82f6' },
        { id: 'clip2', start: 3, duration: 1.5, label: 'Idle', color: '#10b981' },
      ],
    },
    {
      id: 'track2',
      label: 'Camera',
      clips: [{ id: 'clip3', start: 0, duration: 5, label: 'Shot A' }],
    },
  ]

  it('renders track labels', () => {
    render(
      <Themed>
        <Timeline tracks={TRACKS} currentTime={0} duration={10} />
      </Themed>,
    )
    expect(screen.getByText('Character Rig')).toBeInTheDocument()
    expect(screen.getByText('Camera')).toBeInTheDocument()
  })

  it('renders clip labels', () => {
    render(
      <Themed>
        <Timeline tracks={TRACKS} currentTime={0} duration={10} />
      </Themed>,
    )
    expect(screen.getByText('Walk Cycle')).toBeInTheDocument()
    expect(screen.getByText('Idle')).toBeInTheDocument()
    expect(screen.getByText('Shot A')).toBeInTheDocument()
  })

  it('shows current time in toolbar', () => {
    render(
      <Themed>
        <Timeline tracks={TRACKS} currentTime={1.5} duration={10} />
      </Themed>,
    )
    expect(screen.getByText('0:01.5')).toBeInTheDocument()
  })

  it('renders zoom controls', () => {
    render(
      <Themed>
        <Timeline tracks={TRACKS} currentTime={0} duration={10} />
      </Themed>,
    )
    expect(screen.getByRole('button', { name: 'Zoom in' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Zoom out' })).toBeInTheDocument()
  })

  it('calls onZoomChange when zooming', async () => {
    const onZoomChange = vi.fn()
    const user = userEvent.setup()
    render(
      <Themed>
        <Timeline
          tracks={TRACKS}
          currentTime={0}
          duration={10}
          onZoomChange={onZoomChange}
          zoom={80}
        />
      </Themed>,
    )
    await user.click(screen.getByRole('button', { name: 'Zoom in' }))
    expect(onZoomChange).toHaveBeenCalled()
  })

  it('has no axe violations', async () => {
    const { container } = render(
      <Themed>
        <Timeline tracks={TRACKS} currentTime={0} duration={10} />
      </Themed>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// VirtualCanvas
// ---------------------------------------------------------------------------
describe('VirtualCanvas', () => {
  const ITEMS: CanvasItem[] = [
    { id: 'node1', x: 100, y: 100, width: 120, height: 60, children: <div>Node A</div> },
    { id: 'node2', x: 300, y: 200, width: 120, height: 60, children: <div>Node B</div> },
  ]

  it('renders canvas items', () => {
    render(
      <Themed>
        <VirtualCanvas items={ITEMS} />
      </Themed>,
    )
    expect(screen.getByText('Node A')).toBeInTheDocument()
    expect(screen.getByText('Node B')).toBeInTheDocument()
  })

  it('renders viewport indicator', () => {
    render(
      <Themed>
        <VirtualCanvas items={ITEMS} viewport={{ x: 0, y: 0, zoom: 1 }} />
      </Themed>,
    )
    expect(screen.getByLabelText('Zoom: 100%')).toBeInTheDocument()
  })

  it('renders reset viewport button', () => {
    render(
      <Themed>
        <VirtualCanvas items={ITEMS} />
      </Themed>,
    )
    expect(screen.getByRole('button', { name: 'Reset viewport' })).toBeInTheDocument()
  })

  it('calls onViewportChange when reset clicked', async () => {
    const onViewportChange = vi.fn()
    const user = userEvent.setup()
    render(
      <Themed>
        <VirtualCanvas
          items={ITEMS}
          viewport={{ x: 50, y: 50, zoom: 1.5 }}
          onViewportChange={onViewportChange}
        />
      </Themed>,
    )
    await user.click(screen.getByRole('button', { name: 'Reset viewport' }))
    expect(onViewportChange).toHaveBeenCalledWith({ x: 0, y: 0, zoom: 1 })
  })

  it('renders children in canvas space', () => {
    render(
      <Themed>
        <VirtualCanvas items={[]}>
          <div>Custom canvas content</div>
        </VirtualCanvas>
      </Themed>,
    )
    expect(screen.getByText('Custom canvas content')).toBeInTheDocument()
  })

  it('selects item on click', async () => {
    const user = userEvent.setup()
    render(
      <Themed>
        <VirtualCanvas items={ITEMS} />
      </Themed>,
    )
    const node = screen.getByText('Node A').closest('[data-canvas-item-id]')
    expect(node).toBeInTheDocument()
    expect(node).not.toBeNull()
    await user.click(node as HTMLElement)
    expect(node).toHaveAttribute('data-selected', 'true')
  })

  it('has no axe violations', async () => {
    const { container } = render(
      <Themed>
        <VirtualCanvas items={ITEMS} />
      </Themed>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// DrawingCanvas
// ---------------------------------------------------------------------------
describe('DrawingCanvas', () => {
  it('renders the canvas application', () => {
    render(
      <Themed>
        <DrawingCanvas width={256} height={256} tool="brush" brushSize={10} />
      </Themed>,
    )
    expect(screen.getByRole('application', { name: 'Drawing canvas' })).toBeInTheDocument()
  })

  it('shows drawing layer canvas', () => {
    render(
      <Themed>
        <DrawingCanvas width={256} height={256} tool="brush" brushSize={10} />
      </Themed>,
    )
    expect(screen.getByTestId('drawing-layer')).toBeInTheDocument()
  })

  it('displays tool indicator', () => {
    render(
      <Themed>
        <DrawingCanvas width={128} height={128} tool="eraser" brushSize={20} />
      </Themed>,
    )
    expect(screen.getByLabelText('Tool: eraser, Size: 20px')).toBeInTheDocument()
  })

  it('shows loading state when background image is set', () => {
    render(
      <Themed>
        <DrawingCanvas
          width={256}
          height={256}
          tool="brush"
          brushSize={10}
          backgroundImage="test.png"
        />
      </Themed>,
    )
    expect(screen.getByLabelText('Loading background image')).toBeInTheDocument()
  })

  it('has no axe violations', async () => {
    const { container } = render(
      <Themed>
        <DrawingCanvas width={256} height={256} tool="brush" brushSize={10} />
      </Themed>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// ImageViewer
// ---------------------------------------------------------------------------
describe('ImageViewer', () => {
  it('renders with aria label', () => {
    render(
      <Themed>
        <ImageViewer src="test.png" alt="Test image" />
      </Themed>,
    )
    expect(
      screen.getByRole('application', { name: 'Image viewer: Test image' }),
    ).toBeInTheDocument()
  })

  it('renders zoom controls', () => {
    render(
      <Themed>
        <ImageViewer src="test.png" alt="Test image" />
      </Themed>,
    )
    expect(screen.getByRole('button', { name: 'Zoom in' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Zoom out' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Fit to view' })).toBeInTheDocument()
  })

  it('hides controls when showControls is false', () => {
    render(
      <Themed>
        <ImageViewer src="test.png" alt="Test" showControls={false} />
      </Themed>,
    )
    expect(screen.queryByRole('button', { name: 'Zoom in' })).not.toBeInTheDocument()
  })

  it('renders toolbar slot', () => {
    render(
      <Themed>
        <ImageViewer src="test.png" alt="Test" toolbar={<button>Download</button>} />
      </Themed>,
    )
    expect(screen.getByRole('button', { name: 'Download' })).toBeInTheDocument()
  })

  it('has no axe violations', async () => {
    const { container } = render(
      <Themed>
        <ImageViewer src="test.png" alt="Test image" />
      </Themed>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// ComparisonSlider
// ---------------------------------------------------------------------------
describe('ComparisonSlider', () => {
  it('renders with aria role slider', () => {
    render(
      <Themed>
        <ComparisonSlider before="a.png" after="b.png" />
      </Themed>,
    )
    expect(screen.getByRole('slider', { name: 'Image comparison slider' })).toBeInTheDocument()
  })

  it('displays labels', () => {
    render(
      <Themed>
        <ComparisonSlider
          before="a.png"
          after="b.png"
          beforeLabel="Original"
          afterLabel="Processed"
        />
      </Themed>,
    )
    expect(screen.getByText('Original')).toBeInTheDocument()
    expect(screen.getByText('Processed')).toBeInTheDocument()
  })

  it('shows initial position', () => {
    render(
      <Themed>
        <ComparisonSlider before="a.png" after="b.png" initialPosition={75} />
      </Themed>,
    )
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '75')
  })

  it('responds to keyboard left/right', async () => {
    const onPositionChange = vi.fn()
    const user = userEvent.setup()
    render(
      <Themed>
        <ComparisonSlider
          before="a.png"
          after="b.png"
          position={50}
          onPositionChange={onPositionChange}
        />
      </Themed>,
    )
    const slider = screen.getByRole('slider')
    slider.focus()
    await user.keyboard('{ArrowRight}')
    expect(onPositionChange).toHaveBeenCalledWith(55)
  })

  it('has no axe violations', async () => {
    const { container } = render(
      <Themed>
        <ComparisonSlider before="a.png" after="b.png" beforeLabel="Before" afterLabel="After" />
      </Themed>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// LayerStack
// ---------------------------------------------------------------------------
describe('LayerStack', () => {
  const LAYERS: Layer[] = [
    { id: 'bg', label: 'Background', visible: true, locked: false, opacity: 100 },
    { id: 'chars', label: 'Characters', visible: true, locked: false, opacity: 80 },
    { id: 'fx', label: 'Effects', visible: false, locked: true, opacity: 50 },
  ]

  it('renders layer labels', () => {
    render(
      <Themed>
        <LayerStack layers={LAYERS} />
      </Themed>,
    )
    expect(screen.getByText('Background')).toBeInTheDocument()
    expect(screen.getByText('Characters')).toBeInTheDocument()
    expect(screen.getByText('Effects')).toBeInTheDocument()
  })

  it('shows layer count in header', () => {
    render(
      <Themed>
        <LayerStack layers={LAYERS} />
      </Themed>,
    )
    expect(screen.getByText('Layers (3)')).toBeInTheDocument()
  })

  it('shows add button when onAdd provided', () => {
    const onAdd = vi.fn()
    render(
      <Themed>
        <LayerStack layers={LAYERS} onAdd={onAdd} />
      </Themed>,
    )
    expect(screen.getByRole('button', { name: 'Add layer' })).toBeInTheDocument()
  })

  it('calls onAdd when add button clicked', async () => {
    const onAdd = vi.fn()
    const user = userEvent.setup()
    render(
      <Themed>
        <LayerStack layers={LAYERS} onAdd={onAdd} />
      </Themed>,
    )
    await user.click(screen.getByRole('button', { name: 'Add layer' }))
    expect(onAdd).toHaveBeenCalled()
  })

  it('calls onSelect on layer click', async () => {
    const onSelect = vi.fn()
    const user = userEvent.setup()
    render(
      <Themed>
        <LayerStack layers={LAYERS} onSelect={onSelect} />
      </Themed>,
    )
    await user.click(screen.getByText('Characters'))
    expect(onSelect).toHaveBeenCalledWith('chars')
  })

  it('calls onToggleVisibility', async () => {
    const onToggle = vi.fn()
    const user = userEvent.setup()
    render(
      <Themed>
        <LayerStack layers={LAYERS} onToggleVisibility={onToggle} />
      </Themed>,
    )
    await user.click(screen.getByRole('button', { name: 'Hide Background' }))
    expect(onToggle).toHaveBeenCalledWith('bg')
  })

  it('calls onToggleLock', async () => {
    const onToggle = vi.fn()
    const user = userEvent.setup()
    render(
      <Themed>
        <LayerStack layers={LAYERS} onToggleLock={onToggle} />
      </Themed>,
    )
    await user.click(screen.getByRole('button', { name: 'Unlock Effects' }))
    expect(onToggle).toHaveBeenCalledWith('fx')
  })

  it('shows remove buttons when onRemove provided', () => {
    render(
      <Themed>
        <LayerStack layers={LAYERS} onRemove={() => {}} />
      </Themed>,
    )
    expect(screen.getByRole('button', { name: 'Remove Background' })).toBeInTheDocument()
  })

  it('marks selected layer', () => {
    render(
      <Themed>
        <LayerStack layers={LAYERS} selectedId="chars" />
      </Themed>,
    )
    const item = screen.getByRole('listitem', { name: /Characters/ })
    expect(item).toHaveAttribute('data-selected', 'true')
  })

  it('has no axe violations', async () => {
    const { container } = render(
      <Themed>
        <LayerStack layers={LAYERS} selectedId="bg" />
      </Themed>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// AnimationPreview
// ---------------------------------------------------------------------------
describe('AnimationPreview', () => {
  const PIXEL =
    'data:image/svg+xml,' +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8"><rect width="8" height="8" fill="#f00"/></svg>',
    )

  const FRAMES: AnimationFrame[] = [
    { src: PIXEL, duration: 100 },
    { src: PIXEL, duration: 100 },
    { src: PIXEL, duration: 100 },
    { src: PIXEL, duration: 100 },
  ]

  it('renders preview image with frame alt text', () => {
    render(
      <Themed>
        <AnimationPreview frames={FRAMES} autoPlay={false} />
      </Themed>,
    )
    expect(screen.getByAltText('Animation frame 1 of 4')).toBeInTheDocument()
  })

  it('forwards className and style', () => {
    render(
      <Themed>
        <AnimationPreview
          frames={FRAMES}
          autoPlay={false}
          className="custom"
          style={{ maxWidth: '300px' }}
        />
      </Themed>,
    )
    const el = document.querySelector('.forge-animation-preview')
    expect(el?.className).toContain('custom')
    expect((el as HTMLElement).style.maxWidth).toBe('300px')
  })

  it('shows play/pause and frame step controls', () => {
    render(
      <Themed>
        <AnimationPreview frames={FRAMES} autoPlay={false} />
      </Themed>,
    )
    expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Previous frame' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Next frame' })).toBeInTheDocument()
  })

  it('shows frame counter', () => {
    render(
      <Themed>
        <AnimationPreview frames={FRAMES} autoPlay={false} />
      </Themed>,
    )
    expect(screen.getByText('1 / 4')).toBeInTheDocument()
  })

  it('toggles play/pause and fires onPlayStateChange', async () => {
    const onPlayStateChange = vi.fn()
    const user = userEvent.setup()
    render(
      <Themed>
        <AnimationPreview frames={FRAMES} autoPlay={false} onPlayStateChange={onPlayStateChange} />
      </Themed>,
    )
    const playBtn = screen.getByRole('button', { name: 'Play' })
    await user.click(playBtn)
    expect(onPlayStateChange).toHaveBeenCalledWith(true)
    expect(screen.getByRole('button', { name: 'Pause' })).toBeInTheDocument()
  })

  it('steps to next frame and fires onFrameChange', async () => {
    const onFrameChange = vi.fn()
    const user = userEvent.setup()
    render(
      <Themed>
        <AnimationPreview frames={FRAMES} autoPlay={false} onFrameChange={onFrameChange} />
      </Themed>,
    )
    await user.click(screen.getByRole('button', { name: 'Next frame' }))
    expect(onFrameChange).toHaveBeenCalledWith(1)
    expect(screen.getByText('2 / 4')).toBeInTheDocument()
  })

  it('steps to previous frame with loop', async () => {
    const onFrameChange = vi.fn()
    const user = userEvent.setup()
    render(
      <Themed>
        <AnimationPreview frames={FRAMES} autoPlay={false} loop onFrameChange={onFrameChange} />
      </Themed>,
    )
    await user.click(screen.getByRole('button', { name: 'Previous frame' }))
    expect(onFrameChange).toHaveBeenCalledWith(3)
    expect(screen.getByText('4 / 4')).toBeInTheDocument()
  })

  it('renders filmstrip thumbnails', () => {
    render(
      <Themed>
        <AnimationPreview frames={FRAMES} autoPlay={false} />
      </Themed>,
    )
    expect(screen.getByRole('group', { name: 'Animation frames' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Jump to frame 1' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Jump to frame 4' })).toBeInTheDocument()
  })

  it('jumps to frame on filmstrip click and fires onFrameChange', async () => {
    const onFrameChange = vi.fn()
    const user = userEvent.setup()
    render(
      <Themed>
        <AnimationPreview frames={FRAMES} autoPlay={false} onFrameChange={onFrameChange} />
      </Themed>,
    )
    await user.click(screen.getByRole('button', { name: 'Jump to frame 3' }))
    expect(onFrameChange).toHaveBeenCalledWith(2)
    expect(screen.getByText('3 / 4')).toBeInTheDocument()
  })

  it('hides controls and filmstrip for single-frame input', () => {
    render(
      <Themed>
        <AnimationPreview frames={[{ src: PIXEL, duration: 100 }]} />
      </Themed>,
    )
    expect(screen.getByAltText('Animation frame 1 of 1')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Play' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Pause' })).not.toBeInTheDocument()
    expect(screen.queryByRole('group', { name: 'Animation frames' })).not.toBeInTheDocument()
  })

  it('hides filmstrip when showFilmstrip is false', () => {
    render(
      <Themed>
        <AnimationPreview frames={FRAMES} autoPlay={false} showFilmstrip={false} />
      </Themed>,
    )
    expect(screen.queryByRole('group', { name: 'Animation frames' })).not.toBeInTheDocument()
    // Controls should still be visible
    expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument()
  })

  it('shows metadata when enabled', () => {
    render(
      <Themed>
        <AnimationPreview frames={FRAMES} autoPlay={false} showMetadata />
      </Themed>,
    )
    expect(screen.getByText('400ms total')).toBeInTheDocument()
    expect(screen.getByText('10.0 fps')).toBeInTheDocument()
  })

  it('pauses playback when stepping', async () => {
    const onPlayStateChange = vi.fn()
    const user = userEvent.setup()
    render(
      <Themed>
        <AnimationPreview frames={FRAMES} autoPlay onPlayStateChange={onPlayStateChange} />
      </Themed>,
    )
    // Component auto-plays, so Pause button should be visible
    expect(screen.getByRole('button', { name: 'Pause' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Next frame' }))
    expect(onPlayStateChange).toHaveBeenCalledWith(false)
  })

  it('has no axe violations', async () => {
    const { container } = render(
      <Themed>
        <AnimationPreview frames={FRAMES} autoPlay={false} />
      </Themed>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// TilePreview
// ---------------------------------------------------------------------------
describe('TilePreview', () => {
  it('renders canvas at specified size', () => {
    render(
      <Themed>
        <TilePreview source={null} size={64} />
      </Themed>,
    )
    const canvas = document.querySelector('.forge-tile-preview canvas') as HTMLCanvasElement
    expect(canvas).toBeInTheDocument()
    expect(canvas.style.width).toBe('64px')
    expect(canvas.style.height).toBe('64px')
  })

  it('shows placeholder text for null source', () => {
    render(
      <Themed>
        <TilePreview source={null} size={64} />
      </Themed>,
    )
    // Canvas should still render (placeholder drawn on canvas)
    expect(document.querySelector('.forge-tile-preview')).toBeInTheDocument()
  })

  it('renders label overlay', () => {
    render(
      <Themed>
        <TilePreview source={null} size={64} label="MS-3" />
      </Themed>,
    )
    expect(screen.getByText('MS-3')).toBeInTheDocument()
  })

  it('applies selected border style', () => {
    render(
      <Themed>
        <TilePreview source={null} size={64} border="selected" />
      </Themed>,
    )
    const el = document.querySelector('.forge-tile-preview') as HTMLElement
    expect(el.style.border).toContain('var(--forge-accent)')
  })

  it('applies error border style', () => {
    render(
      <Themed>
        <TilePreview source={null} size={64} border="error" />
      </Themed>,
    )
    const el = document.querySelector('.forge-tile-preview') as HTMLElement
    expect(el.style.border).toContain('var(--forge-danger)')
  })

  it('is clickable when onClick provided', async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()
    render(
      <Themed>
        <TilePreview source={null} size={64} onClick={onClick} />
      </Themed>,
    )
    const el = screen.getByRole('button')
    await user.click(el)
    expect(onClick).toHaveBeenCalled()
  })

  it('handles keyboard activation when interactive', async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()
    render(
      <Themed>
        <TilePreview source={null} size={64} onClick={onClick} />
      </Themed>,
    )
    const el = screen.getByRole('button')
    el.focus()
    await user.keyboard('{Enter}')
    expect(onClick).toHaveBeenCalled()
  })

  it('calls onHover on mouse enter/leave', async () => {
    const onHover = vi.fn()
    const user = userEvent.setup()
    render(
      <Themed>
        <TilePreview source={null} size={64} onHover={onHover} />
      </Themed>,
    )
    const el = document.querySelector('.forge-tile-preview') as HTMLElement
    await user.hover(el)
    expect(onHover).toHaveBeenCalledWith(true)
    await user.unhover(el)
    expect(onHover).toHaveBeenCalledWith(false)
  })

  it('forwards className', () => {
    render(
      <Themed>
        <TilePreview source={null} size={64} className="my-custom" />
      </Themed>,
    )
    const el = document.querySelector('.forge-tile-preview')
    expect(el?.className).toContain('my-custom')
  })

  it('does not render as button when no onClick', () => {
    render(
      <Themed>
        <TilePreview source={null} size={64} />
      </Themed>,
    )
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})

// ---------------------------------------------------------------------------
// TilingGrid
// ---------------------------------------------------------------------------
describe('TilingGrid', () => {
  it('renders canvas at specified size', () => {
    render(
      <Themed>
        <TilingGrid source={null} size={192} />
      </Themed>,
    )
    const canvas = document.querySelector('.forge-tiling-grid canvas') as HTMLCanvasElement
    expect(canvas).toBeInTheDocument()
    expect(canvas.style.width).toBe('192px')
  })

  it('has correct aria label with default 3×3', () => {
    render(
      <Themed>
        <TilingGrid source={null} size={192} />
      </Themed>,
    )
    expect(screen.getByLabelText('3×3 tiling grid')).toBeInTheDocument()
  })

  it('has correct aria label with custom dimensions', () => {
    render(
      <Themed>
        <TilingGrid source={null} size={256} cols={5} rows={4} />
      </Themed>,
    )
    expect(screen.getByLabelText('5×4 tiling grid')).toBeInTheDocument()
  })

  it('forwards className', () => {
    render(
      <Themed>
        <TilingGrid source={null} size={192} className="custom-grid" />
      </Themed>,
    )
    const el = document.querySelector('.forge-tiling-grid')
    expect(el?.className).toContain('custom-grid')
  })

  it('accepts getCellSource callback prop', () => {
    const getCellSource = vi.fn().mockReturnValue(null)
    // In JSDOM, canvas.getContext returns null so draw() exits early.
    // We verify the component renders without error and accepts the callback.
    render(
      <Themed>
        <TilingGrid getCellSource={getCellSource} size={192} cols={3} rows={3} />
      </Themed>,
    )
    expect(document.querySelector('.forge-tiling-grid')).toBeInTheDocument()
  })

  it('accepts overlay callback prop', () => {
    const overlay = vi.fn()
    render(
      <Themed>
        <TilingGrid source={null} size={192} overlay={overlay} />
      </Themed>,
    )
    expect(document.querySelector('.forge-tiling-grid')).toBeInTheDocument()
  })
})

/* ===================================================================
 * PipelineStepViewer
 * =================================================================== */
describe('PipelineStepViewer', () => {
  const makeSteps = (): PipelineStep[] => [
    { id: 'raw', label: 'Raw Output', status: 'complete', durationMs: 120 },
    { id: 'palette', label: 'Palette Snap', status: 'running', durationMs: 40 },
    { id: 'alpha', label: 'Alpha Cleanup', status: 'pending' },
  ]

  it('renders all step labels', () => {
    render(
      <Themed>
        <PipelineStepViewer steps={makeSteps()} />
      </Themed>,
    )
    // Each label appears in both the step indicator and possibly the result panel header,
    // so use getAllByText for labels that may appear twice.
    expect(screen.getAllByText('Raw Output').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Palette Snap').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Alpha Cleanup').length).toBeGreaterThanOrEqual(1)
  })

  it('shows status in step button aria-label', () => {
    render(
      <Themed>
        <PipelineStepViewer steps={makeSteps()} />
      </Themed>,
    )
    expect(screen.getByLabelText('Raw Output — complete (120ms)')).toBeInTheDocument()
  })

  it('fires onSelectStep when a step is clicked', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(
      <Themed>
        <PipelineStepViewer steps={makeSteps()} onSelectStep={onSelect} />
      </Themed>,
    )
    await user.click(screen.getByLabelText('Palette Snap — running (40ms)'))
    expect(onSelect).toHaveBeenCalledWith('palette')
  })

  it('highlights the selected step', () => {
    render(
      <Themed>
        <PipelineStepViewer steps={makeSteps()} selectedStep="palette" />
      </Themed>,
    )
    const btn = screen.getByLabelText('Palette Snap — running (40ms)')
    expect(btn.getAttribute('aria-current')).toBe('step')
  })

  it('shows result panel for selected step', () => {
    const steps: PipelineStep[] = [
      { id: 'raw', label: 'Raw', status: 'complete', result: <div>Result content here</div> },
    ]
    render(
      <Themed>
        <PipelineStepViewer steps={steps} selectedStep="raw" />
      </Themed>,
    )
    expect(screen.getByText('Result content here')).toBeInTheDocument()
  })

  it('displays step metadata', () => {
    const steps: PipelineStep[] = [
      { id: 'raw', label: 'Raw', status: 'complete', meta: { colors: '256', format: 'RGBA' } },
    ]
    render(
      <Themed>
        <PipelineStepViewer steps={steps} selectedStep="raw" />
      </Themed>,
    )
    expect(screen.getByText('256')).toBeInTheDocument()
    expect(screen.getByText('RGBA')).toBeInTheDocument()
  })

  it('supports vertical layout', () => {
    render(
      <Themed>
        <PipelineStepViewer steps={makeSteps()} layout="vertical" />
      </Themed>,
    )
    const viewer = document.querySelector('.forge-pipeline-step-viewer')
    expect(viewer).toBeInTheDocument()
    expect((viewer as HTMLElement).style.flexDirection).toBe('row')
  })

  it('supports filmstrip layout showing all results', () => {
    const steps: PipelineStep[] = [
      { id: 'a', label: 'A', status: 'complete', result: <div>Res A</div> },
      { id: 'b', label: 'B', status: 'complete', result: <div>Res B</div> },
    ]
    render(
      <Themed>
        <PipelineStepViewer steps={steps} layout="filmstrip" />
      </Themed>,
    )
    expect(screen.getByText('Res A')).toBeInTheDocument()
    expect(screen.getByText('Res B')).toBeInTheDocument()
  })

  it('supports all layout showing every step with header and result', () => {
    const steps: PipelineStep[] = [
      {
        id: 'a',
        label: 'Step A',
        status: 'complete',
        result: <div>Res A</div>,
        meta: { model: 'xl' },
      },
      { id: 'b', label: 'Step B', status: 'running', result: <div>Res B</div> },
    ]
    render(
      <Themed>
        <PipelineStepViewer steps={steps} layout="all" />
      </Themed>,
    )
    expect(screen.getByText('Res A')).toBeInTheDocument()
    expect(screen.getByText('Res B')).toBeInTheDocument()
    expect(screen.getByText('Step A')).toBeInTheDocument()
    expect(screen.getByText('Step B')).toBeInTheDocument()
  })

  it('formats duration as seconds for large values', () => {
    const steps: PipelineStep[] = [
      { id: 'raw', label: 'Raw', status: 'complete', durationMs: 2500 },
    ]
    render(
      <Themed>
        <PipelineStepViewer steps={steps} />
      </Themed>,
    )
    expect(screen.getAllByText('2.5s').length).toBeGreaterThanOrEqual(1)
  })
})

/* ===================================================================
 * HeatMapOverlay
 * =================================================================== */
describe('HeatMapOverlay', () => {
  it('renders a canvas element', () => {
    render(
      <Themed>
        <HeatMapOverlay width={64} height={64} />
      </Themed>,
    )
    const canvas = document.querySelector('.forge-heatmap-overlay')
    expect(canvas).toBeInTheDocument()
    expect(canvas?.tagName).toBe('CANVAS')
  })

  it('has correct width and height attributes', () => {
    render(
      <Themed>
        <HeatMapOverlay width={128} height={64} />
      </Themed>,
    )
    const canvas = document.querySelector('.forge-heatmap-overlay') as HTMLCanvasElement
    expect(canvas.width).toBe(128)
    expect(canvas.height).toBe(64)
  })

  it('has pointer-events none for overlay use', () => {
    render(
      <Themed>
        <HeatMapOverlay width={64} height={64} />
      </Themed>,
    )
    const canvas = document.querySelector('.forge-heatmap-overlay') as HTMLElement
    expect(canvas.style.pointerEvents).toBe('none')
  })

  it('accepts aria-label for accessibility', () => {
    render(
      <Themed>
        <HeatMapOverlay width={64} height={64} />
      </Themed>,
    )
    expect(screen.getByLabelText('Heat map overlay')).toBeInTheDocument()
  })

  it('accepts className prop', () => {
    render(
      <Themed>
        <HeatMapOverlay width={64} height={64} className="custom-heatmap" />
      </Themed>,
    )
    const canvas = document.querySelector('.forge-heatmap-overlay')
    expect(canvas?.classList.contains('custom-heatmap')).toBe(true)
  })

  it('accepts rgbaData input', () => {
    const rgba = new Uint8ClampedArray(64 * 64 * 4)
    render(
      <Themed>
        <HeatMapOverlay rgbaData={rgba} width={64} height={64} />
      </Themed>,
    )
    expect(document.querySelector('.forge-heatmap-overlay')).toBeInTheDocument()
  })

  it('accepts scalarData as 2D array', () => {
    const scalar = Array.from({ length: 8 }, () => Array.from({ length: 8 }, () => Math.random()))
    render(
      <Themed>
        <HeatMapOverlay scalarData={scalar} width={8} height={8} />
      </Themed>,
    )
    expect(document.querySelector('.forge-heatmap-overlay')).toBeInTheDocument()
  })

  it('exports renderHeatMap utility function', () => {
    expect(typeof renderHeatMap).toBe('function')
  })
})

/* ===================================================================
 * VerdictWidget
 * =================================================================== */
describe('VerdictWidget', () => {
  it('renders approve and reject buttons', () => {
    render(
      <Themed>
        <VerdictWidget />
      </Themed>,
    )
    expect(screen.getByLabelText('Approve')).toBeInTheDocument()
    expect(screen.getByLabelText('Reject')).toBeInTheDocument()
  })

  it('fires onChange with "up" when approve is clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <Themed>
        <VerdictWidget onChange={onChange} />
      </Themed>,
    )
    await user.click(screen.getByLabelText('Approve'))
    expect(onChange).toHaveBeenCalledWith('up')
  })

  it('fires onChange with "down" when reject is clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <Themed>
        <VerdictWidget onChange={onChange} />
      </Themed>,
    )
    await user.click(screen.getByLabelText('Reject'))
    expect(onChange).toHaveBeenCalledWith('down')
  })

  it('toggles off when clicking the active verdict', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <Themed>
        <VerdictWidget value="up" onChange={onChange} />
      </Themed>,
    )
    await user.click(screen.getByLabelText('Approve'))
    expect(onChange).toHaveBeenCalledWith(null)
  })

  it('sets aria-pressed on the active verdict', () => {
    render(
      <Themed>
        <VerdictWidget value="down" />
      </Themed>,
    )
    expect(screen.getByLabelText('Approve').getAttribute('aria-pressed')).toBe('false')
    expect(screen.getByLabelText('Reject').getAttribute('aria-pressed')).toBe('true')
  })

  it('shows notes textarea when showNotes is true and verdict is set', () => {
    render(
      <Themed>
        <VerdictWidget value="up" showNotes />
      </Themed>,
    )
    expect(screen.getByLabelText('Verdict notes')).toBeInTheDocument()
  })

  it('hides notes textarea when no verdict is selected', () => {
    render(
      <Themed>
        <VerdictWidget showNotes />
      </Themed>,
    )
    expect(screen.queryByLabelText('Verdict notes')).not.toBeInTheDocument()
  })

  it('disables buttons when disabled prop is set', () => {
    render(
      <Themed>
        <VerdictWidget disabled />
      </Themed>,
    )
    expect(screen.getByLabelText('Approve')).toBeDisabled()
    expect(screen.getByLabelText('Reject')).toBeDisabled()
  })
})

/* ===================================================================
 * GenerationQueue
 * =================================================================== */
describe('GenerationQueue', () => {
  const makeJobs = (): GenerationJob[] => [
    { id: 'j1', label: 'Generate grass fill', status: 'completed', apiCalls: 3 },
    { id: 'j2', label: 'Generate stone fill', status: 'running', progress: 45 },
    { id: 'j3', label: 'Generate water fill', status: 'queued' },
    { id: 'j4', label: 'Generate lava fill', status: 'failed', error: 'Rate limited' },
  ]

  it('renders compact variant with job summary', () => {
    render(
      <Themed>
        <GenerationQueue jobs={makeJobs()} />
      </Themed>,
    )
    expect(screen.getByText(/1 running/)).toBeInTheDocument()
    expect(screen.getByText(/1 queued/)).toBeInTheDocument()
  })

  it('renders expanded variant with all job labels', () => {
    render(
      <Themed>
        <GenerationQueue jobs={makeJobs()} variant="expanded" />
      </Themed>,
    )
    expect(screen.getByText('Generate grass fill')).toBeInTheDocument()
    expect(screen.getByText('Generate stone fill')).toBeInTheDocument()
    expect(screen.getByText('Generate water fill')).toBeInTheDocument()
    expect(screen.getByText('Generate lava fill')).toBeInTheDocument()
  })

  it('shows cancel button for queued jobs', () => {
    const onCancel = vi.fn()
    render(
      <Themed>
        <GenerationQueue jobs={makeJobs()} variant="expanded" onCancel={onCancel} />
      </Themed>,
    )
    expect(screen.getByLabelText('Cancel Generate water fill')).toBeInTheDocument()
  })

  it('fires onCancel when cancel is clicked', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()
    render(
      <Themed>
        <GenerationQueue jobs={makeJobs()} variant="expanded" onCancel={onCancel} />
      </Themed>,
    )
    await user.click(screen.getByLabelText('Cancel Generate water fill'))
    expect(onCancel).toHaveBeenCalledWith('j3')
  })

  it('shows retry button for failed jobs', () => {
    const onRetry = vi.fn()
    render(
      <Themed>
        <GenerationQueue jobs={makeJobs()} variant="expanded" onRetry={onRetry} />
      </Themed>,
    )
    expect(screen.getByLabelText('Retry Generate lava fill')).toBeInTheDocument()
  })

  it('displays cost with default formatter', () => {
    render(
      <Themed>
        <GenerationQueue jobs={[]} totalCost={850} />
      </Themed>,
    )
    expect(screen.getByText('$8.50')).toBeInTheDocument()
  })

  it('displays cost with custom formatter', () => {
    render(
      <Themed>
        <GenerationQueue jobs={[]} totalCost={100} costFormat={(cents) => `${cents} credits`} />
      </Themed>,
    )
    expect(screen.getByText('100 credits')).toBeInTheDocument()
  })

  it('shows budget warning when over ceiling', () => {
    render(
      <Themed>
        <GenerationQueue jobs={[]} totalCost={1100} budgetCeiling={1000} />
      </Themed>,
    )
    expect(screen.getByText(/over budget/)).toBeInTheDocument()
  })

  it('shows progress bar for running jobs with progress', () => {
    render(
      <Themed>
        <GenerationQueue jobs={makeJobs()} variant="expanded" />
      </Themed>,
    )
    expect(screen.getByLabelText('Generate stone fill progress')).toBeInTheDocument()
  })
})

/* ===================================================================
 * WizardDialog
 * =================================================================== */
describe('WizardDialog', () => {
  const makeSteps = (): WizardStep[] => [
    { id: 'basics', label: 'Basics', content: <div>Step 1 content</div> },
    { id: 'materials', label: 'Materials', content: <div>Step 2 content</div> },
    { id: 'review', label: 'Review', content: <div>Step 3 content</div> },
  ]

  it('renders when open', () => {
    render(
      <Themed>
        <WizardDialog
          open={true}
          onOpenChange={() => {}}
          title="New Pack"
          steps={makeSteps()}
          onComplete={() => {}}
        />
      </Themed>,
    )
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('New Pack')).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    render(
      <Themed>
        <WizardDialog
          open={false}
          onOpenChange={() => {}}
          title="New Pack"
          steps={makeSteps()}
          onComplete={() => {}}
        />
      </Themed>,
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('shows first step content initially', () => {
    render(
      <Themed>
        <WizardDialog
          open={true}
          onOpenChange={() => {}}
          title="New Pack"
          steps={makeSteps()}
          onComplete={() => {}}
        />
      </Themed>,
    )
    expect(screen.getByText('Step 1 content')).toBeInTheDocument()
  })

  it('navigates to next step on Next click', async () => {
    const user = userEvent.setup()
    render(
      <Themed>
        <WizardDialog
          open={true}
          onOpenChange={() => {}}
          title="New Pack"
          steps={makeSteps()}
          onComplete={() => {}}
        />
      </Themed>,
    )
    await user.click(screen.getByText('Next'))
    expect(screen.getByText('Step 2 content')).toBeInTheDocument()
  })

  it('navigates back on Back click', async () => {
    const user = userEvent.setup()
    render(
      <Themed>
        <WizardDialog
          open={true}
          onOpenChange={() => {}}
          title="New Pack"
          steps={makeSteps()}
          onComplete={() => {}}
        />
      </Themed>,
    )
    await user.click(screen.getByText('Next'))
    await user.click(screen.getByText('Back'))
    expect(screen.getByText('Step 1 content')).toBeInTheDocument()
  })

  it('shows finish label on last step', async () => {
    const user = userEvent.setup()
    render(
      <Themed>
        <WizardDialog
          open={true}
          onOpenChange={() => {}}
          title="New Pack"
          steps={makeSteps()}
          onComplete={() => {}}
          finishLabel="Done"
        />
      </Themed>,
    )
    await user.click(screen.getByText('Next'))
    await user.click(screen.getByText('Next'))
    expect(screen.getByText('Done')).toBeInTheDocument()
  })

  it('calls onComplete when finish is clicked', async () => {
    const user = userEvent.setup()
    const onComplete = vi.fn()
    render(
      <Themed>
        <WizardDialog
          open={true}
          onOpenChange={() => {}}
          title="New Pack"
          steps={makeSteps()}
          onComplete={onComplete}
        />
      </Themed>,
    )
    await user.click(screen.getByText('Next'))
    await user.click(screen.getByText('Next'))
    await user.click(screen.getByText('Create'))
    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it('shows validation error when validate returns a message', async () => {
    const user = userEvent.setup()
    const steps: WizardStep[] = [
      {
        id: 'a',
        label: 'A',
        content: <div>A</div>,
        validate: () => 'Name is required',
      },
      { id: 'b', label: 'B', content: <div>B</div> },
    ]
    render(
      <Themed>
        <WizardDialog
          open={true}
          onOpenChange={() => {}}
          title="Test"
          steps={steps}
          onComplete={() => {}}
        />
      </Themed>,
    )
    await user.click(screen.getByText('Next'))
    expect(screen.getByRole('alert')).toHaveTextContent('Name is required')
  })

  it('calls onOpenChange with false when Cancel is clicked', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(
      <Themed>
        <WizardDialog
          open={true}
          onOpenChange={onOpenChange}
          title="New Pack"
          steps={makeSteps()}
          onComplete={() => {}}
        />
      </Themed>,
    )
    await user.click(screen.getByText('Cancel'))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('shows step labels in progress indicator', () => {
    render(
      <Themed>
        <WizardDialog
          open={true}
          onOpenChange={() => {}}
          title="New Pack"
          steps={makeSteps()}
          onComplete={() => {}}
        />
      </Themed>,
    )
    expect(screen.getByText('Basics')).toBeInTheDocument()
    expect(screen.getByText('Materials')).toBeInTheDocument()
    expect(screen.getByText('Review')).toBeInTheDocument()
  })
})
