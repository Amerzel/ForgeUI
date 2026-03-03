import type { Meta, StoryObj } from '@storybook/react'
import { Steps, Text } from '@forgeui/components'
import type { Step } from '@forgeui/components'

const meta: Meta = {
  title: 'Composites/Steps',
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj

const IMPORT_STEPS: Step[] = [
  { label: 'Select file', status: 'completed' },
  { label: 'Configure', status: 'completed' },
  { label: 'Map materials', status: 'active' },
  { label: 'Preview', status: 'pending' },
  { label: 'Import', status: 'pending' },
]

const FAILED_STEPS: Step[] = [
  { label: 'Parse', status: 'completed' },
  { label: 'Validate', status: 'error', description: 'Invalid vertex count' },
  { label: 'Build LODs', status: 'pending' },
  { label: 'Export', status: 'pending' },
]

export const Default: Story = {
  name: 'Steps',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '600px' }}>
      <div>
        <Text
          size="sm"
          style={{ color: 'var(--forge-text-muted)', marginBottom: '12px', display: 'block' }}
        >
          Asset import wizard
        </Text>
        <Steps steps={IMPORT_STEPS} />
      </div>
      <div>
        <Text
          size="sm"
          style={{ color: 'var(--forge-text-muted)', marginBottom: '12px', display: 'block' }}
        >
          Build pipeline — error state
        </Text>
        <Steps steps={FAILED_STEPS} />
      </div>
    </div>
  ),
}
