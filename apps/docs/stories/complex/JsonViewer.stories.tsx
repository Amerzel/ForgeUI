import type { Meta, StoryObj } from '@storybook/react'
import { JsonViewer } from '@forgeui/components'

const meta: Meta<typeof JsonViewer> = {
  title: 'Complex/JsonViewer',
  component: JsonViewer,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Interactive collapsible JSON viewer with search/filter and copy support.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof JsonViewer>

const GAME_DATA = {
  name: 'Ironclad Keep',
  version: '1.4.2',
  difficulty: 'hard',
  map: {
    width: 128,
    height: 128,
    biomes: ['forest', 'mountain', 'swamp'],
    spawnPoints: [
      { x: 10, y: 20, type: 'player' },
      { x: 64, y: 64, type: 'boss' },
    ],
  },
  rules: {
    maxPlayers: 4,
    pvpEnabled: true,
    respawnDelay: 30,
    lootTable: {
      common: 0.6,
      rare: 0.25,
      epic: 0.1,
      legendary: 0.05,
    },
  },
  active: true,
  createdAt: '2025-11-15T08:30:00Z',
}

export const Default: Story = {
  args: {
    data: GAME_DATA,
    defaultExpandDepth: 1,
  },
}

export const FullyExpanded: Story = {
  name: 'Fully Expanded',
  args: {
    data: GAME_DATA,
    defaultExpandDepth: Infinity,
  },
}

export const Collapsed: Story = {
  name: 'Collapsed',
  args: {
    data: GAME_DATA,
    defaultExpandDepth: 0,
  },
}

export const WithSearch: Story = {
  name: 'With Search',
  args: {
    data: GAME_DATA,
    defaultExpandDepth: Infinity,
    searchable: true,
  },
}

export const SimpleArray: Story = {
  name: 'Array Root',
  args: {
    data: ['warrior', 'mage', 'rogue', 'ranger', 'paladin'],
    defaultExpandDepth: 1,
  },
}

export const PrimitiveValue: Story = {
  name: 'Primitive Value',
  args: {
    data: 'Hello, Forge!',
    showCopy: false,
  },
}
