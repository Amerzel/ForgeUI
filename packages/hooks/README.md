# @forgeui/hooks

React 19 hooks for consuming the ForgeUI theme context — read and switch the active palette/mode, and access resolved token values for canvas and WebGL rendering.

## Installation

```bash
npm install @forgeui/hooks @forgeui/tokens
```

`@forgeui/hooks` is automatically installed as a dependency of `@forgeui/components`. Install it directly only if you need hooks without the full component library.

## Setup

Both hooks require a `ThemeProvider` ancestor from `@forgeui/components`:

```tsx
import { ThemeProvider } from '@forgeui/components'

export function App() {
  return (
    <ThemeProvider palette="hearth-bronze" mode="dark">
      <YourApp />
    </ThemeProvider>
  )
}
```

## useTheme

Read and switch the active palette and mode at runtime:

```tsx
import { useTheme } from '@forgeui/hooks'

function ThemeSwitcher() {
  const { palette, mode, setPalette, setMode } = useTheme()

  return (
    <>
      <select value={palette} onChange={e => setPalette(e.target.value as Palette)}>
        <option value="hearth-bronze">Hearth Bronze</option>
        <option value="midnight-forge">Midnight Forge</option>
        <option value="deep-space">Deep Space</option>
        <option value="midnight-forge-v2">Midnight Forge v2</option>
      </select>

      <button onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}>
        Toggle {mode === 'dark' ? 'Light' : 'Dark'} Mode
      </button>
    </>
  )
}
```

### Return value

| Field | Type | Description |
|-------|------|-------------|
| `palette` | `'hearth-bronze' \| 'midnight-forge' \| 'deep-space' \| 'midnight-forge-v2'` | Active palette |
| `mode` | `'dark' \| 'light'` | Active mode |
| `setPalette` | `(p: Palette) => void` | Switch palette — updates `data-palette` attribute instantly |
| `setMode` | `(m: Mode) => void` | Switch mode — updates `data-theme` attribute instantly |
| `extensions` | `TExtensions` | Tool-specific extension tokens (see below) |

Switching palette or mode swaps CSS custom properties via data attributes — no page reload or JS recalculation needed.

## useTokens

Get resolved token values as plain JS strings and numbers for use in `<canvas>`, WebGL, or any context where CSS variables cannot be read:

```tsx
import { useTokens } from '@forgeui/hooks'

function CanvasRenderer() {
  const tokens = useTokens()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = tokens.bg       // '#0c0805'
    ctx.fillRect(0, 0, width, height)

    ctx.strokeStyle = tokens.border // '#3f3227'
    ctx.lineWidth = 1
    ctx.strokeRect(x, y, w, h)

    ctx.fillStyle = tokens.accent   // '#d97706'
    ctx.fillText('Selected', x, y)
  }, [tokens])

  return <canvas ref={canvasRef} />
}
```

### Return value

| Field | Type | Description |
|-------|------|-------------|
| `bg` | `string` | Background hex — `#0c0805` |
| `surface` | `string` | Surface hex |
| `surfaceRaised` | `string` | Raised surface hex |
| `border` | `string` | Default border hex |
| `borderSubtle` | `string` | Subtle border hex |
| `text` | `string` | Primary text hex |
| `textMuted` | `string` | Muted text hex |
| `accent` | `string` | Accent color hex |
| `info` | `string` | Info status hex |
| `success` | `string` | Success status hex |
| `warning` | `string` | Warning status hex |
| `danger` | `string` | Danger status hex |
| `extensions` | `TExtensions` | Tool-specific extension tokens |

### WebGL usage

Combine `useTokens` with `hexToGlsl` from `@forgeui/tokens/color` to pass token colors as WebGL uniforms:

```tsx
import { useTokens } from '@forgeui/hooks'
import { hexToGlsl } from '@forgeui/tokens/color'

function WebGLRenderer({ gl }: { gl: WebGLRenderingContext }) {
  const tokens = useTokens()

  useEffect(() => {
    const [r, g, b, a] = hexToGlsl(tokens.accent)
    gl.uniform4f(colorUniform, r, g, b, a)

    const [br, bg_, bb, ba] = hexToGlsl(tokens.bg)
    gl.clearColor(br, bg_, bb, ba)
  }, [tokens, gl])
}
```

## Type-safe tool extensions

When a tool provides extension tokens via `ThemeProvider`, both hooks expose them with full type safety using a generic type parameter:

```tsx
import { useTheme, useTokens } from '@forgeui/hooks'

interface LoreExtensions {
  prophecy: string
  factionPrimary: string
  factionSecondary: string
}

function LoreCanvas() {
  const tokens = useTokens<LoreExtensions>()
  // tokens.extensions.prophecy — typed as string

  const { extensions } = useTheme<LoreExtensions>()
  // extensions.factionPrimary — typed as string
}
```

See [THEME-EXTENSION.md](../../docs/THEME-EXTENSION.md) for the full extension pattern including CSS injection.
