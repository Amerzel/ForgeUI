# Theme Extension Pattern

ForgeUI supports domain-specific extension tokens via `ThemeProvider.extensions`.
This lets each tool add its own CSS custom properties on top of the shared ForgeUI
token set — without conflicts between tools, and with full TypeScript type safety.

---

## Overview

1. **Define** your tool's extension interface (extends `ThemeContract`)
2. **Pass** extension values to `<ThemeProvider extensions={...}>`
3. **Use** extension tokens in CSS via custom properties (`--lore-*`)
4. **Access** extension values in canvas/WebGL code via `useTokens<T>()`

---

## T16.2 — LoreEngine Extension Example

### Step 1: Define the contract

Create a file `src/theme.ts` in your tool:

```typescript
import type { ThemeContract } from '@forgeui/hooks'

/**
 * LoreEngine-specific CSS custom properties.
 * Keys must be valid CSS custom property names (start with --).
 */
export interface LoreExtensions extends ThemeContract {
  // Faction colors (6 factions × 2 shades)
  '--lore-faction-arcane': string
  '--lore-faction-arcane-muted': string
  '--lore-faction-nature': string
  '--lore-faction-nature-muted': string
  '--lore-faction-void': string
  '--lore-faction-void-muted': string
  // Prophecy and relic accents
  '--lore-prophecy': string
  '--lore-relic': string
  // UI-specific
  '--lore-timeline-clip': string
  '--lore-node-port-input': string
  '--lore-node-port-output': string
}

/**
 * Default LoreEngine extension token values.
 * Override per palette/mode as needed.
 */
export const LORE_EXTENSIONS: LoreExtensions = {
  '--lore-faction-arcane': '#c084fc',
  '--lore-faction-arcane-muted': 'color-mix(in srgb, #c084fc 20%, transparent)',
  '--lore-faction-nature': '#4ade80',
  '--lore-faction-nature-muted': 'color-mix(in srgb, #4ade80 20%, transparent)',
  '--lore-faction-void': '#818cf8',
  '--lore-faction-void-muted': 'color-mix(in srgb, #818cf8 20%, transparent)',
  '--lore-prophecy': '#f9a8d4',
  '--lore-relic': '#fb923c',
  '--lore-timeline-clip': '#a78bfa',
  '--lore-node-port-input': '#38bdf8',
  '--lore-node-port-output': '#34d399',
}
```

### Step 2: Mount ThemeProvider with extensions

```tsx
import { ThemeProvider } from '@forgeui/components'
import { LORE_EXTENSIONS } from './theme'

export function LoreApp() {
  return (
    <ThemeProvider palette="hearth-bronze" mode="dark" extensions={LORE_EXTENSIONS}>
      <LoreRoot />
    </ThemeProvider>
  )
}
```

The ThemeProvider injects each key as a CSS custom property on its wrapper div:

```html
<div
  data-palette="hearth-bronze"
  data-theme="dark"
  data-forge-provider=""
  style="--lore-faction-arcane: #c084fc; --lore-prophecy: #f9a8d4; ..."
>
  <!-- your app -->
</div>
```

### Step 3: Use in CSS / JSX

Extension tokens are available as CSS custom properties anywhere inside the provider:

```css
/* In your component's inline styles or CSS files */
.lore-faction-badge {
  background-color: var(--lore-faction-arcane-muted);
  color: var(--lore-faction-arcane);
  border: 1px solid var(--lore-faction-arcane);
}
```

```tsx
// In inline styles
<div style={{ backgroundColor: 'var(--lore-faction-nature)' }}>Nature faction</div>
```

### Step 4: Access in canvas / WebGL renderers

Use `useTokens<LoreExtensions>()` to get resolved string values for Canvas 2D or
WebGL contexts where CSS custom properties are unavailable:

