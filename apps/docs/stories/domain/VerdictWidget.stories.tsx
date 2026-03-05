import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { VerdictWidget } from '@forgeui/components'
import type { Verdict } from '@forgeui/components'

const meta: Meta<typeof VerdictWidget> = {
  title: 'Domain/VerdictWidget',
  component: VerdictWidget,
}
export default meta

type Story = StoryObj<typeof VerdictWidget>

export const Default: Story = {
  render: function VerdictDemo() {
    const [value, setValue] = useState<Verdict>(null)
    return <VerdictWidget value={value} onChange={setValue} />
  },
}

export const WithNotes: Story = {
  render: function VerdictNotesDemo() {
    const [value, setValue] = useState<Verdict>('up')
    const [notes, setNotes] = useState('')
    return (
      <VerdictWidget
        value={value}
        onChange={setValue}
        showNotes
        notes={notes}
        onNotesChange={setNotes}
      />
    )
  },
}

export const Small: Story = {
  render: function SmallDemo() {
    const [value, setValue] = useState<Verdict>(null)
    return <VerdictWidget value={value} onChange={setValue} size="sm" />
  },
}

export const Preselected: Story = {
  render: function PreselectedDemo() {
    const [value, setValue] = useState<Verdict>('down')
    return <VerdictWidget value={value} onChange={setValue} />
  },
}

export const Disabled: Story = {
  args: {
    value: 'up',
    disabled: true,
  },
}
