import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Combobox, Text } from '@forgeui/components'
import type { ComboboxOption } from '@forgeui/components'

const SHADER_OPTIONS: ComboboxOption[] = [
  { value: 'pbr-standard',   label: 'PBR Standard' },
  { value: 'pbr-metallic',   label: 'PBR Metallic' },
  { value: 'unlit',          label: 'Unlit' },
  { value: 'toon',           label: 'Toon / Cel Shading' },
  { value: 'water',          label: 'Water Surface' },
  { value: 'particle',       label: 'Particle' },
  { value: 'sky',            label: 'Skybox' },
  { value: 'terrain',        label: 'Terrain Blend' },
  { value: 'emissive',       label: 'Emissive Glow' },
  { value: 'glass',          label: 'Glass / Transparent' },
]

const meta: Meta = {
  title: 'Complex/Combobox',
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj

export const ComboboxStory: Story = {
  name: 'Combobox',
  render: function ComboboxDemo() {
    const [shader, setShader] = useState('pbr-standard')
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '320px' }}>
        <div>
          <Text size="sm" style={{ color: 'var(--forge-text-muted)', marginBottom: '6px', display: 'block' }}>Shader type</Text>
          <Combobox
            options={SHADER_OPTIONS}
            value={shader}
            onChange={setShader}
            placeholder="Search shaders…"
          />
          <Text size="xs" style={{ color: 'var(--forge-text-muted)', marginTop: '4px' }}>
            Selected: {SHADER_OPTIONS.find(o => o.value === shader)?.label}
          </Text>
        </div>
        <div>
          <Text size="sm" style={{ color: 'var(--forge-text-muted)', marginBottom: '6px', display: 'block' }}>Loading state</Text>
          <Combobox options={[]} placeholder="Search assets…" loading empty="Loading…" />
        </div>
      </div>
    )
  },
}
