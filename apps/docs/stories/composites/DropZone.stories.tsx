import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { DropZone, Badge, Text } from '@forgeui/components'

const meta: Meta = {
  title: 'Composites/DropZone',
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj

export const Default: Story = {
  name: 'DropZone',
  render: function DropZoneDemo() {
    const [files, setFiles] = useState<string[]>([])
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '480px' }}>
        <DropZone
          accept={['.glb', '.fbx', '.obj', 'model/gltf-binary']}
          multiple
          maxSize={100 * 1024 * 1024}
          onDrop={fs => setFiles(prev => [...prev, ...fs.map(f => f.name)])}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div style={{ fontSize: '32px', opacity: 0.4 }}>📦</div>
            <Text size="sm">Drop 3D assets here (.glb, .fbx, .obj)</Text>
            <Text size="xs" style={{ color: 'var(--forge-text-muted)' }}>or click to browse — max 100 MB</Text>
          </div>
        </DropZone>
        {files.length > 0 && (
          <div>
            <Text size="xs" style={{ color: 'var(--forge-text-muted)', marginBottom: '8px', display: 'block' }}>Queued for import:</Text>
            {files.map((f, i) => (
              <div key={i} style={{ padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--forge-border-subtle)' }}>
                <Badge>3D</Badge>
                <Text size="sm" style={{ fontFamily: 'var(--forge-font-mono)', fontSize: '11px' }}>{f}</Text>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  },
}
