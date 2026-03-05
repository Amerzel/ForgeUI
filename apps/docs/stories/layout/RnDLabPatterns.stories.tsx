import type { Meta, StoryObj } from '@storybook/react'
import { useState, useCallback, useRef, useMemo } from 'react'
import {
  // Layout
  ResizablePanel,
  ResizablePanelGroup,
  Stack,
  Group,
  Center,
  SimpleGrid,
  // Navigation / Structure
  Tabs,
  ScrollArea,
  ModuleToolbar,
  // Feedback
  Badge,
  Text,
  Card,
  Separator,
  Progress,
  StatCard,
  // Forms
  ToggleGroup,
  // Complex
  DataTable,
  TreeView,
  PropertyGrid,
  JsonViewer,
  // Domain — new components
  TilePreview,
  TilingGrid,
  PipelineStepViewer,
  HeatMapOverlay,
  VerdictWidget,
  GenerationQueue,
  // Primitives
  TooltipProvider,
} from '@forgeui/components'
import type {
  PipelineStep,
  GenerationJob,
  Verdict,
  ColumnDef,
  PropertySection,
  TreeNode,
} from '@forgeui/components'

/**
 * R&D Lab — Phase 0 Layouts
 *
 * These layouts represent what the Terrain Creation Studio looks like during
 * Phase 0 R&D. The focus is on **experimentation, iteration, and learning** —
 * running AI generation spikes, comparing approaches, tracking costs, and
 * building confidence in the pipeline before committing to production.
 *
 * ## Component Usage Matrix
 *
 * Each story combines **new domain components** (★) with **existing ForgeUI
 * components** to show realistic page compositions:
 *
 * | Component              | Dashboard | SingleTile | BoundaryPair | PackReview | Comparison |
 * |------------------------|:---------:|:----------:|:------------:|:----------:|:----------:|
 * | ★ TilePreview          |           |     ✓      |      ✓       |     ✓      |     ✓      |
 * | ★ TilingGrid           |           |     ✓      |      ✓       |     ✓      |            |
 * | ★ PipelineStepViewer   |           |     ✓      |      ✓       |            |            |
 * | ★ HeatMapOverlay       |           |     ✓      |      ✓       |     ✓      |     ✓      |
 * | ★ VerdictWidget        |           |     ✓      |      ✓       |     ✓      |     ✓      |
 * | ★ GenerationQueue      |     ✓     |     ✓      |              |     ✓      |            |
 * | DataTable              |     ✓     |            |              |            |     ✓      |
 * | StatCard               |     ✓     |     ✓      |      ✓       |     ✓      |     ✓      |
 * | PropertyGrid           |           |     ✓      |              |            |            |
 * | TreeView               |           |            |              |     ✓      |            |
 * | ComparisonSlider       |           |            |              |            |     ✓      |
 * | JsonViewer             |           |            |              |     ✓      |            |
 * | Tabs                   |     ✓     |     ✓      |      ✓       |     ✓      |     ✓      |
 * | Badge                  |     ✓     |     ✓      |      ✓       |     ✓      |     ✓      |
 * | ResizablePanelGroup    |           |     ✓      |      ✓       |     ✓      |     ✓      |
 * | ToggleGroup            |           |     ✓      |              |            |     ✓      |
 * | Progress               |     ✓     |            |              |     ✓      |            |
 * | Select / Slider        |           |     ✓      |      ✓       |            |            |
 * | ModuleToolbar          |     ✓     |     ✓      |      ✓       |     ✓      |     ✓      |
 * | ScrollArea             |     ✓     |            |      ✓       |     ✓      |            |
 */
const meta: Meta = {
  title: 'Patterns/R&D Lab Patterns',
  parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj

// ---------------------------------------------------------------------------
// Shared helpers
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

function makeTileCanvas(hue: number, size = 64): HTMLCanvasElement {
  const c = document.createElement('canvas')
  c.width = size
  c.height = size
  const ctx = c.getContext('2d')
  if (ctx) {
    // Base fill
    ctx.fillStyle = `hsl(${hue}, 40%, 30%)`
    ctx.fillRect(0, 0, size, size)
    // Inner detail
    ctx.fillStyle = `hsl(${hue}, 50%, 40%)`
    ctx.fillRect(4, 4, size - 8, size - 8)
    // Texture noise
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * size
      const y = Math.random() * size
      ctx.fillStyle = `hsl(${hue + (Math.random() - 0.5) * 20}, 35%, ${35 + Math.random() * 15}%)`
      ctx.fillRect(x, y, 2, 2)
    }
  }
  return c
}

// ---------------------------------------------------------------------------
// Story 1: R&D Dashboard
// ---------------------------------------------------------------------------

const SPIKE_DATA = [
  {
    id: 'S1',
    name: 'Single-tile generation',
    status: 'active',
    runs: 47,
    bestScore: 0.92,
    totalCost: 3.76,
    model: 'flux-1.1-pro',
  },
  {
    id: 'S2',
    name: 'Boundary-pair generation',
    status: 'active',
    runs: 12,
    bestScore: 0.84,
    totalCost: 8.64,
    model: 'flux-1.1-pro',
  },
  {
    id: 'S3',
    name: 'End-to-end pack generation',
    status: 'planned',
    runs: 0,
    bestScore: 0,
    totalCost: 0,
    model: 'TBD',
  },
  {
    id: 'S4',
    name: 'Re-skin in browser',
    status: 'planned',
    runs: 0,
    bestScore: 0,
    totalCost: 0,
    model: 'TBD',
  },
]

const RECENT_JOBS: GenerationJob[] = [
  {
    id: 'r1',
    label: 'S1-47: grass fill (flux, 4-step)',
    status: 'completed',
    estimatedCost: 8,
  },
  {
    id: 'r2',
    label: 'S1-46: grass fill (flux, seed:42)',
    status: 'completed',
    estimatedCost: 8,
  },
  {
    id: 'r3',
    label: 'S2-12: grass→water MS-14',
    status: 'running',
    estimatedCost: 112,
    progress: 64,
  },
  {
    id: 'r4',
    label: 'S1-48: stone fill (flux, 4-step)',
    status: 'queued',
    estimatedCost: 8,
  },
]

/**
 * ### R&D Dashboard
 *
 * The home screen for Phase 0. At a glance, shows:
 * - **Spike progress** — which experiments are active vs planned
 * - **Budget tracking** — total spend, cost per spike, remaining budget
 * - **Recent generations** — live queue of AI jobs
 * - **Quick stats** — best quality scores, total runs, model usage
 *
 * Uses: ModuleToolbar, StatCard, DataTable, Badge, Tabs, GenerationQueue,
 * Progress, ScrollArea
 */
