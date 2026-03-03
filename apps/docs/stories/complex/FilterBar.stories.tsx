import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { FilterBar } from '@forgeui/components'
import type { FilterDefinition, FilterState } from '@forgeui/components'

const meta: Meta<typeof FilterBar> = {
  title: 'Complex/FilterBar',
  component: FilterBar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Chip-based filter bar with multi-select, single-select, and boolean filters.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof FilterBar>

const FILTERS: FilterDefinition[] = [
  {
    id: 'type',
    label: 'Entity Type',
    type: 'multi-select',
    options: [
      { value: 'character', label: 'Character', count: 24 },
      { value: 'location', label: 'Location', count: 18 },
      { value: 'event', label: 'Event', count: 12 },
      { value: 'item', label: 'Item', count: 8 },
      { value: 'faction', label: 'Faction', count: 6 },
    ],
  },
  {
    id: 'canon',
    label: 'Canon State',
    type: 'single-select',
    options: [
      { value: 'canon', label: 'Canon' },
      { value: 'draft', label: 'Draft' },
      { value: 'proposed', label: 'Proposed' },
      { value: 'deprecated', label: 'Deprecated' },
    ],
  },
  { id: 'public', label: 'Public Only', type: 'boolean' },
]

export const Default: Story = {
  render: function FilterBarDemo() {
    const [value, setValue] = useState<FilterState>({})
    return <FilterBar filters={FILTERS} value={value} onChange={setValue} />
  },
}

export const WithActiveFilters: Story = {
  name: 'With Active Filters',
  render: function FilterBarActive() {
    const [value, setValue] = useState<FilterState>({
      type: ['character', 'location'],
      canon: 'canon',
    })
    return <FilterBar filters={FILTERS} value={value} onChange={setValue} />
  },
}
