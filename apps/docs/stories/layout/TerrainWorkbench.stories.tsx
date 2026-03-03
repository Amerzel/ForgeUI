import type { Meta, StoryObj } from '@storybook/react'
import { useState, useCallback } from 'react'
import {
  ResizablePanel, ResizablePanelGroup,
  Tabs, ModuleToolbar,
  FileSourceBar, CodeBlock, JsonViewer,
  TreeView, DropZone, Slider, Select, Badge, Text,
  Card, Stack, Flex, Group, ScrollArea,
  Button, Separator,
  TooltipProvider,
} from '@forgeui/components'
import type { FileSourceBarFile, TreeNode } from '@forgeui/components'

/**
 * Terrain Workbench — Layout Explorations
 *
 * Stories explore two approaches to the ForgeWorkbench UI:
 *
 * 1. **Per-module layouts** (stories 1–5): Each PRD module as a separate page.
 *    Useful for understanding individual module needs, but fragments workflow.
 *
 * 2. **Unified Workspace** (recommended): Single workspace with shared data
 *    context, mode switcher, contextual properties panel. Load files once,
 *    switch focus modes without losing context.
 */
const meta: Meta = {
  title: 'Layout/Terrain Workbench',
  parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj

// ---------------------------------------------------------------------------
// Shared mock data
// ---------------------------------------------------------------------------

const MOCK_MANIFEST = {
  version: 'terrain_pack.v1',
  tileSize: 64,
  atlasWidth: 1024,
  atlasHeight: 2048,
  layers: [
    { tag: 'terrain', tileCount: 6 },
    { tag: 'transitions', tileCount: 84 },
    { tag: 'effects', tileCount: 168 },
  ],
  boundaryPairs: ['grass_water', 'grass_stone', 'stone_sand'],
  tiles: [
    { id: 'grass_water_ms3_cliff-face', case: 3, pair: 'grass_water', effect: 'cliff-face', layer: 'effects', x: 0, y: 0 },
    { id: 'grass_water_ms6_cliff-shadow', case: 6, pair: 'grass_water', effect: 'cliff-shadow', layer: 'effects', x: 64, y: 0 },
    { id: 'grass_water_ms9_outline', case: 9, pair: 'grass_water', effect: 'outline', layer: 'effects', x: 128, y: 0 },
  ],
}

const MOCK_RECIPE_JSON = `{
  "version": "tileset_recipe.v1",
  "tileSize": 64,
  "fills": {
    "grass": { "source": "fills/grass-painterly.png" },
    "water": { "source": "fills/water-painterly.png" },
    "stone": { "source": "fills/stone-painterly.png" }
  },
  "pairs": [
    {
      "a": "grass",
      "b": "water",
      "mode": "ms14",
      "effects": {
        "outline":      { "width": 2, "mode": "darken" },
        "cliff-face":   { "height": 12, "darkness": 0.6 },
        "cliff-shadow": { "depth": 32, "alpha": 0.4 }
      }
    }
  ]
}`

function PlaceholderCanvas({ label, aspect }: { label: string; aspect?: string }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flex: 1, minHeight: 0,
      backgroundColor: 'var(--forge-surface-sunken)',
      borderRadius: 'var(--forge-radius-lg)',
      border: '1px solid var(--forge-border)',
      color: 'var(--forge-text-disabled)',
      fontSize: 'var(--forge-font-size-sm)',
      aspectRatio: aspect,
    }}>
      <Stack gap={1} style={{ alignItems: 'center' }}>
        <div style={{ fontSize: 32, opacity: 0.3 }}>🖼</div>
        <Text size="xs" color="muted">{label}</Text>
      </Stack>
    </div>
  )
}

function TilePlaceholder({ id, color }: { id: string; color: string }) {
  return (
    <div
      title={id}
      style={{
        width: 64, height: 64,
        backgroundColor: `color-mix(in srgb, var(--forge-${color}) 15%, var(--forge-surface))`,
        border: '1px solid var(--forge-border)',
        borderRadius: 'var(--forge-radius-sm)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 'var(--forge-font-size-xs)', color: `var(--forge-${color})`,
        cursor: 'pointer',
      }}
    >
      {id.split('_').pop()}
    </div>
  )
}

// ===========================================================================
// UNIFIED WORKSPACE (Recommended)
// ===========================================================================

type FocusMode = 'inspect' | 'paint' | 'effects' | 'fills' | 'pipeline'

const MODE_ICONS: Record<FocusMode, string> = {
  inspect: '🔍',
  paint: '🖌',
  effects: '⚡',
  fills: '🖼',
  pipeline: '🔨',
}

const MODE_LABELS: Record<FocusMode, string> = {
  inspect: 'Inspect Tiles',
  paint: 'Map Painter',
  effects: 'Effect Tuning',
  fills: 'Fill Quality',
  pipeline: 'Pipeline',
}

const PACK_TREE: TreeNode[] = [
  {
    id: 'fills',
    label: 'Fills (3)',
    children: [
      { id: 'fill-grass', label: 'grass-painterly.png' },
      { id: 'fill-water', label: 'water-painterly.png' },
      { id: 'fill-stone', label: 'stone-painterly.png' },
    ],
  },
  {
    id: 'pairs',
    label: 'Pairs (3)',
    children: [
      {
        id: 'pair-gw',
        label: 'grass → water',
        children: [
          { id: 'gw-transitions', label: 'Transitions (14)' },
          {
            id: 'gw-effects',
            label: 'Effects',
            children: [
              { id: 'gw-outline', label: 'outline (14)' },
              { id: 'gw-cliff-face', label: 'cliff-face (14)' },
              { id: 'gw-cliff-shadow', label: 'cliff-shadow (12)' },
            ],
          },
        ],
      },
      {
        id: 'pair-gs',
        label: 'grass → stone',
        children: [
          { id: 'gs-transitions', label: 'Transitions (14)' },
          { id: 'gs-effects', label: 'Effects (42)' },
        ],
      },
      {
        id: 'pair-ss',
        label: 'stone → sand',
        children: [
          { id: 'ss-transitions', label: 'Transitions (14)' },
          { id: 'ss-effects', label: 'Effects (42)' },
        ],
      },
    ],
  },
  {
    id: 'gaps',
    label: '⚠ Gaps (2)',
    children: [
      { id: 'gap-1', label: 'grass_water_ms5_cliff-shadow' },
      { id: 'gap-2', label: 'grass_water_ms10_cliff-shadow' },
    ],
  },
]

// -- Viewport panels per mode -----------------------------------------------

function InspectViewport({ selectedNode }: { selectedNode: string | null }) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 'var(--forge-space-2)',
        padding: 'var(--forge-space-2) var(--forge-space-3)',
        borderBottom: '1px solid var(--forge-border)',
        backgroundColor: 'var(--forge-surface)',
      }}>
        <Text size="xs" color="muted">View:</Text>
        <Select
          value="grid"
          onValueChange={() => {}}
          options={[
            { label: 'Tile Grid', value: 'grid' },
            { label: 'Atlas Overview', value: 'atlas' },
          ]}
        />
        <Separator orientation="vertical" style={{ height: 20 }} />
        <Text size="xs" color="muted">Show:</Text>
        <Group gap={1}>
          <Badge>Terrain</Badge>
          <Badge variant="outline">Transitions</Badge>
          <Badge variant="outline">Effects</Badge>
        </Group>
      </div>
      <div style={{ flex: 1, padding: 'var(--forge-space-4)', overflow: 'auto' }}>
        <Text size="xs" color="muted" style={{ display: 'block', marginBottom: 'var(--forge-space-2)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {selectedNode?.startsWith('gw-') ? 'grass → water / ' + selectedNode.replace('gw-', '') : 'All Tiles (258)'}
        </Text>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--forge-space-2)' }}>
          {Array.from({ length: 14 }, (_, i) => (
            <div
              key={i}
              title={`ms${i}`}
              style={{
                width: 64, height: 64,
                backgroundColor: (i === 5 || i === 10) && selectedNode?.includes('cliff-shadow')
                  ? 'color-mix(in srgb, var(--forge-danger) 15%, var(--forge-surface))'
                  : 'color-mix(in srgb, var(--forge-info) 12%, var(--forge-surface))',
                border: '1px solid var(--forge-border)',
                borderRadius: 'var(--forge-radius-sm)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 'var(--forge-font-size-xs)',
                color: (i === 5 || i === 10) && selectedNode?.includes('cliff-shadow') ? 'var(--forge-danger)' : 'var(--forge-info)',
                cursor: 'pointer',
              }}
            >
              ms{i}
            </div>
          ))}
        </div>
        {selectedNode?.includes('cliff-shadow') && (
          <Text size="xs" style={{ color: 'var(--forge-danger)', marginTop: 'var(--forge-space-2)', display: 'block' }}>
            ⚠ 2 missing effect tiles (ms5, ms10) — click to view gap details
          </Text>
        )}
      </div>
    </div>
  )
}

