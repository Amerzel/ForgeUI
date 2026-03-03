import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { FileSourceBar } from '@forgeui/components'
import type { FileSourceBarFile } from '@forgeui/components'

const meta: Meta<typeof FileSourceBar> = {
  title: 'Composites/FileSourceBar',
  component: FileSourceBar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Toolbar displaying current file status with load/clear controls. Designed to pair with DropZone.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof FileSourceBar>

export const Default: Story = {
  name: 'FileSourceBar',
  render: function FileSourceBarDemo() {
    const [file, setFile] = useState<FileSourceBarFile | null>(null)
    const [error, setError] = useState<string | null>(null)

    const handleLoad = () => {
      setError(null)
      setFile({ name: 'game-design.json', size: 24576, type: 'application/json' })
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '600px' }}>
        <div>
          <div style={{ fontSize: '12px', color: 'var(--forge-text-muted)', marginBottom: '8px' }}>
            Interactive demo — click Load to simulate
          </div>
          <FileSourceBar
            file={file}
            error={error}
            onLoad={handleLoad}
            onClear={() => {
              setFile(null)
              setError(null)
            }}
            accept=".json"
            label="Game Design Document"
          />
        </div>
      </div>
    )
  },
}

export const Empty: Story = {
  name: 'Empty State',
  args: {
    onLoad: () => {},
    label: 'Game Design Document',
    accept: '.json',
  },
}

export const Loaded: Story = {
  name: 'Loaded State',
  args: {
    file: { name: 'terrain-recipe.json', size: 158720, type: 'application/json' },
    onLoad: () => {},
    onClear: () => {},
  },
}

export const Error: Story = {
  name: 'Error State',
  args: {
    file: { name: 'broken.json', size: 1024, type: 'application/json' },
    error: 'Invalid JSON: Unexpected token at line 42',
    onLoad: () => {},
    onClear: () => {},
  },
}

export const LargeFile: Story = {
  name: 'Large File',
  args: {
    file: { name: 'world-export-v2.4.1.json', size: 52428800, type: 'application/json' },
    onLoad: () => {},
    onClear: () => {},
  },
}
