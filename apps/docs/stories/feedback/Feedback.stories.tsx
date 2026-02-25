import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Alert, Progress, Skeleton, ToastProvider, ToastList, Button } from '@forgeui/components'
import type { ToastItem } from '@forgeui/components'

const meta: Meta = {
  title: 'Feedback/Gallery',
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'ForgeUI feedback components — Alert, Progress, Skeleton, Toast.' } },
  },
}
export default meta
type Story = StoryObj

// ---------------------------------------------------------------------------
// Alert
// ---------------------------------------------------------------------------
export const Alerts: Story = {
  name: 'Alert — variants',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '480px' }}>
      <Alert variant="info" title="New version available">
        ForgeUI 0.2.0 is ready to install.
      </Alert>
      <Alert variant="success" title="Build succeeded">
        All 42 assets compiled in 1.2s.
      </Alert>
      <Alert variant="warning" title="Memory usage high">
        Asset streaming pool is at 87% capacity.
      </Alert>
      <Alert variant="danger" title="Shader compilation failed" live>
        Unexpected token at line 42 in diffuse.glsl.
      </Alert>
    </div>
  ),
}

export const AlertDismissible: Story = {
  name: 'Alert — dismissible',
  render: function AlertDismissDemo() {
    const [visible, setVisible] = useState(true)
    return visible ? (
      <Alert variant="info" title="Welcome to ForgeUI" onDismiss={() => setVisible(false)}>
        Use the toolbar above to switch palettes and modes.
      </Alert>
    ) : (
      <button onClick={() => setVisible(true)} style={{ color: 'var(--forge-accent)', background: 'none', border: 'none', cursor: 'pointer' }}>
        Show alert again
      </button>
    )
  },
}

// ---------------------------------------------------------------------------
// Progress
// ---------------------------------------------------------------------------
export const Progresses: Story = {
  name: 'Progress — variants',
  render: function ProgressDemo() {
    const [value, setValue] = useState(60)
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '400px' }}>
        <Progress value={value} label="Upload progress" showValue />
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setValue(v => Math.max(0, v - 10))} style={{ padding: '4px 8px', cursor: 'pointer', background: 'var(--forge-surface)', border: '1px solid var(--forge-border)', borderRadius: '4px', color: 'var(--forge-text)' }}>-10</button>
          <button onClick={() => setValue(v => Math.min(100, v + 10))} style={{ padding: '4px 8px', cursor: 'pointer', background: 'var(--forge-surface)', border: '1px solid var(--forge-border)', borderRadius: '4px', color: 'var(--forge-text)' }}>+10</button>
        </div>
        <Progress variant="success" value={100} label="Completed" showValue />
        <Progress variant="warning" value={78} label="Warning threshold" size="sm" />
        <Progress variant="danger" value={95} label="Critical" size="lg" />
        <Progress label="Indeterminate (loading…)" />
      </div>
    )
  },
}

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------
export const Skeletons: Story = {
  name: 'Skeleton — loading state',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Card loading state */}
      <div role="status" aria-label="Loading content" style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', width: '320px' }}>
        <Skeleton circle width={40} height={40} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Skeleton width="60%" height={14} />
          <Skeleton width="100%" height={12} />
          <Skeleton width="80%" height={12} />
        </div>
      </div>
      {/* Table rows */}
      <div role="status" aria-label="Loading table" style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '400px' }}>
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} style={{ display: 'flex', gap: '12px' }}>
            <Skeleton width={120} height={14} />
            <Skeleton width={80} height={14} />
            <Skeleton width="100%" height={14} />
          </div>
        ))}
      </div>
    </div>
  ),
}

// ---------------------------------------------------------------------------
// Toast
// ---------------------------------------------------------------------------
let _toastId = 0

export const Toasts: Story = {
  name: 'Toast',
  render: function ToastDemo() {
    const [toasts, setToasts] = useState<ToastItem[]>([])

    const addToast = (variant: NonNullable<ToastItem['variant']>, title: string, description?: string) => {
      const id = String(++_toastId)
      const item: ToastItem = { id, title, variant, duration: 5000 }
      if (description) item.description = description
      setToasts(prev => [...prev, item])
    }
    const dismiss = (id: string) => setToasts(prev => prev.filter(t => t.id !== id))

    return (
      <ToastProvider>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Button variant="secondary" size="sm" onClick={() => addToast('default', 'File saved', 'Changes saved to disk.')}>
            Default
          </Button>
          <Button variant="secondary" size="sm" onClick={() => addToast('success', 'Build succeeded', 'All 12 assets compiled.')}>
            Success
          </Button>
          <Button variant="secondary" size="sm" onClick={() => addToast('warning', 'Memory high', 'Asset pool at 87%.')}>
            Warning
          </Button>
          <Button variant="secondary" size="sm" onClick={() => addToast('danger', 'Compilation failed', 'Error in shader.glsl:42')}>
            Danger
          </Button>
        </div>
        <ToastList toasts={toasts} onDismiss={dismiss} />
      </ToastProvider>
    )
  },
}