function PaintViewport() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 'var(--forge-space-2)',
        padding: 'var(--forge-space-2) var(--forge-space-3)',
        borderBottom: '1px solid var(--forge-border)',
        backgroundColor: 'var(--forge-surface)',
      }}>
        <Group gap={1}>
          <Button size="sm" variant="solid">🖌 Paint</Button>
          <Button size="sm" variant="outline">⬜ Erase</Button>
          <Button size="sm" variant="outline">🔍 Inspect</Button>
        </Group>
        <Separator orientation="vertical" style={{ height: 20 }} />
        <Text size="xs" color="muted">Grid:</Text>
        <Select
          value="16"
          onValueChange={() => {}}
          options={[
            { label: '8×8', value: '8' },
            { label: '16×16', value: '16' },
            { label: '32×32', value: '32' },
          ]}
        />
        <div style={{ flex: 1 }} />
        <Group gap={1}>
          {['Terrain', 'Transitions', 'Effects'].map(l => (
            <Flex key={l} align="center" gap={1}>
              <input type="checkbox" defaultChecked style={{ accentColor: 'var(--forge-accent)' }} />
              <Text size="xs">{l}</Text>
            </Flex>
          ))}
        </Group>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <PlaceholderCanvas label="16×16 — click to paint materials, MS classification updates live" />
      </div>
    </div>
  )
}

function EffectsViewport() {
  const [splitView, setSplitView] = useState('composite')
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 'var(--forge-space-2)',
        padding: 'var(--forge-space-2) var(--forge-space-3)',
        borderBottom: '1px solid var(--forge-border)',
        backgroundColor: 'var(--forge-surface)',
      }}>
        <Text size="xs" color="muted">Case:</Text>
        <Select
          value="ms3"
          onValueChange={() => {}}
          options={Array.from({ length: 14 }, (_, i) => ({ label: `MS-${i}`, value: `ms${i}` }))}
        />
        <Separator orientation="vertical" style={{ height: 20 }} />
        <Group gap={1}>
          {(['composite', 'mask', 'effect', 'split'] as const).map(v => (
            <Button key={v} size="sm" variant={splitView === v ? 'solid' : 'outline'} onClick={() => setSplitView(v)}>
              {v === 'composite' ? 'Composite' : v === 'mask' ? 'SDF Mask' : v === 'effect' ? 'Effect' : 'Split'}
            </Button>
          ))}
        </Group>
        <div style={{ flex: 1 }} />
        <Group gap={1}>
          <Button size="sm" variant="solid">B Higher ↑</Button>
          <Button size="sm" variant="outline">A Higher ↑</Button>
        </Group>
      </div>
      <div style={{ flex: 1, padding: 'var(--forge-space-4)', display: 'flex', gap: 'var(--forge-space-3)' }}>
        {splitView === 'split' ? (
          <>
            <PlaceholderCanvas label="SDF Mask" />
            <PlaceholderCanvas label="Effect Overlay" />
            <PlaceholderCanvas label="Composite" />
          </>
        ) : (
          <PlaceholderCanvas label={
            splitView === 'mask' ? 'SDF Mask (blue → red gradient)'
              : splitView === 'effect' ? 'Effect Overlay (alpha channel)'
                : 'Fill + Mask + Effect'
          } />
        )}
      </div>
    </div>
  )
}

function FillsViewport() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 'var(--forge-space-2)',
        padding: 'var(--forge-space-2) var(--forge-space-3)',
        borderBottom: '1px solid var(--forge-border)',
        backgroundColor: 'var(--forge-surface)',
      }}>
        <Text size="xs" color="muted">Grid:</Text>
        <Select
          value="4"
          onValueChange={() => {}}
          options={[
            { label: '3×3', value: '3' },
            { label: '4×4', value: '4' },
            { label: '6×6', value: '6' },
          ]}
        />
        <Separator orientation="vertical" style={{ height: 20 }} />
        <Group gap={1}>
          <Button size="sm" variant="outline">Seam Lines</Button>
          <Button size="sm" variant="solid">Heat Map</Button>
        </Group>
        <div style={{ flex: 1 }} />
        <DropZone
          accept={['.png']}
          multiple
          onDrop={() => {}}
          className="forge-inline-drop"
        >
          <Text size="xs" color="muted">+ Drop fills to compare</Text>
        </DropZone>
      </div>
      <div style={{ flex: 1, padding: 'var(--forge-space-4)' }}>
        <PlaceholderCanvas label="4×4 tiling grid — seam heat map overlay" />
      </div>
    </div>
  )
}

function PipelineViewport() {
  const [composeStatus, setComposeStatus] = useState<'idle' | 'running' | 'done'>('done')
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 'var(--forge-space-2)',
        padding: 'var(--forge-space-2) var(--forge-space-3)',
        borderBottom: '1px solid var(--forge-border)',
        backgroundColor: 'var(--forge-surface)',
      }}>
        <Group gap={1}>
          <Button size="sm" variant="solid"
            onClick={() => { setComposeStatus('running'); setTimeout(() => setComposeStatus('done'), 1500) }}
            disabled={composeStatus === 'running'}
          >
            {composeStatus === 'running' ? '⏳ Composing…' : '🔨 Compose'}
          </Button>
          <Button size="sm" variant="outline">🗺 Resolve</Button>
        </Group>
        <Separator orientation="vertical" style={{ height: 20 }} />
        <Group gap={1}>
          {['Rendered', 'Diff', 'Layers'].map(v => (
            <Button key={v} size="sm" variant={v === 'Rendered' ? 'solid' : 'outline'}>{v}</Button>
          ))}
        </Group>
      </div>
      <div style={{ flex: 1, padding: 'var(--forge-space-4)' }}>
        <PlaceholderCanvas label="Resolved map — all layers composited" />
      </div>
    </div>
  )
}

// -- Properties panels per mode / selection ---------------------------------

function InspectProperties({ selectedNode }: { selectedNode: string | null }) {
  if (selectedNode?.startsWith('gap-')) {
    return (
      <Stack gap={3} style={{ padding: 'var(--forge-space-3)' }}>
        <Badge color="danger">Missing Tile</Badge>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '4px 12px' }}>
          <Text size="xs" color="muted">Tile ID</Text>
          <Text size="xs" style={{ fontFamily: 'var(--forge-font-mono)', wordBreak: 'break-all' }}>
            {selectedNode === 'gap-1' ? 'grass_water_ms5_cliff-shadow' : 'grass_water_ms10_cliff-shadow'}
          </Text>
          <Text size="xs" color="muted">Pair</Text>
          <Text size="xs">grass → water</Text>
          <Text size="xs" color="muted">Effect</Text>
          <Text size="xs">cliff-shadow</Text>
          <Text size="xs" color="muted">Case</Text>
          <Text size="xs">{selectedNode === 'gap-1' ? 'MS-5' : 'MS-10'}</Text>
        </div>
        <Separator />
        <Text size="xs" color="muted">The transition tile exists but the corresponding cliff-shadow effect overlay is absent. This causes the renderer to skip the effect layer for this case.</Text>
        <Button size="sm" variant="outline">→ Tune this effect</Button>
      </Stack>
    )
  }

  return (
    <Stack gap={3} style={{ padding: 'var(--forge-space-3)' }}>
      {/* Enlarged tile preview */}
      <div style={{
        width: '100%', aspectRatio: '1', maxWidth: 192, alignSelf: 'center',
        backgroundColor: 'color-mix(in srgb, var(--forge-accent) 12%, var(--forge-surface-sunken))',
        border: '1px solid var(--forge-border)',
        borderRadius: 'var(--forge-radius-lg)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--forge-text-disabled)', fontSize: 48,
      }}>
        🖼
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '4px 12px' }}>
        <Text size="xs" color="muted">Tile ID</Text>
        <Text size="xs" style={{ fontFamily: 'var(--forge-font-mono)', wordBreak: 'break-all' }}>grass_water_ms3_cliff-face</Text>
        <Text size="xs" color="muted">Case</Text>
        <Text size="xs">MS-3 (UL·UR)</Text>
        <Text size="xs" color="muted">Pair</Text>
        <Text size="xs">grass → water</Text>
        <Text size="xs" color="muted">Effect</Text>
        <Badge variant="outline">cliff-face</Badge>
        <Text size="xs" color="muted">Layer</Text>
        <Text size="xs">effects (order: 2)</Text>
      </div>

      <Separator />

      {/* Corner bit diagram */}
      <Text size="xs" color="muted" style={{ display: 'block' }}>Corner Bits (MS-3)</Text>
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        width: 80, height: 80, gap: 2,
      }}>
        {['A', 'A', 'B', 'B'].map((m, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backgroundColor: m === 'A'
              ? 'color-mix(in srgb, var(--forge-success) 20%, var(--forge-surface))'
              : 'color-mix(in srgb, var(--forge-info) 20%, var(--forge-surface))',
            borderRadius: 'var(--forge-radius-sm)',
            fontSize: 'var(--forge-font-size-xs)',
            color: m === 'A' ? 'var(--forge-success)' : 'var(--forge-info)',
            fontWeight: 600,
          }}>
            {m}
          </div>
        ))}
      </div>

      <Separator />

      <JsonViewer
        data={{ type: 'cliff-face', height: 12, darkness: 0.6, direction: 'south' }}
        defaultExpandDepth={Infinity}
        showCopy={false}
      />
    </Stack>
  )
}

