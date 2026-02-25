import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Accordion, Tabs } from '@forgeui/components'

const meta: Meta = {
  title: 'Disclosure/Gallery',
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'Accordion and Tabs disclosure components.' } },
  },
}
export default meta
type Story = StoryObj

const ACCORDION_ITEMS = [
  {
    value: 'scene',
    trigger: 'Scene Settings',
    content: 'Configure ambient lighting, fog density, and global illumination for the scene.',
  },
  {
    value: 'physics',
    trigger: 'Physics World',
    content: 'Set gravity vector, collision layers, and simulation substeps.',
  },
  {
    value: 'audio',
    trigger: 'Audio Engine',
    content: 'Master volume, spatial audio model, and reverb settings.',
  },
  {
    value: 'disabled',
    trigger: 'Locked Settings',
    content: 'These settings are locked in this project.',
    disabled: true,
  },
]

// ---------------------------------------------------------------------------
// Accordion
// ---------------------------------------------------------------------------
export const AccordionSingle: Story = {
  name: 'Accordion — single',
  render: () => (
    <div style={{ maxWidth: '480px' }}>
      <Accordion items={ACCORDION_ITEMS} type="single" collapsible />
    </div>
  ),
}

export const AccordionMultiple: Story = {
  name: 'Accordion — multiple',
  render: () => (
    <div style={{ maxWidth: '480px' }}>
      <Accordion items={ACCORDION_ITEMS} type="multiple" values={['scene', 'physics']} />
    </div>
  ),
}

// ---------------------------------------------------------------------------
// Tabs — line variant
// ---------------------------------------------------------------------------
const TAB_ITEMS = [
  {
    value: 'inspector',
    label: 'Inspector',
    content: (
      <div style={{ color: 'var(--forge-text-muted)', fontSize: '13px', lineHeight: 1.6 }}>
        <strong style={{ color: 'var(--forge-text)' }}>Transform</strong>
        <div>Position: 0, 0, 0</div>
        <div>Rotation: 0°, 0°, 0°</div>
        <div>Scale: 1, 1, 1</div>
      </div>
    ),
  },
  {
    value: 'materials',
    label: 'Materials',
    content: (
      <div style={{ color: 'var(--forge-text-muted)', fontSize: '13px' }}>
        Albedo, Normal, Roughness, Metallic maps displayed here.
      </div>
    ),
  },
  {
    value: 'physics',
    label: 'Physics',
    content: (
      <div style={{ color: 'var(--forge-text-muted)', fontSize: '13px' }}>
        Rigidbody, Collider, Joints configuration.
      </div>
    ),
  },
  {
    value: 'locked',
    label: 'Locked',
    content: <div>Locked content</div>,
    disabled: true,
  },
]

export const TabsLine: Story = {
  name: 'Tabs — line variant',
  render: function TabsLineDemo() {
    const [value, setValue] = useState('inspector')
    return (
      <div style={{ maxWidth: '480px' }}>
        <Tabs items={TAB_ITEMS} value={value} onValueChange={setValue} variant="line" />
      </div>
    )
  },
}

export const TabsSolid: Story = {
  name: 'Tabs — solid variant',
  render: function TabsSolidDemo() {
    const [value, setValue] = useState('inspector')
    return (
      <div style={{ maxWidth: '480px' }}>
        <Tabs items={TAB_ITEMS} value={value} onValueChange={setValue} variant="solid" />
      </div>
    )
  },
}

export const TabsVertical: Story = {
  name: 'Tabs — vertical',
  render: function TabsVerticalDemo() {
    const [value, setValue] = useState('inspector')
    return (
      <div style={{ maxWidth: '540px' }}>
        <Tabs items={TAB_ITEMS.slice(0, 3)} value={value} onValueChange={setValue} orientation="vertical" />
      </div>
    )
  },
}
