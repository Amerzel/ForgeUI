import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Alert } from '@forgeui/components'

const meta: Meta<typeof Alert> = {
  title: 'Feedback/Alert',
  component: Alert,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof Alert>

export const Variants: Story = {
  name: 'Alert — variants',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '480px' }}>
      <Alert variant="info" title="New version available">
        ForgeUI 0.2.0 is ready to install.
      </Alert>
      <Alert variant="success" title="Build succeeded">
        All 42 assets compiled in 1.2s.
      </Alert>
      <Alert variant="warning" title="Memory usage high">
        Asset streaming pool is at 87% capacity.
      </Alert>
      <Alert variant="danger" title="Shader compilation failed" live>
        Unexpected token at line 42 in diffuse.glsl.
      </Alert>
    </div>
  ),
}

export const Dismissible: Story = {
  name: 'Alert — dismissible',
  render: function AlertDismissDemo() {
    const [visible, setVisible] = useState(true)
    return visible ? (
      <Alert variant="info" title="Welcome to ForgeUI" onDismiss={() => setVisible(false)}>
        Use the toolbar above to switch palettes and modes.
      </Alert>
    ) : (
      <button
        onClick={() => setVisible(true)}
        style={{
          color: 'var(--forge-accent)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Show alert again
      </button>
    )
  },
}