```tsx
import { useTokens } from '@forgeui/hooks'
import type { LoreExtensions } from './theme'

function LoreCanvasRenderer() {
  const { tokens, extensions } = useTokens<LoreExtensions>()

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return

    // ForgeUI base tokens (resolved hex strings)
    ctx.fillStyle = tokens.bg
    ctx.strokeStyle = tokens.border

    // LoreEngine extension tokens (raw CSS values)
    ctx.fillStyle = extensions['--lore-faction-arcane']
  }, [tokens, extensions])

  return <canvas ref={canvasRef} />
}
```

**Note:** Extension token values are passed through as-is from your `extensions` prop.
For CSS functions like `color-mix(...)`, these won't resolve in canvas contexts.
Use plain hex/rgb values in canvas-bound extensions.

### Typed extension setter (useTheme)

```tsx
import { useTheme } from '@forgeui/hooks'
import type { LoreExtensions } from './theme'

function LoreToolbar() {
  const { palette, mode, setPalette, extensions } = useTheme<LoreExtensions>()
  // extensions is typed as LoreExtensions — full auto-complete
  console.log(extensions['--lore-prophecy']) // string
}
```

---

## T16.3 — Migration Guide Template

For any existing game dev tool adopting ForgeUI.

### Phase 1: Tokens Only

Replace hardcoded color/spacing constants with CSS custom properties from
`@forgeui/tokens`. No component changes needed.

**Token mapping table:**

| Hardcoded value          | ForgeUI token                                            | Notes                 |
| ------------------------ | -------------------------------------------------------- | --------------------- |
| `#1a1a2e`                | `var(--forge-bg)`                                        | Background            |
| `#16213e`                | `var(--forge-surface)`                                   | Panel/card background |
| `#0f3460`                | `var(--forge-surface-raised)`                            | Elevated surface      |
| `#e94560`                | `var(--forge-accent)`                                    | Primary accent        |
| `#ffffff`                | `var(--forge-text)`                                      | Primary text          |
| `rgba(255,255,255,0.5)`  | `var(--forge-text-muted)`                                | Secondary text        |
| `rgba(255,255,255,0.25)` | `var(--forge-border)`                                    | Default border        |
| `4px`                    | `var(--forge-radius-sm)`                                 | Border radius         |
| `8px`                    | `var(--forge-radius-md)`                                 | Medium radius         |
| `0.15s ease`             | `var(--forge-duration-fast) var(--forge-easing-default)` | Transition            |
| `12px`                   | `var(--forge-font-size-xs)`                              | XS text               |
| `14px`                   | `var(--forge-font-size-sm)`                              | SM text               |
| `16px`                   | `var(--forge-font-size-base)`                            | Base text             |

**How to apply:**

```tsx
// Before
import './App.css' // Contains hardcoded :root { --bg: #1a1a2e }

// After
import '@forgeui/tokens/tokens.css' // ForgeUI design tokens
import '@forgeui/components/styles' // ForgeUI component base styles

// Wrap your app
;<ThemeProvider palette="hearth-bronze" mode="dark">
  <App />
</ThemeProvider>
```

### Phase 2: Primitive Components

Replace ad-hoc button/input/text implementations with ForgeUI primitives.

**Component swap list:**

| Ad-hoc component                | ForgeUI equivalent | Notes                                  |
| ------------------------------- | ------------------ | -------------------------------------- |
| `<button className="btn">`      | `<Button>`         | Variants: default/primary/ghost/danger |
| `<button className="icon-btn">` | `<IconButton>`     | For icon-only buttons                  |
| `<input type="text">`           | `<Input>`          | With label, error, clearable           |
| `<textarea>`                    | `<Textarea>`       | Resizable, auto-grow                   |
| `<select>`                      | `<Select>`         | Accessible combobox                    |
| `<input type="checkbox">`       | `<Checkbox>`       | Radix-based                            |
| `<input type="range">`          | `<Slider>`         | Multi-thumb support                    |
| `<span className="badge">`      | `<Badge>`          | Color variants                         |
| Custom spinner                  | `<Spinner>`        | With accessible label                  |
| `<div className="card">`        | `<Card>`           | With Card.Header/Body/Footer           |
| Custom divider                  | `<Separator>`      | Horizontal/vertical                    |
| `<h1-h6>`                       | `<Heading>`        | Level prop                             |
| `<p>` styled text               | `<Text>`           | Size/weight variants                   |
| Custom kbd                      | `<Kbd>`            | Key combo rendering                    |
| Custom scroll area              | `<ScrollArea>`     | Styled scrollbar                       |

