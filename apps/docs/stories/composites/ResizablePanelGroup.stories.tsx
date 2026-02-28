import type { Meta, StoryObj } from '@storybook/react'
import { ResizablePanelGroup, ResizablePanel, Text } from '@forgeui/components'

const meta: Meta = {
  title: 'Composites/ResizablePanelGroup',
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj

export const Default: Story = {
  name: 'ResizablePanelGroup',
  render: () => (
    <div style={{ height: '320px', border: '1px solid var(--forge-border)', borderRadius: 'var(--forge-radius-md)', overflow: 'hidden' }}>
      <ResizablePanelGroup direction="horizontal" storageKey="story-panels">
        <ResizablePanel defaultSize={200} minSize={120}>
          <div style={{ height: '100%', padding: '12px', backgroundColor: 'var(--forge-surface)' }}>
            <Text size="xs" style={{ color: 'var(--forge-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Scene Graph</Text>
            <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {['Root', 'Camera', 'Player', 'Lights'].map(n => (
                <div key={n} style={{ padding: '4px 8px', fontSize: 'var(--forge-font-size-sm)', color: 'var(--forge-text-muted)', borderRadius: 'var(--forge-radius-sm)' }}>{n}</div>
              ))}
            </div>
          </div>
        </ResizablePanel>
        <ResizablePanel flex>
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--forge-text-muted)' }}>
            ← Drag dividers to resize →
          </div>
        </ResizablePanel>
        <ResizablePanel defaultSize={220} minSize={140}>
          <div style={{ height: '100%', padding: '12px', backgroundColor: 'var(--forge-surface)' }}>
            <Text size="xs" style={{ color: 'var(--forge-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Inspector</Text>
            <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {['Position', 'Rotation', 'Scale'].map(p => (
                <div key={p} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text size="sm" style={{ color: 'var(--forge-text-muted)' }}>{p}</Text>
                  <Text size="sm" style={{ fontFamily: 'var(--forge-font-mono)', fontSize: '11px' }}>0.0, 0.0, 0.0</Text>
                </div>
              ))}
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
}