export const RnDDashboard: Story = {
  name: '★ R&D Dashboard',
  parameters: {
    docs: {
      description: {
        story:
          'Phase 0 home screen. Track spike progress, budget spend, recent generations, and overall experiment health. The recommended starting point for any R&D session.',
      },
    },
  },
  render: function RnDDashboardStory() {
    const budgetUsed = SPIKE_DATA.reduce((s, d) => s + d.totalCost, 0)
    const budgetTotal = 50.0
    const totalRuns = SPIKE_DATA.reduce((s, d) => s + d.runs, 0)

    const spikeColumns: ColumnDef<(typeof SPIKE_DATA)[0]>[] = useMemo(
      () => [
        {
          id: 'id',
          header: 'Spike',
          accessorKey: 'id',
          cell: ({ row }) => (
            <Text weight="semibold" size="sm">
              {row.original.id}
            </Text>
          ),
          size: 60,
        },
        {
          id: 'name',
          header: 'Experiment',
          accessorKey: 'name',
          size: 220,
        },
        {
          id: 'status',
          header: 'Status',
          accessorKey: 'status',
          cell: ({ row }) => (
            <Badge
              variant={row.original.status === 'active' ? 'solid' : 'outline'}
              {...(row.original.status === 'active' ? { color: 'success' as const } : {})}
            >
              {row.original.status}
            </Badge>
          ),
          size: 90,
        },
        {
          id: 'runs',
          header: 'Runs',
          accessorKey: 'runs',
          size: 60,
        },
        {
          id: 'bestScore',
          header: 'Best Score',
          accessorKey: 'bestScore',
          cell: ({ row }) =>
            row.original.bestScore > 0 ? (
              <Badge
                variant="outline"
                color={row.original.bestScore >= 0.9 ? 'success' : 'warning'}
              >
                {row.original.bestScore.toFixed(2)}
              </Badge>
            ) : (
              <Text size="sm" style={{ color: 'var(--forge-color-text-muted)' }}>
                —
              </Text>
            ),
          size: 90,
        },
        {
          id: 'totalCost',
          header: 'Cost',
          accessorKey: 'totalCost',
          cell: ({ row }) => <Text size="sm">${row.original.totalCost.toFixed(2)}</Text>,
          size: 70,
        },
        {
          id: 'model',
          header: 'Model',
          accessorKey: 'model',
          size: 120,
        },
      ],
      [],
    )

    return (
      <TooltipProvider>
        <div
          style={{
            height: 720,
            display: 'flex',
            flexDirection: 'column',
            fontFamily: 'var(--forge-font-sans)',
          }}
        >
          <ModuleToolbar
            badge="R&D"
            title="Terrain Studio — R&D Lab"
            actions={
              <Group gap={2}>
                <Badge variant="outline">Phase 0</Badge>
                <Badge variant="outline">{totalRuns} runs</Badge>
                <Badge
                  variant="outline"
                  {...(budgetUsed / budgetTotal > 0.8 ? { color: 'danger' as const } : {})}
                >
                  ${budgetUsed.toFixed(2)} / ${budgetTotal.toFixed(2)}
                </Badge>
              </Group>
            }
          />

          <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
            {/* Main content */}
            <div style={{ flex: 1, padding: 'var(--forge-space-4)', overflow: 'auto' }}>
              {/* Stats row */}
              <SimpleGrid cols={4} spacing="md" style={{ marginBottom: 'var(--forge-space-4)' }}>
                <StatCard label="Total Experiments" value={String(totalRuns)} />
                <StatCard label="Best Quality Score" value="0.92" delta="+0.04 vs last batch" />
                <StatCard
                  label="Budget Remaining"
                  value={`$${(budgetTotal - budgetUsed).toFixed(2)}`}
                  delta={`${Math.round((budgetUsed / budgetTotal) * 100)}% used`}
                />
                <StatCard label="Active Spikes" value="2 / 4" />
              </SimpleGrid>

              {/* Budget progress */}
              <Card
                style={{ padding: 'var(--forge-space-3)', marginBottom: 'var(--forge-space-4)' }}
              >
                <Group gap="sm" align="center" style={{ marginBottom: 'var(--forge-space-2)' }}>
                  <Text size="sm" weight="semibold">
                    Budget
                  </Text>
                  <Text size="xs" style={{ color: 'var(--forge-color-text-muted)' }}>
                    ${budgetUsed.toFixed(2)} of ${budgetTotal.toFixed(2)}
                  </Text>
                </Group>
                <Progress value={Math.round((budgetUsed / budgetTotal) * 100)} />
              </Card>

              {/* Spike registry */}
              <Card style={{ padding: 'var(--forge-space-3)' }}>
                <SectionLabel>Spike Registry</SectionLabel>
                <div style={{ marginTop: 'var(--forge-space-2)' }}>
                  <DataTable columns={spikeColumns} data={SPIKE_DATA} />
                </div>
              </Card>
            </div>

            {/* Right sidebar: Generation queue */}
            <div
              style={{
                width: 300,
                borderLeft: '1px solid var(--forge-border)',
                padding: 'var(--forge-space-3)',
                overflow: 'auto',
              }}
            >
              <SectionLabel>Recent Generations</SectionLabel>
              <div style={{ marginTop: 'var(--forge-space-2)' }}>
                <GenerationQueue
                  jobs={RECENT_JOBS}
                  variant="expanded"
                  costFormat={(c) => `$${(c / 100).toFixed(2)}`}
                />
              </div>
            </div>
          </div>
        </div>
      </TooltipProvider>
    )
  },
}

// ---------------------------------------------------------------------------
// Story 2: Single-Tile Experiment (Spike S1)
// ---------------------------------------------------------------------------

