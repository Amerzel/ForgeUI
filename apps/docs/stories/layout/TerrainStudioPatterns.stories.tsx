import type { Meta, StoryObj } from '@storybook/react'
import { useState, useCallback, useRef } from 'react'
import {
  ResizablePanel,
  ResizablePanelGroup,
  Tabs,
  Badge,
  Text,
  Card,
  Stack,
  Group,
  Button,
  Separator,
  Select,
  Progress,
  ScrollArea,
  Slider,
  TilePreview,
  TilingGrid,
  PipelineStepViewer,
  HeatMapOverlay,
  VerdictWidget,
  GenerationQueue,
  InpaintMaskPainter,
  SpritesheetSlicer,
} from '@forgeui/components'
import type { PipelineStep, GenerationJob, Verdict, GridTemplate } from '@forgeui/components'

/**
 * Terrain Creation Studio — Suggested Page Layouts
 *
 * These patterns demonstrate how **all 9 new domain components** compose into
 * complete application screens for the Terrain Creation Studio.
 *
 * Each story shows a different module or workflow:
 *
 * 1. **GenerationWorkspace** — The main workspace for generating tile packs.
 *    Combines TilingGrid, PipelineStepViewer, GenerationQueue, and VerdictWidget.
 *
 * 2. **TileEditor** — Per-tile refinement with InpaintMaskPainter,
 *    HeatMapOverlay, and before/after TilePreview.
 *
 * 3. **ImportWorkflow** — SpritesheetSlicer → TilingGrid pipeline for
 *    importing existing tilesets.
 *
 * 4. **QualityDashboard** — Overview dashboard with HeatMapOverlay,
 *    VerdictWidget, and GenerationQueue for monitoring batch jobs.
 */