function PaintProperties() {
  return (
    <Stack gap={3} style={{ padding: 'var(--forge-space-3)' }}>
      <Text size="xs" color="muted" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cell (4, 7)</Text>
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '4px 12px' }}>
        <Text size="xs" color="muted">Material</Text>
        <Text size="xs">grass</Text>
        <Text size="xs" color="muted">MS Case</Text>
        <Text size="xs">MS-6 (border)</Text>
        <Text size="xs" color="muted">Tile ID</Text>
        <Text size="xs" style={{ fontFamily: 'var(--forge-font-mono)', wordBreak: 'break-all' }}>grass_water_ms6</Text>
      </div>
      <Separator />
      <Text size="xs" color="muted" style={{ display: 'block' }}>Layers at this cell:</Text>
      <Stack gap={1}>
        {['terrain: grass', 'transition: grass_water_ms6', 'outline: grass_water_ms6_outline', 'cliff-face: grass_water_ms6_cliff-face'].map(l => (
          <Text key={l} size="xs" style={{ fontFamily: 'var(--forge-font-mono)', color: 'var(--forge-text-muted)' }}>{l}</Text>
        ))}
      </Stack>
      <Separator />
      <Text size="xs" color="muted" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Material Palette</Text>
      <Stack gap={1}>
        {[
          { name: 'grass', color: 'success' },
          { name: 'water', color: 'info' },
          { name: 'stone', color: 'warning' },
          { name: 'sand', color: 'accent' },
        ].map(m => (
          <Flex key={m.name} align="center" gap={2}>
            <div style={{ width: 16, height: 16, borderRadius: 'var(--forge-radius-sm)', backgroundColor: `var(--forge-${m.color})`, opacity: 0.6 }} />
            <Text size="xs" style={{ textTransform: 'capitalize' }}>{m.name}</Text>
          </Flex>
        ))}
      </Stack>
    </Stack>
  )
}

function EffectsProperties() {
  const [height, setHeight] = useState([12])
  const [darkness, setDarkness] = useState([60])
  const [depth, setDepth] = useState([32])
  const [alpha, setAlpha] = useState([40])
  const [outlineWidth, setOutlineWidth] = useState([2])

  return (
    <ScrollArea style={{ height: '100%' }}>
      <Stack gap={4} style={{ padding: 'var(--forge-space-3)' }}>
        {/* Cliff-face */}
        <Stack gap={3}>
          <Flex align="center" justify="between">
            <Text size="xs" weight="semibold">Cliff Face</Text>
            <Badge variant="outline">cliff-face</Badge>
          </Flex>
          <Stack gap={2}>
            <Flex align="center" justify="between">
              <Text size="xs" color="muted">Height</Text>
              <Text size="xs" style={{ fontFamily: 'var(--forge-font-mono)' }}>{height[0]}px</Text>
            </Flex>
            <Slider min={1} max={32} step={1} value={height} onValueChange={setHeight} />
          </Stack>
          <Stack gap={2}>
            <Flex align="center" justify="between">
              <Text size="xs" color="muted">Darkness</Text>
              <Text size="xs" style={{ fontFamily: 'var(--forge-font-mono)' }}>{(darkness[0] / 100).toFixed(2)}</Text>
            </Flex>
            <Slider min={0} max={100} step={1} value={darkness} onValueChange={setDarkness} />
          </Stack>
        </Stack>

        <Separator />

        {/* Cliff-shadow */}
        <Stack gap={3}>
          <Flex align="center" justify="between">
            <Text size="xs" weight="semibold">Cliff Shadow</Text>
            <Badge variant="outline">cliff-shadow</Badge>
          </Flex>
          <Stack gap={2}>
            <Flex align="center" justify="between">
              <Text size="xs" color="muted">Depth</Text>
              <Text size="xs" style={{ fontFamily: 'var(--forge-font-mono)' }}>{depth[0]}px</Text>
            </Flex>
            <Slider min={1} max={64} step={1} value={depth} onValueChange={setDepth} />
          </Stack>
          <Stack gap={2}>
            <Flex align="center" justify="between">
              <Text size="xs" color="muted">Alpha</Text>
              <Text size="xs" style={{ fontFamily: 'var(--forge-font-mono)' }}>{(alpha[0] / 100).toFixed(2)}</Text>
            </Flex>
            <Slider min={0} max={100} step={1} value={alpha} onValueChange={setAlpha} />
          </Stack>
        </Stack>

        <Separator />

        {/* Outline */}
        <Stack gap={3}>
          <Flex align="center" justify="between">
            <Text size="xs" weight="semibold">Outline</Text>
            <Badge variant="outline">outline</Badge>
          </Flex>
          <Stack gap={2}>
            <Flex align="center" justify="between">
              <Text size="xs" color="muted">Width</Text>
              <Text size="xs" style={{ fontFamily: 'var(--forge-font-mono)' }}>{outlineWidth[0]}px</Text>
            </Flex>
            <Slider min={1} max={5} step={1} value={outlineWidth} onValueChange={setOutlineWidth} />
          </Stack>
          <Select
            value="darken"
            onValueChange={() => {}}
            options={[
              { label: 'Darken', value: 'darken' },
              { label: 'Black', value: 'black' },
              { label: 'None', value: 'none' },
            ]}
          />
        </Stack>

        <Separator />

        {/* Direction filter mini grid */}
        <Stack gap={2}>
          <Text size="xs" color="muted" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Direction Filter</Text>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
            {Array.from({ length: 14 }, (_, i) => (
              <div key={i} style={{
                padding: '3px', textAlign: 'center',
                fontSize: 9, fontFamily: 'var(--forge-font-mono)',
                backgroundColor: i % 2 === 1
                  ? 'color-mix(in srgb, var(--forge-success) 15%, var(--forge-surface))'
                  : 'color-mix(in srgb, var(--forge-danger) 10%, var(--forge-surface))',
                color: i % 2 === 1 ? 'var(--forge-success)' : 'var(--forge-danger)',
                borderRadius: 'var(--forge-radius-sm)',
              }}>
                {i}
              </div>
            ))}
          </div>
          <Text size="xs" color="muted">✓ 7 included · ✗ 7 excluded</Text>
        </Stack>

        <Separator />

        {/* Live recipe fragment */}
        <Stack gap={2}>
          <Flex align="center" justify="between">
            <Text size="xs" weight="semibold">Recipe Fragment</Text>
            <Button size="sm" variant="outline">Export</Button>
          </Flex>
          <CodeBlock
            language="json"
            code={JSON.stringify({
              outline: { width: outlineWidth[0], mode: 'darken' },
              'cliff-face': { height: height[0], darkness: darkness[0] / 100 },
              'cliff-shadow': { depth: depth[0], alpha: alpha[0] / 100 },
            }, null, 2)}
            showLineNumbers={false}
          />
        </Stack>
      </Stack>
    </ScrollArea>
  )
}

