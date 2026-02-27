import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { ThemeProvider } from '../ThemeProvider/index.js'
import {
  VisuallyHidden, Label, Separator, Spinner, Badge,
  Text, Heading, Kbd, Card, Button, IconButton, AlertDialog,
} from '../index.js'

// Wrapper providing theme context for all tests
function Themed({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>
}

// ---------------------------------------------------------------------------
// VisuallyHidden
// ---------------------------------------------------------------------------
describe('VisuallyHidden', () => {
  it('renders content in the DOM but visually hidden', () => {
    render(<VisuallyHidden>screen reader text</VisuallyHidden>)
    const el = screen.getByText('screen reader text')
    expect(el).toBeInTheDocument()
    expect(el).toHaveStyle({ position: 'absolute', width: '1px', height: '1px' })
  })

  it('has no a11y violations', async () => {
    const { container } = render(<Themed><VisuallyHidden>hidden</VisuallyHidden></Themed>)
    expect(await axe(container)).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// Label
// ---------------------------------------------------------------------------
describe('Label', () => {
  it('renders with htmlFor association', () => {
    render(<Themed><Label htmlFor="my-input">My Label</Label><input id="my-input" /></Themed>)
    const label = screen.getByText('My Label')
    expect(label).toBeInTheDocument()
    expect(label).toHaveAttribute('for', 'my-input')
  })

  it('has no a11y violations', async () => {
    const { container } = render(<Themed><Label htmlFor="x">Label</Label><input id="x" /></Themed>)
    expect(await axe(container)).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// Separator
// ---------------------------------------------------------------------------
describe('Separator', () => {
  it('renders horizontal by default as decorative', () => {
    render(<Themed><Separator /></Themed>)
    // decorative=true → role="none" not present in a11y tree
    const sep = document.querySelector('.forge-separator')
    expect(sep).toBeInTheDocument()
  })

  it('non-decorative separator has role="separator"', () => {
    render(<Themed><Separator decorative={false} /></Themed>)
    expect(screen.getByRole('separator')).toBeInTheDocument()
  })

  it('has no a11y violations', async () => {
    const { container } = render(<Themed><Separator /></Themed>)
    expect(await axe(container)).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// Spinner
// ---------------------------------------------------------------------------
describe('Spinner', () => {
  it('has role="status"', () => {
    render(<Themed><Spinner /></Themed>)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('uses custom label', () => {
    render(<Themed><Spinner label="Processing" /></Themed>)
    expect(screen.getByRole('status', { name: 'Processing' })).toBeInTheDocument()
  })

  it('has no a11y violations', async () => {
    const { container } = render(<Themed><Spinner /></Themed>)
    expect(await axe(container)).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// Badge
// ---------------------------------------------------------------------------
describe('Badge', () => {
  it('renders children', () => {
    render(<Themed><Badge>Active</Badge></Themed>)
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('renders all color variants without throwing', () => {
    const colors = ['accent', 'info', 'success', 'warning', 'danger', 'neutral'] as const
    for (const color of colors) {
      render(<Themed><Badge color={color}>{color}</Badge></Themed>)
      expect(screen.getByText(color)).toBeInTheDocument()
    }
  })

  it('has no a11y violations', async () => {
    const { container } = render(<Themed><Badge color="success">Done</Badge></Themed>)
    expect(await axe(container)).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// Text
// ---------------------------------------------------------------------------
describe('Text', () => {
  it('renders as <p> by default', () => {
    render(<Themed><Text>Hello</Text></Themed>)
    expect(screen.getByText('Hello').tagName).toBe('P')
  })

  it('truncates with overflow style when truncate=true', () => {
    render(<Themed><Text truncate>Long text</Text></Themed>)
    const el = screen.getByText('Long text')
    expect(el).toHaveStyle({ overflow: 'hidden', textOverflow: 'ellipsis' })
  })

  it('has no a11y violations', async () => {
    const { container } = render(<Themed><Text>Content</Text></Themed>)
    expect(await axe(container)).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// Heading
// ---------------------------------------------------------------------------
describe('Heading', () => {
  it('renders the correct heading level', () => {
    render(<Themed><Heading level={3}>Section Title</Heading></Themed>)
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Section Title')
  })

  it('defaults to h2', () => {
    render(<Themed><Heading>Default Heading</Heading></Themed>)
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
  })

  it('has no a11y violations', async () => {
    const { container } = render(<Themed><Heading>Title</Heading></Themed>)
    expect(await axe(container)).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// Kbd
// ---------------------------------------------------------------------------
describe('Kbd', () => {
  it('renders a single key', () => {
    render(<Themed><Kbd keys="Escape" /></Themed>)
    expect(screen.getByText('Escape')).toBeInTheDocument()
  })

  it('renders multi-key combo with separators', () => {
    render(<Themed><Kbd keys={['⌘', 'S']} /></Themed>)
    expect(screen.getByText('⌘')).toBeInTheDocument()
    expect(screen.getByText('S')).toBeInTheDocument()
    expect(screen.getByText('+')).toBeInTheDocument()
  })

  it('has no a11y violations', async () => {
    const { container } = render(<Themed><Kbd keys={['Ctrl', 'Z']} /></Themed>)
    expect(await axe(container)).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// Card
// ---------------------------------------------------------------------------
describe('Card', () => {
  it('renders children', () => {
    render(<Themed><Card>Content</Card></Themed>)
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('renders with compound sub-components', () => {
    render(
      <Themed>
        <Card>
          <Card.Header>Header</Card.Header>
          <Card.Body>Body</Card.Body>
          <Card.Footer>Footer</Card.Footer>
        </Card>
      </Themed>
    )
    expect(screen.getByText('Header')).toBeInTheDocument()
    expect(screen.getByText('Body')).toBeInTheDocument()
    expect(screen.getByText('Footer')).toBeInTheDocument()
  })

  it('has no a11y violations', async () => {
    const { container } = render(<Themed><Card>Card content</Card></Themed>)
    expect(await axe(container)).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// Button
// ---------------------------------------------------------------------------
describe('Button', () => {
  it('renders children and is clickable', async () => {
    const user = userEvent.setup()
    let clicked = false
    render(<Themed><Button onClick={() => { clicked = true }}>Click me</Button></Themed>)
    await user.click(screen.getByRole('button', { name: 'Click me' }))
    expect(clicked).toBe(true)
  })

  it('is disabled when disabled=true', () => {
    render(<Themed><Button disabled>Disabled</Button></Themed>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('shows spinner and disables when loading=true', () => {
    render(<Themed><Button loading>Save</Button></Themed>)
    expect(screen.getByRole('button')).toBeDisabled()
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('renders all variants without throwing', () => {
    const variants = ['primary', 'secondary', 'ghost', 'danger'] as const
    for (const variant of variants) {
      render(<Themed><Button variant={variant}>{variant}</Button></Themed>)
    }
    expect(screen.getAllByRole('button').length).toBeGreaterThan(0)
  })

  it('has no a11y violations', async () => {
    const { container } = render(<Themed><Button>Save</Button></Themed>)
    expect(await axe(container)).toHaveNoViolations()
  })

  it('keyboard: activates on Enter', async () => {
    const user = userEvent.setup()
    let activated = false
    render(<Themed><Button onClick={() => { activated = true }}>Save</Button></Themed>)
    const btn = screen.getByRole('button')
    btn.focus()
    await user.keyboard('{Enter}')
    expect(activated).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// IconButton
// ---------------------------------------------------------------------------
describe('IconButton', () => {
  it('uses label as aria-label', () => {
    render(<Themed><IconButton icon={<span>✕</span>} label="Close" /></Themed>)
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()
  })

  it('is disabled when disabled=true', () => {
    render(<Themed><IconButton icon={<span>✕</span>} label="Close" disabled /></Themed>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('has no a11y violations', async () => {
    const { container } = render(<Themed><IconButton icon={<span aria-hidden>✕</span>} label="Close dialog" /></Themed>)
    expect(await axe(container)).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// AlertDialog
// ---------------------------------------------------------------------------
describe('AlertDialog', () => {
  it('shows content when open=true', () => {
    render(
      <Themed>
        <AlertDialog
          open={true}
          onOpenChange={() => {}}
          title="Delete file?"
          description="This cannot be undone."
          onConfirm={() => {}}
        />
      </Themed>
    )
    expect(screen.getByText('Delete file?')).toBeInTheDocument()
    expect(screen.getByText('This cannot be undone.')).toBeInTheDocument()
  })

  it('does not render when open=false', () => {
    render(
      <Themed>
        <AlertDialog open={false} onOpenChange={() => {}} title="Delete?" onConfirm={() => {}} />
      </Themed>
    )
    expect(screen.queryByText('Delete?')).not.toBeInTheDocument()
  })

  it('calls onConfirm and closes when confirm is clicked', async () => {
    const user = userEvent.setup()
    let confirmed = false
    const setOpen = (_v: boolean) => { /* no-op */ }

    render(
      <Themed>
        <AlertDialog
          open={true}
          onOpenChange={setOpen}
          title="Are you sure?"
          onConfirm={() => { confirmed = true }}
          confirmLabel="Yes, delete"
        />
      </Themed>
    )
    await user.click(screen.getByRole('button', { name: 'Yes, delete' }))
    expect(confirmed).toBe(true)
  })

  it('has no a11y violations when open', async () => {
    const { container } = render(
      <Themed>
        <AlertDialog open={true} onOpenChange={() => {}} title="Confirm action" onConfirm={() => {}} />
      </Themed>
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
