# ForgeUI — Design System Plan

## Problem

9 game development tools share zero UI code. LoreEngine alone has 80+ UI items
on its roadmap. Each tool building ad-hoc components means inconsistent UX,
duplicated effort, and expensive retrofitting later.

## Solution

ForgeUI is a comprehensive design system built on **Radix Primitives + custom
token-based styling**, published as npm packages consumed by all tools.

---

## Repository structure

```
ForgeUI/
├── packages/
│   ├── tokens/                  # @forgeui/tokens
│   │   └── src/
│   │       ├── colors.ts        # Color palette + semantic aliases
│   │       ├── spacing.ts       # Spacing scale (4px base)
│   │       ├── typography.ts    # Type scale, font stacks, weights
│   │       ├── shadows.ts       # Elevation shadows
│   │       ├── animations.ts    # Duration + easing tokens
│   │       ├── layout.ts        # Layout constants (nav height, sidebar width)
│   │       ├── radii.ts         # Border radius scale
│   │       └── index.ts         # Barrel export + CSS variable generator
│   │
│   ├── components/              # @forgeui/components
│   │   ├── src/
│   │   │   ├── primitives/      # Button, Badge, IconButton, Link, Text, Separator
│   │   │   ├── forms/           # FormField, Input, TextArea, Select, Switch, Checkbox,
│   │   │   │                    # RadioGroup, Chip, ChipGroup, DatePicker
│   │   │   ├── composites/      # Card, Panel, Drawer, Tabs, Accordion
│   │   │   ├── data-display/    # DataTable, List, ListItem, ActivityFeed,
│   │   │   │                    # StatusGrid, DiffView
│   │   │   ├── navigation/      # NavBar, Sidebar, Breadcrumb, CommandPalette
│   │   │   ├── feedback/        # Toast, Spinner, EmptyState, ErrorBoundary, Skeleton
│   │   │   ├── overlays/        # Dialog, Popover, Tooltip, ContextMenu, DropdownMenu
│   │   │   └── layout/          # AppShell, SplitPane, Stack, Grid
│   │   ├── styles/
│   │   │   └── base.css         # CSS reset + token-driven global styles
│   │   └── package.json
│   │
│   ├── icons/                   # @forgeui/icons
│   │   └── src/
│   │       └── ...              # SVG icon components
│   │
│   └── hooks/                   # @forgeui/hooks
│       └── src/
│           ├── useTheme.ts      # Theme toggle + persistence
│           ├── useKeyboardShortcut.ts
│           ├── useMediaQuery.ts
│           └── useLocalStorage.ts
│
├── apps/
│   └── docs/                    # Storybook 8 documentation site
│       ├── .storybook/
│       └── stories/
│
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

---

## Design tokens

### Colors

Extracted from LoreEngine's existing dark theme and formalized into a systematic
palette. Dark-first with light mode support planned (LoreEngine UX-01).

#### Base palette

```
Background:     --forge-bg:              #1a1a2e
Surface:        --forge-surface:         #16213e
Surface hover:  --forge-surface-hover:   #1a2744
Surface raised: --forge-surface-raised:  #1e2d4a
Border:         --forge-border:          #0f3460
Border subtle:  --forge-border-subtle:   #0a2540
```

#### Text

```
Primary:   --forge-text:          #e0e0e0
Secondary: --forge-text-muted:    #8892a4
Disabled:  --forge-text-disabled: #5a6577
Inverse:   --forge-text-inverse:  #1a1a2e
```

#### Semantic

```
Highlight:       --forge-highlight:       #e94560
Highlight hover: --forge-highlight-hover: #d63550
Accent:          --forge-accent:          #0f3460
Success:         --forge-success:         #4caf50
Danger:          --forge-danger:          #e94560
Warning:         --forge-warning:         #ff9800
Info:            --forge-info:            #2196f3
```

#### Entity type palette (LoreEngine domain, extensible)

```
character:  #2e4057    location:  #3a5a40    event:    #6b3fa0
faction:    #8b4513    item:      #4a6fa5    concept:  #5c5c8a
creature:   #7a4069    prophecy:  #6a5acd    secret:   #8b0000
rumor:      #b8860b
```

### Spacing

4px base unit. Consistent across all tools.

```
--forge-space-0:  0
--forge-space-px: 1px
--forge-space-1:  0.25rem  (4px)
--forge-space-2:  0.5rem   (8px)
--forge-space-3:  0.75rem  (12px)
--forge-space-4:  1rem     (16px)
--forge-space-5:  1.25rem  (20px)
--forge-space-6:  1.5rem   (24px)
--forge-space-8:  2rem     (32px)
--forge-space-10: 2.5rem   (40px)
--forge-space-12: 3rem     (48px)
--forge-space-16: 4rem     (64px)
```

### Typography

```
Font family:  system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
Mono family:  'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace

