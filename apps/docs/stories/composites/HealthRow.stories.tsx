import type { Meta, StoryObj } from '@storybook/react'
import { HealthRow, Text } from '@forgeui/components'

const meta: Meta<typeof HealthRow> = {
  title: 'Composites/HealthRow',
  component: HealthRow,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'Status indicator row with colored dot, icon, name, and detail text. Use for service health, pipeline status, etc.' } },
  },
}
export default meta
type Story = StoryObj<typeof HealthRow>

export const Ok: Story = {
  args: {
    name: 'Asset Pipeline',
    status: 'ok',
    detail: 'Healthy · 4ms',
    icon: '🔧',
  },
}

export const Warning: Story = {
  args: {
    name: 'Build Server',
    status: 'warn',
    detail: 'High latency · 1.2s',
    icon: '🖥',
  },
}

export const Error: Story = {
  args: {
    name: 'Database',
    status: 'error',
    detail: 'Connection refused',
    icon: '🗄',
  },
}

export const Running: Story = {
  args: {
    name: 'Deployment',
    status: 'running',
    detail: 'In progress · 45%',
    icon: '🚀',
  },
}

export const ServiceDashboard: Story = {
  name: 'Service Dashboard',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxWidth: '400px' }}>
      <Text size="sm" style={{ fontWeight: 500, marginBottom: '8px' }}>Service Health</Text>
      <HealthRow name="Asset Pipeline" status="ok" detail="Healthy · 4ms" icon="🔧" />
      <HealthRow name="Build Server" status="ok" detail="Healthy · 12ms" icon="🖥" />
      <HealthRow name="Texture Compiler" status="running" detail="Processing batch 3/8" icon="🎨" />
      <HealthRow name="Shader Compiler" status="warn" detail="Queue depth: 47" icon="💠" />
      <HealthRow name="Hot Reload" status="error" detail="Socket disconnected" icon="🔄" />
      <HealthRow name="Version Control" status="ok" detail="Connected" icon="📦" />
    </div>
  ),
}
