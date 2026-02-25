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
│   │       ├── scales/          # Numeric scales (gray-50 to gray-950)
│   │       ├── semantic/        # Mapping scales to aliases (bg, surface, etc.)
│   │       ├── index.ts         # Exports JS objects + CSS variable generator
│   │       └── color.ts         # Color manipulation helpers for canvas rendering
│   │
│   ├── components/              # @forgeui/components
│   │   ├── src/
│   │   │   ├── primitives/      # Button, Badge, Text, Heading, Card, etc.
│   │   │   ├── forms/           # Input, Select, Checkbox, Slider, etc.
│   │   │   ├── disclosure/      # Accordion, Tabs
│   │   │   ├── feedback/        # Alert, Progress, Skeleton, Toast
│   │   │   ├── overlays/        # Dialog, Tooltip, DropdownMenu, Drawer, Popover, ContextMenu
│   │   │   ├── navigation/      # Menubar, Steps, Toolbar
│   │   │   ├── composites/      # DataTable, CommandPalette, TreeView, etc.
│   │   │   └── lib/
│   │   │       └── cn.ts        # Internal class merging util (clsx)
│   │   ├── styles/
│   │   │   ├── base.css         # Global resets & variables
│   │   │   └── *.module.css     # Scoped CSS Modules for components
│   │   └── package.json
│   │
│   ├── icons/                   # @forgeui/icons
│   │   └── src/
│   │       └── index.ts         # Curated Lucide React + custom game icons
│   │
│   └── hooks/                   # @forgeui/hooks
│       └── src/
│           ├── useTheme.ts
│           └── useTokens.ts     # Access raw token values in JS (for Canvas/WebGL)
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

**Note:** There is no standalone `@forgeui/utils` package. Class merging (`cn.ts`)
lives inside `@forgeui/components` as an internal utility. Color manipulation
(`color.ts`) lives inside `@forgeui/tokens` alongside the values it operates on.

---

## Design tokens

### Colors (Numeric & Semantic)

Standardized on a 10-step numeric scale to ensure longevity and easy "Light Mode" implementation. All tokens are exported as **JS Constants** and **CSS Variables**.

#### Gray Scale (Example)
Used for backgrounds, borders, and neutral text. Steps 50–700 follow a neutral
luminance ramp. Steps 800–950 shift intentionally toward a **navy/blue tint** to
create the dark, immersive aesthetic expected in game development tooling. This is
a deliberate design choice, not a neutral gray — light mode will use the neutral
upper steps.

> **Note:** All hex values below are **preliminary placeholders**. Final values
> will be set once a palette direction is selected (see `docs/palette-samples.html`
> for candidates under review). The scale structure and semantic mappings are stable;
> only the specific hex codes will change.

| Step | Variable | Hex |
|------|----------|-----|
| 50 | `--forge-gray-50` | `#f9fafb` |
| 100 | `--forge-gray-100` | `#f3f4f6` |
| 200 | `--forge-gray-200` | `#e5e7eb` |
| 300 | `--forge-gray-300` | `#d1d5db` |
| 400 | `--forge-gray-400` | `#9ca3af` |
| 500 | `--forge-gray-500` | `#6b7280` |
| 600 | `--forge-gray-600` | `#4b5563` |
| 700 | `--forge-gray-700` | `#374151` |
| 800 | `--forge-gray-800` | `#1e2d4a` |
| 900 | `--forge-gray-900` | `#16213e` |
| 950 | `--forge-gray-950` | `#0a0a0f` |

Same 50–950 scale applies to: **Blue**, **Red**, **Green**, **Amber**, **Purple**.

#### Semantic Mapping (Dark Mode Default)

| Semantic Alias | Scale Value | Hex (Approx) |
|-----------|-----------|-------|
| `--forge-bg` | `gray-950` | `#0a0a0f` |
| `--forge-surface` | `gray-900` | `#16213e` |
| `--forge-surface-raised` | `gray-800` | `#1e2d4a` |
| `--forge-border` | `gray-700` | `#374151` |
| `--forge-border-subtle` | `gray-750` | `#2a3550` |
| `--forge-text` | `gray-100` | `#e0e0e0` |
| `--forge-text-muted` | `gray-400` | `#9ca3af` |

#### Semantic Status
Mapped to vibrant scales (Blue, Red, Green, Amber).