--forge-text-xs:   0.7rem    (badges, tiny labels)
--forge-text-sm:   0.8rem    (form labels, metadata, captions)
--forge-text-base: 0.875rem  (body text, default)
--forge-text-md:   1rem      (subheadings, emphasis)
--forge-text-lg:   1.25rem   (section headers)
--forge-text-xl:   1.5rem    (page titles)
--forge-text-2xl:  1.75rem   (hero titles)

--forge-weight-normal:   400
--forge-weight-medium:   500
--forge-weight-semibold: 600
--forge-weight-bold:     700

--forge-leading-tight:   1.25
--forge-leading-normal:  1.5
--forge-leading-relaxed: 1.75
```

### Border radius

```
--forge-radius-sm:   3px   (badges, chips)
--forge-radius-md:   4px   (inputs, buttons)
--forge-radius-lg:   8px   (cards, panels)
--forge-radius-xl:   12px  (modals, dialogs)
--forge-radius-full: 9999px (pills, avatars)
```

### Shadows (elevation)

```
--forge-shadow-sm:  0 1px 3px rgba(0, 0, 0, 0.3)
--forge-shadow-md:  0 4px 12px rgba(0, 0, 0, 0.4)
--forge-shadow-lg:  0 8px 24px rgba(0, 0, 0, 0.5)
--forge-shadow-xl:  0 12px 36px rgba(0, 0, 0, 0.6)
```

### Animation

```
--forge-duration-fast:   100ms
--forge-duration-normal: 150ms
--forge-duration-slow:   300ms
--forge-duration-slower: 500ms

