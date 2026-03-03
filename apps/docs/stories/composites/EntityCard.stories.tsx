import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { EntityCard } from '@forgeui/components'

const meta: Meta<typeof EntityCard> = {
  title: 'Composites/EntityCard',
  component: EntityCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Rich metadata card for entities in knowledge graphs, catalogs, and lists.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof EntityCard>

export const Default: Story = {
  args: {
    name: 'Gandalf the Grey',
    type: 'Character',
    typeIcon: '🧙',
    description: 'A wizard of the Istari order, sent to Middle-earth.',
  },
}

export const WithStatus: Story = {
  name: 'With Status Badge',
  args: {
    name: 'Mordor',
    type: 'Location',
    typeIcon: '🏔',
    status: 'Canon',
    statusColor: 'var(--forge-success)',
    description: 'The dark land ruled by Sauron.',
  },
}

export const WithTagsAndMeta: Story = {
  name: 'Tags & Metadata',
  args: {
    name: 'The One Ring',
    type: 'Item',
    typeIcon: '💍',
    status: 'Canon',
    statusColor: 'var(--forge-success)',
    description: 'The master ring forged by Sauron to control all other rings of power.',
    tags: ['artifact', 'evil', 'corrupting'],
    meta: [
      { label: 'Creator', value: 'Sauron' },
      { label: 'Location', value: 'Mount Doom' },
    ],
  },
}

export const EntityList: Story = {
  name: 'Entity List',
  render: function EntityListDemo() {
    const [selected, setSelected] = useState('1')
    const entities = [
      {
        id: '1',
        name: 'Gandalf',
        type: 'Character',
        typeIcon: '🧙',
        status: 'Canon',
        statusColor: 'var(--forge-success)',
        tags: ['wizard'],
      },
      {
        id: '2',
        name: 'Mordor',
        type: 'Location',
        typeIcon: '🏔',
        status: 'Canon',
        statusColor: 'var(--forge-success)',
        tags: ['evil'],
      },
      {
        id: '3',
        name: 'Frodo',
        type: 'Character',
        typeIcon: '🧑',
        status: 'Draft',
        statusColor: 'var(--forge-warning)',
        tags: ['hobbit'],
      },
      {
        id: '4',
        name: 'The Fellowship',
        type: 'Faction',
        typeIcon: '🤝',
        status: 'Draft',
        statusColor: 'var(--forge-warning)',
        tags: ['alliance'],
      },
    ]
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '320px' }}>
        {entities.map((e) => (
          <EntityCard
            key={e.id}
            name={e.name}
            type={e.type}
            typeIcon={e.typeIcon}
            status={e.status}
            statusColor={e.statusColor}
            tags={e.tags}
            selected={selected === e.id}
            onClick={() => setSelected(e.id)}
          />
        ))}
      </div>
    )
  },
}
