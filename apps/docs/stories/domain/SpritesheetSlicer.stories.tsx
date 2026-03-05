import type { Meta, StoryObj } from '@storybook/react'
import { SpritesheetSlicer, Stack, Text, Badge } from '@forgeui/components'
import type { GridTemplate, SlicedTile } from '@forgeui/components'
import { useState, useRef } from 'react'

const meta: Meta = {
  title: 'Domain/SpritesheetSlicer',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Grid-based tileset import tool with template overlay, auto-slicing, and optional classification. Supports pan/zoom preview with adjustable offset and spacing.',
      },
    },
  },
}
export default meta
type Story = StoryObj

const TEMPLATES: GridTemplate[] = [
  { id: 'wang4', label: '4×4 Wang', cols: 4, rows: 4 },
  { id: 'blob47', label: '7×7 Blob-47', cols: 7, rows: 7 },
  { id: 'ms14', label: '4×4 MS-14', cols: 4, rows: 4 },
  { id: 'custom', label: '8×8 Custom', cols: 8, rows: 8 },
]

/** Creates a demo spritesheet canvas with colored cells */
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
      ctx.fillStyle = `hsl(${hue}, 50%, ${30 + Math.random() * 20}%)`
      ctx.fillRect(col * tileSize, r * tileSize, tileSize, tileSize)
      // Add subtle inner border
      ctx.strokeStyle = `hsl(${hue}, 40%, 50%)`
      ctx.lineWidth = 1
      ctx.strokeRect(col * tileSize + 2, r * tileSize + 2, tileSize - 4, tileSize - 4)
    }
  }
  return c
}

/**
 * Default slicer with a 4×4 Wang template.
 */
export const Default: Story = {
  render: function DefaultStory() {
    const [template, setTemplate] = useState('wang4')
    const sheet = useRef(makeSheet(4, 4, 32)).current

    return (
      <SpritesheetSlicer
        source={sheet}
        templates={TEMPLATES}
        selectedTemplate={template}
        onTemplateChange={setTemplate}
        width={400}
        height={300}
      />
    )
  },
}

/**
 * Interactive demo with slice output and classification.
 */
export const WithSlicing: Story = {
  render: function WithSlicingStory() {
    const [template, setTemplate] = useState('wang4')
    const [tiles, setTiles] = useState<SlicedTile[]>([])
    const sheet = useRef(makeSheet(4, 4, 32)).current

    function handleSlice(sliced: SlicedTile[]) {
      setTiles(sliced)
    }

    return (
      <Stack gap="md">
        <SpritesheetSlicer
          source={sheet}
          templates={TEMPLATES}
          selectedTemplate={template}
          onTemplateChange={setTemplate}
          onSlice={handleSlice}
          width={400}
          height={300}
        />
        {tiles.length > 0 && (
          <Stack gap="sm">
            <Text weight="semibold">{tiles.length} tiles sliced</Text>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {tiles.map((t) => (
                <Badge key={`${t.col}-${t.row}`} variant="outline">
                  ({t.col},{t.row})
                </Badge>
              ))}
            </div>
          </Stack>
        )}
      </Stack>
    )
  },
}

/**
 * No source loaded — shows placeholder state.
 */
export const EmptyState: Story = {
  render: function EmptyStateStory() {
    return <SpritesheetSlicer source={null} templates={TEMPLATES} width={400} height={300} />
  },
}

/**
 * 7×7 Blob template on a larger spritesheet.
 */
export const BlobTemplate: Story = {
  render: function BlobTemplateStory() {
    const [template, setTemplate] = useState('blob47')
    const sheet = useRef(makeSheet(7, 7, 32)).current

    return (
      <SpritesheetSlicer
        source={sheet}
        templates={TEMPLATES}
        selectedTemplate={template}
        onTemplateChange={setTemplate}
        width={500}
        height={400}
      />
    )
  },
}

/**
 * With classification callback that labels tiles by position.
 */
export const WithClassification: Story = {
  render: function WithClassificationStory() {
    const [template, setTemplate] = useState('wang4')
    const [tiles, setTiles] = useState<SlicedTile[]>([])
    const sheet = useRef(makeSheet(4, 4, 32)).current

    function classify(_img: ImageData, col: number, row: number) {
      const classes = ['fill', 'edge', 'corner', 'transition']
      return {
        class: classes[(col + row) % classes.length] as string,
        confidence: 0.7 + Math.random() * 0.3,
      }
    }

    return (
      <Stack gap="md">
        <SpritesheetSlicer
          source={sheet}
          templates={TEMPLATES}
          selectedTemplate={template}
          onTemplateChange={setTemplate}
          onSlice={setTiles}
          classify={classify}
          width={400}
          height={300}
        />
        {tiles.length > 0 && (
          <Stack gap="sm">
            <Text weight="semibold">Classified tiles</Text>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {tiles.map((t) => (
                <Badge key={`${t.col}-${t.row}`} variant="outline">
                  {t.autoClass} ({Math.round((t.confidence ?? 0) * 100)}%)
                </Badge>
              ))}
            </div>
          </Stack>
        )}
      </Stack>
    )
  },
}
