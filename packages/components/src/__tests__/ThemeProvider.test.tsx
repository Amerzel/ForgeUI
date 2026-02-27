import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '../ThemeProvider/index.js'
import { useTheme, useTokens, usePortalContainer } from '@forgeui/hooks'

// Helper consumer component that reads context
function ThemeDisplay() {
  const { palette, mode, setPalette, setMode } = useTheme()
  const { tokens } = useTokens()
  return (
    <div>
      <span data-testid="palette">{palette}</span>
      <span data-testid="mode">{mode}</span>
      <span data-testid="bg">{tokens.bg}</span>
      <button onClick={() => setPalette('midnight-forge')}>switch palette</button>
      <button onClick={() => setMode('light')}>switch mode</button>
    </div>
  )
}

describe('ThemeProvider', () => {
  it('renders children', () => {
    render(
      <ThemeProvider>
        <span>hello</span>
      </ThemeProvider>,
    )
    expect(screen.getByText('hello')).toBeInTheDocument()
  })

  it('sets data-palette and data-theme attributes', () => {
    const { container } = render(
      <ThemeProvider palette="deep-space" mode="dark">
        <span>child</span>
      </ThemeProvider>,
    )
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toHaveAttribute('data-palette', 'deep-space')
    expect(wrapper).toHaveAttribute('data-theme', 'dark')
    expect(wrapper).toHaveAttribute('data-forge-provider')
  })

  it('defaults to midnight-forge-v2 dark', () => {
    const { container } = render(
      <ThemeProvider>
        <span />
      </ThemeProvider>,
    )
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toHaveAttribute('data-palette', 'midnight-forge-v2')
    expect(wrapper).toHaveAttribute('data-theme', 'dark')
  })

  it('injects extension tokens as inline styles', () => {
    const { container } = render(
      <ThemeProvider extensions={{ '--lore-prophecy': '#c084fc' }}>
        <span />
      </ThemeProvider>,
    )
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.style.getPropertyValue('--lore-prophecy')).toBe('#c084fc')
  })

  it('provides palette and mode via useTheme()', () => {
    render(
      <ThemeProvider palette="midnight-forge" mode="dark">
        <ThemeDisplay />
      </ThemeProvider>,
    )
    expect(screen.getByTestId('palette')).toHaveTextContent('midnight-forge')
    expect(screen.getByTestId('mode')).toHaveTextContent('dark')
  })

  it('provides resolved token values via useTokens()', () => {
    render(
      <ThemeProvider palette="hearth-bronze" mode="dark">
        <ThemeDisplay />
      </ThemeProvider>,
    )
    // Hearth Bronze dark bg is #0c0805
    expect(screen.getByTestId('bg')).toHaveTextContent('#0c0805')
  })

  it('updates data attribute when palette changes', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <ThemeProvider>
        <ThemeDisplay />
      </ThemeProvider>,
    )
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toHaveAttribute('data-palette', 'midnight-forge-v2')
    await user.click(screen.getByText('switch palette'))
    expect(wrapper).toHaveAttribute('data-palette', 'midnight-forge')
  })

  it('updates data attribute when mode changes', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <ThemeProvider>
        <ThemeDisplay />
      </ThemeProvider>,
    )
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toHaveAttribute('data-theme', 'dark')
    await user.click(screen.getByText('switch mode'))
    expect(wrapper).toHaveAttribute('data-theme', 'light')
  })

  it('provides portal container via usePortalContainer()', () => {
    function PortalContainerDisplay() {
      const container = usePortalContainer()
      return <span data-testid="has-container">{container ? 'yes' : 'no'}</span>
    }
    const { container } = render(
      <ThemeProvider>
        <PortalContainerDisplay />
      </ThemeProvider>,
    )
    expect(screen.getByTestId('has-container')).toHaveTextContent('yes')
    // The portal container should be the ThemeProvider wrapper div
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toHaveAttribute('data-forge-provider')
  })

  it('returns undefined from usePortalContainer() without ThemeProvider', () => {
    function PortalContainerDisplay() {
      const container = usePortalContainer()
      return <span data-testid="has-container">{container ? 'yes' : 'no'}</span>
    }
    render(<PortalContainerDisplay />)
    expect(screen.getByTestId('has-container')).toHaveTextContent('no')
  })
})