const meta: Meta = {
  title: 'Patterns/Terrain Studio Patterns',
  parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj

// ---------------------------------------------------------------------------
// Shared helpers & mock data
// ---------------------------------------------------------------------------

function SectionLabel({ children }: { children: string }) {
  return (
    <Text
      size="xs"
      style={{
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: 'var(--forge-color-text-muted)',
        fontWeight: 600,
      }}
    >
      {children}
    </Text>
  )
}

function Panel({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        height: '100%',
        backgroundColor: 'var(--forge-surface)',
        borderRight: '1px solid var(--forge-border)',
        padding: 'var(--forge-space-3)',
        overflow: 'auto',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

const MOCK_PIPELINE_STEPS: PipelineStep[] = [
  {
    id: 'gen',
    label: 'Generate',
    status: 'complete',
    result: (
      <div
        style={{
          width: 120,
          height: 120,
          backgroundColor: '#2d5a3d',
          borderRadius: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text size="xs" style={{ color: '#7bc88f' }}>
          AI Output
        </Text>
      </div>
    ),
    meta: { Model: 'flux-1.1' },
  },
  {
    id: 'upscale',
    label: 'Upscale',
    status: 'complete',
    result: (
      <div
        style={{
          width: 120,
          height: 120,
          backgroundColor: '#3d4a5a',
          borderRadius: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text size="xs" style={{ color: '#8ba8c4' }}>
          4× Upscaled
        </Text>
      </div>
    ),
    meta: { Scale: '4×' },
  },
  {
    id: 'color',
    label: 'Color Match',
    status: 'running',
    result: (
      <div
        style={{
          width: 120,
          height: 120,
          backgroundColor: '#5a4a3d',
          borderRadius: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text size="xs" style={{ color: '#c4a87b' }}>
          Processing…
        </Text>
      </div>
    ),
  },
  {
    id: 'tile',
    label: 'Tile Wrap',
    status: 'pending',
  },
  {
    id: 'final',
    label: 'Final',
    status: 'pending',
  },
]

const MOCK_JOBS: GenerationJob[] = [
  { id: 'j1', label: 'grass_water_ms3', status: 'completed', estimatedCost: 0.04 },
  { id: 'j2', label: 'grass_water_ms6', status: 'completed', estimatedCost: 0.04 },
  { id: 'j3', label: 'grass_water_ms9', status: 'running', estimatedCost: 0.04 },
  { id: 'j4', label: 'grass_stone_ms3', status: 'queued' },
  { id: 'j5', label: 'grass_stone_ms6', status: 'queued' },
  { id: 'j6', label: 'stone_sand_ms3', status: 'queued' },
]

const SLICER_TEMPLATES: GridTemplate[] = [
  { id: 'wang4', label: '4×4 Wang', cols: 4, rows: 4 },
  { id: 'blob47', label: '7×7 Blob-47', cols: 7, rows: 7 },
  { id: 'custom', label: '8×8 Custom', cols: 8, rows: 8 },
]

/** Creates a simple colored tile canvas for demo */
function makeTileCanvas(hue: number, size = 64): HTMLCanvasElement {
  const c = document.createElement('canvas')
  c.width = size
  c.height = size
  const ctx = c.getContext('2d')
  if (ctx) {
    ctx.fillStyle = `hsl(${hue}, 40%, 35%)`
    ctx.fillRect(0, 0, size, size)
    ctx.fillStyle = `hsl(${hue}, 50%, 45%)`
    ctx.fillRect(4, 4, size - 8, size - 8)
  }
  return c
}

/** Creates a spritesheet canvas for demos */
function makeSheet(cols: number, rows: number, tileSize: number): HTMLCanvasElement {
  const c = document.createElement('canvas')
  c.width = cols * tileSize
  c.height = rows * tileSize
  const ctx = c.getContext('2d')
  if (!ctx) return c
  const hues = [120, 200, 40, 280, 0, 60, 320, 160]
  for (let r = 0; r < rows; r++) {
    for (let col = 0; col < cols; col++) {
      const hue = hues[(r * cols + col) % hues.length] as number
      ctx.fillStyle = `hsl(${hue}, 50%, ${30 + ((r * cols + col) % 10)}%)`
      ctx.fillRect(col * tileSize, r * tileSize, tileSize, tileSize)
      ctx.strokeStyle = `hsl(${hue}, 40%, 50%)`
      ctx.lineWidth = 1
      ctx.strokeRect(col * tileSize + 2, r * tileSize + 2, tileSize - 4, tileSize - 4)
    }
  }
  return c
}

// ---------------------------------------------------------------------------
// Story 1: Generation Workspace
// ---------------------------------------------------------------------------

/**
 * ### Generation Workspace
 *
 * The primary layout for generating and reviewing tile packs. Combines:
 *
 * - **Left Panel**: TilingGrid showing the current tileset, TilePreview for
 *   the selected tile
 * - **Center Panel**: PipelineStepViewer showing all 5 processing stages
 * - **Right Panel**: GenerationQueue tracking batch jobs, VerdictWidget for
 *   quality approval
 *
 * This is the recommended layout for the main Terrain Studio workspace.
 */
export const GenerationWorkspace: Story = {
  render: function GenerationWorkspaceStory() {
    const [selectedTile] = useState<{ col: number; row: number } | null>({ col: 1, row: 0 })
    const [verdict, setVerdict] = useState<Verdict | null>(null)
    const tiles = useRef(Array.from({ length: 16 }, (_, i) => makeTileCanvas(120 + i * 15))).current

    const getCellSource = useCallback(
      (col: number, row: number) => {
        const idx = row * 4 + col
        return tiles[idx] ?? null
      },
      [tiles],
    )

    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Top bar */}
        <div
          style={{
            padding: 'var(--forge-space-2) var(--forge-space-4)',
            backgroundColor: 'var(--forge-surface-2)',
            borderBottom: '1px solid var(--forge-border)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--forge-space-3)',
          }}
        >
          <Text weight="semibold">Terrain Studio</Text>
          <Separator orientation="vertical" style={{ height: 20 }} />
          <Badge variant="outline">grass_water</Badge>
          <Badge variant="subtle">4×4 Wang</Badge>
          <div style={{ flex: 1 }} />
          <Badge variant={verdict === 'up' ? 'solid' : 'outline'}>
            {verdict === 'up' ? '✓ Approved' : verdict === 'down' ? '✗ Rejected' : 'Pending review'}
          </Badge>
        </div>

        {/* Main content */}
        <div style={{ flex: 1, minHeight: 0 }}>
          <ResizablePanelGroup direction="horizontal">
            {/* Left: Tile Grid */}
            <ResizablePanel defaultSize={30} minSize={20}>
              <Panel>
                <Stack gap="sm">
                  <SectionLabel>Tile Grid</SectionLabel>
                  <TilingGrid
                    cols={4}
                    rows={4}
                    size={256}
                    getCellSource={getCellSource}
                    showBoundaries
                  />
                  {selectedTile && (
                    <>
                      <Separator />
                      <SectionLabel>Selected Tile</SectionLabel>
                      <Group gap="sm" align="start">
                        <TilePreview
                          source={getCellSource(selectedTile.col, selectedTile.row)}
                          size={96}
                          label={`(${selectedTile.col}, ${selectedTile.row})`}
                          border="selected"
                        />
                        <Stack gap="xs">
                          <Text size="sm" weight="semibold">
                            ms{selectedTile.row * 4 + selectedTile.col + 1}
                          </Text>
                          <Text size="xs" style={{ color: 'var(--forge-color-text-muted)' }}>
                            Case {selectedTile.row * 4 + selectedTile.col}
                          </Text>
                          <VerdictWidget value={verdict} onChange={setVerdict} size="sm" />
                        </Stack>
                      </Group>
                    </>
                  )}
                </Stack>
              </Panel>
            </ResizablePanel>

            {/* Center: Pipeline */}
            <ResizablePanel defaultSize={45} minSize={30}>
              <Panel style={{ borderRight: '1px solid var(--forge-border)' }}>
                <Stack gap="sm">
                  <SectionLabel>Pipeline</SectionLabel>
                  <PipelineStepViewer steps={MOCK_PIPELINE_STEPS} layout="all" />
                </Stack>
              </Panel>
            </ResizablePanel>

            {/* Right: Queue & Verdict */}
            <ResizablePanel defaultSize={25} minSize={15}>
              <Panel style={{ borderRight: 'none' }}>
                <Stack gap="md">
                  <SectionLabel>Generation Queue</SectionLabel>
                  <GenerationQueue
                    jobs={MOCK_JOBS}
                    variant="expanded"
                    budgetCeiling={1.0}
                    costFormat={(c) => `$${c.toFixed(2)}`}
                  />
                </Stack>
              </Panel>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    )
  },
}

// ---------------------------------------------------------------------------
// Story 2: Tile Editor
// ---------------------------------------------------------------------------

/**
 * ### Tile Editor
 *
 * Per-tile refinement workflow combining:
 *
 * - **InpaintMaskPainter** for painting regions to regenerate
 * - **HeatMapOverlay** showing quality scores across the tile
 * - **TilePreview** for before/after comparison
 * - **VerdictWidget** for final approval
 *
 * Recommended for the "Tile Editor" module in the Terrain Studio.
 */
export const TileEditor: Story = {
  render: function TileEditorStory() {
    const tile = useRef(makeTileCanvas(120, 64)).current
    const [tool, setTool] = useState<'paint' | 'erase'>('paint')
    const [brushSize, setBrushSize] = useState(4)
    const [verdict, setVerdict] = useState<Verdict | null>(null)

    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            padding: 'var(--forge-space-2) var(--forge-space-4)',
            backgroundColor: 'var(--forge-surface-2)',
            borderBottom: '1px solid var(--forge-border)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--forge-space-3)',
          }}
        >
          <Text weight="semibold">Tile Editor</Text>
          <Separator orientation="vertical" style={{ height: 20 }} />
          <Badge variant="outline">grass_water_ms3</Badge>
        </div>

        <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
          {/* Left: Tool panel */}
          <div
            style={{
              width: 200,
              padding: 'var(--forge-space-3)',
              borderRight: '1px solid var(--forge-border)',
              backgroundColor: 'var(--forge-surface)',
            }}
          >
            <Stack gap="md">
              <SectionLabel>Tools</SectionLabel>
              <Stack gap="xs">
                <button
                  onClick={() => setTool('paint')}
                  style={{
                    padding: '6px 12px',
                    textAlign: 'left',
                    backgroundColor:
                      tool === 'paint' ? 'var(--forge-color-primary)' : 'transparent',
                    color: 'var(--forge-color-text)',
                    border: '1px solid var(--forge-border)',
                    borderRadius: 'var(--forge-radius-sm)',
                    cursor: 'pointer',
                  }}
                >
                  🖌️ Paint Mask
                </button>
                <button
                  onClick={() => setTool('erase')}
                  style={{
                    padding: '6px 12px',
                    textAlign: 'left',
                    backgroundColor:
                      tool === 'erase' ? 'var(--forge-color-primary)' : 'transparent',
                    color: 'var(--forge-color-text)',
                    border: '1px solid var(--forge-border)',
                    borderRadius: 'var(--forge-radius-sm)',
                    cursor: 'pointer',
                  }}
                >
                  ⌫ Erase
                </button>
              </Stack>

              <Separator />
              <SectionLabel>Brush Size</SectionLabel>
              <Group gap="sm" align="center">
                <Slider
                  value={[brushSize]}
                  onValueChange={(v) => setBrushSize(v[0] as number)}
                  min={1}
                  max={16}
                  step={1}
                  style={{ flex: 1 }}
                />
                <Text size="sm">{brushSize}px</Text>
              </Group>

              <Separator />
              <SectionLabel>Quality</SectionLabel>
              <VerdictWidget value={verdict} onChange={setVerdict} size="sm" />
            </Stack>
          </div>

          {/* Center: Canvas */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--forge-space-6)',
              padding: 'var(--forge-space-4)',
              backgroundColor: 'var(--forge-surface)',
            }}
          >
            <Stack gap="sm" align="center">
              <SectionLabel>Source</SectionLabel>
              <TilePreview source={tile} size={200} label="Original" />
            </Stack>

            <Stack gap="sm" align="center">
              <SectionLabel>Paint Mask</SectionLabel>
              <InpaintMaskPainter source={tile} size={200} tool={tool} brushSize={brushSize} />
            </Stack>

            <Stack gap="sm" align="center">
              <SectionLabel>Heat Map</SectionLabel>
              <HeatMapOverlay
                scalarData={Array.from({ length: 64 }, () =>
                  Array.from({ length: 64 }, () => Math.random()),
                )}
                width={200}
                height={200}
                colorMap="viridis"
              />
            </Stack>
          </div>
        </div>
      </div>
    )
  },
}

// ---------------------------------------------------------------------------
// Story 3: Import Workflow
// ---------------------------------------------------------------------------

/**
 * ### Import Workflow
 *
 * Importing an existing tileset using SpritesheetSlicer, then previewing
 * sliced tiles in a TilingGrid.
 *
 * - **SpritesheetSlicer** for loading and slicing spritesheets
 * - **TilingGrid** for previewing the sliced result
 * - **TilePreview** for inspecting individual tiles
 */
export const ImportWorkflow: Story = {
  render: function ImportWorkflowStory() {
    const sheet = useRef(makeSheet(4, 4, 32)).current
    const [template, setTemplate] = useState('wang4')
    const [slicedCount, setSlicedCount] = useState(0)

    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            padding: 'var(--forge-space-2) var(--forge-space-4)',
            backgroundColor: 'var(--forge-surface-2)',
            borderBottom: '1px solid var(--forge-border)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--forge-space-3)',
          }}
        >
          <Text weight="semibold">Import Tileset</Text>
          <Separator orientation="vertical" style={{ height: 20 }} />
          <Badge variant="outline">spritesheet.png</Badge>
          {slicedCount > 0 && <Badge variant="subtle">{slicedCount} tiles sliced</Badge>}
        </div>

        <div style={{ flex: 1, minHeight: 0 }}>
          <ResizablePanelGroup direction="horizontal">
            {/* Left: Slicer */}
            <ResizablePanel defaultSize={55} minSize={30}>
              <Panel>
                <Stack gap="sm">
                  <SectionLabel>Spritesheet Slicer</SectionLabel>
                  <SpritesheetSlicer
                    source={sheet}
                    templates={SLICER_TEMPLATES}
                    selectedTemplate={template}
                    onTemplateChange={setTemplate}
                    onSlice={(tiles) => setSlicedCount(tiles.length)}
                    width={450}
                    height={350}
                  />
                </Stack>
              </Panel>
            </ResizablePanel>

            {/* Right: Preview grid */}
            <ResizablePanel defaultSize={45} minSize={25}>
              <Panel style={{ borderRight: 'none' }}>
                <Stack gap="sm">
                  <SectionLabel>Preview Grid</SectionLabel>
                  <TilingGrid
                    cols={4}
                    rows={4}
                    size={192}
                    getCellSource={(col, row) => {
                      // Grab from spritesheet
                      const c = document.createElement('canvas')
                      c.width = 32
                      c.height = 32
                      const ctx = c.getContext('2d')
                      if (ctx) {
                        ctx.drawImage(sheet, col * 32, row * 32, 32, 32, 0, 0, 32, 32)
                      }
                      return c
                    }}
                  />
                  <Separator />
                  <SectionLabel>Tile Inspector</SectionLabel>
                  <Group gap="sm" wrap="wrap">
                    {Array.from({ length: 4 }, (_, i) => {
                      const c = document.createElement('canvas')
                      c.width = 32
                      c.height = 32
                      const ctx = c.getContext('2d')
                      if (ctx) ctx.drawImage(sheet, i * 32, 0, 32, 32, 0, 0, 32, 32)
                      return <TilePreview key={i} source={c} size={64} label={`tile_${i}`} />
                    })}
                  </Group>
                </Stack>
              </Panel>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    )
  },
}

