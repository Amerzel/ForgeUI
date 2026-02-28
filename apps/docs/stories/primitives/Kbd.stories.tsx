import type { Meta, StoryObj } from '@storybook/react'
import { Kbd } from '@forgeui/components'

const meta: Meta<typeof Kbd> = {
  title: 'Primitives/Kbd',
  component: Kbd,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof Kbd>

export const KeyCombos: Story = {
  name: 'Kbd — key combos',
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
      <Kbd keys="Escape" />
      <Kbd keys={['⌘', 'S']} />
      <Kbd keys={['Ctrl', 'Shift', 'P']} />
      <Kbd keys={['⌥', '⌘', 'I']} />
    </div>
  ),
}