function FillsProperties() {
  return (
    <ScrollArea style={{ height: '100%' }}>
      <Stack gap={3} style={{ padding: 'var(--forge-space-3)' }}>
        <Card>
          <Card.Body>
            <Flex align="center" justify="between">
              <Stack gap={1}>
                <Text size="xs" color="muted">Boundary RMSE</Text>
                <Text size="2xl" weight="bold" style={{ color: 'var(--forge-success)' }}>4.2</Text>
              </Stack>
              <Badge color="success">PASS</Badge>
            </Flex>
            <Text size="xs" color="muted" style={{ marginTop: 'var(--forge-space-2)', display: 'block' }}>
              Threshold: &lt;8.0 for painterly
            </Text>
          </Card.Body>
        </Card>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--forge-space-2)' }}>
          <Card><Card.Body><Text size="xs" color="muted">Dimensions</Text><Text size="sm" weight="semibold">256×256</Text></Card.Body></Card>
          <Card><Card.Body><Text size="xs" color="muted">Tile Size</Text><Text size="sm" weight="semibold">64px</Text></Card.Body></Card>
          <Card><Card.Body><Text size="xs" color="muted">Variants</Text><Text size="sm" weight="semibold">4×4</Text></Card.Body></Card>
          <Card><Card.Body><Text size="xs" color="muted">Anti-Alias</Text><Text size="sm" weight="semibold">true</Text></Card.Body></Card>
        </div>

        <Separator />

        <Stack gap={1}>
          <Text size="xs" color="muted" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Style Recommendation</Text>
          <Text size="xs">
            Painterly at 64px with antiAlias=true. RMSE 4.2 is well within threshold. Noise amplitude 3–5 recommended.
          </Text>
        </Stack>
      </Stack>
    </ScrollArea>
  )
}

function PipelineProperties() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Tabs
        defaultValue="manifest"
        items={[
          {
            value: 'manifest',
            label: 'Manifest',
            content: (
              <ScrollArea style={{ flex: 1 }}>
                <div style={{ padding: 'var(--forge-space-3)' }}>
                  <JsonViewer data={MOCK_MANIFEST} defaultExpandDepth={2} searchable />
                </div>
              </ScrollArea>
            ),
          },
          {
            value: 'recipe',
            label: 'Recipe',
            content: (
              <ScrollArea style={{ flex: 1 }}>
                <div style={{ padding: 'var(--forge-space-3)' }}>
                  <CodeBlock code={MOCK_RECIPE_JSON} language="json" showLineNumbers />
                </div>
              </ScrollArea>
            ),
          },
          {
            value: 'logs',
            label: 'Output',
            content: (
              <ScrollArea style={{ flex: 1 }}>
                <div style={{ padding: 'var(--forge-space-3)' }}>
                  <CodeBlock
                    language="text"
                    showCopy={false}
                    code={`[forge-tileset] compose v2.1.0
[INFO]  Loading recipe: recipe.json
[INFO]  Loading 3 fill textures…
[OK]    grass-painterly.png (RMSE 4.2 ✓)
[OK]    water-painterly.png (RMSE 3.8 ✓)
[OK]    stone-painterly.png (RMSE 5.1 ✓)
[INFO]  Composing 3 pairs × 14 cases…
[INFO]  Rendering effects…
[OK]    Atlas: 1024×2048 (258 tiles)
[WARN]  2 cliff-shadow tiles missing
[DONE]  Composed in 2.4s`}
                  />
                </div>
              </ScrollArea>
            ),
          },
        ]}
      />
    </div>
  )
}

// -- Main unified story -----------------------------------------------------

export const UnifiedWorkspace: Story = {
  name: '★ Unified Workspace',
  parameters: {
    docs: {
      description: {
        story: `**Recommended layout.** Single workspace with shared file context, persistent browser panel, mode switcher, and contextual properties. All 5 modules accessible without re-loading files or losing context.

Click the mode buttons in the bottom-left to switch focus. Click tree nodes in the left browser to navigate. The right properties panel adapts to the current mode and selection.`,
      },
    },
  },
  render: function UnifiedWorkspaceDemo() {
    const [mode, setMode] = useState<FocusMode>('inspect')
    const [packFile, setPackFile] = useState<FileSourceBarFile | null>({ name: 'terrain_pack.v1.png', size: 2097152, type: 'image/png' })
    const [selectedNode, setSelectedNode] = useState<string | null>('gw-cliff-face')
    const [expandedNodes, setExpandedNodes] = useState(['fills', 'pairs', 'pair-gw', 'gw-effects', 'gaps'])

    const handleNodeSelect = useCallback((id: string) => {
      setSelectedNode(id)
      // Auto-switch mode based on what was clicked
      if (id.startsWith('fill-')) setMode('fills')
      else if (id.startsWith('gap-')) setMode('inspect')
      else if (id.includes('effect') || id.includes('outline') || id.includes('cliff') || id.includes('shadow')) setMode('inspect')
      else if (id.includes('transition')) setMode('inspect')
    }, [])

    const handleNodeExpand = useCallback((id: string, open: boolean) => {
      setExpandedNodes(prev => open ? [...prev, id] : prev.filter(n => n !== id))
    }, [])

    return (
      <TooltipProvider>
        <div style={{ height: 720, display: 'flex', flexDirection: 'column', fontFamily: 'var(--forge-font-sans)' }}>
          {/* ── Top toolbar ── */}
          <ModuleToolbar badge="TW" title="Terrain Workbench"
            actions={
              <Group gap={2}>
                <Badge variant="outline">258 tiles</Badge>
                <Badge variant="outline">3 pairs</Badge>
                <Badge color="danger" variant="outline">2 gaps</Badge>
              </Group>
            }
          >
            <FileSourceBar
              file={packFile}
              onLoad={() => setPackFile({ name: 'terrain_pack.v1.png', size: 2097152, type: 'image/png' })}
              onClear={() => setPackFile(null)}
              accept=".png + .json"
              label="Terrain Pack"
            />
          </ModuleToolbar>

          {/* ── Main area ── */}
          <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
            <ResizablePanelGroup direction="horizontal">
              {/* ── Left: Browser + mode switcher ── */}
              <ResizablePanel defaultSize={20} minSize={14} maxSize={30}>
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  {/* Pack tree */}
                  <ScrollArea style={{ flex: 1 }}>
                    <div style={{ padding: 'var(--forge-space-2)' }}>
                      <TreeView
                        nodes={PACK_TREE}
                        selected={selectedNode ?? undefined}
                        expanded={expandedNodes}
                        onSelect={handleNodeSelect}
                        onExpand={handleNodeExpand}
                      />
                    </div>
                  </ScrollArea>

                  {/* Mode switcher */}
                  <div style={{
                    borderTop: '1px solid var(--forge-border)',
                    padding: 'var(--forge-space-2)',
                    backgroundColor: 'var(--forge-surface)',
                  }}>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(5, 1fr)',
                      gap: 2,
                    }}>
                      {(Object.keys(MODE_ICONS) as FocusMode[]).map(m => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setMode(m)}
                          title={MODE_LABELS[m]}
                          aria-label={MODE_LABELS[m]}
                          aria-pressed={mode === m}
                          style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                            padding: '6px 2px',
                            border: 'none',
                            borderRadius: 'var(--forge-radius-md)',
                            backgroundColor: mode === m ? 'color-mix(in srgb, var(--forge-accent) 15%, var(--forge-surface))' : 'transparent',
                            color: mode === m ? 'var(--forge-accent)' : 'var(--forge-text-muted)',
                            cursor: 'pointer',
                            fontSize: 16,
                            lineHeight: 1,
                          }}
                        >
                          <span>{MODE_ICONS[m]}</span>
                          <span style={{ fontSize: 9, whiteSpace: 'nowrap' }}>
                            {MODE_LABELS[m].split(' ')[0]}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </ResizablePanel>

              {/* ── Center: Viewport (changes per mode) ── */}
              <ResizablePanel defaultSize={55} minSize={35}>
                {mode === 'inspect' && <InspectViewport selectedNode={selectedNode} />}
                {mode === 'paint' && <PaintViewport />}
                {mode === 'effects' && <EffectsViewport />}
                {mode === 'fills' && <FillsViewport />}
                {mode === 'pipeline' && <PipelineViewport />}
              </ResizablePanel>

              {/* ── Right: Properties (contextual) ── */}
              <ResizablePanel defaultSize={25} minSize={18} maxSize={35}>
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--forge-surface)' }}>
                  <div style={{
                    padding: 'var(--forge-space-2) var(--forge-space-3)',
                    borderBottom: '1px solid var(--forge-border)',
                    display: 'flex', alignItems: 'center', gap: 'var(--forge-space-2)',
                  }}>
                    <Text size="sm" weight="semibold">
                      {mode === 'inspect' ? 'Tile Detail' : mode === 'paint' ? 'Cell Inspector' : mode === 'effects' ? 'Effect Parameters' : mode === 'fills' ? 'Quality Metrics' : 'Pipeline'}
                    </Text>
                    <div style={{ flex: 1 }} />
                    <Text size="xs" color="muted">{MODE_ICONS[mode]} {MODE_LABELS[mode]}</Text>
                  </div>
                  <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
                    {mode === 'inspect' && <InspectProperties selectedNode={selectedNode} />}
                    {mode === 'paint' && <PaintProperties />}
                    {mode === 'effects' && <EffectsProperties />}
                    {mode === 'fills' && <FillsProperties />}
                    {mode === 'pipeline' && <PipelineProperties />}
                  </div>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </div>
      </TooltipProvider>
    )
  },
}