| Alias | Scale | Use |
|-------|-------|-----|
| `--forge-info` | `blue-500` | Informational states |
| `--forge-success` | `green-500` | Confirmations, valid states |
| `--forge-warning` | `amber-500` | Caution, pending states |
| `--forge-danger` | `red-500` | Errors, destructive actions |

### Spacing (4px Base, Multiplier Scale)

Every step is `N × 4px`. The full scale:

| Token | Value |
|-------|-------|
| `--forge-space-0` | `0px` |
| `--forge-space-px` | `1px` |
| `--forge-space-0.5` | `2px` |
| `--forge-space-1` | `4px` |
| `--forge-space-2` | `8px` |
| `--forge-space-3` | `12px` |
| `--forge-space-4` | `16px` |
| `--forge-space-5` | `20px` |
| `--forge-space-6` | `24px` |
| `--forge-space-8` | `32px` |
| `--forge-space-10` | `40px` |
| `--forge-space-12` | `48px` |
| `--forge-space-16` | `64px` |

The naming convention is **multiplier-based**: `--forge-space-N` = `N × 4px`.
Sub-unit values (`0.5`, `px`) cover fine alignment needs (borders, icon nudges).

### Typography

Three font stacks cover all use cases across the 9-tool suite.

| Token | Value | Use |
|-------|-------|-----|
| `--forge-font-sans` | `'Inter', system-ui, sans-serif` | Body text, labels, UI chrome |
| `--forge-font-display` | `'Geist', 'Inter', system-ui, sans-serif` | Page titles, hero headings |
| `--forge-font-mono` | `'JetBrains Mono', 'Fira Code', monospace` | Code, numeric values, terminal output |

#### Font Size Scale

| Token | Size | Line Height | Use |
|-------|------|-------------|-----|
| `--forge-text-xs` | `11px` | `16px` | Metadata, timestamps, compact labels |
| `--forge-text-sm` | `13px` | `20px` | Secondary text, descriptions, form hints |
| `--forge-text-base` | `14px` | `22px` | Default body text, inputs, buttons |
| `--forge-text-md` | `16px` | `24px` | Emphasized text, section labels |
| `--forge-text-lg` | `18px` | `28px` | Subheadings, card titles |
| `--forge-text-xl` | `20px` | `28px` | Page section headings |
| `--forge-text-2xl` | `24px` | `32px` | Page titles |
| `--forge-text-3xl` | `30px` | `36px` | Hero headings, display text |

Note: `14px` is the default base size — game dev tools are information-dense and benefit
from a slightly smaller base than typical web apps (16px).

#### Font Weight Scale

| Token | Value | Use |
|-------|-------|-----|
| `--forge-font-normal` | `400` | Body text |
| `--forge-font-medium` | `500` | Labels, slightly emphasized text |
| `--forge-font-semibold` | `600` | Section headers, button text |
| `--forge-font-bold` | `700` | Page titles, strong emphasis |

### Border Radius

| Token | Value | Use |
|-------|-------|-----|
| `--forge-radius-none` | `0px` | No rounding (sharp edges) |
| `--forge-radius-sm` | `4px` | Small elements (badges, chips, inline tags) |
| `--forge-radius-md` | `6px` | Default (buttons, inputs, cards, dropdowns) |
| `--forge-radius-lg` | `8px` | Larger containers (dialogs, drawers, panels) |
| `--forge-radius-xl` | `12px` | Feature cards, hero sections |
| `--forge-radius-full` | `9999px` | Pill shapes (toggle pills, circular avatars) |

`--forge-radius-md` (6px) is the default for most components. The exact values will
be finalized alongside the palette selection — some palettes pair better with sharper
(4px) or softer (8px) defaults.

### Shadows

| Token | Value | Use |
|-------|-------|-----|
| `--forge-shadow-sm` | `0 1px 2px rgba(0,0,0,0.3)` | Subtle lift (cards) |
| `--forge-shadow-md` | `0 4px 8px rgba(0,0,0,0.4)` | Dropdowns, tooltips |
| `--forge-shadow-lg` | `0 8px 24px rgba(0,0,0,0.5)` | Modals, dialogs |
| `--forge-shadow-inset` | `inset 0 1px 2px rgba(0,0,0,0.3)` | Pressed/input states |

