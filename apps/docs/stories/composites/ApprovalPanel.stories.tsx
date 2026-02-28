import type { Meta, StoryObj } from '@storybook/react'
import { ApprovalPanel, DiffViewer, Text } from '@forgeui/components'

const meta: Meta<typeof ApprovalPanel> = {
  title: 'Composites/ApprovalPanel',
  component: ApprovalPanel,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'Review panel with approve/reject workflow and rationale capture.' } },
  },
}
export default meta
type Story = StoryObj<typeof ApprovalPanel>

export const Pending: Story = {
  args: {
    title: 'Update Character Age',
    description: 'AI agent proposes updating Gandalf\'s age based on Silmarillion cross-references.',
    status: 'pending',
    onApprove: (r: string) => console.log('Approved:', r),
    onReject: (r: string) => console.log('Rejected:', r),
    children: <Text size="sm">Proposed change: Age from "Unknown" to "~11,000 years"</Text>,
  },
}

export const Approved: Story = {
  args: {
    title: 'Add Fellowship Affiliation',
    description: 'Missing faction relationship detected.',
    status: 'approved',
    children: <Text size="sm">Added "member of" relationship to The Fellowship of the Ring.</Text>,
  },
}

export const Rejected: Story = {
  args: {
    title: 'Rename to Gandalf the White',
    description: 'AI suggests renaming based on late-story events.',
    status: 'rejected',
    children: <Text size="sm">Rejected: Character is known as "the Grey" for most of the narrative.</Text>,
  },
}

export const WithDiff: Story = {
  name: 'With Diff Content',
  render: () => (
    <ApprovalPanel
      title="Entity Update: Gandalf"
      description="AI agent detected missing lore details"
      status="pending"
      onApprove={(r) => console.log('Approved:', r)}
      onReject={(r) => console.log('Rejected:', r)}
    >
      <DiffViewer
        before="Race: Unknown\nAge: Unknown"
        after="Race: Maia (Istari)\nAge: ~11,000 years"
        beforeLabel="Current"
        afterLabel="Proposed"
      />
    </ApprovalPanel>
  ),
}
