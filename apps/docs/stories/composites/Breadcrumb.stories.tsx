import type { Meta, StoryObj } from '@storybook/react'
import { Breadcrumb } from '@forgeui/components'
import type { BreadcrumbItem } from '@forgeui/components'

const meta: Meta = {
  title: 'Composites/Breadcrumb',
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj

const CRUMBS: BreadcrumbItem[] = [
  { label: 'Project', href: '#' },
  { label: 'Assets',  href: '#' },
  { label: 'Textures', href: '#' },
  { label: 'diffuse_albedo.png' },
]

export const Default: Story = {
  name: 'Breadcrumb',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Breadcrumb items={CRUMBS} />
      <Breadcrumb items={[{ label: 'Project' }]} />
      <Breadcrumb items={[{ label: 'Project', href: '#' }, { label: 'SpaceShooter.level' }]} />
    </div>
  ),
}