### Animation & Motion

| Token | Value | Use |
|-------|-------|-----|
| `--forge-duration-fast` | `100ms` | Hover, focus feedback |
| `--forge-duration-normal` | `200ms` | Panels, dropdowns |
| `--forge-duration-slow` | `400ms` | Page transitions, modals |
| `--forge-easing-default` | `cubic-bezier(0.4, 0, 0.2, 1)` | General purpose |
| `--forge-easing-in` | `cubic-bezier(0.4, 0, 1, 1)` | Exit animations |
| `--forge-easing-out` | `cubic-bezier(0, 0, 0.2, 1)` | Enter animations |

All duration tokens respect `prefers-reduced-motion`. When the user's OS requests
reduced motion, `base.css` overrides all duration tokens to `0ms`:
```css
@media (prefers-reduced-motion: reduce) {
  :root {
    --forge-duration-fast: 0ms;
    --forge-duration-normal: 0ms;
    --forge-duration-slow: 0ms;
  }
}
```
Components that use these tokens automatically become motion-safe with no extra work.

### Focus Ring

A consistent focus indicator across all interactive components.

| Token | Value | Use |
|-------|-------|-----|
| `--forge-focus-ring-color` | `blue-400` (`#60a5fa`) | Ring color; high contrast against dark surfaces |
| `--forge-focus-ring-width` | `2px` | Ring thickness |
| `--forge-focus-ring-offset` | `2px` | Gap between element edge and ring |

Applied via a shared utility style:
```css
.focus-ring:focus-visible {
  outline: var(--forge-focus-ring-width) solid var(--forge-focus-ring-color);
  outline-offset: var(--forge-focus-ring-offset);
}
```

### Z-Index

Fixed scale to prevent z-index wars across tools.

| Token | Value | Use |
|-------|-------|-----|
| `--forge-z-base` | `0` | Default stacking |
| `--forge-z-dropdown` | `100` | Dropdowns, popovers |
| `--forge-z-sticky` | `200` | Sticky headers, toolbars |
| `--forge-z-overlay` | `300` | Overlays, backdrops |
| `--forge-z-modal` | `400` | Dialogs, modals |
| `--forge-z-toast` | `500` | Notifications, toasts |
| `--forge-z-tooltip` | `600` | Tooltips (always on top) |

### JS-Accessible Tokens
Critical for tool development (Node editors, Graph views, Canvas maps).
```typescript
// @forgeui/tokens
export const tokens = {
  colors: {
    gray: { 50: '#f9fafb', /* ... */ 950: '#0a0a0f' },
    blue: { /* ... */ },
  },
  spacing: { 1: '4px', 2: '8px', 3: '12px', 4: '16px', /* ... */ },
  typography: {
    fontSans: "'Inter', system-ui, sans-serif",
    fontDisplay: "'Geist', 'Inter', system-ui, sans-serif",
    fontMono: "'JetBrains Mono', 'Fira Code', monospace",
    textXs: '11px', textSm: '13px', textBase: '14px', textMd: '16px',
    textLg: '18px', textXl: '20px', text2xl: '24px', text3xl: '30px',
    fontNormal: 400, fontMedium: 500, fontSemibold: 600, fontBold: 700,
  },
  radius: { none: '0px', sm: '4px', md: '6px', lg: '8px', xl: '12px', full: '9999px' },
  shadows: { sm: '0 1px 2px rgba(0,0,0,0.3)', /* ... */ },
  animation: { durationFast: '100ms', easingDefault: 'cubic-bezier(0.4, 0, 0.2, 1)', /* ... */ },
  zIndex: { base: 0, dropdown: 100, /* ... */ },
  focusRing: { color: '#60a5fa', width: '2px', offset: '2px' },
}
```

---

## Component inventory (45 total)

Informed by cross-referencing **shadcn/ui** (59 components), **Radix** (30), **Ark UI** (46),
**Park UI** (59), **Mantine** (130), and **Chakra UI** (107), plus an audit of the
**AssetGenerator** codebase (47 production components). The inventory below covers every
component pattern that appears in 2+ major libraries AND has a confirmed use case
across the 9-tool ecosystem.

### Phase 1: Foundation (27 components)

All primitives support the `as` prop for semantic flexibility. Styling uses **CSS Modules** to prevent global namespace pollution.

