import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { PipelineStepViewer } from '@forgeui/components'
import type { PipelineStep } from '@forgeui/components'

const meta: Meta<typeof PipelineStepViewer> = {
  title: 'Domain/PipelineStepViewer',
  component: PipelineStepViewer,
}
export default meta

type Story = StoryObj<typeof PipelineStepViewer>

/* ---------- helpers ---------- */
function ResultPlaceholder({ label, color }: { label: string; color: string }) {
  return (
    <div
      style={{
        width: 128,
        height: 128,
        backgroundColor: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 'var(--forge-radius-md)',
        fontSize: 'var(--forge-font-size-sm)',
        color: 'var(--forge-text)',
      }}
    >
      {label}
    </div>
  )
}

const DEMO_STEPS: PipelineStep[] = [
  {
    id: 'raw',
    label: 'Raw AI Output',
    status: 'complete',
    durationMs: 1200,
    meta: { model: 'sd-xl-turbo', seed: '42' },
    result: <ResultPlaceholder label="Raw" color="#3a3a5c" />,
  },
  {
    id: 'palette',
    label: 'Palette Snap',
    status: 'complete',
    durationMs: 85,
    meta: { colors: '32', method: 'k-means' },
    result: <ResultPlaceholder label="Snapped" color="#4a5a3c" />,
  },
  {
    id: 'alpha',
    label: 'Alpha Cleanup',
    status: 'running',
    durationMs: 40,
    result: <ResultPlaceholder label="Alpha" color="#5c3a3a" />,
  },
  {
    id: 'nn-clean',
    label: 'NN Cleanup',
    status: 'pending',
    result: <ResultPlaceholder label="NN Clean" color="#3a5c5c" />,
  },
  {
    id: 'final',
    label: 'Final Result',
    status: 'pending',
  },
]

/* ---------- stories ---------- */
export const Default: Story = {
  render: function PipelineDemo() {
    const [selected, setSelected] = useState('raw')
    return (
      <div style={{ width: 640 }}>
        <PipelineStepViewer steps={DEMO_STEPS} selectedStep={selected} onSelectStep={setSelected} />
      </div>
    )
  },
}

export const VerticalLayout: Story = {
  render: function VerticalDemo() {
    const [selected, setSelected] = useState('palette')
    return (
      <div style={{ width: 480, height: 400 }}>
        <PipelineStepViewer
          steps={DEMO_STEPS}
          selectedStep={selected}
          onSelectStep={setSelected}
          layout="vertical"
        />
      </div>
    )
  },
}

export const FilmstripLayout: Story = {
  render: function FilmstripDemo() {
    const [selected, setSelected] = useState('raw')
    return (
      <div style={{ width: 700 }}>
        <PipelineStepViewer
          steps={DEMO_STEPS}
          selectedStep={selected}
          onSelectStep={setSelected}
          layout="filmstrip"
        />
      </div>
    )
  },
}

export const AllComplete: Story = {
  render: function AllCompleteDemo() {
    const complete = DEMO_STEPS.map((s) => ({
      ...s,
      status: 'complete' as const,
      durationMs: s.durationMs ?? 50,
    }))
    const [selected, setSelected] = useState('raw')
    return (
      <div style={{ width: 640 }}>
        <PipelineStepViewer steps={complete} selectedStep={selected} onSelectStep={setSelected} />
      </div>
    )
  },
}

export const WithError: Story = {
  render: function ErrorDemo() {
    const steps: PipelineStep[] = DEMO_STEPS.map((s) =>
      s.id === 'alpha'
        ? {
            ...s,
            status: 'error',
            meta: { ...s.meta, error: 'CUDA OOM' },
          }
        : s,
    )
    const [selected, setSelected] = useState('alpha')
    return (
      <div style={{ width: 640 }}>
        <PipelineStepViewer steps={steps} selectedStep={selected} onSelectStep={setSelected} />
      </div>
    )
  },
}