### Phase 3: Composite & Feedback Components

| Ad-hoc              | ForgeUI equivalent                |
| ------------------- | --------------------------------- |
| Custom modal        | `<Dialog>`                        |
| Custom tooltip      | `<Tooltip>` + `<TooltipProvider>` |
| Custom dropdown     | `<DropdownMenu>`                  |
| Right-click menu    | `<ContextMenu>`                   |
| Custom popover      | `<Popover>`                       |
| Custom tabs         | `<Tabs>`                          |
| Custom accordion    | `<Accordion>`                     |
| Inline alerts       | `<Alert>`                         |
| Custom progress bar | `<Progress>`                      |
| Loading placeholder | `<Skeleton>`                      |
| Custom toast system | `<ToastProvider>` + `<ToastList>` |
| Custom drawer/panel | `<Drawer>`                        |
| Custom toolbar      | `<Toolbar>`                       |
| Custom stepper      | `<Steps>`                         |
| File upload zone    | `<DropZone>`                      |
| Custom breadcrumbs  | `<Breadcrumb>`                    |
| Inline edit field   | `<EditableText>`                  |
| Tag chips           | `<TagsInput>`                     |
| Autocomplete        | `<Combobox>`                      |
| Command bar (⌘K)    | `<CommandPalette>`                |
| Tree structure      | `<TreeView>`                      |
| Entity inspector    | `<PropertyGrid>`                  |
| Data grid           | `<DataTable>`                     |
| Color input         | `<ColorPicker>`                   |

### Phase 4: Layout Components

| Ad-hoc                | ForgeUI equivalent                            |
| --------------------- | --------------------------------------------- |
| Custom app shell      | `<AppShell>` (nav/sidebar/main grid)          |
| Resizable split panes | `<ResizablePanelGroup>` + `<ResizablePanel>`  |
| Data table            | `<Table>` (static) or `<DataTable>` (dynamic) |
| Pagination controls   | `<Pagination>`                                |
| Custom menu bar       | `<Menubar>`                                   |

### Phase 5: Domain Components

| Use case                | ForgeUI equivalent               |
| ----------------------- | -------------------------------- |
| Node/graph editor       | `<NodeEditor>` (ReactFlow-based) |
| Animation timeline      | `<Timeline>`                     |
| Level/map editor canvas | `<VirtualCanvas>`                |

### Step-by-step adoption checklist

- [ ] **Install packages**: `pnpm add @forgeui/tokens @forgeui/components @forgeui/hooks @forgeui/icons`
- [ ] **Add CSS import**: `import '@forgeui/tokens/tokens.css'` at app entry
- [ ] **Wrap root**: `<ThemeProvider palette="..." mode="dark">` around app root
- [ ] **Define extensions**: Create `src/theme.ts` with tool-specific token interface
- [ ] **Migrate globals**: Replace `:root` hardcoded values with CSS var references
- [ ] **Phase 2 swap**: Replace button/input/form primitives one file at a time
- [ ] **Phase 3 swap**: Replace overlays, feedback, composites
- [ ] **Phase 4 swap**: Replace layout structure (AppShell last — largest change)
- [ ] **Phase 5 swap**: Adopt domain editors if applicable
- [ ] **Run a11y audit**: `pnpm vitest run` — all ForgeUI components are zero-violation
- [ ] **Check size-limit**: `pnpm size-limit` — target under 80 KB gzipped
- [ ] **Document extensions**: Update `src/theme.ts` with all tool-specific tokens
