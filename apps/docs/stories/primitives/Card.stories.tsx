import type { Meta, StoryObj } from '@storybook/react'
import { Card } from '@forgeui/components'

const meta: Meta<typeof Card> = {
  title: 'Primitives/Card',
  component: Card,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof Card>

export const Compound: Story = {
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