export const TileInspector: Story = {
  name: '1 — Tile Inspector',
  parameters: {
    docs: { description: { story: 'Module 1: Load a terrain_pack.v1 atlas and browse tiles by layer, boundary pair, and MS case. Click a tile to see its metadata.' } },
  },
  render: function TileInspectorLayout() {
    const [file, setFile] = useState<FileSourceBarFile | null>(null)
    const [selectedTile, setSelectedTile] = useState<string | null>('grass_water_ms3_cliff-face')
    const [filterPair, setFilterPair] = useState('all')

    return (
      <TooltipProvider>
        <div style={{ height: 700, display: 'flex', flexDirection: 'column', fontFamily: 'var(--forge-font-sans)' }}>
          {/* Top bar */}
          <ModuleToolbar badge="TI" title="Tile Inspector">
            <FileSourceBar
              file={file}
              onLoad={() => setFile({ name: 'terrain_pack.v1.png', size: 2097152, type: 'image/png' })}
              onClear={() => { setFile(null); setSelectedTile(null) }}
              accept=".png + .json"
              label="Terrain Pack"
            />
          </ModuleToolbar>

          {/* Main content */}
          <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
            <ResizablePanelGroup direction="horizontal">
              {/* Left: Tile grid */}
              <ResizablePanel defaultSize={65} minSize={40}>
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  {/* Filter bar */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 'var(--forge-space-2)',
                    padding: 'var(--forge-space-2) var(--forge-space-3)',
                    borderBottom: '1px solid var(--forge-border)',
                    backgroundColor: 'var(--forge-surface)',
                  }}>
                    <Text size="xs" color="muted">Filter:</Text>
                    <Select
                      value={filterPair}
                      onValueChange={setFilterPair}
                      options={[
                        { label: 'All Pairs', value: 'all' },
                        { label: 'grass → water', value: 'grass_water' },
                        { label: 'grass → stone', value: 'grass_stone' },
                        { label: 'stone → sand', value: 'stone_sand' },
                      ]}
                    />
                    <Separator orientation="vertical" style={{ height: 20 }} />
                    <Group gap={1}>
                      <Badge>Terrain: 6</Badge>
                      <Badge variant="outline">Transitions: 84</Badge>
                      <Badge variant="outline">Effects: 168</Badge>
                    </Group>
                  </div>

                  {/* Tile grid */}
                  <ScrollArea style={{ flex: 1 }}>
                    <div style={{ padding: 'var(--forge-space-4)' }}>
                      <Text size="xs" color="muted" style={{ marginBottom: 'var(--forge-space-2)', display: 'block' }}>
                        TRANSITIONS — grass → water (14 cases × 3 effects)
                      </Text>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--forge-space-2)' }}>
                        {Array.from({ length: 14 }, (_, i) => (
                          <div key={i} role="button" tabIndex={0} onClick={() => setSelectedTile(`grass_water_ms${i}_transition`)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedTile(`grass_water_ms${i}_transition`) }} style={{ cursor: 'pointer' }}>
                            <TilePlaceholder id={`ms${i}`} color={selectedTile?.includes(`ms${i}`) ? 'accent' : 'info'} />
                          </div>
                        ))}
                      </div>

                      <Text size="xs" color="muted" style={{ marginTop: 'var(--forge-space-4)', marginBottom: 'var(--forge-space-2)', display: 'block' }}>
                        EFFECTS — cliff-face
                      </Text>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--forge-space-2)' }}>
                        {Array.from({ length: 14 }, (_, i) => (
                          <div key={i} role="button" tabIndex={0} onClick={() => setSelectedTile(`grass_water_ms${i}_cliff-face`)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedTile(`grass_water_ms${i}_cliff-face`) }}>
                            <TilePlaceholder id={`ms${i}`} color={i === 5 || i === 10 ? 'danger' : 'success'} />
                          </div>
                        ))}
                      </div>
                      <div style={{ marginTop: 'var(--forge-space-1)' }}>
                        <Text size="xs" style={{ color: 'var(--forge-danger)' }}>⚠ 2 missing effect tiles (ms5, ms10)</Text>
                      </div>
                    </div>
                  </ScrollArea>
                </div>
              </ResizablePanel>

              {/* Right: Tile detail */}
              <ResizablePanel defaultSize={35} minSize={25}>
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--forge-surface)' }}>
                  <div style={{ padding: 'var(--forge-space-3)', borderBottom: '1px solid var(--forge-border)' }}>
                    <Text size="sm" weight="semibold">Tile Detail</Text>
                  </div>

                  {selectedTile ? (
                    <ScrollArea style={{ flex: 1 }}>
                      <div style={{ padding: 'var(--forge-space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--forge-space-4)' }}>
                        {/* Enlarged tile preview */}
                        <div style={{
                          width: 192, height: 192, alignSelf: 'center',
                          backgroundColor: 'color-mix(in srgb, var(--forge-accent) 12%, var(--forge-surface-sunken))',
                          border: '1px solid var(--forge-border)',
                          borderRadius: 'var(--forge-radius-lg)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'var(--forge-text-disabled)', fontSize: 48,
                        }}>
                          🖼
                        </div>

                        {/* Metadata */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '4px 12px', fontSize: 'var(--forge-font-size-xs)' }}>
                          <Text size="xs" color="muted">Tile ID</Text>
                          <Text size="xs" style={{ fontFamily: 'var(--forge-font-mono)' }}>{selectedTile}</Text>
                          <Text size="xs" color="muted">Case</Text>
                          <Text size="xs">MS-3 (UL·UR)</Text>
                          <Text size="xs" color="muted">Pair</Text>
                          <Text size="xs">grass → water</Text>
                          <Text size="xs" color="muted">Effect</Text>
                          <Badge variant="outline">cliff-face</Badge>
                          <Text size="xs" color="muted">Layer</Text>
                          <Text size="xs">effects (order: 2)</Text>
                          <Text size="xs" color="muted">Atlas</Text>
                          <Text size="xs" style={{ fontFamily: 'var(--forge-font-mono)' }}>(0, 0) 64×64</Text>
                        </div>

                        <Separator />

                        {/* Corner bit diagram */}
                        <div>
                          <Text size="xs" color="muted" style={{ marginBottom: 'var(--forge-space-2)', display: 'block' }}>Corner Bits (MS-3)</Text>
                          <div style={{
                            display: 'grid', gridTemplateColumns: '1fr 1fr',
                            width: 80, height: 80, gap: 2,
                          }}>
                            {['A', 'A', 'B', 'B'].map((m, i) => (
                              <div key={i} style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                backgroundColor: m === 'A'
                                  ? 'color-mix(in srgb, var(--forge-success) 20%, var(--forge-surface))'
                                  : 'color-mix(in srgb, var(--forge-info) 20%, var(--forge-surface))',
                                borderRadius: 'var(--forge-radius-sm)',
                                fontSize: 'var(--forge-font-size-xs)',
                                color: m === 'A' ? 'var(--forge-success)' : 'var(--forge-info)',
                                fontWeight: 600,
                              }}>
                                {m}
                              </div>
                            ))}
                          </div>
                        </div>

                        <Separator />

                        {/* Effect params */}
                        <JsonViewer
                          data={{ type: 'cliff-face', height: 12, darkness: 0.6, direction: 'south' }}
                          defaultExpandDepth={Infinity}
                          showCopy={false}
                        />
                      </div>
                    </ScrollArea>
                  ) : (
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--forge-text-disabled)' }}>
                      <Text size="sm">Select a tile to inspect</Text>
                    </div>
                  )}
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </div>
      </TooltipProvider>
    )
  },
}

// ===========================================================================
// Module 3: Effect Workbench
// ===========================================================================

