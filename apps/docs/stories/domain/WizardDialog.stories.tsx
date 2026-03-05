import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { WizardDialog } from '@forgeui/components'
import type { WizardStep } from '@forgeui/components'

const meta: Meta<typeof WizardDialog> = {
  title: 'Domain/WizardDialog',
  component: WizardDialog,
}
export default meta

type Story = StoryObj<typeof WizardDialog>

function StepContent({ label }: { label: string }) {
  return (
    <div
      style={{
        padding: 'var(--forge-space-4)',
        border: '1px dashed var(--forge-border)',
        borderRadius: 'var(--forge-radius-md)',
        textAlign: 'center',
        color: 'var(--forge-text-muted)',
        minHeight: 120,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {label} form content goes here
    </div>
  )
}

const DEMO_STEPS: WizardStep[] = [
  {
    id: 'basics',
    label: 'Pack Basics',
    description: 'Name, description, tile size',
    content: <StepContent label="Pack Basics" />,
  },
  {
    id: 'materials',
    label: 'Materials',
    description: 'Add terrain materials',
    content: <StepContent label="Materials" />,
  },
  {
    id: 'pairs',
    label: 'Pairs',
    description: 'Configure transitions',
    content: <StepContent label="Pair Configuration" />,
  },
  {
    id: 'review',
    label: 'Review',
    description: 'Summary before creation',
    content: <StepContent label="Review & Create" />,
  },
]

export const Default: Story = {
  render: function WizardDemo() {
    const [open, setOpen] = useState(true)
    return (
      <>
        <button onClick={() => setOpen(true)}>Open Wizard</button>
        <WizardDialog
          open={open}
          onOpenChange={setOpen}
          title="New Terrain Pack"
          steps={DEMO_STEPS}
          onComplete={() => alert('Pack created!')}
          finishLabel="Create Pack"
        />
      </>
    )
  },
}

export const WithValidation: Story = {
  render: function ValidationDemo() {
    const [open, setOpen] = useState(true)
    const [name, setName] = useState('')

    const steps: WizardStep[] = [
      {
        id: 'name',
        label: 'Name',
        content: (
          <div>
            <label
              style={{
                display: 'block',
                color: 'var(--forge-text)',
                fontSize: 'var(--forge-font-size-sm)',
                marginBottom: 'var(--forge-space-2)',
              }}
            >
              Pack Name
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Fantasy Forest"
                style={{
                  display: 'block',
                  width: '100%',
                  marginTop: 'var(--forge-space-1)',
                  padding: 'var(--forge-space-2)',
                  border: '1px solid var(--forge-border)',
                  borderRadius: 'var(--forge-radius-md)',
                  backgroundColor: 'var(--forge-surface)',
                  color: 'var(--forge-text)',
                }}
              />
            </label>
          </div>
        ),
        validate: () => (name.trim() ? null : 'Pack name is required'),
      },
      {
        id: 'confirm',
        label: 'Confirm',
        content: <StepContent label={`Creating pack: "${name}"`} />,
      },
    ]

    return (
      <>
        <button onClick={() => setOpen(true)}>Open Wizard</button>
        <WizardDialog
          open={open}
          onOpenChange={setOpen}
          title="New Pack"
          steps={steps}
          onComplete={() => alert(`Created: ${name}`)}
        />
      </>
    )
  },
}