#### Primitives (9)

| Component | Props | Notes |
|-----------|-------|-------|
| `Button` | variant, size, as, disabled, loading | Primary, secondary, ghost, danger variants |
| `IconButton` | icon, label, size, variant | Accessible wrapper; requires `label` for screen readers |
| `Badge` | variant, color | Status indicators; includes numeric entity-state mapping |
| `Text` | as, size, weight, color, truncate | Inline/block text (`p`, `span`, `label`, `div`). Does **not** render headings — use `Heading` for that |
| `Heading` | as, level, size | Semantic heading levels (`h1`–`h6`); `level` controls the HTML element, `size` controls visual scale independently |
| `Separator` | orientation, decorative | Horizontal/vertical divider; `decorative` hides from a11y tree |
| `Card` | as, variant, padding | Surface container with border and shadow tokens |
| `Kbd` | keys | Keyboard shortcut display (e.g., `⌘+S`); renders styled keycap elements |
| `ScrollArea` | orientation, scrollbarSize | Custom-styled scrollbar container; preserves native scroll behavior while matching dark theme |

#### Forms (10)

| Component | Props | Notes |
|-----------|-------|-------|
| `Input` | size, variant, error, disabled | Text input with built-in validation styling |
| `Textarea` | size, resize, error | Auto-grows by default; resize configurable |
| `Select` | options, value, placeholder | Radix Select for accessible dropdowns |
| `Checkbox` | checked, indeterminate, label | Radix Checkbox with label association |
| `Switch` | checked, size, label | Toggle switch for boolean settings |
| `RadioGroup` | options, value, orientation | Radix RadioGroup with keyboard navigation |
| `Slider` | min, max, step, value | Radix Slider; useful for numeric tool parameters |
| `Toggle` | pressed, variant, size | Radix Toggle; two-state button (on/off). Used for bold/italic toggles, view mode switches |
| `ToggleGroup` | type, value, orientation | Radix ToggleGroup; single or multiple selection. Used for toolbar tool selection, alignment controls, mode switchers |
| `FormField` | label, error, hint, required | Wrapper that composes label + input + error message |

#### Disclosure (2)

| Component | Library | Props | Notes |
|-----------|---------|-------|-------|
| `Accordion` | Radix Accordion | type, collapsible, defaultValue | Collapsible content sections; single or multiple open panels. Used in inspector panels, settings groups, property editors |
| `Tabs` | Radix Tabs | value, orientation | Tabbed content panels; horizontal/vertical. Used in inspectors, multi-view editors, settings |

#### Feedback (3)

| Component | Library | Props | Notes |
|-----------|---------|-------|-------|
| `Alert` | — | variant, icon, closable | Status banner for info/success/warning/error; used for inline feedback and destructive action confirmations |
| `Progress` | Radix Progress | value, max, getValueLabel | Linear progress bar; determinate or indeterminate. Used for build progress, asset processing, batch operations |
| `Skeleton` | — | width, height, radius, animate | Loading placeholder; matches content shape while data loads. Shimmer animation uses `--forge-duration-slow` |

#### Overlays (3)

| Component | Library | Props | Notes |
|-----------|---------|-------|-------|
| `Dialog` | Radix Dialog | open, title, description | Modal with focus trap and scroll lock |
| `Tooltip` | Radix Tooltip | content, side, delay | Hover/focus info; accessible by default |
| `DropdownMenu` | Radix DropdownMenu | items, trigger | Keyboard-navigable action menus |

### Phase 2a: Radix Composites & Layout (8 components)

Components that wrap existing Radix primitives or compose straightforward layouts.
Lower risk — primarily integration and styling work.

#### Overlays (3)

| Component | Library | Props | Notes |
|-----------|---------|-------|-------|
| `ContextMenu` | Radix Context Menu | items, trigger | Right-click menus; fundamental to every game dev tool. Supports submenus, checkable items, keyboard navigation |
| `Drawer` | Radix Dialog (extended) | side, open, title | Slide-in panel from any edge; non-blocking alternative to Dialog for properties and settings |
| `Popover` | Radix Popover | side, align, sideOffset | Anchored floating content; used for quick-edit panels, inline color pickers, mini-forms |

#### Composites (3)