export const EffectWorkbench: Story = {
  name: '3 — Effect Workbench',
  parameters: {
    docs: { description: { story: 'Module 3: Tune effect parameters with instant visual feedback. Sliders drive real-time re-renders of SDF masks and effect overlays.' } },
  },
  render: function EffectWorkbenchLayout() {
    const [height, setHeight] = useState([12])
    const [darkness, setDarkness] = useState([60])
    const [depth, setDepth] = useState([32])
    const [alpha, setAlpha] = useState([40])
    const [outlineWidth, setOutlineWidth] = useState([2])
    const [splitView, setSplitView] = useState('composite')

    return (
      <div style={{ height: 700, display: 'flex', flexDirection: 'column', fontFamily: 'var(--forge-font-sans)' }}>
        <ModuleToolbar badge="EW" title="Effect Workbench"
          actions={
            <Group gap={1}>
              <Button variant="outline" size="sm">Export Recipe Fragment</Button>
            </Group>
          }
        >
          <Select
            value="grass_water"
            onValueChange={() => {}}
            options={[
              { label: 'grass → water', value: 'grass_water' },
              { label: 'grass → stone', value: 'grass_stone' },
            ]}
          />
          <Separator orientation="vertical" style={{ height: 20 }} />
          <Text size="xs" color="muted">Case:</Text>
          <Select
            value="ms3"
            onValueChange={() => {}}
            options={Array.from({ length: 14 }, (_, i) => ({ label: `MS-${i}`, value: `ms${i}` }))}
          />
        </ModuleToolbar>

        <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
          <ResizablePanelGroup direction="horizontal">
            {/* Left: Parameter controls */}
            <ResizablePanel defaultSize={28} minSize={22} maxSize={40}>
              <ScrollArea style={{ height: '100%' }}>
                <div style={{ padding: 'var(--forge-space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--forge-space-5)' }}>
                  {/* Elevation */}
                  <div>
                    <Text size="xs" color="muted" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--forge-space-2)', display: 'block' }}>
                      Elevation
                    </Text>
                    <Group gap={1}>
                      <Button size="sm" variant="solid">B Higher ↑</Button>
                      <Button size="sm" variant="outline">A Higher ↑</Button>
                    </Group>
                  </div>

                  <Separator />

                  {/* Cliff-face */}
                  <Stack gap={3}>
                    <Flex align="center" justify="between">
                      <Text size="xs" weight="semibold">Cliff Face</Text>
                      <Badge variant="outline">cliff-face</Badge>
                    </Flex>
                    <Stack gap={2}>
                      <Flex align="center" justify="between">
                        <Text size="xs" color="muted">Height</Text>
                        <Text size="xs" style={{ fontFamily: 'var(--forge-font-mono)' }}>{height[0]}px</Text>
                      </Flex>
                      <Slider min={1} max={32} step={1} value={height} onValueChange={setHeight} />
                    </Stack>
                    <Stack gap={2}>
                      <Flex align="center" justify="between">
                        <Text size="xs" color="muted">Darkness</Text>
                        <Text size="xs" style={{ fontFamily: 'var(--forge-font-mono)' }}>{(darkness[0] / 100).toFixed(2)}</Text>
                      </Flex>
                      <Slider min={0} max={100} step={1} value={darkness} onValueChange={setDarkness} />
                    </Stack>
                  </Stack>

                  <Separator />

                  {/* Cliff-shadow */}
                  <Stack gap={3}>
                    <Flex align="center" justify="between">
                      <Text size="xs" weight="semibold">Cliff Shadow</Text>
                      <Badge variant="outline">cliff-shadow</Badge>
                    </Flex>
                    <Stack gap={2}>
                      <Flex align="center" justify="between">
                        <Text size="xs" color="muted">Depth</Text>
                        <Text size="xs" style={{ fontFamily: 'var(--forge-font-mono)' }}>{depth[0]}px</Text>
                      </Flex>
                      <Slider min={1} max={64} step={1} value={depth} onValueChange={setDepth} />
                    </Stack>
                    <Stack gap={2}>
                      <Flex align="center" justify="between">
                        <Text size="xs" color="muted">Alpha</Text>
                        <Text size="xs" style={{ fontFamily: 'var(--forge-font-mono)' }}>{(alpha[0] / 100).toFixed(2)}</Text>
                      </Flex>
                      <Slider min={0} max={100} step={1} value={alpha} onValueChange={setAlpha} />
                    </Stack>
                  </Stack>

                  <Separator />

                  {/* Outline */}
                  <Stack gap={3}>
                    <Flex align="center" justify="between">
                      <Text size="xs" weight="semibold">Outline</Text>
                      <Badge variant="outline">outline</Badge>
                    </Flex>
                    <Stack gap={2}>
                      <Flex align="center" justify="between">
                        <Text size="xs" color="muted">Width</Text>
                        <Text size="xs" style={{ fontFamily: 'var(--forge-font-mono)' }}>{outlineWidth[0]}px</Text>
                      </Flex>
                      <Slider min={1} max={5} step={1} value={outlineWidth} onValueChange={setOutlineWidth} />
                    </Stack>
                    <Select
                      value="darken"
                      onValueChange={() => {}}
                      options={[
                        { label: 'Darken', value: 'darken' },
                        { label: 'Black', value: 'black' },
                        { label: 'None', value: 'none' },
                      ]}
                    />
                  </Stack>

                  <Separator />

                  {/* Direction filter */}
                  <div>
                    <Text size="xs" color="muted" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--forge-space-2)', display: 'block' }}>
                      Direction Filter
                    </Text>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4 }}>
                      {['ms0', 'ms1', 'ms2', 'ms3', 'ms4', 'ms5', 'ms6', 'ms7',
                        'ms8', 'ms9', 'ms10', 'ms11', 'ms12', 'ms13'].map((c, i) => (
                        <div key={c} style={{
                          padding: '4px', textAlign: 'center',
                          fontSize: 'var(--forge-font-size-xs)',
                          fontFamily: 'var(--forge-font-mono)',
                          backgroundColor: [1, 3, 5, 7, 9, 11, 13].includes(i)
                            ? 'color-mix(in srgb, var(--forge-success) 15%, var(--forge-surface))'
                            : 'color-mix(in srgb, var(--forge-danger) 10%, var(--forge-surface))',
                          color: [1, 3, 5, 7, 9, 11, 13].includes(i) ? 'var(--forge-success)' : 'var(--forge-danger)',
                          borderRadius: 'var(--forge-radius-sm)',
                        }}>
                          {i}
                        </div>
                      ))}
                    </div>
                    <Text size="xs" color="muted" style={{ marginTop: 'var(--forge-space-1)', display: 'block' }}>
                      ✓ 7 included · ✗ 7 excluded (south-east)
                    </Text>
                  </div>
                </div>
              </ScrollArea>
            </ResizablePanel>

            {/* Center: Canvas previews */}
            <ResizablePanel defaultSize={50} minSize={30}>
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* View mode tabs */}
                <Tabs
                  value={splitView}
                  onValueChange={setSplitView}
                  items={[
                    { value: 'composite', label: 'Composite', content: null },
                    { value: 'mask', label: 'SDF Mask', content: null },
                    { value: 'effect', label: 'Effect Only', content: null },
                    { value: 'split', label: 'Split View', content: null },
                  ]}
                />
                <div style={{ flex: 1, padding: 'var(--forge-space-4)', display: 'flex', gap: 'var(--forge-space-3)' }}>
                  {splitView === 'split' ? (
                    <>
                      <PlaceholderCanvas label="SDF Mask" />
                      <PlaceholderCanvas label="Effect Overlay" />
                      <PlaceholderCanvas label="Composite" />
                    </>
                  ) : (
                    <PlaceholderCanvas label={splitView === 'mask' ? 'SDF Mask (blue → red gradient)' : splitView === 'effect' ? 'Effect Overlay (alpha channel)' : 'Fill + Mask + Effect'} />
                  )}
                </div>
              </div>
            </ResizablePanel>

            {/* Right: Export preview */}
            <ResizablePanel defaultSize={22} minSize={18}>
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: 'var(--forge-space-3)', borderBottom: '1px solid var(--forge-border)' }}>
                  <Text size="sm" weight="semibold">Recipe Fragment</Text>
                </div>
                <ScrollArea style={{ flex: 1 }}>
                  <div style={{ padding: 'var(--forge-space-3)' }}>
                    <CodeBlock
                      language="json"
                      code={JSON.stringify({
                        effects: {
                          outline: { width: outlineWidth[0], mode: 'darken' },
                          'cliff-face': { height: height[0], darkness: darkness[0] / 100 },
                          'cliff-shadow': { depth: depth[0], alpha: alpha[0] / 100 },
                        },
                      }, null, 2)}
                    />
                  </div>
                </ScrollArea>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    )
  },
}

