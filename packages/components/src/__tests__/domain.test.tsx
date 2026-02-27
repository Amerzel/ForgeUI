import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { ThemeProvider } from '../ThemeProvider/index.js'
import { Timeline, VirtualCanvas, DrawingCanvas, ImageViewer, ComparisonSlider, LayerStack } from '../index.js'
import type { TimelineTrack, CanvasItem, Layer } from '../index.js'

// Note: NodeEditor wraps ReactFlow which uses canvas and extensive browser APIs.
// We test its accessibility and rendering at the component level via Timeline and
// VirtualCanvas which share the same interaction patterns.

function Themed({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>
}

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
      clips: [
        { id: 'clip3', start: 0, duration: 5, label: 'Shot A' },
      ],
    },
  ]

  it('renders track labels', () => {
    render(
      <Themed>
        <Timeline tracks={TRACKS} currentTime={0} duration={10} />
      </Themed>
    )
    expect(screen.getByText('Character Rig')).toBeInTheDocument()
    expect(screen.getByText('Camera')).toBeInTheDocument()
  })

  it('renders clip labels', () => {
    render(
      <Themed>
        <Timeline tracks={TRACKS} currentTime={0} duration={10} />
      </Themed>
    )
    expect(screen.getByText('Walk Cycle')).toBeInTheDocument()
    expect(screen.getByText('Idle')).toBeInTheDocument()
    expect(screen.getByText('Shot A')).toBeInTheDocument()
  })

  it('shows current time in toolbar', () => {
    render(
      <Themed>
        <Timeline tracks={TRACKS} currentTime={1.5} duration={10} />
      </Themed>
    )
    expect(screen.getByText('0:01.5')).toBeInTheDocument()
  })

  it('renders zoom controls', () => {
    render(
      <Themed>
        <Timeline tracks={TRACKS} currentTime={0} duration={10} />
      </Themed>
    )
    expect(screen.getByRole('button', { name: 'Zoom in' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Zoom out' })).toBeInTheDocument()
  })

  it('calls onZoomChange when zooming', async () => {
    const onZoomChange = vi.fn()
    const user = userEvent.setup()
    render(
      <Themed>
        <Timeline tracks={TRACKS} currentTime={0} duration={10} onZoomChange={onZoomChange} zoom={80} />
      </Themed>
    )
    await user.click(screen.getByRole('button', { name: 'Zoom in' }))
    expect(onZoomChange).toHaveBeenCalled()
  })

  it('has no axe violations', async () => {
    const { container } = render(
      <Themed>
        <Timeline tracks={TRACKS} currentTime={0} duration={10} />
      </Themed>
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
      </Themed>
    )
    expect(screen.getByText('Node A')).toBeInTheDocument()
    expect(screen.getByText('Node B')).toBeInTheDocument()
  })

  it('renders viewport indicator', () => {
    render(
      <Themed>
        <VirtualCanvas items={ITEMS} viewport={{ x: 0, y: 0, zoom: 1 }} />
      </Themed>
    )
    expect(screen.getByLabelText('Zoom: 100%')).toBeInTheDocument()
  })

  it('renders reset viewport button', () => {
    render(
      <Themed>
        <VirtualCanvas items={ITEMS} />
      </Themed>
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
      </Themed>
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
      </Themed>
    )
    expect(screen.getByText('Custom canvas content')).toBeInTheDocument()
  })

  it('selects item on click', async () => {
    const user = userEvent.setup()
    render(
      <Themed>
        <VirtualCanvas items={ITEMS} />
      </Themed>
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
      </Themed>
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
      </Themed>
    )
    expect(screen.getByRole('application', { name: 'Drawing canvas' })).toBeInTheDocument()
  })

  it('shows drawing layer canvas', () => {
    render(
      <Themed>
        <DrawingCanvas width={256} height={256} tool="brush" brushSize={10} />
      </Themed>
    )
    expect(screen.getByTestId('drawing-layer')).toBeInTheDocument()
  })

  it('displays tool indicator', () => {
    render(
      <Themed>
        <DrawingCanvas width={128} height={128} tool="eraser" brushSize={20} />
      </Themed>
    )
    expect(screen.getByLabelText('Tool: eraser, Size: 20px')).toBeInTheDocument()
  })

  it('shows loading state when background image is set', () => {
    render(
      <Themed>
        <DrawingCanvas width={256} height={256} tool="brush" brushSize={10} backgroundImage="test.png" />
      </Themed>
    )
    expect(screen.getByLabelText('Loading background image')).toBeInTheDocument()
  })

  it('has no axe violations', async () => {
    const { container } = render(
      <Themed>
        <DrawingCanvas width={256} height={256} tool="brush" brushSize={10} />
      </Themed>
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
      </Themed>
    )
    expect(screen.getByRole('application', { name: 'Image viewer: Test image' })).toBeInTheDocument()
  })

  it('renders zoom controls', () => {
    render(
      <Themed>
        <ImageViewer src="test.png" alt="Test image" />
      </Themed>
    )
    expect(screen.getByRole('button', { name: 'Zoom in' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Zoom out' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Fit to view' })).toBeInTheDocument()
  })

  it('hides controls when showControls is false', () => {
    render(
      <Themed>
        <ImageViewer src="test.png" alt="Test" showControls={false} />
      </Themed>
    )
    expect(screen.queryByRole('button', { name: 'Zoom in' })).not.toBeInTheDocument()
  })

  it('renders toolbar slot', () => {
    render(
      <Themed>
        <ImageViewer src="test.png" alt="Test" toolbar={<button>Download</button>} />
      </Themed>
    )
    expect(screen.getByRole('button', { name: 'Download' })).toBeInTheDocument()
  })

  it('has no axe violations', async () => {
    const { container } = render(
      <Themed>
        <ImageViewer src="test.png" alt="Test image" />
      </Themed>
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
      </Themed>
    )
    expect(screen.getByRole('slider', { name: 'Image comparison slider' })).toBeInTheDocument()
  })

  it('displays labels', () => {
    render(
      <Themed>
        <ComparisonSlider before="a.png" after="b.png" beforeLabel="Original" afterLabel="Processed" />
      </Themed>
    )
    expect(screen.getByText('Original')).toBeInTheDocument()
    expect(screen.getByText('Processed')).toBeInTheDocument()
  })

  it('shows initial position', () => {
    render(
      <Themed>
        <ComparisonSlider before="a.png" after="b.png" initialPosition={75} />
      </Themed>
    )
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '75')
  })

  it('responds to keyboard left/right', async () => {
    const onPositionChange = vi.fn()
    const user = userEvent.setup()
    render(
      <Themed>
        <ComparisonSlider before="a.png" after="b.png" position={50} onPositionChange={onPositionChange} />
      </Themed>
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
      </Themed>
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
      </Themed>
    )
    expect(screen.getByText('Background')).toBeInTheDocument()
    expect(screen.getByText('Characters')).toBeInTheDocument()
    expect(screen.getByText('Effects')).toBeInTheDocument()
  })

  it('shows layer count in header', () => {
    render(
      <Themed>
        <LayerStack layers={LAYERS} />
      </Themed>
    )
    expect(screen.getByText('Layers (3)')).toBeInTheDocument()
  })

  it('shows add button when onAdd provided', () => {
    const onAdd = vi.fn()
    render(
      <Themed>
        <LayerStack layers={LAYERS} onAdd={onAdd} />
      </Themed>
    )
    expect(screen.getByRole('button', { name: 'Add layer' })).toBeInTheDocument()
  })

  it('calls onAdd when add button clicked', async () => {
    const onAdd = vi.fn()
    const user = userEvent.setup()
    render(
      <Themed>
        <LayerStack layers={LAYERS} onAdd={onAdd} />
      </Themed>
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
      </Themed>
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
      </Themed>
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
      </Themed>
    )
    await user.click(screen.getByRole('button', { name: 'Unlock Effects' }))
    expect(onToggle).toHaveBeenCalledWith('fx')
  })

  it('shows remove buttons when onRemove provided', () => {
    render(
      <Themed>
        <LayerStack layers={LAYERS} onRemove={() => {}} />
      </Themed>
    )
    expect(screen.getByRole('button', { name: 'Remove Background' })).toBeInTheDocument()
  })

  it('marks selected layer', () => {
    render(
      <Themed>
        <LayerStack layers={LAYERS} selectedId="chars" />
      </Themed>
    )
    const item = screen.getByRole('listitem', { name: /Characters/ })
    expect(item).toHaveAttribute('data-selected', 'true')
  })

  it('has no axe violations', async () => {
    const { container } = render(
      <Themed>
        <LayerStack layers={LAYERS} selectedId="bg" />
      </Themed>
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
