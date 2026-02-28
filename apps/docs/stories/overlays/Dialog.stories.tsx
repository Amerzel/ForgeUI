import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Dialog, Button, FormField, Input, Select } from '@forgeui/components'

const meta: Meta<typeof Dialog> = {
  title: 'Overlays/Dialog',
  component: Dialog,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof Dialog>

export const Default: Story = {
  name: 'Dialog',
  render: function DialogDemo() {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Dialog</Button>
        <Dialog
          open={open}
          onOpenChange={setOpen}
          title="Project Settings"
          description="Configure global settings for this project."
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <FormField label="Project name" htmlFor="dlg-name">
              <Input id="dlg-name" defaultValue="My Game Project" />
            </FormField>
            <FormField label="Build target" htmlFor="dlg-target">
              <Select
                id="dlg-target"
                options={[
                  { value: 'windows', label: 'Windows' },
                  { value: 'linux', label: 'Linux' },
                  { value: 'macos', label: 'macOS' },
                  { value: 'web', label: 'WebGL' },
                ]}
              />
            </FormField>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '8px' }}>
              <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button variant="primary" onClick={() => setOpen(false)}>Save</Button>
            </div>
          </div>
        </Dialog>
      </>
    )
  },
}