// ===========================================================================
// Module 2: Map Painter
// ===========================================================================

export const MapPainter: Story = {
  name: '2 — Map Painter',
  parameters: {
    docs: { description: { story: 'Module 2: Paint materials onto a grid and see the resolved tile map update live with marching-squares classification.' } },
  },
  render: function MapPainterLayout() {
    const [activeMaterial, setActiveMaterial] = useState('grass')
    const materials = ['grass', 'water', 'stone', 'sand']
    const materialColors: Record<string, string> = { grass: 'success', water: 'info', stone: 'warning', sand: 'accent' }

    return (
      <div style={{ height: 700, display: 'flex', flexDirection: 'column', fontFamily: 'var(--forge-font-sans)' }}>
        <ModuleToolbar badge="MP" title="Map Painter"
          actions={
            <Group gap={1}>
              <Text size="xs" color="muted">Grid:</Text>
              <Select
                value="16"
                onValueChange={() => {}}
                options={[
                  { label: '8×8', value: '8' },
                  { label: '16×16', value: '16' },
                  { label: '32×32', value: '32' },
                ]}
              />
              <Separator orientation="vertical" style={{ height: 20 }} />
              <Button variant="outline" size="sm">Clear</Button>
            </Group>
          }
        >
          <FileSourceBar
            file={{ name: 'terrain_pack.v1.png', size: 2097152, type: 'image/png' }}
            onLoad={() => {}}
            onClear={() => {}}
            label="Terrain Pack"
          />
        </ModuleToolbar>

        <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
          <ResizablePanelGroup direction="horizontal">
            {/* Left: Material palette + layers */}
            <ResizablePanel defaultSize={20} minSize={16} maxSize={30}>
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Material palette */}
                <div style={{ padding: 'var(--forge-space-3)', borderBottom: '1px solid var(--forge-border)' }}>
                  <Text size="xs" color="muted" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--forge-space-2)', display: 'block' }}>
                    Material Palette
                  </Text>
                  <Stack gap={1}>
                    {materials.map(m => (
                      <div
                        key={m}
                        role="button"
                        tabIndex={0}
                        onClick={() => setActiveMaterial(m)}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setActiveMaterial(m) }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 'var(--forge-space-2)',
                          padding: 'var(--forge-space-1) var(--forge-space-2)',
                          borderRadius: 'var(--forge-radius-md)',
                          cursor: 'pointer',
                          backgroundColor: activeMaterial === m ? 'var(--forge-surface-hover)' : 'transparent',
                          border: activeMaterial === m ? '1px solid var(--forge-accent)' : '1px solid transparent',
                        }}
                      >
                        <div style={{
                          width: 20, height: 20,
                          borderRadius: 'var(--forge-radius-sm)',
                          backgroundColor: `var(--forge-${materialColors[m]})`,
                          opacity: 0.6,
                        }} />
                        <Text size="sm" style={{ textTransform: 'capitalize' }}>{m}</Text>
                      </div>
                    ))}
                  </Stack>
                </div>

                <Separator />

                {/* Layer toggles */}
                <div style={{ padding: 'var(--forge-space-3)' }}>
                  <Text size="xs" color="muted" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--forge-space-2)', display: 'block' }}>
                    Layers
                  </Text>
                  <Stack gap={1}>
                    {['Terrain Fills', 'Transitions', 'Outline', 'Cliff Face', 'Cliff Shadow'].map((layer) => (
                      <Flex key={layer} align="center" gap={2} style={{ padding: '2px 0' }}>
                        <input type="checkbox" defaultChecked style={{ accentColor: 'var(--forge-accent)' }} />
                        <Text size="xs">{layer}</Text>
                      </Flex>
                    ))}
                  </Stack>
                </div>

                <Separator />

                {/* Tools */}
                <div style={{ padding: 'var(--forge-space-3)' }}>
                  <Text size="xs" color="muted" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--forge-space-2)', display: 'block' }}>
                    Tool
                  </Text>
                  <Group gap={1}>
                    <Button size="sm" variant="solid">🖌 Paint</Button>
                    <Button size="sm" variant="outline">🔍 Inspect</Button>
                  </Group>
                </div>
              </div>
            </ResizablePanel>

            {/* Center: Grid canvas */}
            <ResizablePanel defaultSize={60} minSize={40}>
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--forge-space-4)' }}>
                <PlaceholderCanvas label="16×16 Tile Grid — click to paint materials, MS classification updates live" />
              </div>
            </ResizablePanel>

            {/* Right: Cell inspector */}
            <ResizablePanel defaultSize={20} minSize={16}>
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--forge-surface)' }}>
                <div style={{ padding: 'var(--forge-space-3)', borderBottom: '1px solid var(--forge-border)' }}>
                  <Text size="sm" weight="semibold">Cell Inspector</Text>
                </div>
                <div style={{ padding: 'var(--forge-space-3)', display: 'flex', flexDirection: 'column', gap: 'var(--forge-space-2)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '4px 12px', fontSize: 'var(--forge-font-size-xs)' }}>
                    <Text size="xs" color="muted">Cell</Text>
                    <Text size="xs" style={{ fontFamily: 'var(--forge-font-mono)' }}>(4, 7)</Text>
                    <Text size="xs" color="muted">Material</Text>
                    <Text size="xs">grass</Text>
                    <Text size="xs" color="muted">MS Case</Text>
                    <Text size="xs">MS-6 (border)</Text>
                    <Text size="xs" color="muted">Tile ID</Text>
                    <Text size="xs" style={{ fontFamily: 'var(--forge-font-mono)', wordBreak: 'break-all' }}>grass_water_ms6</Text>
                  </div>

                  <Separator />

                  <Text size="xs" color="muted" style={{ display: 'block' }}>Layers at this cell:</Text>
                  <Stack gap={1}>
                    {['terrain: grass', 'transition: grass_water_ms6', 'outline: grass_water_ms6_outline', 'cliff-face: grass_water_ms6_cliff-face'].map(l => (
                      <Text key={l} size="xs" style={{ fontFamily: 'var(--forge-font-mono)', color: 'var(--forge-text-muted)' }}>
                        {l}
                      </Text>
                    ))}
                  </Stack>
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    )
  },
}

// ===========================================================================
// Module 4: Fill Inspector
// ===========================================================================

