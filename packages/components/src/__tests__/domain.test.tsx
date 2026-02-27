import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { ThemeProvider } from '../ThemeProvider/index.js'
import { Timeline, VirtualCanvas } from '../index.js'
import type { TimelineTrack, CanvasItem } from '../index.js'

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
