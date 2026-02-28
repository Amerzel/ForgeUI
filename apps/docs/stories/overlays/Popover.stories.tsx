import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Popover, Button, FormField, Input, Select } from '@forgeui/components'

const meta: Meta<typeof Popover> = {
  title: 'Overlays/Popover',
  component: Popover,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof Popover>

export const Default: Story = {
  name: 'Popover',
  render: function PopoverDemo() {
    const [open, setOpen] = useState(false)
    return (
      <div style={{ padding: '20px' }}>
        <Popover
          trigger={<Button variant="secondary">Filters ▾</Button>}
          open={open}
          onOpenChange={setOpen}
          width="260px"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <strong style={{ fontSize: '13px', color: 'var(--forge-text)' }}>Filter assets</strong>
            <FormField label="Type" htmlFor="pop-type">
              <Select
                id="pop-type"
                options={[
                  { value: 'mesh', label: 'Mesh' },
                  { value: 'texture', label: 'Texture' },
                  { value: 'material', label: 'Material' },
                  { value: 'audio', label: 'Audio' },
                ]}
                placeholder="All types"
              />
            </FormField>
            <FormField label="Name contains" htmlFor="pop-name">
              <Input id="pop-name" placeholder="Search…" size="sm" />
            </FormField>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>Reset</Button>
              <Button variant="primary" size="sm" onClick={() => setOpen(false)}>Apply</Button>
            </div>
          </div>
        </Popover>
      </div>
    )
  },
}