// ---------------------------------------------------------------------------
// Story 4: Quality Dashboard
// ---------------------------------------------------------------------------

/**
 * ### Quality Dashboard
 *
 * Bird's-eye view of batch generation quality. Combines:
 *
 * - **GenerationQueue** tracking all jobs
 * - **HeatMapOverlay** showing per-tile quality heatmaps
 * - **VerdictWidget** for bulk approval
 * - **TilePreview** grid for quick visual scan
 *
 * Recommended for quality review after batch generation completes.
 */
export const QualityDashboard: Story = {
  render: function QualityDashboardStory() {
    const [verdicts, setVerdicts] = useState<Record<string, Verdict>>({})

    const jobs: GenerationJob[] = [
      { id: 'j1', label: 'grass_water (16 tiles)', status: 'completed', estimatedCost: 0.64 },
      { id: 'j2', label: 'grass_stone (16 tiles)', status: 'completed', estimatedCost: 0.64 },
      { id: 'j3', label: 'stone_sand (16 tiles)', status: 'completed', estimatedCost: 0.64 },
    ]

    const approvedCount = Object.values(verdicts).filter((v) => v === 'up').length
    const rejectedCount = Object.values(verdicts).filter((v) => v === 'down').length

    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            padding: 'var(--forge-space-2) var(--forge-space-4)',
            backgroundColor: 'var(--forge-surface-2)',
            borderBottom: '1px solid var(--forge-border)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--forge-space-3)',
          }}
        >
          <Text weight="semibold">Quality Dashboard</Text>
          <Separator orientation="vertical" style={{ height: 20 }} />
          <Badge variant="solid">{approvedCount} approved</Badge>
          {rejectedCount > 0 && <Badge variant="solid">{rejectedCount} rejected</Badge>}
          <div style={{ flex: 1 }} />
          <Text size="sm" style={{ color: 'var(--forge-color-text-muted)' }}>
            Total cost: ${jobs.reduce((s, j) => s + (j.estimatedCost ?? 0), 0).toFixed(2)}
          </Text>
        </div>

        <div style={{ flex: 1, minHeight: 0 }}>
          <ResizablePanelGroup direction="horizontal">
            {/* Left: Queue */}
            <ResizablePanel defaultSize={30} minSize={20}>
              <Panel>
                <Stack gap="md">
                  <SectionLabel>Batch Jobs</SectionLabel>
                  <GenerationQueue
                    jobs={jobs}
                    variant="expanded"
                    budgetCeiling={2.0}
                    costFormat={(c) => `$${c.toFixed(2)}`}
                  />
                </Stack>
              </Panel>
            </ResizablePanel>

            {/* Center: Quality overview */}
            <ResizablePanel defaultSize={45} minSize={30}>
              <Panel style={{ borderRight: '1px solid var(--forge-border)' }}>
                <Stack gap="md">
                  <SectionLabel>Quality Heat Maps</SectionLabel>
                  <Group gap="md" wrap="wrap">
                    {['grass_water', 'grass_stone', 'stone_sand'].map((pair) => (
                      <Stack key={pair} gap="xs" align="center">
                        <Text size="xs" weight="semibold">
                          {pair}
                        </Text>
                        <HeatMapOverlay
                          scalarData={Array.from({ length: 16 }, () =>
                            Array.from({ length: 16 }, () => 0.5 + Math.random() * 0.5),
                          )}
                          width={140}
                          height={140}
                          colorMap="viridis"
                        />
                        <VerdictWidget
                          value={verdicts[pair] ?? null}
                          onChange={(v) => setVerdicts((prev) => ({ ...prev, [pair]: v }))}
                          size="sm"
                        />
                      </Stack>
                    ))}
                  </Group>
                </Stack>
              </Panel>
            </ResizablePanel>

            {/* Right: Tile gallery */}
            <ResizablePanel defaultSize={25} minSize={15}>
              <Panel style={{ borderRight: 'none' }}>
                <Stack gap="sm">
                  <SectionLabel>Tile Gallery</SectionLabel>
                  <ScrollArea style={{ height: 500 }}>
                    <Group gap="xs" wrap="wrap">
                      {Array.from({ length: 24 }, (_, i) => (
                        <TilePreview
                          key={i}
                          source={makeTileCanvas(90 + i * 10, 32)}
                          size={48}
                          label={`t${i + 1}`}
                        />
                      ))}
                    </Group>
                  </ScrollArea>
                </Stack>
              </Panel>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    )
  },
}

