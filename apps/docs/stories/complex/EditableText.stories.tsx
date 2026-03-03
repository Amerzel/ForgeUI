import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { EditableText, Text } from '@forgeui/components'

const meta: Meta = {
  title: 'Complex/EditableText',
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj

export const EditableTextStory: Story = {
  name: 'EditableText',
  render: function EditableTextDemo() {
    const [entityName, setEntityName] = useState('Player_01')
    const [layerName, setLayerName] = useState('Background')
    const [nodeLabel, setNodeLabel] = useState('Multiply')
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '320px' }}>
        <div>
          <Text
            size="xs"
            style={{ color: 'var(--forge-text-muted)', marginBottom: '6px', display: 'block' }}
          >
            Entity name — click to rename
          </Text>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px',
              backgroundColor: 'var(--forge-surface)',
              borderRadius: 'var(--forge-radius-md)',
              border: '1px solid var(--forge-border)',
            }}
          >
            <span style={{ fontSize: '16px' }}>🧑</span>
            <EditableText value={entityName} onCommit={setEntityName} />
          </div>
        </div>
        <div>
          <Text
            size="xs"
            style={{ color: 'var(--forge-text-muted)', marginBottom: '6px', display: 'block' }}
          >
            Timeline track
          </Text>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {[layerName, 'Midground', 'Foreground'].map((name, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 10px',
                  backgroundColor: 'var(--forge-surface)',
                  borderRadius: 'var(--forge-radius-sm)',
                  border: '1px solid var(--forge-border)',
                }}
              >
                <div
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '2px',
                    backgroundColor: [
                      'var(--forge-accent)',
                      'var(--forge-success)',
                      'var(--forge-warning)',
                    ][i],
                  }}
                />
                {i === 0 ? (
                  <EditableText value={name} onCommit={setLayerName} />
                ) : (
                  <span style={{ fontSize: '13px', color: 'var(--forge-text)' }}>{name}</span>
                )}
              </div>
            ))}
          </div>
        </div>
        <div>
          <Text
            size="xs"
            style={{ color: 'var(--forge-text-muted)', marginBottom: '6px', display: 'block' }}
          >
            Shader node
          </Text>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '6px 12px',
              backgroundColor: 'var(--forge-surface)',
              border: '1px solid var(--forge-accent)',
              borderRadius: 'var(--forge-radius-md)',
              gap: '8px',
            }}
          >
            <span style={{ color: 'var(--forge-accent)', fontSize: '12px' }}>⬡</span>
            <EditableText value={nodeLabel} onCommit={setNodeLabel} />
          </div>
        </div>
      </div>
    )
  },
}
