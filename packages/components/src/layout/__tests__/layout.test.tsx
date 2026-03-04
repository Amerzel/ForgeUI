import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { ThemeProvider } from '../../ThemeProvider/index.js'
import { Box } from '../Box.js'
import { Stack } from '../Stack.js'
import { Flex } from '../Flex.js'
import { Group } from '../Group.js'
import { Grid } from '../Grid.js'
import { Center } from '../Center.js'
import { Spacer } from '../Spacer.js'
import { Container } from '../Container.js'
import { SimpleGrid } from '../SimpleGrid.js'
import { Wrap } from '../Wrap.js'

function wrap(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>)
}

/** Navigate past the ThemeProvider wrapper div to the first rendered component */
function getEl(container: HTMLElement) {
  return container.querySelector('[data-forge-provider]')?.firstElementChild as HTMLElement
}

// ---------------------------------------------------------------------------
// Box
// ---------------------------------------------------------------------------
describe('Box', () => {
  it('renders as div by default', () => {
    const { container } = wrap(<Box data-testid="box">content</Box>)
    expect(container.querySelector('div')).toBeTruthy()
  })

  it('renders as a custom element via as prop', () => {
    const { container } = wrap(<Box as="section">content</Box>)
    expect(container.querySelector('section')).toBeTruthy()
  })

  it('applies padding token via p prop', () => {
    const { container } = wrap(<Box p={4}>content</Box>)
    const el = getEl(container)
    expect(el.style.paddingLeft).toBe('var(--forge-space-4)')
    expect(el.style.paddingRight).toBe('var(--forge-space-4)')
    expect(el.style.paddingTop).toBe('var(--forge-space-4)')
    expect(el.style.paddingBottom).toBe('var(--forge-space-4)')
  })

  it('specific padding overrides shorthand', () => {
    const { container } = wrap(
      <Box p={4} pl={2}>
        content
      </Box>,
    )
    const el = getEl(container)
    expect(el.style.paddingLeft).toBe('var(--forge-space-2)')
    expect(el.style.paddingRight).toBe('var(--forge-space-4)')
  })

  it('applies semantic background color', () => {
    const { container } = wrap(<Box bg="surface">content</Box>)
    const el = getEl(container)
    expect(el.style.backgroundColor).toBe('var(--forge-surface)')
  })

  it('passes through raw CSS color', () => {
    const { container } = wrap(<Box bg="#ff0000">content</Box>)
    const el = getEl(container)
    expect(el.style.backgroundColor).toBe('rgb(255, 0, 0)')
  })

  it('applies semantic text color', () => {
    const { container } = wrap(<Box c="text-muted">content</Box>)
    const el = getEl(container)
    expect(el.style.color).toBe('var(--forge-text-muted)')
  })

  it('applies radius token', () => {
    const { container } = wrap(<Box radius="md">content</Box>)
    const el = getEl(container)
    expect(el.style.borderRadius).toBe('var(--forge-radius-md)')
  })

  it('merges consumer style prop', () => {
    const { container } = wrap(
      <Box p={4} style={{ border: '1px solid red' }}>
        content
      </Box>,
    )
    const el = getEl(container)
    expect(el.style.border).toBe('1px solid red')
    expect(el.style.paddingLeft).toBe('var(--forge-space-4)')
  })

  it('passes axe', async () => {
    const { container } = wrap(
      <Box>
        <p>Hello</p>
      </Box>,
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// Stack
// ---------------------------------------------------------------------------
describe('Stack', () => {
  it('renders a column flex container', () => {
    const { container } = wrap(
      <Stack>
        <div>a</div>
        <div>b</div>
      </Stack>,
    )
    const el = getEl(container)
    expect(el.style.display).toBe('flex')
    expect(el.style.flexDirection).toBe('column')
  })

  it('applies gap token', () => {
    const { container } = wrap(
      <Stack gap={4}>
        <div>a</div>
      </Stack>,
    )
    const el = getEl(container)
    expect(el.style.gap).toBe('var(--forge-space-4)')
  })

  it('accepts spacing alias', () => {
    const { container } = wrap(
      <Stack spacing={2}>
        <div>a</div>
      </Stack>,
    )
    const el = getEl(container)
    expect(el.style.gap).toBe('var(--forge-space-2)')
  })

  it('renders column-reverse when reverse=true', () => {
    const { container } = wrap(
      <Stack reverse>
        <div>a</div>
      </Stack>,
    )
    const el = getEl(container)
    expect(el.style.flexDirection).toBe('column-reverse')
  })

  it('passes axe', async () => {
    const { container } = wrap(
      <Stack>
        <p>A</p>
        <p>B</p>
      </Stack>,
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// Flex
// ---------------------------------------------------------------------------
describe('Flex', () => {
  it('renders a flex container', () => {
    const { container } = wrap(
      <Flex>
        <div>a</div>
      </Flex>,
    )
    const el = getEl(container)
    expect(el.style.display).toBe('flex')
  })

  it('applies direction prop', () => {
    const { container } = wrap(
      <Flex direction="row-reverse">
        <div>a</div>
      </Flex>,
    )
    const el = getEl(container)
    expect(el.style.flexDirection).toBe('row-reverse')
  })

  it('renders inline-flex when inline=true', () => {
    const { container } = wrap(
      <Flex inline>
        <span>a</span>
      </Flex>,
    )
    const el = getEl(container)
    expect(el.style.display).toBe('inline-flex')
  })

  it('passes axe', async () => {
    const { container } = wrap(
      <Flex>
        <p>A</p>
      </Flex>,
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// Group
// ---------------------------------------------------------------------------
describe('Group', () => {
  it('renders a row flex container', () => {
    const { container } = wrap(
      <Group>
        <span>a</span>
        <span>b</span>
      </Group>,
    )
    const el = getEl(container)
    expect(el.style.display).toBe('flex')
    expect(el.style.flexDirection).toBe('row')
  })

  it('defaults align to center', () => {
    const { container } = wrap(
      <Group>
        <span>a</span>
      </Group>,
    )
    const el = getEl(container)
    expect(el.style.alignItems).toBe('center')
  })

  it('defaults gap to space-2', () => {
    const { container } = wrap(
      <Group>
        <span>a</span>
      </Group>,
    )
    const el = getEl(container)
    expect(el.style.gap).toBe('var(--forge-space-2)')
  })

  it('passes axe', async () => {
    const { container } = wrap(
      <Group>
        <span>A</span>
        <span>B</span>
      </Group>,
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// Grid
// ---------------------------------------------------------------------------
describe('Grid', () => {
  it('renders a grid container', () => {
    const { container } = wrap(
      <Grid columns={3}>
        <div>a</div>
      </Grid>,
    )
    const el = getEl(container)
    expect(el.style.display).toBe('grid')
  })

  it('converts numeric columns to repeat(N, 1fr)', () => {
    const { container } = wrap(
      <Grid columns={3}>
        <div>a</div>
      </Grid>,
    )
    const el = getEl(container)
    expect(el.style.gridTemplateColumns).toBe('repeat(3, 1fr)')
  })

  it('passes string columns through', () => {
    const { container } = wrap(
      <Grid columns="300px 1fr 360px">
        <div>a</div>
      </Grid>,
    )
    const el = getEl(container)
    expect(el.style.gridTemplateColumns).toBe('300px 1fr 360px')
  })

  it('Grid.Col applies span', () => {
    const { container } = wrap(
      <Grid columns={12}>
        <Grid.Col span={4}>a</Grid.Col>
      </Grid>,
    )
    const col = container.querySelector('[data-forge-provider] > div > div') as HTMLElement
    expect(col.style.gridColumn).toBe('span 4 / span 4')
  })

  it('passes axe', async () => {
    const { container } = wrap(
      <Grid columns={2}>
        <div>A</div>
        <div>B</div>
      </Grid>,
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// Center
// ---------------------------------------------------------------------------
describe('Center', () => {
  it('centers content', () => {
    const { container } = wrap(<Center>content</Center>)
    const el = getEl(container)
    expect(el.style.display).toBe('flex')
    expect(el.style.alignItems).toBe('center')
    expect(el.style.justifyContent).toBe('center')
  })

  it('renders inline-flex when inline=true', () => {
    const { container } = wrap(<Center inline>content</Center>)
    const el = getEl(container)
    expect(el.style.display).toBe('inline-flex')
  })

  it('passes axe', async () => {
    const { container } = wrap(
      <Center>
        <p>Centered</p>
      </Center>,
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// Spacer
// ---------------------------------------------------------------------------
describe('Spacer', () => {
  it('renders with flex: 1 1', () => {
    const { container } = wrap(
      <Flex>
        <span>a</span>
        <Spacer />
        <span>b</span>
      </Flex>,
    )
    const spacer = container.querySelector('[data-forge-provider] > div > div') as HTMLElement
    expect(spacer.style.flexGrow).toBe('1')
    expect(spacer.style.flexShrink).toBe('1')
  })

  it('passes axe', async () => {
    const { container } = wrap(
      <Flex>
        <span>A</span>
        <Spacer />
        <span>B</span>
      </Flex>,
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// Container
// ---------------------------------------------------------------------------
describe('Container', () => {
  it('renders with auto margins', () => {
    const { container } = wrap(<Container>content</Container>)
    const el = getEl(container)
    expect(el.style.marginLeft).toBe('auto')
    expect(el.style.marginRight).toBe('auto')
  })

  it('applies size token', () => {
    const { container } = wrap(<Container size="md">content</Container>)
    const el = getEl(container)
    expect(el.style.maxWidth).toBe('var(--forge-max-w-md)')
  })

  it('removes maxWidth when fluid=true', () => {
    const { container } = wrap(<Container fluid>content</Container>)
    const el = getEl(container)
    expect(el.style.maxWidth).toBe('')
  })

  it('passes axe', async () => {
    const { container } = wrap(
      <Container>
        <p>Content</p>
      </Container>,
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// SimpleGrid
// ---------------------------------------------------------------------------
describe('SimpleGrid', () => {
  it('renders a grid with equal columns', () => {
    const { container } = wrap(
      <SimpleGrid cols={3}>
        <div>a</div>
      </SimpleGrid>,
    )
    const el = getEl(container)
    expect(el.style.display).toBe('grid')
    expect(el.style.gridTemplateColumns).toBe('repeat(3, 1fr)')
  })

  it('uses auto-fit with minChildWidth', () => {
    const { container } = wrap(
      <SimpleGrid minChildWidth="200px">
        <div>a</div>
      </SimpleGrid>,
    )
    const el = getEl(container)
    expect(el.style.gridTemplateColumns).toBe('repeat(auto-fit, minmax(200px, 1fr))')
  })

  it('passes axe', async () => {
    const { container } = wrap(
      <SimpleGrid cols={2}>
        <div>A</div>
        <div>B</div>
      </SimpleGrid>,
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})

// ---------------------------------------------------------------------------
// sp() string aliases
// ---------------------------------------------------------------------------
describe('sp string aliases', () => {
  it('resolves xs to space-1', () => {
    const { container } = wrap(<Box p="xs">content</Box>)
    const el = getEl(container)
    expect(el.style.paddingLeft).toBe('var(--forge-space-1)')
  })

  it('resolves sm to space-2', () => {
    const { container } = wrap(<Box p="sm">content</Box>)
    const el = getEl(container)
    expect(el.style.paddingLeft).toBe('var(--forge-space-2)')
  })

  it('resolves md to space-4', () => {
    const { container } = wrap(
      <Stack gap="md">
        <div>a</div>
      </Stack>,
    )
    const el = getEl(container)
    expect(el.style.gap).toBe('var(--forge-space-4)')
  })

  it('resolves lg to space-6', () => {
    const { container } = wrap(<Box px="lg">content</Box>)
    const el = getEl(container)
    expect(el.style.paddingLeft).toBe('var(--forge-space-6)')
  })

  it('resolves xl to space-8', () => {
    const { container } = wrap(
      <Flex gap="xl">
        <div>a</div>
      </Flex>,
    )
    const el = getEl(container)
    expect(el.style.gap).toBe('var(--forge-space-8)')
  })
})

// ---------------------------------------------------------------------------
// Wrap
// ---------------------------------------------------------------------------
describe('Wrap', () => {
  it('renders flex-wrap container', () => {
    const { container } = wrap(
      <Wrap>
        <span>a</span>
      </Wrap>,
    )
    const el = getEl(container)
    expect(el.style.display).toBe('flex')
    expect(el.style.flexWrap).toBe('wrap')
  })

  it('defaults gap to space-2', () => {
    const { container } = wrap(
      <Wrap>
        <span>a</span>
      </Wrap>,
    )
    const el = getEl(container)
    expect(el.style.gap).toBe('var(--forge-space-2)')
  })

  it('passes axe', async () => {
    const { container } = wrap(
      <Wrap>
        <span>A</span>
        <span>B</span>
      </Wrap>,
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
