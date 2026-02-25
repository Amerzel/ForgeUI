import type { Meta, StoryObj } from '@storybook/react'
import {
  VisuallyHidden, Label, Separator, Spinner, Badge,
  Text, Heading, Kbd, Card, IconButton, AlertDialog, ScrollArea,
} from '@forgeui/components'
import { useState } from 'react'

const meta: Meta = {
  title: 'Primitives/Gallery',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: { component: 'Gallery of ForgeUI primitive components.' },
    },
  },
}
export default meta
type Story = StoryObj

// ---------------------------------------------------------------------------
// Badge
// ---------------------------------------------------------------------------
export const Badges: Story = {
  name: 'Badge — variants',
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      {(['accent','info','success','warning','danger','neutral'] as const).map(color =>
        (['solid','subtle','outline'] as const).map(variant => (
          <Badge key={`${color}-${variant}`} color={color} variant={variant}>{color}</Badge>
        ))
      )}
    </div>
  ),
}

// ---------------------------------------------------------------------------
// Spinner
// ---------------------------------------------------------------------------
export const Spinners: Story = {
  name: 'Spinner — sizes',
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Spinner size="sm" label="Loading small" />
      <Spinner size="md" label="Loading medium" />
      <Spinner size="lg" label="Loading large" />
    </div>
  ),
}

// ---------------------------------------------------------------------------
// Text & Heading
// ---------------------------------------------------------------------------
export const Typography: Story = {
  name: 'Text & Heading',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Heading level={1} size="3xl">Heading 1 — 3xl</Heading>
      <Heading level={2} size="2xl">Heading 2 — 2xl</Heading>
      <Heading level={3} size="xl">Heading 3 — xl</Heading>
      <Separator />
      <Text size="lg">Large body text</Text>
      <Text size="base">Base body text — default</Text>
      <Text size="sm" color="muted">Small muted text</Text>
      <Text size="xs" color="muted">Extra small muted text</Text>
    </div>
  ),
}

// ---------------------------------------------------------------------------
// Kbd
// ---------------------------------------------------------------------------
export const Keyboard: Story = {
  name: 'Kbd — key combos',
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
      <Kbd keys="Escape" />
      <Kbd keys={['⌘', 'S']} />
      <Kbd keys={['Ctrl', 'Shift', 'P']} />
      <Kbd keys={['⌥', '⌘', 'I']} />
    </div>
  ),
}

// ---------------------------------------------------------------------------
// Separator
// ---------------------------------------------------------------------------
export const Separators: Story = {
  name: 'Separator',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
      <Text>Above separator</Text>
      <Separator />
      <Text>Below separator</Text>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', height: '40px' }}>
        <Text>Left</Text>
        <Separator orientation="vertical" />
        <Text>Right</Text>
      </div>
    </div>
  ),
}

// ---------------------------------------------------------------------------
// Label
// ---------------------------------------------------------------------------
export const Labels: Story = {
  name: 'Label',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Label htmlFor="demo-input">Field label</Label>
      <input id="demo-input" style={{ padding: '4px 8px', background: 'var(--forge-surface)', border: '1px solid var(--forge-border)', borderRadius: '4px', color: 'var(--forge-text)' }} placeholder="Input" />
      <Label htmlFor="demo-input-2" disabled>Disabled label</Label>
      <input id="demo-input-2" disabled style={{ padding: '4px 8px', background: 'var(--forge-surface)', border: '1px solid var(--forge-border)', borderRadius: '4px', color: 'var(--forge-text)', opacity: 0.5 }} />
    </div>
  ),
}

// ---------------------------------------------------------------------------
// Card
// ---------------------------------------------------------------------------
export const Cards: Story = {
  name: 'Card — compound',
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <Card style={{ width: '240px' }}>
        <Card.Header>Simple card</Card.Header>
        <Card.Body>Card body content goes here.</Card.Body>
        <Card.Footer>Footer</Card.Footer>
      </Card>
      <Card elevated style={{ width: '240px' }}>
        <Card.Header>Elevated card</Card.Header>
        <Card.Body>Raised surface with shadow.</Card.Body>
      </Card>
    </div>
  ),
}

// ---------------------------------------------------------------------------
// IconButton
// ---------------------------------------------------------------------------
export const IconButtons: Story = {
  name: 'IconButton',
  render: () => (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      {(['sm','md','lg'] as const).map(size => (
        <IconButton
          key={size}
          size={size}
          label={`Close (${size})`}
          icon={
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          }
        />
      ))}
      <IconButton
        label="Close (disabled)"
        disabled
        icon={
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        }
      />
    </div>
  ),
}

// ---------------------------------------------------------------------------
// ScrollArea
// ---------------------------------------------------------------------------
export const ScrollAreas: Story = {
  name: 'ScrollArea',
  render: () => (
    <ScrollArea style={{ height: '160px', width: '300px', border: '1px solid var(--forge-border)', borderRadius: '6px' }}>
      <div style={{ padding: '16px' }}>
        {Array.from({ length: 20 }, (_, i) => (
          <div key={i} style={{ padding: '4px 0', color: 'var(--forge-text)', fontSize: '13px' }}>
            Item {i + 1} — long enough content to trigger scroll
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
}

// ---------------------------------------------------------------------------
// AlertDialog
// ---------------------------------------------------------------------------
export const AlertDialogStory: Story = {
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