--forge-ease-default:    ease
--forge-ease-in-out:     cubic-bezier(0.4, 0, 0.2, 1)
--forge-ease-spring:     cubic-bezier(0.34, 1.56, 0.64, 1)
```

### Layout constants

```
--forge-nav-height:         56px
--forge-sidebar-width:      280px
--forge-sidebar-collapsed:  56px
--forge-detail-pane-width:  360px
--forge-content-max-width:  48rem
--forge-controls-width:     300px
```

---

## Component inventory

### Phase 1: Foundation (~25 components)

Core components needed by LoreEngine wave 1 and likely by all tools.

#### Primitives (7)

| Component | Radix base | Props | Notes |
|-----------|-----------|-------|-------|
| `Button` | — | variant (primary, secondary, danger, ghost), size (sm, md, lg), disabled, loading | Existing LoreEngine: `.btn`, `.btn--primary`, `.btn--danger`, `.btn--ghost`, `.btn--sm` |
| `Badge` | — | variant (type, status, visibility), color, size | LoreEngine's 23-variant badge system |
| `IconButton` | — | icon, label (aria), size, variant | Compact action triggers |
| `Link` | — | href, external, variant | Styled anchor with router integration |
| `Text` | — | as (p, span, h1-h6, label), size, weight, color, truncate | Semantic text rendering |
| `Separator` | Radix.Separator | orientation, decorative | Horizontal/vertical divider |
| `VisuallyHidden` | Radix.VisuallyHidden | — | Accessibility utility |

#### Forms (8)

| Component | Radix base | Props | Notes |
|-----------|-----------|-------|-------|
| `FormField` | — | label, error, description, required, children | Wrapper: label + input + error + help text |
| `Input` | — | type (text, number, search, password), size, placeholder | Existing: `.form-input` |
| `TextArea` | — | autoResize, minRows, maxRows | Existing: `.form-textarea` |
| `Select` | Radix.Select | options, placeholder, multiple | Dropdown selection |
| `Switch` | Radix.Switch | checked, onCheckedChange, label | Toggle switch |
| `Checkbox` | Radix.Checkbox | checked, onCheckedChange, label, indeterminate | Check toggle |
| `Chip` | — | label, selected, onToggle, removable, color | Filter chip / tag |
| `ChipGroup` | — | children, exclusive | Group of toggleable chips |

#### Feedback (4)

| Component | Radix base | Props | Notes |
|-----------|-----------|-------|-------|
| `Spinner` | — | size, message | Existing: `LoadingSpinner.tsx` |
| `EmptyState` | — | icon, title, description, action | Existing: `EmptyState.tsx` |
| `ErrorBoundary` | — | fallback, onReset | Existing: `ErrorBoundary.tsx` |
| `Skeleton` | — | width, height, variant (text, circle, rect) | Loading placeholder |

#### Overlays (3)

| Component | Radix base | Props | Notes |
|-----------|-----------|-------|-------|
| `Dialog` | Radix.Dialog | title, description, children, open, onOpenChange | Modal dialog |
| `Tooltip` | Radix.Tooltip | content, side, delayDuration | Hover tooltip |
| `DropdownMenu` | Radix.DropdownMenu | trigger, items, onSelect | Action menu |

#### Layout (3)

| Component | Radix base | Props | Notes |
|-----------|-----------|-------|-------|
| `Stack` | — | direction (h, v), gap, align, justify, wrap | Flexbox shorthand |
| `Grid` | — | columns, gap, minChildWidth | Responsive auto-fit grid |
| `Card` | — | header, footer, padding, variant (surface, raised, outlined) | Surface container |

### Phase 2: Composites (~15 components)

Needed for LoreEngine wave 1 packs and general tool UX.

| Component | Radix base | Props | Notes |
|-----------|-----------|-------|-------|
| `Drawer` | Radix.Dialog | side (left, right), title, width | Slide-out panel (UI-01 inspector) |
| `Tabs` | Radix.Tabs | tabs[], activeTab, onTabChange | Tab navigation |
| `Accordion` | Radix.Accordion | items[], type (single, multiple) | Collapsible sections |
| `Panel` | — | title, collapsible, actions, children | Titled section container |
| `Popover` | Radix.Popover | trigger, content, side | Floating content |
| `ContextMenu` | Radix.ContextMenu | trigger, items | Right-click menu (UX-07) |
| `Toast` | Radix.Toast | title, description, variant, duration | Notification |
| `CommandPalette` | Radix.Dialog | commands[], onSelect, placeholder | Keyboard command search (UX-02) |
| `NavBar` | — | brand, items, actions | App-level navigation bar |
| `Sidebar` | — | items, collapsible, width | Navigation sidebar |
| `AppShell` | — | nav, sidebar, main, detail | Full page layout scaffold |
| `SplitPane` | — | direction, defaultSizes, minSizes, onResize | Resizable panels |
| `DataTable` | — | columns, data, sortable, filterable, onRowClick | Tabular data display |
| `List` / `ListItem` | — | items, selectable, onSelect, renderItem | Selectable item list |
| `ActivityFeed` | — | events[], renderEvent | Timestamped event stream |

### Phase 3: Domain extensions

LoreEngine-specific components built on ForgeUI primitives. These stay in
LoreEngine's repo, not in ForgeUI, but demonstrate the design system's
extensibility.

- `EntityBadge` (wraps Badge with entity type colors)
- `CanonBadge` (wraps Badge with canon state colors)
- `VisibilityBadge` (wraps Badge with visibility colors)
- `EntityCard` (wraps Card + EntityBadge + metadata)
- `FindingCard` (wraps Card + severity + entity anchors)
- `DiffView` (before/after comparison for agent approval)
- `RevisionList` (wraps List for version history)

---

## Theming architecture

### CSS variable injection

Tokens are exported as both TypeScript objects and CSS variables. The
`ThemeProvider` component injects variables at the root level.

```tsx
import { ThemeProvider } from '@forgeui/components'
import { darkTheme } from '@forgeui/tokens'

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <AppShell>...</AppShell>
    </ThemeProvider>
  )
}
```

### Theme contract

Each theme must satisfy a `ThemeContract` type that defines all required
token categories. This ensures tools can't accidentally omit tokens.

```typescript
interface ThemeContract {
  colors: {
    bg: string
    surface: string
    surfaceHover: string
    border: string
    text: string
    textMuted: string
    highlight: string
    success: string
    danger: string
    warning: string
    info: string
  }
  spacing: Record<SpacingKey, string>
  typography: Record<TypographyKey, string>
  radii: Record<RadiusKey, string>
  shadows: Record<ShadowKey, string>
}
```

### Dark mode (default) → Light mode (UX-01)

Dark theme ships first. Light theme added as a second `ThemeContract`
implementation. Tools opt in via `ThemeProvider` or user preference
(persisted via `useTheme` hook in `@forgeui/hooks`).

---

## Tooling decisions

| Concern | Choice | Rationale |
|---------|--------|-----------|
| Monorepo runner | **Turborepo** | Fast incremental builds, task caching, pnpm-native |
| Package manager | **pnpm** | Workspace support, strict dependencies, fast installs |
| Bundler | **tsup** | Zero-config TS → ESM/CJS, fast, tree-shakeable output |
| Docs | **Storybook 8** | Industry standard, interactive component playground, auto-generated docs |
| Testing | **Vitest + Testing Library** | Matches LoreEngine's existing frontend test stack |
| Linting | **ESLint + Prettier** | Consistent code style across packages |
| Versioning | **Changesets** | Automated semver, changelogs, monorepo-aware publishing |
| CSS approach | **Vanilla CSS + CSS variables** | No Tailwind dependency; token-driven; tools import base.css |
| Type checking | **TypeScript strict** | Matches all tools' existing TS configurations |

---

## LoreEngine migration strategy

### Phase A: Token extraction

1. Copy LoreEngine's `:root` CSS variables into `@forgeui/tokens`
2. Formalize into scales (spacing, typography, radius, shadows)
3. Add `@forgeui/tokens` as dependency in LoreEngine `client/package.json`
4. Replace `index.css` `:root` block with `@import '@forgeui/tokens/base.css'`
5. Update all `var(--bg)` → `var(--forge-bg)` references (find-replace)

### Phase B: Primitive replacement

1. Replace LoreEngine's `.btn` classes with `<Button>` component
2. Replace `.badge` classes with `<Badge>` component
3. Replace `.form-*` classes with `<FormField>`, `<Input>`, `<TextArea>`
4. Replace `LoadingSpinner.tsx` with `<Spinner>`
5. Replace `EmptyState.tsx` with ForgeUI `<EmptyState>`

### Phase C: Composite replacement

1. Replace wiki sidebar with `<Sidebar>` + `<List>`
2. Replace entity detail with `<Drawer>` or `<Panel>`
3. Replace modal patterns with `<Dialog>`
4. Replace tab patterns with `<Tabs>`

### Phase D: Layout replacement

1. Replace each view's manual CSS grid with `<AppShell>` configuration
2. Replace flex containers with `<Stack>`
3. Replace responsive grids with `<Grid>`

### Result

- LoreEngine's `index.css` shrinks from ~1,120 lines to ~200 lines
  (view-specific overrides for graph canvas, map, timeline)
- All new wave 1–5 UI items build on ForgeUI from day one
- Other tools adopt ForgeUI for instant visual consistency

---

## Quality gates

- **Accessibility**: All interactive components pass axe-core automated audit
- **Keyboard**: Every component usable without a mouse
- **Screen reader**: ARIA labels and live regions tested with VoiceOver/NVDA
- **Type safety**: All props fully typed; no `any` in public API
- **Bundle size**: Tree-shakeable; individual component imports supported
- **Browser support**: Chrome/Firefox/Safari/Edge latest 2 versions
- **Visual regression**: Chromatic or Percy snapshots on PR

---

## Implementation phases

### Phase 1: Bootstrap + tokens + ~25 core components

- Initialize monorepo (Turborepo + pnpm)
- Build @forgeui/tokens with full token set + CSS variable generation
- Build Phase 1 components (primitives, forms, feedback, overlays, layout)
- Set up Storybook with stories for every component
- Write component tests (Vitest + Testing Library)
- Publish first internal release

### Phase 2: Composites + AppShell + docs

- Build Phase 2 components (Drawer, Tabs, NavBar, Sidebar, AppShell, DataTable, etc.)
- Build documentation site in Storybook (usage guides, token reference)
- Begin LoreEngine migration (Phase A + B)

### Phase 3: Domain extensions + full migration

- Build LoreEngine domain components on ForgeUI primitives
- Complete LoreEngine migration (Phase C + D)
- Onboard first sibling tool

### Phase 4: Ecosystem rollout

- Publish to npm (or internal registry)
- Onboard remaining tools
- Add light theme
- Add visual regression testing
