import type { Meta, StoryObj } from '@storybook/react'
import { NavItem, Text } from '@forgeui/components'

const meta: Meta<typeof NavItem> = {
  title: 'Composites/NavItem',
  component: NavItem,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Sidebar navigation button with icon, label, active state, and optional count badge.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof NavItem>

export const Default: Story = {
  args: {
    label: 'Dashboard',
    icon: '📊',
  },
}

export const Active: Story = {
  args: {
    label: 'Entities',
    icon: '🗂',
    active: true,
    count: 2847,
  },
}

export const WithCount: Story = {
  name: 'With Count Badge',
  args: {
    label: 'Validation',
    icon: '✅',
    count: 12,
  },
}

export const Disabled: Story = {
  args: {
    label: 'Deployment',
    icon: '🚀',
    disabled: true,
  },
}

export const Sidebar: Story = {
  name: 'Sidebar Navigation',
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        width: '220px',
        padding: '8px',
        backgroundColor: 'var(--forge-surface)',
        borderRadius: 'var(--forge-radius-md)',
      }}
    >
      <Text
        size="xs"
        style={{
          color: 'var(--forge-text-muted)',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          padding: '8px 12px 4px',
        }}
      >
        Workspace
      </Text>
      <NavItem label="Dashboard" icon="📊" active />
      <NavItem label="Entities" icon="🗂" count={2847} />
      <NavItem label="Validation" icon="✅" count={12} />
      <NavItem label="Coverage" icon="📈" />

      <Text
        size="xs"
        style={{
          color: 'var(--forge-text-muted)',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          padding: '12px 12px 4px',
        }}
      >
        Tools
      </Text>
      <NavItem label="Build" icon="🔨" />
      <NavItem label="Settings" icon="⚙️" />
      <NavItem label="Deployment" icon="🚀" disabled />
    </div>
  ),
}