export const FillInspector: Story = {
  name: '4 — Fill Inspector',
  parameters: {
    docs: { description: { story: 'Module 4: Preview and debug fill texture tiling quality with seam heat maps and RMSE scoring.' } },
  },
  render: function FillInspectorLayout() {
    const [file, setFile] = useState<FileSourceBarFile | null>(null)

    return (
      <div style={{ height: 700, display: 'flex', flexDirection: 'column', fontFamily: 'var(--forge-font-sans)' }}>
        <ModuleToolbar badge="FI" title="Fill Inspector">
          <FileSourceBar
            file={file}
            onLoad={() => setFile({ name: 'grass-painterly.png', size: 65536, type: 'image/png' })}
            onClear={() => setFile(null)}
            accept=".png"
            label="Fill Texture"
          />
        </ModuleToolbar>

        <div style={{ flex: 1, minHeight: 0 }}>
          <ResizablePanelGroup direction="horizontal">
            {/* Left: Tiling preview */}
            <ResizablePanel defaultSize={55} minSize={40}>
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 'var(--forge-space-2)',
                  padding: 'var(--forge-space-2) var(--forge-space-3)',
                  borderBottom: '1px solid var(--forge-border)',
                }}>
                  <Text size="xs" color="muted">Grid:</Text>
                  <Select
                    value="4"
                    onValueChange={() => {}}
                    options={[
                      { label: '3×3', value: '3' },
                      { label: '4×4', value: '4' },
                      { label: '6×6', value: '6' },
                    ]}
                  />
                  <Separator orientation="vertical" style={{ height: 20 }} />
                  <Group gap={1}>
                    <Button size="sm" variant="outline">Seam Lines</Button>
                    <Button size="sm" variant="solid">Heat Map</Button>
                  </Group>
                </div>
                <div style={{ flex: 1, padding: 'var(--forge-space-4)' }}>
                  <PlaceholderCanvas label="4×4 Tiling Grid — seam heat map overlay showing boundary pixel differences" />
                </div>
              </div>
            </ResizablePanel>

            {/* Right: Quality metrics + comparison */}
            <ResizablePanel defaultSize={45} minSize={30}>
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Tabs
                  defaultValue="metrics"
                  items={[
                    {
                      value: 'metrics',
                      label: 'Quality Metrics',
                      content: (
                        <Stack gap={4} style={{ padding: 'var(--forge-space-4)' }}>
                          {/* RMSE score card */}
                          <Card>
                            <Card.Body>
                              <Flex align="center" justify="between">
                                <Stack gap={1}>
                                  <Text size="xs" color="muted">Boundary RMSE</Text>
                                  <Text size="2xl" weight="bold" style={{ color: 'var(--forge-success)' }}>4.2</Text>
                                </Stack>
                                <Badge color="success">PASS</Badge>
                              </Flex>
                              <Text size="xs" color="muted" style={{ marginTop: 'var(--forge-space-2)', display: 'block' }}>
                                Threshold: &lt;8.0 for painterly style
                              </Text>
                            </Card.Body>
                          </Card>

                          {/* Stats grid */}
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--forge-space-2)' }}>
                            <Card>
                              <Card.Body>
                                <Text size="xs" color="muted">Dimensions</Text>
                                <Text size="sm" weight="semibold">256×256</Text>
                              </Card.Body>
                            </Card>
                            <Card>
                              <Card.Body>
                                <Text size="xs" color="muted">Tile Size</Text>
                                <Text size="sm" weight="semibold">64px</Text>
                              </Card.Body>
                            </Card>
                            <Card>
                              <Card.Body>
                                <Text size="xs" color="muted">Variants</Text>
                                <Text size="sm" weight="semibold">4×4 grid</Text>
                              </Card.Body>
                            </Card>
                            <Card>
                              <Card.Body>
                                <Text size="xs" color="muted">Anti-Alias</Text>
                                <Text size="sm" weight="semibold">true</Text>
                              </Card.Body>
                            </Card>
                          </div>

                          <Separator />

                          <div>
                            <Text size="xs" color="muted" style={{ display: 'block', marginBottom: 'var(--forge-space-1)' }}>
                              Style Recommendation
                            </Text>
                            <Text size="xs">
                              Painterly at 64px with antiAlias=true. RMSE 4.2 is well within threshold.
                              Noise amplitude 3–5 recommended for transition masking.
                            </Text>
                          </div>
                        </Stack>
                      ),
                    },
                    {
                      value: 'compare',
                      label: 'Compare',
                      content: (
                        <div style={{ padding: 'var(--forge-space-4)' }}>
                          <DropZone
                            accept={['.png']}
                            multiple
                            onDrop={() => {}}
                          >
                            <Stack gap={2} style={{ alignItems: 'center' }}>
                              <Text size="sm">Drop fill candidates to compare</Text>
                              <Text size="xs" color="muted">Side-by-side tiling + RMSE comparison</Text>
                            </Stack>
                          </DropZone>
                        </div>
                      ),
                    },
                    {
                      value: 'variants',
                      label: 'Variants',
                      content: (
                        <div style={{ padding: 'var(--forge-space-4)' }}>
                          <PlaceholderCanvas label="Variant grid extraction — shows each 64×64 variant individually with RMSE continuity scores" />
                        </div>
                      ),
                    },
                  ]}
                />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    )
  },
}

// ===========================================================================
// Module 5: End-to-End Preview
// ===========================================================================

export const EndToEndPreview: Story = {
  name: '5 — End-to-End Preview',
  parameters: {
    docs: { description: { story: 'Module 5: Full pipeline in one view — edit recipe, compose, resolve, render, and diff. Uses CLI Bridge for backend computation.' } },
  },
  render: function EndToEndLayout() {
    const [composeStatus, setComposeStatus] = useState<'idle' | 'running' | 'done'>('done')

    return (
      <div style={{ height: 700, display: 'flex', flexDirection: 'column', fontFamily: 'var(--forge-font-sans)' }}>
        <ModuleToolbar badge="E2E" title="End-to-End Preview"
          actions={
            <Group gap={2}>
              <Button variant="outline" size="sm"
                onClick={() => { setComposeStatus('running'); setTimeout(() => setComposeStatus('done'), 1500) }}
                disabled={composeStatus === 'running'}
              >
                {composeStatus === 'running' ? '⏳ Composing…' : '🔨 Compose'}
              </Button>
              <Button variant="outline" size="sm">🗺 Resolve</Button>
              <Separator orientation="vertical" style={{ height: 20 }} />
              <Button variant="outline" size="sm">📸 Screenshot</Button>
            </Group>
          }
        />

        <div style={{ flex: 1, minHeight: 0 }}>
          <ResizablePanelGroup direction="horizontal">
            {/* Left: Recipe editor */}
            <ResizablePanel defaultSize={30} minSize={20}>
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 'var(--forge-space-2)',
                  padding: 'var(--forge-space-2) var(--forge-space-3)',
                  borderBottom: '1px solid var(--forge-border)',
                }}>
                  <FileSourceBar
                    file={{ name: 'recipe.json', size: 2048, type: 'application/json' }}
                    onLoad={() => {}}
                    onClear={() => {}}
                    label="Recipe"
                  />
                </div>
                <ScrollArea style={{ flex: 1 }}>
                  <div style={{ padding: 'var(--forge-space-2)' }}>
                    <CodeBlock
                      code={MOCK_RECIPE_JSON}
                      language="json"
                      showLineNumbers
                    />
                  </div>
                </ScrollArea>
              </div>
            </ResizablePanel>

            {/* Center: Rendered output */}
            <ResizablePanel defaultSize={45} minSize={30}>
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Tabs
                  defaultValue="render"
                  items={[
                    {
                      value: 'render',
                      label: 'Rendered Map',
                      content: (
                        <div style={{ flex: 1, padding: 'var(--forge-space-4)', display: 'flex', flexDirection: 'column' }}>
                          <PlaceholderCanvas label="Resolved map — all layers composited (terrain + transitions + effects)" />
                        </div>
                      ),
                    },
                    {
                      value: 'diff',
                      label: 'Diff View',
                      content: (
                        <div style={{ flex: 1, padding: 'var(--forge-space-4)', display: 'flex', gap: 'var(--forge-space-3)' }}>
                          <PlaceholderCanvas label="Before (previous compose)" />
                          <PlaceholderCanvas label="After (current compose)" />
                        </div>
                      ),
                    },
                    {
                      value: 'layers',
                      label: 'Layers',
                      content: (
                        <div style={{ flex: 1, padding: 'var(--forge-space-4)' }}>
                          <Stack gap={2}>
                            {['Terrain Fills', 'Transitions', 'Outline Effects', 'Cliff-Face', 'Cliff-Shadow'].map(layer => (
                              <Flex key={layer} align="center" gap={2}>
                                <input type="checkbox" defaultChecked style={{ accentColor: 'var(--forge-accent)' }} />
                                <Text size="sm">{layer}</Text>
                              </Flex>
                            ))}
                          </Stack>
                          <div style={{ flex: 1, marginTop: 'var(--forge-space-3)' }}>
                            <PlaceholderCanvas label="Layer-filtered render" />
                          </div>
                        </div>
                      ),
                    },
                  ]}
                />
              </div>
            </ResizablePanel>

            {/* Right: Manifest / output metadata */}
            <ResizablePanel defaultSize={25} minSize={18}>
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Tabs
                  defaultValue="manifest"
                  items={[
                    {
                      value: 'manifest',
                      label: 'Manifest',
                      content: (
                        <ScrollArea style={{ flex: 1 }}>
                          <div style={{ padding: 'var(--forge-space-3)' }}>
                            <JsonViewer data={MOCK_MANIFEST} defaultExpandDepth={2} searchable />
                          </div>
                        </ScrollArea>
                      ),
                    },
                    {
                      value: 'logs',
                      label: 'CLI Output',
                      content: (
                        <ScrollArea style={{ flex: 1 }}>
                          <div style={{ padding: 'var(--forge-space-3)' }}>
                            <CodeBlock
                              language="text"
                              showCopy={false}
                              code={`[forge-tileset] compose v2.1.0
[INFO]  Loading recipe: recipe.json
[INFO]  Loading 3 fill textures…
[OK]    grass-painterly.png (256×256, RMSE 4.2 ✓)
[OK]    water-painterly.png (256×256, RMSE 3.8 ✓)
[OK]    stone-painterly.png (256×256, RMSE 5.1 ✓)
[INFO]  Composing 1 boundary pair × 14 MS cases…
[INFO]  Rendering 3 effect types…
[OK]    Atlas: 1024×2048 (258 tiles)
[OK]    Manifest: terrain_pack.v1.json
[DONE]  Composed in 2.4s`}
                            />
                          </div>
                        </ScrollArea>
                      ),
                    },
                  ]}
                />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    )
  },
}
