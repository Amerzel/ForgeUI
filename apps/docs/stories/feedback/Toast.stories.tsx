import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { ToastProvider, ToastList, Button } from '@forgeui/components'
import type { ToastItem } from '@forgeui/components'

const meta: Meta = {
  title: 'Feedback/Toast',
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj

let _toastId = 0

export const Default: Story = {
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
