import type { Meta, StoryObj } from '@storybook/react'
import { DiffViewer } from '@forgeui/components'

const meta: Meta<typeof DiffViewer> = {
  title: 'Complex/DiffViewer',
  component: DiffViewer,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: { component: 'Line-by-line text diff viewer with unified and split modes.' },
    },
  },
}
export default meta
type Story = StoryObj<typeof DiffViewer>

const BEFORE = `## Character Profile

Name: Gandalf
Race: Unknown
Role: Wizard

Gandalf is a mysterious wizard
who helps the hobbits.`

const AFTER = `## Character Profile

Name: Gandalf the Grey
Race: Maia (Istari Order)
Role: Wizard, Ring-bearer (Narya)

Gandalf is one of the five Istari
sent to Middle-earth by the Valar.
He carries the Elven ring Narya.`

export const Unified: Story = {
  args: {
    before: BEFORE,
    after: AFTER,
  },
}

export const Split: Story = {
  name: 'Split Mode',
  args: {
    before: BEFORE,
    after: AFTER,
    mode: 'split',
    beforeLabel: 'Original',
    afterLabel: 'AI Proposed',
  },
}

export const NoDifferences: Story = {
  name: 'No Differences',
  args: {
    before: 'Line one\nLine two\nLine three',
    after: 'Line one\nLine two\nLine three',
  },
}
