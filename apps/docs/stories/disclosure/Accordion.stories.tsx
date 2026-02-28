import type { Meta, StoryObj } from '@storybook/react'
import { Accordion } from '@forgeui/components'

const meta: Meta<typeof Accordion> = {
  title: 'Disclosure/Accordion',
  component: Accordion,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof Accordion>

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

export const Single: Story = {
  name: 'Accordion — single',
  render: () => (
    <div style={{ maxWidth: '480px' }}>
      <Accordion items={ACCORDION_ITEMS} type="single" collapsible />
    </div>
  ),
}

export const Multiple: Story = {
  name: 'Accordion — multiple',
  render: () => (
    <div style={{ maxWidth: '480px' }}>
      <Accordion items={ACCORDION_ITEMS} type="multiple" values={['scene', 'physics']} />
    </div>
  ),
}
