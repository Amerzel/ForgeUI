import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { AlertDialog } from '@forgeui/components'

const meta: Meta<typeof AlertDialog> = {
  title: 'Primitives/AlertDialog',
  component: AlertDialog,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof AlertDialog>

export const Default: Story = {
  name: 'AlertDialog',
  render: function AlertDialogDemo() {
    const [open, setOpen] = useState(false)
    return (
      <>
        <button
          onClick={() => setOpen(true)}
          style={{ padding: '8px 16px', background: 'var(--forge-danger)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
        >
          Delete file
        </button>
        <AlertDialog
          open={open}
          onOpenChange={setOpen}
          title="Delete file permanently?"
          description="This action cannot be undone. The file will be permanently removed."
          confirmLabel="Delete"
          cancelLabel="Cancel"
          onConfirm={() => { setOpen(false) }}
          destructive
        />
      </>
    )
  },
}