| Component | Library | Notes |
|-----------|---------|-------|
| `Toast` | **Radix Toast** | Stackable notifications at `--forge-z-toast`; auto-dismiss with configurable duration |
| `Toolbar` | **Radix Toolbar** | Groups related controls (buttons, toggles, separators) with roving keyboard focus. Used in canvas toolbars, editor action bars |
| `SplitPane` | — | Native-feeling resizable panels; persist sizes to localStorage |

#### Layout (2)

| Component | Library | Notes |
|-----------|---------|-------|
| `AppShell` | — | Root layout (Sidebar + Nav + Main); fixed-viewport desktop assumption |
| `DropZone` | — | Drag-and-drop file upload area with visual drag state, file type validation, and click-to-browse fallback. Used in asset import workflows |

### Phase 2b: Complex Inputs & Data (6 components)

Custom-built components with significant internal logic. Higher complexity — each
requires dedicated design, testing, and iteration.

#### Data (2)

| Component | Library | Notes |
|-----------|---------|-------|
| `DataTable` | **TanStack Table** | Virtualization support for 10k+ rows; sorting, filtering, column resize |
| `CommandPalette` | **cmdk** | Fast, keyboard-first navigation; fuzzy search |

#### Advanced Inputs (4)

| Component | Library | Props | Notes |
|-----------|---------|-------|-------|
| `Combobox` | **cmdk** or Radix | options, value, placeholder, search | Searchable select for large lists; autocomplete with filtering. Essential when Select doesn't scale (100s of entities/assets) |
| `NumberInput` | — | value, min, max, step, precision | Numeric input with increment/decrement stepper buttons and min/max clamping. Used for transforms, dimensions, physics params |
| `ColorPicker` | — | value, format, swatches | HSL/RGB/Hex color selection with saturation/hue/alpha controls. Used in material editing, palette creation, map annotations |
| `TagsInput` | — | value, suggestions, max | Multi-tag entry field; add/remove freeform tags as pills. Used for entity tagging, keyword management across LoreEngine and QuestForge |

### Phase 3: Domain-Specific (4 components)

Components that require deeper integration with tool-specific data structures or OS-level patterns.

| Component | Library | Props | Notes |
|-----------|---------|-------|-------|
| `TreeView` | — | data, expandedIds, selectedId, onSelect | Hierarchical data display with expand/collapse, keyboard navigation, and selection. Used for scene graphs, entity hierarchies, file trees in EntityArchitect, LoreEngine, TerrainComposer |
| `Editable` | — | value, placeholder, onSubmit | Inline text that switches to an input on click/Enter. Used for renaming entities, nodes, layers, and labels in-place without opening a dialog |
| `Steps` | — | current, items, orientation | Multi-step wizard indicator with active/completed/error states. Used for asset pipeline flows, entity creation wizards, import workflows |
| `Menubar` | Radix Menubar | menus | Desktop-style horizontal menu bar (File, Edit, View...) with keyboard navigation and submenus. Used in Electron-based tools for native-feeling app chrome |

---

## Theming architecture

### Theme Contract Extensions

