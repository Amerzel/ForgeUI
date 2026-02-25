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
│   │   │   ├── primitives/      # Polymorphic components (as prop)
│   │   │   ├── forms/
│   │   │   ├── overlays/        # Radix-based Dialog, Tooltip, Dropdown
│   │   │   ├── composites/      # DataTable (TanStack), CommandPalette (cmdk)
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
Used for backgrounds, borders, and neutral text.

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
| `--forge-border-subtle` | `gray-800` | `#1e2d4a` |
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
  shadows: { sm: '0 1px 2px rgba(0,0,0,0.3)', /* ... */ },
  animation: { durationFast: '100ms', easingDefault: 'cubic-bezier(0.4, 0, 0.2, 1)', /* ... */ },
  zIndex: { base: 0, dropdown: 100, /* ... */ },
}
```

---

## Component inventory

### Phase 1: Foundation (Polymorphic & Scoped)

All primitives support the `as` prop for semantic flexibility. Styling uses **CSS Modules** to prevent global namespace pollution.

#### Primitives (7)

| Component | Props | Notes |
|-----------|-------|-------|
| `Button` | variant, size, as, disabled, loading | Primary, secondary, ghost, danger variants |
| `IconButton` | icon, label, size, variant | Accessible wrapper; requires `label` for screen readers |
| `Badge` | variant, color | Status indicators; includes numeric entity-state mapping |
| `Text` | as, size, weight, color, truncate | Polymorphic (`p`, `span`, `label`, `h1`–`h6`) |
| `Heading` | as, size | Semantic heading levels with consistent scale |
| `Separator` | orientation, decorative | Horizontal/vertical divider; `decorative` hides from a11y tree |
| `Card` | as, variant, padding | Surface container with border and shadow tokens |

#### Forms (8)

| Component | Props | Notes |
|-----------|-------|-------|
| `Input` | size, variant, error, disabled | Text input with built-in validation styling |
| `Textarea` | size, resize, error | Auto-grows by default; resize configurable |
| `Select` | options, value, placeholder | Radix Select for accessible dropdowns |
| `Checkbox` | checked, indeterminate, label | Radix Checkbox with label association |
| `Switch` | checked, size, label | Toggle switch for boolean settings |
| `RadioGroup` | options, value, orientation | Radix RadioGroup with keyboard navigation |
| `Slider` | min, max, step, value | Radix Slider; useful for numeric tool parameters |
| `FormField` | label, error, hint, required | Wrapper that composes label + input + error message |

#### Overlays (3)

| Component | Library | Props | Notes |
|-----------|---------|-------|-------|
| `Dialog` | Radix Dialog | open, title, description | Modal with focus trap and scroll lock |
| `Tooltip` | Radix Tooltip | content, side, delay | Hover/focus info; accessible by default |
| `DropdownMenu` | Radix DropdownMenu | items, trigger | Keyboard-navigable context menus |

### Phase 2: Composites (Headless Logic)

Focus on complex tools using industry-standard headless libraries for performance.

| Component | Library | Notes |
|-----------|---------|-------|
| `DataTable` | **TanStack Table** | Virtualization support for 10k+ rows; sorting, filtering, column resize |
| `CommandPalette` | **cmdk** | Fast, keyboard-first navigation; fuzzy search |
| `SplitPane` | — | Native-feeling resizable panels; persist sizes to localStorage |
| `AppShell` | — | Root layout (Sidebar + Nav + Main); fixed-viewport desktop assumption |

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

// In MapEditor:
interface MapExtensions {
  terrain: { grass: string; water: string; rock: string };
  gridLine: string;
}
type MapTheme = ThemeContract<MapExtensions>;
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

### Phase 1: Core & Scoping
- Setup Monorepo (pnpm + Turborepo).
- Define full numeric color scales (50–950) for all palettes and export JS-accessible objects.
- Define spacing, shadow, animation, and z-index token scales.
- Implement all 7 Primitives using **CSS Modules**.
- Implement all 8 Form components with Radix where applicable.
- Implement all 3 Overlay components using Radix primitives.
- Set up Vitest + Testing Library with axe audits.
- Set up Storybook with A11y and Interaction addons.
- Configure Changesets for versioning.

### Phase 2: Headless Composites
- Integrate **TanStack Table** for `DataTable` with virtualization.
- Integrate **cmdk** for `CommandPalette`.
- Build `SplitPane` with persisted panel sizes.
- Build `AppShell` targeting 1280×720 minimum viewport.

### Phase 3: Domain Extensions & Rollout

#### Extension Support
- Implement generic `ThemeContract<T>` provider with typed extensions.
- Build and document the extension pattern for LoreEngine (first consumer).

#### Pilot Migration: PipelineInspector
- **PipelineInspector** migrates first — it has the simplest UI surface and fewest custom components, making it the lowest-risk pilot.
- Document the migration process, pain points, and patterns discovered.

#### Incremental Rollout
- Tools migrate incrementally, not all-at-once. A tool can adopt ForgeUI for new screens while keeping existing UI intact.
- Migration order (after pilot): **EntityArchitect** → **QuestForge** → **EncounterComposer** → **AssetGenerator** → **Director** → **TerrainComposer** → **LoreEngine** (last, largest surface area).
- Each tool's migration includes:
  - Token mapping from existing hardcoded values.
  - Component swap list (ad-hoc → ForgeUI equivalent).
  - Codemods where prop interfaces differ.
- "Migrated" means: all new UI uses ForgeUI components; existing UI is converted or has a tracked backlog to convert.

#### Compatibility
- ForgeUI targets **React 18+**. Tools on older versions must upgrade before adopting.
- ForgeUI does not depend on any specific bundler, but CSS Modules require bundler support (Vite, webpack 5+, esbuild with plugin).
