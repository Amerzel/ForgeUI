import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Pagination, Text } from '@forgeui/components'

const meta: Meta = {
  title: 'Composites/Pagination',
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj

export const Default: Story = {
  name: 'Pagination',
  render: function PaginationDemo() {
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(25)
    const total = 1234
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <Pagination
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={setPage}
          onPageSizeChange={(p) => {
            setPageSize(p)
            setPage(1)
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <Text size="xs" style={{ color: 'var(--forge-text-muted)' }}>
            Small dataset (no ellipsis)
          </Text>
          <Pagination page={2} pageSize={10} total={50} onPageChange={() => {}} />
        </div>
        <div>
          <Text size="xs" style={{ color: 'var(--forge-text-muted)' }}>
            Disabled state
          </Text>
          <Pagination page={1} pageSize={25} total={500} onPageChange={() => {}} disabled />
        </div>
      </div>
    )
  },
}