const S1_PIPELINE: PipelineStep[] = [
  {
    id: 'prompt',
    label: 'Prompt',
    status: 'complete',
    durationMs: 120,
    meta: { Model: 'flux-1.1-pro' },
    result: (
      <div
        style={{
          width: 128,
          height: 128,
          backgroundColor: '#2d5a3d',
          borderRadius: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text size="xs" style={{ color: '#7bc88f' }}>
          512×512 raw
        </Text>
      </div>
    ),
  },
  {
    id: 'upscale',
    label: 'Upscale',
    status: 'complete',
    durationMs: 2400,
    meta: { Scale: '4×', Method: 'ESRGAN' },
    result: (
      <div
        style={{
          width: 128,
          height: 128,
          backgroundColor: '#3a5a4d',
          borderRadius: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text size="xs" style={{ color: '#8bc88f' }}>
          2048×2048
        </Text>
      </div>
    ),
  },
  {
    id: 'color',
    label: 'Color Match',
    status: 'complete',
    durationMs: 340,
    result: (
      <div
        style={{
          width: 128,
          height: 128,
          backgroundColor: '#4a6a3d',
          borderRadius: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text size="xs" style={{ color: '#aad88f' }}>
          Palette matched
        </Text>
      </div>
    ),
  },
  {
    id: 'wrap',
    label: 'Tile Wrap',
    status: 'complete',
    durationMs: 180,
    result: (
      <div
        style={{
          width: 128,
          height: 128,
          backgroundColor: '#3d6a4a',
          borderRadius: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text size="xs" style={{ color: '#8fd8aa' }}>
          Seamless
        </Text>
      </div>
    ),
  },
  {
    id: 'score',
    label: 'Score',
    status: 'complete',
    durationMs: 50,
    meta: { RMSE: '0.023', IoU: '0.94' },
    result: (
      <div
        style={{
          width: 128,
          height: 128,
          backgroundColor: '#2d4a3d',
          borderRadius: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text size="xs" style={{ color: '#7bc88f' }}>
          Score: 0.92
        </Text>
      </div>
    ),
  },
]

const S1_PARAMS: PropertySection[] = [
  {
    label: 'Generation',
    items: [
      { key: 'model', label: 'Model', type: 'text' },
      { key: 'prompt', label: 'Prompt', type: 'text' },
      { key: 'negative', label: 'Negative', type: 'text' },
      { key: 'seed', label: 'Seed', type: 'text' },
      { key: 'steps', label: 'Steps', type: 'text' },
      { key: 'guidance', label: 'Guidance', type: 'text' },
    ],
  },
  {
    label: 'Post-processing',
    items: [
      { key: 'upscale', label: 'Upscale', type: 'text' },
      { key: 'colorMatch', label: 'Color match', type: 'text' },
      { key: 'tileWrap', label: 'Tile wrap', type: 'text' },
    ],
  },
  {
    label: 'Scoring',
    items: [
      { key: 'seamRmse', label: 'Seam RMSE', type: 'text' },
      { key: 'iou', label: 'IoU', type: 'text' },
      { key: 'paletteDrift', label: 'Palette drift', type: 'text' },
    ],
  },
]

const S1_VALUES: Record<string, unknown> = {
  model: 'flux-1.1-pro',
  prompt: 'seamless grass texture, top-down, pixel art, 64px',
  negative: 'blurry, watermark, text',
  seed: '42',
  steps: '4',
  guidance: '3.5',
  upscale: '4× ESRGAN',
  colorMatch: 'Histogram (target palette)',
  tileWrap: 'Cross-blend 16px',
  seamRmse: '0.023',
  iou: '0.94',
  paletteDrift: '2.1%',
}

/**
 * ### Single-Tile Experiment (Spike S1)
 *
 * The core R&D workflow: configure generation parameters, run the 5-step
 * pipeline, review the output tile's quality.
 *
 * **Left panel**: Generation parameters (PropertyGrid) with model, prompt,
 * seed, and post-processing controls. Queue of recent generations.
 *
 * **Center panel**: Pipeline view (PipelineStepViewer) showing all 5 stages.
 * Below that, the output tile in a TilingGrid for seamlessness preview, plus
 * a HeatMapOverlay showing seam quality.
 *
 * **Right panel**: Quality metrics (StatCard), verdict (VerdictWidget), and
 * tile at multiple zoom levels (TilePreview).
 *
 * Uses: PipelineStepViewer, TilePreview, TilingGrid, HeatMapOverlay,
 * VerdictWidget, GenerationQueue, PropertyGrid, StatCard, Tabs, ToggleGroup,
 * ResizablePanelGroup, Badge, Slider, Select
 */
export const SingleTileExperiment: Story = {
  name: 'Spike S1 — Single Tile',
  parameters: {
    docs: {
      description: {
        story:
          'Spike S1: Generate a single seamless tile. Configure AI parameters, run the 5-step pipeline, review quality with tiling grid and seam heatmap, then accept or reject.',
      },
    },
  },
  render: function SingleTileStory() {
    const tile = useRef(makeTileCanvas(120, 64)).current
    const [verdict, setVerdict] = useState<Verdict | null>(null)
    const [resolution, setResolution] = useState('64')

    const singleJob: GenerationJob[] = [
      { id: 'j1', label: 'S1-47: grass fill', status: 'completed', estimatedCost: 8 },
    ]

    return (
      <TooltipProvider>
        <div
          style={{
            height: 720,
            display: 'flex',
            flexDirection: 'column',
            fontFamily: 'var(--forge-font-sans)',
          }}
        >
          <ModuleToolbar
            badge="S1"
            title="Single-Tile Generation"
            actions={
              <Group gap={2}>
                <Badge variant="outline">Run #47</Badge>
                <Badge variant="outline" color="success">
                  flux-1.1-pro
                </Badge>
                <ToggleGroup
                  type="single"
                  value={resolution}
                  onValueChange={(v) => v && setResolution(v)}
                  items={[
                    { value: '32', label: '32' },
                    { value: '64', label: '64' },
                    { value: '128', label: '128' },
                  ]}
                />
              </Group>
            }
          />

          <div style={{ flex: 1, minHeight: 0 }}>
            <ResizablePanelGroup direction="horizontal">
              {/* Left: Parameters + Queue */}
              <ResizablePanel defaultSize={25} minSize={18}>
                <Panel>
                  <Stack gap="md">
                    <SectionLabel>Parameters</SectionLabel>
                    <PropertyGrid sections={S1_PARAMS} values={S1_VALUES} onChange={() => {}} />
                    <Separator />
                    <SectionLabel>Generation</SectionLabel>
                    <GenerationQueue
                      jobs={singleJob}
                      variant="expanded"
                      costFormat={(c) => `$${(c / 100).toFixed(2)}`}
                    />
                  </Stack>
                </Panel>
              </ResizablePanel>

              {/* Center: Pipeline + Tiling preview */}
              <ResizablePanel defaultSize={50} minSize={30}>
                <Panel style={{ borderRight: '1px solid var(--forge-border)' }}>
                  <Stack gap="md">
                    <SectionLabel>Pipeline</SectionLabel>
                    <PipelineStepViewer steps={S1_PIPELINE} layout="all" />

                    <Separator />

                    <SectionLabel>Seamlessness Preview</SectionLabel>
                    <Group gap="lg" align="start">
                      <Stack gap="xs" align="center">
                        <TilingGrid source={tile} cols={3} rows={3} size={180} showBoundaries />
                        <Text size="xs" style={{ color: 'var(--forge-color-text-muted)' }}>
                          3×3 tiling
                        </Text>
                      </Stack>

                      <Stack gap="xs" align="center">
                        <HeatMapOverlay
                          scalarData={Array.from({ length: 64 }, (_, y) =>
                            Array.from({ length: 64 }, (_, x) => {
                              // Simulate seam heat at edges
                              const edgeDist = Math.min(x, y, 63 - x, 63 - y)
                              return edgeDist < 4 ? 0.3 + Math.random() * 0.5 : Math.random() * 0.1
                            }),
                          )}
                          width={180}
                          height={180}
                          colorMap="hot"
                        />
                        <Text size="xs" style={{ color: 'var(--forge-color-text-muted)' }}>
                          Seam heat map
                        </Text>
                      </Stack>
                    </Group>
                  </Stack>
                </Panel>
              </ResizablePanel>

              {/* Right: Quality review */}
              <ResizablePanel defaultSize={25} minSize={15}>
                <Panel style={{ borderRight: 'none' }}>
                  <Stack gap="md">
                    <SectionLabel>Output</SectionLabel>
                    <Center>
                      <TilePreview source={tile} size={120} label="grass_fill" border="selected" />
                    </Center>

                    <SimpleGrid cols={2} spacing="sm">
                      <StatCard label="RMSE" value="0.023" />
                      <StatCard label="IoU" value="0.94" delta="+0.02" />
                      <StatCard label="Palette Drift" value="2.1%" />
                      <StatCard label="Cost" value="$0.08" />
                    </SimpleGrid>

                    <Separator />
                    <SectionLabel>Verdict</SectionLabel>
                    <Center>
                      <VerdictWidget value={verdict} onChange={setVerdict} size="md" />
                    </Center>

                    <Separator />
                    <SectionLabel>Zoom Levels</SectionLabel>
                    <Group gap="xs" wrap="wrap" justify="center">
                      <TilePreview source={tile} size={32} />
                      <TilePreview source={tile} size={48} />
                      <TilePreview source={tile} size={64} />
                      <TilePreview source={tile} size={96} />
                    </Group>
                  </Stack>
                </Panel>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </div>
      </TooltipProvider>
    )
  },
}

// ---------------------------------------------------------------------------
// Story 3: Boundary-Pair Experiment (Spike S2)
// ---------------------------------------------------------------------------

/**
 * ### Boundary-Pair Experiment (Spike S2)
 *
 * Generate all 14 MS transition cases between two terrain fills. Shows:
 *
 * - **Top**: The two fill materials being connected (TilePreview × 2)
 * - **Center**: 4×4 grid of all transition cases (TilingGrid + getCellSource)
 *   with seam heat maps per tile and per-case quality badges
 * - **Bottom**: Aggregate quality metrics and batch verdict
 *
 * This is the hardest R&D problem — transitions must be visually coherent
 * across all 14 cases while maintaining seamless tiling.
 *
 * Uses: TilePreview, TilingGrid, PipelineStepViewer, HeatMapOverlay,
 * VerdictWidget, StatCard, Badge, Tabs, ScrollArea, ResizablePanelGroup
 */
export const BoundaryPairExperiment: Story = {
  name: 'Spike S2 — Boundary Pair',
  parameters: {
    docs: {
      description: {
        story:
          'Spike S2: Generate all 14 MS transition tiles for a terrain pair. Review each case individually and approve/reject the batch.',
      },
    },
  },
  render: function BoundaryPairStory() {
    const fillA = useRef(makeTileCanvas(120, 64)).current // grass
    const fillB = useRef(makeTileCanvas(210, 64)).current // water
    const transitions = useRef(
      Array.from({ length: 14 }, (_, i) => makeTileCanvas(120 + i * 6, 64)),
    ).current
    const [selectedCase, setSelectedCase] = useState(0)
    const [verdicts, setVerdicts] = useState<Record<number, Verdict>>({})

    const approvedCount = Object.values(verdicts).filter((v) => v === 'up').length

    const getCellSource = useCallback(
      (col: number, row: number) => {
        const idx = row * 4 + col
        if (idx >= 14) return fillA
        return transitions[idx] ?? fillA
      },
      [transitions, fillA],
    )

    const pipelineForCase: PipelineStep[] = [
      { id: 'gen', label: 'Generate', status: 'complete', durationMs: 140 },
      { id: 'upscale', label: 'Upscale', status: 'complete', durationMs: 2200 },
      { id: 'color', label: 'Color', status: 'complete', durationMs: 280 },
      { id: 'wrap', label: 'Wrap', status: 'complete', durationMs: 160 },
      {
        id: 'score',
        label: 'Score',
        status: 'complete',
        durationMs: 40,
        meta: { RMSE: '0.031' },
      },
    ]

    return (
      <TooltipProvider>
        <div
          style={{
            height: 720,
            display: 'flex',
            flexDirection: 'column',
            fontFamily: 'var(--forge-font-sans)',
          }}
        >
          <ModuleToolbar
            badge="S2"
            title="Boundary Pair — grass → water"
            actions={
              <Group gap={2}>
                <Badge variant="outline">14 cases</Badge>
                <Badge variant="outline" color="success">
                  {approvedCount}/14 approved
                </Badge>
                <Badge variant="outline">Run #12</Badge>
              </Group>
            }
          />

          <div style={{ flex: 1, minHeight: 0 }}>
            <ResizablePanelGroup direction="horizontal">
              {/* Left: Fill materials + case list */}
              <ResizablePanel defaultSize={25} minSize={18}>
                <Panel>
                  <Stack gap="md">
                    <SectionLabel>Fill Materials</SectionLabel>
                    <Group gap="md">
                      <Stack gap="xs" align="center">
                        <TilePreview source={fillA} size={72} label="grass" border="selected" />
                        <Badge variant="outline">Fill A</Badge>
                      </Stack>
                      <Stack gap="xs" align="center">
                        <TilePreview source={fillB} size={72} label="water" border="selected" />
                        <Badge variant="outline">Fill B</Badge>
                      </Stack>
                    </Group>

                    <Separator />
                    <SectionLabel>Transition Cases</SectionLabel>
                    <ScrollArea style={{ height: 340 }}>
                      <Stack gap="xs">
                        {Array.from({ length: 14 }, (_, i) => (
                          <button
                            key={i}
                            onClick={() => setSelectedCase(i)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 'var(--forge-space-2)',
                              padding: '6px 8px',
                              backgroundColor:
                                selectedCase === i ? 'var(--forge-color-primary)' : 'transparent',
                              color: 'var(--forge-color-text)',
                              border: '1px solid var(--forge-border)',
                              borderRadius: 'var(--forge-radius-sm)',
                              cursor: 'pointer',
                              width: '100%',
                              textAlign: 'left',
                            }}
                          >
                            <TilePreview source={transitions[i] ?? null} size={28} />
                            <Text size="sm">MS-{i + 1}</Text>
                            {verdicts[i] === 'up' && (
                              <Badge variant="solid" color="success">
                                ✓
                              </Badge>
                            )}
                            {verdicts[i] === 'down' && (
                              <Badge variant="solid" color="danger">
                                ✗
                              </Badge>
                            )}
                          </button>
                        ))}
                      </Stack>
                    </ScrollArea>
                  </Stack>
                </Panel>
              </ResizablePanel>

              {/* Center: Grid + pipeline for selected case */}
              <ResizablePanel defaultSize={50} minSize={30}>
                <Panel style={{ borderRight: '1px solid var(--forge-border)' }}>
                  <Tabs
                    defaultValue="grid"
                    items={[
                      {
                        value: 'grid',
                        label: 'Transition Grid',
                        content: (
                          <Stack gap="md" style={{ padding: 'var(--forge-space-2) 0' }}>
                            <TilingGrid
                              cols={4}
                              rows={4}
                              size={280}
                              getCellSource={getCellSource}
                              showBoundaries
                            />
                            <Group gap="sm" wrap="wrap">
                              {Array.from({ length: 14 }, (_, i) => (
                                <Stack key={i} gap="2px" align="center">
                                  <TilePreview
                                    source={transitions[i] ?? null}
                                    size={40}
                                    {...(selectedCase === i ? { border: 'selected' as const } : {})}
                                    onClick={() => setSelectedCase(i)}
                                  />
                                  <Text
                                    size="xs"
                                    style={{ color: 'var(--forge-color-text-muted)' }}
                                  >
                                    {i + 1}
                                  </Text>
                                </Stack>
                              ))}
                            </Group>
                          </Stack>
                        ),
                      },
                      {
                        value: 'pipeline',
                        label: `Pipeline (MS-${selectedCase + 1})`,
                        content: (
                          <div style={{ padding: 'var(--forge-space-2) 0' }}>
                            <PipelineStepViewer steps={pipelineForCase} layout="all" />
                          </div>
                        ),
                      },
                    ]}
                  />
                </Panel>
              </ResizablePanel>

              {/* Right: Quality for selected case */}
              <ResizablePanel defaultSize={25} minSize={15}>
                <Panel style={{ borderRight: 'none' }}>
                  <Stack gap="md">
                    <SectionLabel>{`MS-${selectedCase + 1} Quality`}</SectionLabel>
                    <Center>
                      <TilePreview
                        source={transitions[selectedCase] ?? null}
                        size={100}
                        label={`MS-${selectedCase + 1}`}
                        border="selected"
                      />
                    </Center>

                    <HeatMapOverlay
                      scalarData={Array.from({ length: 64 }, (_, y) =>
                        Array.from({ length: 64 }, (_, x) => {
                          const edgeDist = Math.min(x, y, 63 - x, 63 - y)
                          return edgeDist < 6 ? 0.2 + Math.random() * 0.6 : Math.random() * 0.15
                        }),
                      )}
                      width={160}
                      height={160}
                      colorMap="hot"
                    />

                    <SimpleGrid cols={2} spacing="sm">
                      <StatCard label="RMSE" value="0.031" />
                      <StatCard label="IoU" value="0.89" />
                    </SimpleGrid>

                    <Separator />
                    <SectionLabel>Verdict</SectionLabel>
                    <Center>
                      <VerdictWidget
                        value={verdicts[selectedCase] ?? null}
                        onChange={(v) => setVerdicts((prev) => ({ ...prev, [selectedCase]: v }))}
                        size="md"
                      />
                    </Center>
                  </Stack>
                </Panel>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </div>
      </TooltipProvider>
    )
  },
}

// ---------------------------------------------------------------------------
// Story 4: Pack Review (Spike S3 planning)
// ---------------------------------------------------------------------------

const PACK_TREE: TreeNode[] = [
  {
    id: 'fills',
    label: 'Fills (3)',
    children: [
      { id: 'fill-grass', label: '🟩 grass' },
      { id: 'fill-water', label: '🟦 water' },
      { id: 'fill-stone', label: '⬜ stone' },
    ],
  },
  {
    id: 'pairs',
    label: 'Pairs (3)',
    children: [
      {
        id: 'pair-gw',
        label: 'grass → water',
        children: Array.from({ length: 14 }, (_, i) => ({
          id: `gw-ms${i + 1}`,
          label: `MS-${i + 1}`,
        })),
      },
      {
        id: 'pair-gs',
        label: 'grass → stone',
        children: Array.from({ length: 14 }, (_, i) => ({
          id: `gs-ms${i + 1}`,
          label: `MS-${i + 1}`,
        })),
      },
      {
        id: 'pair-sw',
        label: 'stone → water',
        children: Array.from({ length: 14 }, (_, i) => ({
          id: `sw-ms${i + 1}`,
          label: `MS-${i + 1}`,
        })),
      },
    ],
  },
]

const PACK_MANIFEST = {
  version: 'terrain_pack.v1',
  tileSize: 64,
  materials: ['grass', 'water', 'stone'],
  pairs: ['grass_water', 'grass_stone', 'stone_water'],
  tileCount: { fills: 3, transitions: 42, total: 45 },
  quality: {
    avgRMSE: 0.028,
    avgIoU: 0.91,
    worstCase: 'stone_water_ms12',
    bestCase: 'grass_fill',
  },
  cost: { total: '$12.40', perTile: '$0.28' },
}

/**
 * ### Pack Review
 *
 * Full-pack review after batch generation. Browse the tile tree, inspect
 * individual tiles, review the manifest, and check aggregate quality.
 *
 * This is the layout for reviewing Spike S3 results — a complete terrain
 * pack with fills, transitions, and quality scores.
 *
 * Uses: TreeView, TilePreview, TilingGrid, HeatMapOverlay, VerdictWidget,
 * GenerationQueue, StatCard, JsonViewer, Tabs, Badge, ResizablePanelGroup
 */
export const PackReview: Story = {
  name: 'Pack Review',
  parameters: {
    docs: {
      description: {
        story:
          'Review a complete generated terrain pack. Browse the tile tree, inspect quality per tile, check the manifest, and approve or flag issues.',
      },
    },
  },
  render: function PackReviewStory() {
    const [selectedNode, setSelectedNode] = useState<string | undefined>('fill-grass')
    const [expandedNodes, setExpandedNodes] = useState(['fills', 'pairs', 'pair-gw'])
    const tile = useRef(makeTileCanvas(120, 64)).current
    const [verdict, setVerdict] = useState<Verdict | null>(null)

    const packJobs: GenerationJob[] = [
      { id: 'p1', label: 'Fills (3 tiles)', status: 'completed', estimatedCost: 24 },
      { id: 'p2', label: 'grass→water (14)', status: 'completed', estimatedCost: 112 },
      { id: 'p3', label: 'grass→stone (14)', status: 'completed', estimatedCost: 112 },
      { id: 'p4', label: 'stone→water (14)', status: 'completed', estimatedCost: 112 },
    ]

    const handleNodeSelect = useCallback((id: string) => {
      setSelectedNode(id)
    }, [])

    const handleNodeExpand = useCallback((id: string, open: boolean) => {
      setExpandedNodes((prev) => (open ? [...prev, id] : prev.filter((n) => n !== id)))
    }, [])

    return (
      <TooltipProvider>
        <div
          style={{
            height: 720,
            display: 'flex',
            flexDirection: 'column',
            fontFamily: 'var(--forge-font-sans)',
          }}
        >
          <ModuleToolbar
            badge="PKG"
            title="Pack Review — terrain_pack.v1"
            actions={
              <Group gap={2}>
                <Badge variant="outline">45 tiles</Badge>
                <Badge variant="outline" color="success">
                  avg IoU: 0.91
                </Badge>
                <Badge variant="outline">$12.40 total</Badge>
              </Group>
            }
          />

          <div style={{ flex: 1, minHeight: 0 }}>
            <ResizablePanelGroup direction="horizontal">
              {/* Left: Pack browser */}
              <ResizablePanel defaultSize={22} minSize={15}>
                <Panel>
                  <Stack gap="sm">
                    <SectionLabel>Pack Contents</SectionLabel>
                    <TreeView
                      nodes={PACK_TREE}
                      {...(selectedNode !== undefined ? { selected: selectedNode } : {})}
                      expanded={expandedNodes}
                      onSelect={handleNodeSelect}
                      onExpand={handleNodeExpand}
                    />
                  </Stack>
                </Panel>
              </ResizablePanel>

              {/* Center: Tile detail */}
              <ResizablePanel defaultSize={45} minSize={25}>
                <Panel style={{ borderRight: '1px solid var(--forge-border)' }}>
                  <Tabs
                    defaultValue="preview"
                    items={[
                      {
                        value: 'preview',
                        label: 'Tile Preview',
                        content: (
                          <Stack gap="md" style={{ padding: 'var(--forge-space-2) 0' }}>
                            <Group gap="lg" align="start">
                              <Stack gap="xs" align="center">
                                <TilePreview
                                  source={tile}
                                  size={128}
                                  label={selectedNode ?? 'select tile'}
                                  border="selected"
                                />
                                <VerdictWidget value={verdict} onChange={setVerdict} size="sm" />
                              </Stack>
                              <Stack gap="xs" align="center">
                                <TilingGrid source={tile} cols={3} rows={3} size={180} />
                                <Text size="xs" style={{ color: 'var(--forge-color-text-muted)' }}>
                                  Seamlessness
                                </Text>
                              </Stack>
                            </Group>
                            <Separator />
                            <SectionLabel>Quality Heat Map</SectionLabel>
                            <HeatMapOverlay
                              scalarData={Array.from({ length: 64 }, (_, y) =>
                                Array.from({ length: 64 }, (_, x) => {
                                  const edgeDist = Math.min(x, y, 63 - x, 63 - y)
                                  return edgeDist < 5
                                    ? 0.2 + Math.random() * 0.4
                                    : Math.random() * 0.1
                                }),
                              )}
                              width={200}
                              height={200}
                              colorMap="hot"
                            />
                          </Stack>
                        ),
                      },
                      {
                        value: 'manifest',
                        label: 'Manifest',
                        content: (
                          <div style={{ padding: 'var(--forge-space-2) 0' }}>
                            <JsonViewer data={PACK_MANIFEST} defaultExpandDepth={3} />
                          </div>
                        ),
                      },
                      {
                        value: 'batch',
                        label: 'Batch Jobs',
                        content: (
                          <div style={{ padding: 'var(--forge-space-2) 0' }}>
                            <GenerationQueue
                              jobs={packJobs}
                              variant="expanded"
                              costFormat={(c) => `$${(c / 100).toFixed(2)}`}
                            />
                          </div>
                        ),
                      },
                    ]}
                  />
                </Panel>
              </ResizablePanel>

              {/* Right: Stats */}
              <ResizablePanel defaultSize={33} minSize={20}>
                <Panel style={{ borderRight: 'none' }}>
                  <Stack gap="md">
                    <SectionLabel>Pack Quality</SectionLabel>
                    <SimpleGrid cols={2} spacing="sm">
                      <StatCard label="Avg RMSE" value="0.028" />
                      <StatCard label="Avg IoU" value="0.91" delta="good" />
                      <StatCard label="Worst" value="sw-ms12" />
                      <StatCard label="Best" value="grass" />
                      <StatCard label="Total Cost" value="$12.40" />
                      <StatCard label="Per Tile" value="$0.28" />
                    </SimpleGrid>

                    <Separator />
                    <SectionLabel>Tile Gallery</SectionLabel>
                    <ScrollArea style={{ height: 250 }}>
                      <Group gap="xs" wrap="wrap">
                        {Array.from({ length: 20 }, (_, i) => (
                          <TilePreview
                            key={i}
                            source={makeTileCanvas(100 + i * 12, 32)}
                            size={44}
                            onClick={() => setSelectedNode(`tile-${i}`)}
                          />
                        ))}
                      </Group>
                    </ScrollArea>

                    <Separator />
                    <SectionLabel>Progress</SectionLabel>
                    <Stack gap="xs">
                      <Group gap="sm" align="center">
                        <Text size="sm">Fills</Text>
                        <div style={{ flex: 1 }}>
                          <Progress value={100} />
                        </div>
                        <Text size="xs">3/3</Text>
                      </Group>
                      <Group gap="sm" align="center">
                        <Text size="sm">Pairs</Text>
                        <div style={{ flex: 1 }}>
                          <Progress value={100} />
                        </div>
                        <Text size="xs">42/42</Text>
                      </Group>
                      <Group gap="sm" align="center">
                        <Text size="sm">Approved</Text>
                        <div style={{ flex: 1 }}>
                          <Progress value={82} />
                        </div>
                        <Text size="xs">37/45</Text>
                      </Group>
                    </Stack>
                  </Stack>
                </Panel>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </div>
      </TooltipProvider>
    )
  },
}

// ---------------------------------------------------------------------------
// Story 5: Experiment Comparison
// ---------------------------------------------------------------------------

const COMPARISON_DATA = [
  {
    id: 'a',
    label: 'flux-1.1-pro, 4-step',
    model: 'flux-1.1-pro',
    steps: 4,
    seed: 42,
    rmse: 0.023,
    iou: 0.94,
    cost: 0.08,
    verdict: 'up' as Verdict,
  },
  {
    id: 'b',
    label: 'flux-1.1-pro, 8-step',
    model: 'flux-1.1-pro',
    steps: 8,
    seed: 42,
    rmse: 0.019,
    iou: 0.96,
    cost: 0.14,
    verdict: 'up' as Verdict,
  },
  {
    id: 'c',
    label: 'flux-1.1-pro, 4-step, alt prompt',
    model: 'flux-1.1-pro',
    steps: 4,
    seed: 42,
    rmse: 0.041,
    iou: 0.87,
    cost: 0.08,
    verdict: 'down' as Verdict,
  },
  {
    id: 'd',
    label: 'flux-schnell, 4-step',
    model: 'flux-schnell',
    steps: 4,
    seed: 42,
    rmse: 0.052,
    iou: 0.82,
    cost: 0.03,
    verdict: null,
  },
]

/**
 * ### Experiment Comparison
 *
 * Side-by-side comparison of different generation strategies. Compare models,
 * step counts, prompts, and seeds across runs.
 *
 * - **Left**: Comparison table with quality metrics and cost
 * - **Right**: Visual comparison of selected pair (ComparisonSlider,
 *   TilePreview, HeatMapOverlay, VerdictWidget per run)
 *
 * Uses: DataTable, ComparisonSlider, TilePreview, HeatMapOverlay,
 * VerdictWidget, StatCard, Badge, ToggleGroup, Tabs, ResizablePanelGroup
 */
export const ExperimentComparison: Story = {
  name: 'Experiment Comparison',
  parameters: {
    docs: {
      description: {
        story:
          'Compare generation approaches side by side. Review quality metrics, cost trade-offs, and visual output across different models, step counts, and prompts.',
      },
    },
  },
  render: function ExperimentComparisonStory() {
    const [selectedA, setSelectedA] = useState(0)
    const [selectedB, setSelectedB] = useState(1)

    const tiles = useRef(COMPARISON_DATA.map((_, i) => makeTileCanvas(100 + i * 30, 64))).current

    const comparisonColumns: ColumnDef<(typeof COMPARISON_DATA)[0]>[] = useMemo(
      () => [
        {
          id: 'label',
          header: 'Experiment',
          accessorKey: 'label',
          size: 200,
        },
        {
          id: 'rmse',
          header: 'RMSE',
          accessorKey: 'rmse',
          cell: ({ row }) => (
            <Badge
              variant="outline"
              color={
                row.original.rmse < 0.03
                  ? 'success'
                  : row.original.rmse < 0.05
                    ? 'warning'
                    : 'danger'
              }
            >
              {row.original.rmse.toFixed(3)}
            </Badge>
          ),
          size: 80,
        },
        {
          id: 'iou',
          header: 'IoU',
          accessorKey: 'iou',
          cell: ({ row }) => (
            <Badge
              variant="outline"
              color={
                row.original.iou >= 0.9
                  ? 'success'
                  : row.original.iou >= 0.85
                    ? 'warning'
                    : 'danger'
              }
            >
              {row.original.iou.toFixed(2)}
            </Badge>
          ),
          size: 70,
        },
        {
          id: 'cost',
          header: 'Cost',
          accessorKey: 'cost',
          cell: ({ row }) => <Text size="sm">${row.original.cost.toFixed(2)}</Text>,
          size: 60,
        },
        {
          id: 'verdict',
          header: 'Verdict',
          accessorKey: 'verdict',
          cell: ({ row }) =>
            row.original.verdict === 'up' ? (
              <Badge variant="solid" color="success">
                ✓
              </Badge>
            ) : row.original.verdict === 'down' ? (
              <Badge variant="solid" color="danger">
                ✗
              </Badge>
            ) : (
              <Text size="sm" style={{ color: 'var(--forge-color-text-muted)' }}>
                —
              </Text>
            ),
          size: 70,
        },
      ],
      [],
    )

    const runA = COMPARISON_DATA[selectedA] as (typeof COMPARISON_DATA)[0]
    const runB = COMPARISON_DATA[selectedB] as (typeof COMPARISON_DATA)[0]

    return (
      <TooltipProvider>
        <div
          style={{
            height: 720,
            display: 'flex',
            flexDirection: 'column',
            fontFamily: 'var(--forge-font-sans)',
          }}
        >
          <ModuleToolbar
            badge="CMP"
            title="Experiment Comparison"
            actions={
              <Group gap={2}>
                <Badge variant="outline">{COMPARISON_DATA.length} runs</Badge>
                <Badge variant="outline">grass fill</Badge>
              </Group>
            }
          />

          <div style={{ flex: 1, minHeight: 0 }}>
            <ResizablePanelGroup direction="horizontal">
              {/* Left: Results table */}
              <ResizablePanel defaultSize={45} minSize={30}>
                <Panel>
                  <Stack gap="md">
                    <SectionLabel>Experiment Results</SectionLabel>
                    <DataTable columns={comparisonColumns} data={COMPARISON_DATA} />

                    <Separator />
                    <SectionLabel>Select for Comparison</SectionLabel>
                    <Group gap="md">
                      <Stack gap="xs">
                        <Text size="xs" weight="semibold">
                          Left (A)
                        </Text>
                        <select
                          value={selectedA}
                          onChange={(e) => setSelectedA(Number(e.target.value))}
                          style={{
                            padding: '4px 8px',
                            backgroundColor: 'var(--forge-surface-2)',
                            color: 'var(--forge-color-text)',
                            border: '1px solid var(--forge-border)',
                            borderRadius: 'var(--forge-radius-sm)',
                            fontSize: 'var(--forge-text-sm)',
                          }}
                        >
                          {COMPARISON_DATA.map((d, i) => (
                            <option key={d.id} value={i}>
                              {d.label}
                            </option>
                          ))}
                        </select>
                      </Stack>
                      <Stack gap="xs">
                        <Text size="xs" weight="semibold">
                          Right (B)
                        </Text>
                        <select
                          value={selectedB}
                          onChange={(e) => setSelectedB(Number(e.target.value))}
                          style={{
                            padding: '4px 8px',
                            backgroundColor: 'var(--forge-surface-2)',
                            color: 'var(--forge-color-text)',
                            border: '1px solid var(--forge-border)',
                            borderRadius: 'var(--forge-radius-sm)',
                            fontSize: 'var(--forge-text-sm)',
                          }}
                        >
                          {COMPARISON_DATA.map((d, i) => (
                            <option key={d.id} value={i}>
                              {d.label}
                            </option>
                          ))}
                        </select>
                      </Stack>
                    </Group>

                    <Separator />
                    <SectionLabel>Cost vs Quality</SectionLabel>
                    <SimpleGrid cols={2} spacing="sm">
                      <StatCard
                        label="Best Quality"
                        value={`IoU ${Math.max(...COMPARISON_DATA.map((d) => d.iou)).toFixed(2)}`}
                      />
                      <StatCard
                        label="Cheapest"
                        value={`$${Math.min(...COMPARISON_DATA.map((d) => d.cost)).toFixed(2)}`}
                      />
                      <StatCard
                        label="Best Value"
                        value={`${Math.max(...COMPARISON_DATA.map((d) => d.iou / d.cost)).toFixed(1)} IoU/$`}
                      />
                      <StatCard
                        label="Total Spend"
                        value={`$${COMPARISON_DATA.reduce((s, d) => s + d.cost, 0).toFixed(2)}`}
                      />
                    </SimpleGrid>
                  </Stack>
                </Panel>
              </ResizablePanel>

              {/* Right: Visual comparison */}
              <ResizablePanel defaultSize={55} minSize={30}>
                <Panel style={{ borderRight: 'none' }}>
                  <Stack gap="md">
                    <SectionLabel>Visual Comparison</SectionLabel>

                    {/* Side-by-side tiles */}
                    <Group gap="lg" align="start" justify="center">
                      <Stack gap="sm" align="center">
                        <Text
                          size="xs"
                          weight="semibold"
                          style={{ color: 'var(--forge-color-text-muted)' }}
                        >
                          A: {runA.label}
                        </Text>
                        <TilePreview
                          source={tiles[selectedA] ?? null}
                          size={120}
                          border="selected"
                        />
                        <Group gap="xs">
                          <Badge variant="outline">RMSE {runA.rmse.toFixed(3)}</Badge>
                          <Badge variant="outline">IoU {runA.iou.toFixed(2)}</Badge>
                        </Group>
                        <VerdictWidget value={runA.verdict} onChange={() => {}} size="sm" />
                      </Stack>

                      <Stack gap="sm" align="center">
                        <Text
                          size="xs"
                          weight="semibold"
                          style={{ color: 'var(--forge-color-text-muted)' }}
                        >
                          B: {runB.label}
                        </Text>
                        <TilePreview
                          source={tiles[selectedB] ?? null}
                          size={120}
                          border="selected"
                        />
                        <Group gap="xs">
                          <Badge variant="outline">RMSE {runB.rmse.toFixed(3)}</Badge>
                          <Badge variant="outline">IoU {runB.iou.toFixed(2)}</Badge>
                        </Group>
                        <VerdictWidget value={runB.verdict} onChange={() => {}} size="sm" />
                      </Stack>
                    </Group>

                    <Separator />

                    {/* Heat map comparison */}
                    <SectionLabel>Seam Quality Comparison</SectionLabel>
                    <Group gap="lg" justify="center">
                      <Stack gap="xs" align="center">
                        <HeatMapOverlay
                          scalarData={Array.from({ length: 64 }, (_, y) =>
                            Array.from({ length: 64 }, (_, x) => {
                              const d = Math.min(x, y, 63 - x, 63 - y)
                              return d < 4
                                ? runA.rmse * 10 + Math.random() * 0.3
                                : Math.random() * 0.05
                            }),
                          )}
                          width={150}
                          height={150}
                          colorMap="hot"
                        />
                        <Text size="xs" style={{ color: 'var(--forge-color-text-muted)' }}>
                          A seams
                        </Text>
                      </Stack>
                      <Stack gap="xs" align="center">
                        <HeatMapOverlay
                          scalarData={Array.from({ length: 64 }, (_, y) =>
                            Array.from({ length: 64 }, (_, x) => {
                              const d = Math.min(x, y, 63 - x, 63 - y)
                              return d < 4
                                ? runB.rmse * 10 + Math.random() * 0.3
                                : Math.random() * 0.05
                            }),
                          )}
                          width={150}
                          height={150}
                          colorMap="hot"
                        />
                        <Text size="xs" style={{ color: 'var(--forge-color-text-muted)' }}>
                          B seams
                        </Text>
                      </Stack>
                    </Group>

                    <Separator />

                    {/* Tiling comparison */}
                    <SectionLabel>Tiling Comparison</SectionLabel>
                    <Group gap="lg" justify="center">
                      <Stack gap="xs" align="center">
                        <TilingGrid
                          source={tiles[selectedA] ?? null}
                          cols={3}
                          rows={3}
                          size={140}
                        />
                        <Text size="xs" style={{ color: 'var(--forge-color-text-muted)' }}>
                          A tiled
                        </Text>
                      </Stack>
                      <Stack gap="xs" align="center">
                        <TilingGrid
                          source={tiles[selectedB] ?? null}
                          cols={3}
                          rows={3}
                          size={140}
                        />
                        <Text size="xs" style={{ color: 'var(--forge-color-text-muted)' }}>
                          B tiled
                        </Text>
                      </Stack>
                    </Group>
                  </Stack>
                </Panel>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </div>
      </TooltipProvider>
    )
  },
}
