import type { Meta, StoryObj } from '@storybook/react'
import { ModuleToolbar, Button, Badge, Text } from '@forgeui/components'

const meta: Meta<typeof ModuleToolbar> = {
  title: 'Composites/ModuleToolbar',
  component: ModuleToolbar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Module header toolbar with badge, title, content slot, and actions slot.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof ModuleToolbar>

export const Default: Story = {
  args: {
    badge: 'EA',
    title: 'Entity Administration',
  },
}

export const WithActions: Story = {
  name: 'With Actions',
  args: {
    badge: 'QF',
    title: 'Query Forge',
    actions: (
      <div style={{ display: 'flex', gap: '4px' }}>
        <Button variant="ghost" size="sm">
          Export
        </Button>
        <Button variant="primary" size="sm">
          Run Query
        </Button>
      </div>
    ),
  },
}

export const WithChildren: Story = {
  name: 'With View Switcher',
  args: {
    badge: 'EC',
    title: 'Entity Catalog',
    children: (
      <div style={{ display: 'flex', gap: '4px' }}>
        <Button variant="ghost" size="sm">
          📋 List
        </Button>
        <Button variant="secondary" size="sm">
          🏗 Grid
        </Button>
        <Button variant="ghost" size="sm">
          🗂 Tree
        </Button>
      </div>
    ),
    actions: (
      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
        <Badge>2,847 entities</Badge>
        <Button variant="primary" size="sm">
          + New
        </Button>
      </div>
    ),
  },
}

export const ModuleHeaders: Story = {
  name: 'Module Header Examples',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <ModuleToolbar badge="DA" title="Dashboard" />
      <ModuleToolbar badge="VA" title="Validation" actions={<Badge>12 issues</Badge>} />
      <ModuleToolbar
        badge="CO"
        title="Coverage"
        children={
          <div style={{ display: 'flex', gap: '4px' }}>
            <Button variant="secondary" size="sm">
              Heatmap
            </Button>
            <Button variant="ghost" size="sm">
              Table
            </Button>
          </div>
        }
        actions={
          <Button variant="primary" size="sm">
            Run Analysis
          </Button>
        }
      />
    </div>
  ),
}