// ---------------------------------------------------------------------------
// Story 5: Component Showcase
// ---------------------------------------------------------------------------

/**
 * ### All Components Showcase
 *
 * A single page showing all 9 new domain components side-by-side. Useful for
 * design review and as a quick visual reference.
 */
export const ComponentShowcase: Story = {
  render: function ComponentShowcaseStory() {
    const tile = useRef(makeTileCanvas(120, 64)).current
    const sheet = useRef(makeSheet(4, 4, 32)).current

    return (
      <div
        style={{
          padding: 'var(--forge-space-6)',
          backgroundColor: 'var(--forge-surface)',
          minHeight: '100vh',
        }}
      >
        <Stack gap="lg">
          <div>
            <Text size="xl" weight="bold">
              Terrain Studio — Component Showcase
            </Text>
            <Text size="sm" style={{ color: 'var(--forge-color-text-muted)', marginTop: 4 }}>
              All 9 new domain components for the Terrain Creation Studio
            </Text>
          </div>

          <Separator />

          {/* Row 1: TilePreview + TilingGrid + VerdictWidget */}
          <Group gap="lg" align="start" wrap="wrap">
            <Card style={{ padding: 'var(--forge-space-4)' }}>
              <Stack gap="sm">
                <Text weight="semibold">TilePreview</Text>
                <Text size="xs" style={{ color: 'var(--forge-color-text-muted)' }}>
                  Canvas-based tile renderer with nearest-neighbor scaling
                </Text>
                <Group gap="sm">
                  <TilePreview source={tile} size={64} label="grass" />
                  <TilePreview source={tile} size={64} border="selected" label="selected" />
                  <TilePreview source={null} size={64} label="empty" />
                </Group>
              </Stack>
            </Card>

            <Card style={{ padding: 'var(--forge-space-4)' }}>
              <Stack gap="sm">
                <Text weight="semibold">TilingGrid</Text>
                <Text size="xs" style={{ color: 'var(--forge-color-text-muted)' }}>
                  NxN grid with per-cell tile source
                </Text>
                <TilingGrid cols={3} rows={3} size={144} getCellSource={() => tile} />
              </Stack>
            </Card>

            <Card style={{ padding: 'var(--forge-space-4)' }}>
              <Stack gap="sm">
                <Text weight="semibold">VerdictWidget</Text>
                <Text size="xs" style={{ color: 'var(--forge-color-text-muted)' }}>
                  Thumbs up/down quality verdict
                </Text>
                <VerdictWidget value={null} onChange={() => {}} size="md" />
              </Stack>
            </Card>
          </Group>

          <Separator />

          {/* Row 2: PipelineStepViewer */}
          <Card style={{ padding: 'var(--forge-space-4)' }}>
            <Stack gap="sm">
              <Text weight="semibold">PipelineStepViewer</Text>
              <Text size="xs" style={{ color: 'var(--forge-color-text-muted)' }}>
                All-steps layout showing the 5-stage generation pipeline
              </Text>
              <PipelineStepViewer steps={MOCK_PIPELINE_STEPS} layout="all" />
            </Stack>
          </Card>

          <Separator />

          {/* Row 3: HeatMapOverlay + InpaintMaskPainter */}
          <Group gap="lg" align="start" wrap="wrap">
            <Card style={{ padding: 'var(--forge-space-4)' }}>
              <Stack gap="sm">
                <Text weight="semibold">HeatMapOverlay</Text>
                <Text size="xs" style={{ color: 'var(--forge-color-text-muted)' }}>
                  Quality heatmap with viridis color scale
                </Text>
                <HeatMapOverlay
                  scalarData={Array.from({ length: 32 }, () =>
                    Array.from({ length: 32 }, () => Math.random()),
                  )}
                  width={180}
                  height={180}
                  colorMap="viridis"
                />
              </Stack>
            </Card>

            <Card style={{ padding: 'var(--forge-space-4)' }}>
              <Stack gap="sm">
                <Text weight="semibold">InpaintMaskPainter</Text>
                <Text size="xs" style={{ color: 'var(--forge-color-text-muted)' }}>
                  Brush-based binary mask painting
                </Text>
                <InpaintMaskPainter source={tile} size={180} brushSize={4} />
              </Stack>
            </Card>
          </Group>

          <Separator />

          {/* Row 4: GenerationQueue */}
          <Card style={{ padding: 'var(--forge-space-4)' }}>
            <Stack gap="sm">
              <Text weight="semibold">GenerationQueue</Text>
              <Text size="xs" style={{ color: 'var(--forge-color-text-muted)' }}>
                Batch job tracker with cost tracking
              </Text>
              <GenerationQueue
                jobs={MOCK_JOBS}
                variant="expanded"
                budgetCeiling={1.0}
                costFormat={(c) => `$${c.toFixed(2)}`}
              />
            </Stack>
          </Card>

          <Separator />

          {/* Row 5: SpritesheetSlicer */}
          <Card style={{ padding: 'var(--forge-space-4)' }}>
            <Stack gap="sm">
              <Text weight="semibold">SpritesheetSlicer</Text>
              <Text size="xs" style={{ color: 'var(--forge-color-text-muted)' }}>
                Grid-based tileset import with template overlay
              </Text>
              <SpritesheetSlicer
                source={sheet}
                templates={SLICER_TEMPLATES}
                selectedTemplate="wang4"
                width={400}
                height={250}
              />
            </Stack>
          </Card>
        </Stack>
      </div>
    )
  },
}