Tools can provide domain-specific tokens (e.g., LoreEngine's "Prophecy" color) via the `ThemeProvider` without bloating the core system. The contract uses a generic type parameter for type-safe extensions.

```typescript
interface ThemeContract<TExtensions extends Record<string, unknown> = Record<string, never>> {
  colors: BaseColors;
  spacing: SpacingScale;
  shadows: ShadowScale;
  animation: AnimationTokens;
  zIndex: ZIndexScale;
  extensions: TExtensions;
}

// In LoreEngine:
interface LoreExtensions {
  prophecy: string;
  factionPrimary: string;
  factionSecondary: string;
  timeline: { past: string; present: string; future: string };
}
type LoreTheme = ThemeContract<LoreExtensions>;

// In TerrainComposer:
interface TerrainExtensions {
  terrain: { grass: string; water: string; rock: string };
  gridLine: string;
}
type TerrainTheme = ThemeContract<TerrainExtensions>;
```

### Layout Assumptions

All 9 tools are **fixed-viewport desktop applications** (Electron or full-window browser). ForgeUI does not ship responsive breakpoints. If a tool requires responsive behavior, it handles its own breakpoint logic on top of ForgeUI's layout primitives.

`AppShell` targets a minimum viewport of **1280×720** and uses CSS `dvh`/`dvw` units for full-viewport layouts.

---

## Build & Distribution

### Output Format

All packages are built with **tsup**, producing:
- **ESM** (primary) — for modern bundlers (Vite, esbuild).
- **CJS** (secondary) — for legacy Node tooling or SSR if needed.
- **TypeScript declarations** (`.d.ts`) — generated alongside each format.

### CSS Delivery

- `@forgeui/tokens` outputs a standalone `tokens.css` file containing all CSS custom properties. Consumers import it once at their app root.
- `@forgeui/components` uses **CSS Modules**. Each component's scoped `.module.css` is bundled alongside its JS. Consumers' bundlers (Vite, webpack) handle the CSS automatically on import.
- No runtime CSS-in-JS. No Tailwind.

### Entry Points

Packages support both barrel and deep imports:
```typescript
// Barrel (convenient, tree-shaking relies on bundler)
import { Button, Input } from '@forgeui/components';

// Deep import (guaranteed minimal, no barrel overhead)
import { Button } from '@forgeui/components/Button';
```

Each component is a separate entry point in the package's `exports` map.

### Build Order

Turborepo manages the dependency graph: `tokens` → `components` / `icons` / `hooks` (parallel where independent).

---

## Testing strategy

### Unit & Interaction Tests

- **Vitest** as the test runner across all packages.
- **Testing Library** for DOM-based component tests.
- Every component must have at minimum:
  - Render test (mounts without error).
  - Accessibility audit (`vitest-axe`, must pass with zero violations).
  - Keyboard interaction test (focus, activation, navigation).

### Visual Regression

- **Storybook** with the **A11y addon** and **Interaction addon** active for every story.
- Every component variant has a dedicated Storybook story that doubles as visual documentation.
- Visual regression snapshots are captured via **Storybook test runner** in CI to catch unintended style changes.

### CI Enforcement

All quality gates run in CI on every PR:
- `pnpm lint` — ESLint + Prettier.
- `pnpm test` — Vitest (includes axe audits).
- `pnpm build` — Ensures all packages compile cleanly.
- Storybook build — Ensures no broken stories.

PRs that fail any gate cannot merge.

---

## Versioning & Release

### Semantic Versioning

All packages follow **semver** strictly:
- **Patch**: Bug fixes, token value tweaks that don't change names.
- **Minor**: New components, new tokens, new non-breaking props.
- **Major**: Removed/renamed components, removed/renamed tokens, breaking prop changes.

### Changesets

Versioning is managed via **Changesets**:
1. Every PR that changes a published package must include a changeset (`pnpm changeset`).
2. Changesets accumulate on `main`.
3. A release PR is auto-generated that bumps versions and updates changelogs.
4. On merge of the release PR, packages are published to the registry.

### Breaking Change Policy

Breaking changes require:
- A migration guide in the PR description.
- A deprecation period of at least one minor release where the old API is preserved with console warnings before removal.
- Codemods provided where feasible (e.g., renaming a prop across consuming tools).

---

## Documentation

### Storybook as Primary Docs

Storybook serves as the living documentation site:
- Every component has stories covering all variants, sizes, and states.
- Stories include usage examples and prop documentation via `argTypes`.
- The A11y addon panel is visible on every story for real-time audit feedback.

### API Reference

TypeScript types serve as the API reference. Component props are documented via JSDoc comments on the prop interfaces, which surface in IDE tooltips and Storybook's auto-generated docs.

### Migration Guides

When consuming tools adopt ForgeUI, each tool gets a brief migration guide covering:
- Which ForgeUI components replace existing ad-hoc components.
- Token mapping from the tool's existing hardcoded values to ForgeUI tokens.
- Any breaking changes in the tool's UI behavior.

---

## Tooling & Quality Gates

| Concern | Choice | Rationale |
|---------|--------|-----------|
| CSS Approach | **CSS Modules** | Scoped styles, zero runtime overhead, high performance |
| Icons | **Lucide React** | Large, consistent library + custom SVG extension |
| Testing | **Vitest + Testing Library** | Fast, modern test runner with DOM testing |
| Accessibility | **vitest-axe** | Automated A11y testing; zero-violation policy in CI |
| Styling Utils | **clsx** | Lightweight class merging for variant composition |
| Build | **tsup** | Fast TS bundler; outputs ESM + CJS + declarations |
| Versioning | **Changesets** | Automated semver bumps and changelogs |

### Quality Gates
- **A11y**: 100% `vitest-axe` pass rate on every component.
- **Canvas-Ready**: Every color token must be available as a raw hex string for `<canvas>` use.
- **Performance**: Individual packages are tree-shakeable; deep imports supported.
- **Visuals**: Storybook A11y and Interaction addons active on every story.
- **Types**: TypeScript strict mode; no `any` in public API surfaces.

---

## Implementation Strategy

### Phase 1: Foundation (27 components)
- Setup Monorepo (pnpm + Turborepo).
- Define full numeric color scales (50–950) for all palettes and export JS-accessible objects.
- Define spacing, typography, border radius, shadow, animation, z-index, and focus ring token scales.
- Implement 9 Primitives: Button, IconButton, Badge, Text, Heading, Separator, Card, Kbd, ScrollArea.
- Implement 10 Form components: Input, Textarea, Select, Checkbox, Switch, RadioGroup, Slider, Toggle, ToggleGroup, FormField.
- Implement 2 Disclosure components: Accordion, Tabs.
- Implement 3 Feedback components: Alert, Progress, Skeleton.
- Implement 3 Overlay components: Dialog, Tooltip, DropdownMenu.
- Set up Vitest + Testing Library with axe audits.
- Set up Storybook with A11y and Interaction addons.
- Configure Changesets for versioning.

### Phase 2a: Radix Composites & Layout (8 components)
Lower risk — primarily wrapping existing Radix primitives and composing layouts.
- Integrate **Radix Context Menu** for `ContextMenu` (right-click menus).
- Integrate **Radix Popover** for `Popover` (floating anchored content).
- Build `Drawer` extending Radix Dialog for slide-in panels.
- Integrate **Radix Toast** for `Toast` notifications.
- Build `Toolbar` with roving focus and grouped controls.
- Build `SplitPane` with persisted panel sizes.
- Build `AppShell` targeting 1280×720 minimum viewport.
- Build `DropZone` with drag state, file validation, and click fallback.

### Phase 2b: Complex Inputs & Data (6 components)
Higher complexity — each requires dedicated design, testing, and iteration.
- Integrate **TanStack Table** for `DataTable` with virtualization.
- Integrate **cmdk** for `CommandPalette` and `Combobox`.
- Build `NumberInput` with stepper controls and min/max clamping.
- Build `ColorPicker` with HSL/RGB/Hex modes and swatch presets.
- Build `TagsInput` with freeform entry and optional suggestions.

### Phase 3: Domain-Specific Components & Rollout (4 components)

#### Domain Components
- Build `TreeView` for hierarchical data (scene graphs, entity trees, file browsers).
- Build `Editable` for inline rename interactions.
- Build `Steps` for multi-step wizard flows.
- Integrate **Radix Menubar** for `Menubar` (desktop-style app menus).

#### Extension Support
- Implement generic `ThemeContract<T>` provider with typed extensions.
- Build and document the extension pattern for LoreEngine (first consumer).

#### Pilot Migration: PipelineInspector
- **PipelineInspector** migrates first — it has the simplest UI surface and fewest custom components, making it the lowest-risk pilot.
- Document the migration process, pain points, and patterns discovered.

#### Incremental Rollout
- Tools migrate incrementally, not all-at-once. A tool can adopt ForgeUI for new screens while keeping existing UI intact.
- Migration order (after pilot): **EntityArchitect** → **QuestForge** → **EncounterComposer** → **AssetGenerator** → **Director** → **TerrainComposer** → **LoreEngine** (last, largest surface area).
- **Crucible** is excluded from the migration order — it is the core framework, not a UI application. It may consume `@forgeui/tokens` for shared constants but does not render ForgeUI components.
- Each tool's migration includes:
  - Token mapping from existing hardcoded values.
  - Component swap list (ad-hoc → ForgeUI equivalent).
  - Codemods where prop interfaces differ.
- "Migrated" means: all new UI uses ForgeUI components; existing UI is converted or has a tracked backlog to convert.

#### Compatibility
- ForgeUI targets **React 18+**. Tools on older versions must upgrade before adopting.
- ForgeUI does not depend on any specific bundler, but CSS Modules require bundler support (Vite, webpack 5+, esbuild with plugin).
