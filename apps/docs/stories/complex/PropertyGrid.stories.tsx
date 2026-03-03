import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { PropertyGrid, Text } from '@forgeui/components'
import type { PropertySection, SelectOption } from '@forgeui/components'

const RIGIDBODY_OPTIONS: SelectOption[] = [
  { value: 'dynamic', label: 'Dynamic' },
  { value: 'kinematic', label: 'Kinematic' },
  { value: 'static', label: 'Static' },
]

const INSPECTOR_SECTIONS: PropertySection[] = [
  {
    label: 'Transform',
    defaultOpen: true,
    items: [
      { key: 'position', label: 'Position', type: 'vec3' },
      { key: 'rotation', label: 'Rotation', type: 'vec3' },
      { key: 'scale', label: 'Scale', type: 'vec3' },
    ],
  },
  {
    label: 'Mesh Renderer',
    defaultOpen: true,
    items: [
      { key: 'castShadows', label: 'Cast Shadows', type: 'boolean' },
      { key: 'receiveShadows', label: 'Receive Shadows', type: 'boolean' },
      { key: 'emissiveColor', label: 'Emissive Color', type: 'color' },
      { key: 'lod', label: 'LOD Bias', type: 'number', min: 0, max: 2, step: 0.1 },
    ],
  },
  {
    label: 'Rigidbody',
    defaultOpen: false,
    items: [
      { key: 'bodyType', label: 'Body Type', type: 'select', options: RIGIDBODY_OPTIONS },
      { key: 'mass', label: 'Mass (kg)', type: 'number', min: 0, max: 1000, step: 0.5 },
      { key: 'useGravity', label: 'Use Gravity', type: 'boolean' },
      { key: 'drag', label: 'Drag', type: 'number', min: 0, max: 10, step: 0.1 },
    ],
  },
]

const meta: Meta = {
  title: 'Complex/PropertyGrid',
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj

export const PropertyGridStory: Story = {
  name: 'PropertyGrid',
  render: function PropertyGridDemo() {
    const [values, setValues] = useState<Record<string, unknown>>({
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      castShadows: true,
      receiveShadows: true,
      emissiveColor: '#000000',
      lod: 1.0,
      bodyType: 'dynamic',
      mass: 70,
      useGravity: true,
      drag: 0.1,
    })
    return (
      <div
        style={{
          width: '300px',
          border: '1px solid var(--forge-border)',
          borderRadius: 'var(--forge-radius-md)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '10px 12px',
            backgroundColor: 'var(--forge-surface)',
            borderBottom: '1px solid var(--forge-border)',
          }}
        >
          <Text size="sm" style={{ fontWeight: 500 }}>
            Player Entity
          </Text>
        </div>
        <PropertyGrid
          sections={INSPECTOR_SECTIONS}
          values={values}
          onChange={(key, value) => setValues((prev) => ({ ...prev, [key]: value }))}
        />
      </div>
    )
  },
}
