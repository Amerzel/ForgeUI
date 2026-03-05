import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { GenerationQueue } from '@forgeui/components'
import type { GenerationJob } from '@forgeui/components'

const meta: Meta<typeof GenerationQueue> = {
  title: 'Domain/GenerationQueue',
  component: GenerationQueue,
}
export default meta

type Story = StoryObj<typeof GenerationQueue>

const DEMO_JOBS: GenerationJob[] = [
  {
    id: 'j1',
    label: 'Generate grass fill (64px)',
    status: 'completed',
    startedAt: Date.now() - 4200,
    completedAt: Date.now() - 2800,
    apiCalls: 3,
    estimatedCost: 12,
  },
  {
    id: 'j2',
    label: 'Generate stone fill (64px)',
    status: 'running',
    startedAt: Date.now() - 1500,
    progress: 65,
    apiCalls: 2,
    estimatedCost: 8,
  },
  {
    id: 'j3',
    label: 'Generate water fill (64px)',
    status: 'queued',
    estimatedCost: 12,
  },
  {
    id: 'j4',
    label: 'Generate lava fill (64px)',
    status: 'queued',
    estimatedCost: 12,
  },
  {
    id: 'j5',
    label: 'Generate sand fill (64px)',
    status: 'failed',
    startedAt: Date.now() - 8000,
    completedAt: Date.now() - 7200,
    error: 'Rate limit exceeded — retry in 30s',
    apiCalls: 1,
    estimatedCost: 4,
  },
]

export const Compact: Story = {
  args: {
    jobs: DEMO_JOBS,
    totalCost: 36,
    totalApiCalls: 6,
    variant: 'compact',
  },
}

export const Expanded: Story = {
  render: function ExpandedDemo() {
    const [jobs, setJobs] = useState(DEMO_JOBS)
    return (
      <div style={{ width: 480 }}>
        <GenerationQueue
          jobs={jobs}
          totalCost={36}
          totalApiCalls={6}
          budgetCeiling={500}
          variant="expanded"
          onCancel={(id) => setJobs((prev) => prev.filter((j) => j.id !== id))}
          onRetry={(id) =>
            setJobs((prev) =>
              prev.map((j) => {
                if (j.id !== id) return j
                const { error: _, ...rest } = j
                return { ...rest, status: 'queued' as const }
              }),
            )
          }
        />
      </div>
    )
  },
}

export const OverBudget: Story = {
  args: {
    jobs: DEMO_JOBS,
    totalCost: 550,
    budgetCeiling: 500,
    variant: 'compact',
  },
}

export const Empty: Story = {
  args: {
    jobs: [],
    variant: 'compact',
  },
}
