import type { Meta, StoryObj } from '@storybook/react'
import { useTokens } from '@forgeui/hooks'

// Simple component that shows the active theme tokens
function TokenDisplay() {
  const { tokens } = useTokens()
  return (
    <div
      style={{
        fontFamily: 'var(--forge-font-mono)',
        fontSize: '13px',
        display: 'grid',
        gap: '8px',
      }}
    >
      <div
        style={{
          color: 'var(--forge-text)',
          background: 'var(--forge-surface)',
          padding: '16px',
          borderRadius: 'var(--forge-radius-md)',
          border: '1px solid var(--forge-border)',
        }}
      >
        <strong>Active palette tokens</strong>
        <div style={{ marginTop: '8px', display: 'grid', gap: '4px' }}>
          {Object.entries(tokens).map(([key, value]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  background: value as string,
                  border: '1px solid var(--forge-border)',
                  borderRadius: '2px',
                  flexShrink: 0,
                }}
              />
              <span style={{ color: 'var(--forge-text-muted)' }}>{key}:</span>
              <span style={{ color: 'var(--forge-text)' }}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const meta: Meta = {
  title: 'System/ThemeProvider',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'ThemeProvider wraps the app and provides palette/mode switching. Use the toolbar above to switch themes.',
      },
    },
  },
}
export default meta

type Story = StoryObj

export const Default: Story = {
  name: 'Active Token Values',
  render: () => <TokenDisplay />,
}
