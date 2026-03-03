import type { Meta, StoryObj } from '@storybook/react'
import { StatCard, Text } from '@forgeui/components'

const meta: Meta<typeof StatCard> = {
  title: 'Composites/StatCard',
  component: StatCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'KPI / metric card with label, value, delta indicator, icon, and color accent.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof StatCard>

export const Default: Story = {
  args: {
    label: 'Total Assets',
    value: '1,247',
    icon: '📦',
  },
}

export const WithPositiveDelta: Story = {
  name: 'Positive Delta',
  args: {
    label: 'Build Success',
    value: '98.2%',
    delta: '+2.4%',
    icon: '✅',
    color: 'success',
  },
}

export const WithNegativeDelta: Story = {
  name: 'Negative Delta',
  args: {
    label: 'Open Issues',
    value: '23',
    delta: '-5',
    icon: '🐛',
    color: 'danger',
  },
}

export const ColorVariants: Story = {
  name: 'Color Variants',
  render: () => (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      <StatCard label="Accent" value="42" icon="🎨" color="accent" />
      <StatCard label="Info" value="99" icon="ℹ️" color="info" />
      <StatCard label="Success" value="100%" icon="✅" color="success" />
      <StatCard label="Warning" value="3" icon="⚠️" color="warning" />
      <StatCard label="Danger" value="7" icon="🔴" color="danger" />
    </div>
  ),
}

export const Clickable: Story = {
  args: {
    label: 'Active Users',
    value: '512',
    icon: '👥',
    color: 'accent',
    onClick: () => alert('StatCard clicked!'),
  },
}

export const Dashboard: Story = {
  name: 'Dashboard Grid',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Text size="sm" style={{ fontWeight: 500 }}>
        Project Dashboard
      </Text>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px',
        }}
      >
        <StatCard label="Entities" value="2,847" delta="+124" icon="🗂" color="accent" />
        <StatCard label="Build Time" value="4.2s" delta="-0.8s" icon="⚡" color="success" />
        <StatCard label="Warnings" value="12" delta="+3" icon="⚠️" color="warning" />
        <StatCard label="Errors" value="0" icon="✅" color="success" />
        <StatCard label="Coverage" value="87%" delta="+2%" icon="📊" color="info" />
        <StatCard label="Bundle Size" value="1.4MB" delta="+0.1MB" icon="📦" color="danger" />
      </div>
    </div>
  ),
}
