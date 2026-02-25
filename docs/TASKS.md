# ForgeUI — Implementation Task Breakdown

Status key: `[ ]` pending · `[x]` done · `[-]` skipped/deferred

Dependencies are noted where a task cannot start until another is complete.

---

## Track 1: Infrastructure

> Must be fully complete before any package work begins.

- [x] **T1.1** — Create `pnpm-workspace.yaml` declaring `packages/*` and `apps/*`
- [x] **T1.2** — Create root `package.json` with workspace scripts (`build`, `dev`, `test`, `lint`, `typecheck`)
- [x] **T1.3** — Configure Turborepo (`turbo.json`): pipeline `tokens → hooks → components`, `icons` parallel with `hooks`; `dev` and `build` tasks with correct inputs/outputs
- [x] **T1.4** — Create root `tsconfig.json` with `composite: true`, `strict: true`, project references to all packages
- [x] **T1.5** — Configure ESLint 9 flat config (`eslint.config.js`): `eslint-plugin-jsx-a11y`, `eslint-plugin-react-hooks`, TypeScript rules, no `any` in public APIs
- [x] **T1.6** — Configure Prettier (`.prettierrc`): single quotes, no semicolons, trailing commas `all`
- [x] **T1.7** — Configure root Vitest (`vitest.config.ts`): workspace mode pointing to each package's config; jsdom environment
- [x] **T1.8** — Initialize Changesets (`.changeset/config.json`): fixed versioning group for all 4 packages, changelog format
- [x] **T1.9** — Configure `size-limit` (`.size-limit.json`): per-component <3 KB, full barrel <80 KB (gzipped); fail on exceed
- [x] **T1.10** — Create GitHub Actions CI workflow (`.github/workflows/ci.yml`): lint → typecheck → test (vitest + axe) → build → Storybook build → size-limit check; runs on PR and push to main

---

## Track 2: `@forgeui/tokens`

> Depends on: T1.1–T1.4 complete.

### Package scaffold
- [x] **T2.1** — Create `packages/tokens/package.json`: exports map (`./`, `./color`, `./tokens.css`), `sideEffects: ["*.css"]`, tsup build script
- [x] **T2.2** — Create `packages/tokens/tsconfig.json` extending root, with `composite: true`
- [x] **T2.3** — Configure `packages/tokens/tsup.config.ts`: ESM + CJS + `.d.ts`; copy `tokens.css` to dist

### Color scales
- [x] **T2.4** — Implement gray scale for all 4 palettes as static TS objects in `src/scales/gray.ts`:
  - Hearth Bronze: warm/brown tint from step 750 upward (values from PLAN.md)
  - Midnight Forge: navy/blue tint
  - Deep Space: deep navy tint
  - Midnight Forge v2: navy/blue tint
  - Steps: 50, 100, 200, 300, 400, 500, 600, 700, 750, 800, 900, 950
- [x] **T2.5** — Implement OKLCH interpolation build script (`scripts/generate-scales.ts`):
  - Takes 3 anchors (50, 500, 950) per hue
  - Interpolates in OKLCH to produce steps 100, 200, 300, 400, 600, 700, 750, 800, 900
  - Writes output as static TS objects to `src/scales/` — committed to source control
- [x] **T2.6** — Run scale generator and commit outputs for all 7 hues (Blue, Red, Green, Amber, Purple, Teal, Orange) using anchors from PLAN.md

### Utilities
- [x] **T2.7** — Implement `src/color.ts`:
  - `lighten(color, amount)`: lightens by amount (0–1) in HSL
  - `darken(color, amount)`: darkens by amount (0–1) in HSL
  - `alpha(color, opacity)`: returns `rgba(r, g, b, opacity)` string
  - `mix(color1, color2, weight?)`: blends two hex colors; default weight 0.5
  - `hexToRgb(hex)`: returns `[r, g, b]` tuple
  - `rgbToHex(r, g, b)`: returns hex string
  - `hexToGlsl(hex)`: returns `[r, g, b, 1.0]` floats 0–1
  - `contrastRatio(fg, bg)`: WCAG relative luminance contrast ratio
  - `getAccessibleForeground(bgColor)`: returns `'#000000'` or `'#ffffff'`

### Non-color tokens
- [x] **T2.8** — Implement `src/scales/spacing.ts`: multiplier-based scale (`space-0` through `space-64`), including `space-px` and `space-0.5` exceptions
- [x] **T2.9** — Implement `src/scales/typography.ts`: font stacks, font sizes (11–30px) with line heights, font weights, leading scale, tracking scale
- [x] **T2.10** — Implement `src/scales/radius.ts`: none/sm(2px)/md(3px)/lg(6px)/xl(8px)/full(9999px)
- [x] **T2.11** — Implement `src/scales/shadows.ts`: sm through xl, inset, ring-accent
- [x] **T2.12** — Implement `src/scales/animation.ts`: 4 durations (0/100/200/400ms), 4 easings (default/in/out/in-out)
- [x] **T2.13** — Implement `src/scales/zindex.ts`: base(0)/dropdown(100)/sticky(200)/overlay(300)/modal(400)/toast(500)/tooltip(600)
- [x] **T2.14** — Implement `src/scales/misc.ts`: focus ring tokens, opacity scale, icon sizes, container widths, backdrop blur, selection/scrollbar colors

### Semantic tokens
- [x] **T2.15** — Implement `src/semantic/index.ts`: resolve semantic aliases for all 4 palettes × 2 modes using `color.ts` functions at build time:
  - Surface hierarchy (`bg`, `surface`, `surface-raised`, `surface-hover`, `surface-active`, `surface-sunken`, `surface-overlay`, `surface-popover`, `bg-overlay`, `bg-disabled`)
  - Border hierarchy (`border`, `border-subtle`, `border-strong`)
  - Text hierarchy (`text`, `text-muted`, `text-disabled`)
  - Accent per palette
  - Status quintuplets per palette: info/success/warning/danger × (base, hover, bg, border, foreground)
  - Text-on-color tokens (`text-on-accent`, `text-on-info`, `text-on-success`, `text-on-warning`, `text-on-danger`)

### CSS output
- [x] **T2.16** — Generate `src/tokens.css`: all 8 blocks (`[data-palette][data-theme]` combinations) with full CSS custom property declarations for every semantic and scale token; verify manually against PLAN.md values

### JS exports
- [x] **T2.17** — Implement `src/index.ts`: export `tokens` (raw scales as JS object), `semantic` (semantic aliases), and `generateCssVars(palette, mode)` helper that returns a CSS variable block string for use in SSR or custom injection

### Validation
- [x] **T2.18** — Write unit tests for `color.ts` utilities (round-trip hex, contrast ratios, known values)
- [x] **T2.19** — Write contrast validation tests: assert all semantic text/bg pairs meet WCAG AA (4.5:1 normal, 3:1 large); flag muted text and danger button fill issues noted in PLAN.md

---

## Track 3: `@forgeui/icons`

> Depends on: T1.1–T1.4.

- [x] **T3.1** — Create `packages/icons/package.json` + `tsconfig.json` + tsup config
- [x] **T3.2** — Curate Lucide React subset: audit all 9 tools' icon needs; export re-named components (e.g., `ChevronDownIcon`) for tree-shaking
- [x] **T3.3** — Create custom game-specific SVG icons as React components (node graph, timeline, terrain, etc.) based on tool requirements
- [x] **T3.4** — Implement `src/index.ts`: named exports for all icons with consistent `size` and `color` props; all icons square bounding box

---

## Track 4: `@forgeui/hooks`

> Depends on: T2.17 (tokens JS export).

- [x] **T4.1** — Create `packages/hooks/package.json` + `tsconfig.json` + tsup config
- [x] **T4.2** — Implement `ThemeContext` (internal): holds `palette`, `mode`, and extension token values; used by both hooks and ThemeProvider
- [x] **T4.3** — Implement `src/useTheme.ts`: returns `{ palette, mode, setPalette, setMode }`; reads/writes ThemeContext; changing values triggers data-attribute update on provider element
- [x] **T4.4** — Implement `src/useTokens.ts`: returns resolved token values for active palette/mode as plain JS (hex strings, numbers); essential for canvas/WebGL; reads ThemeContext; merges core + extension tokens

---

## Track 5: `@forgeui/components` — Setup

> Depends on: T2.16 (tokens.css), T4.2–T4.4 (hooks).

- [x] **T5.1** — Create `packages/components/package.json`: exports map (barrel + per-component deep imports), `sideEffects: ["*.css"]`, tsup build with `'use client'` banner prepended to every entry
- [x] **T5.2** — Create `packages/components/tsconfig.json` extending root
- [x] **T5.3** — Configure `packages/components/tsup.config.ts`: one entry per component for deep imports; CSS Modules via postcss-modules with `generateScopedName: '[name]__[local]--[hash:base64:5]'`
- [x] **T5.4** — Implement `src/lib/cn.ts`: `clsx`-based class merging utility (internal only, not exported)
- [x] **T5.5** — Create `styles/base.css`:
  - CSS reset (box-sizing, margins)
  - Import `tokens.css` or expect consumer to import it
  - `.focus-ring:focus-visible` utility using focus ring tokens
  - `@media (prefers-reduced-motion: reduce)` zeroing all duration tokens
  - `::selection` styling using selection tokens
  - `::-webkit-scrollbar` styling using scrollbar tokens
  - `@media (forced-colors: active)` fallback ensuring visible borders and focus indicators
- [x] **T5.6** — Implement `ThemeProvider` component:
  - Accepts `palette`, `mode`, `extensions?` props
  - Renders `<div data-palette={palette} data-theme={mode} style={extensionVars}>` wrapper
  - Provides ThemeContext with palette, mode, setters, and extension values
  - Defaults: palette `'hearth-bronze'`, mode `'dark'`
  - Compatible with React 19 `use()` hook for async components
  - Type-safe generic `ThemeContract<TExtensions>` — extensions injected as CSS custom properties

---

## Track 6: Storybook

> Depends on: T5.5–T5.6 (base styles + ThemeProvider).

- [x] **T6.1** — Initialize Storybook 8 in `apps/docs/` with Vite builder and React framework
- [x] **T6.2** — Install and configure `@storybook/addon-a11y` (A11y panel visible on every story)
- [x] **T6.3** — Install and configure `@storybook/addon-interactions` (Interaction addon)
- [x] **T6.4** — Configure `.storybook/preview.ts`: global decorator wrapping all stories in `ThemeProvider` (defaulting to hearth-bronze dark); import `tokens.css` and `base.css`; add toolbar control for palette/mode switching
- [x] **T6.5** — Configure `.storybook/main.ts`: package aliases, CSS Modules support, absolute imports
- [x] **T6.6** — Set up Storybook test runner (`@storybook/test-runner`) for visual regression snapshots in CI

---

## Track 7: Phase 1 — Primitives (13 components)

> Depends on: T5.1–T5.6 complete. Build in order below (Label before Input, etc.)

- [x] **T7.1** — `VisuallyHidden`: renders children visible only to screen readers; `asChild` support via Radix Slot
- [x] **T7.2** — `Label`: `htmlFor` prop; wraps Radix Label; styled with `--forge-font-size-sm`, `--forge-font-medium`
- [x] **T7.3** — `Separator`: `orientation` (horizontal/vertical), `decorative` (removes from a11y tree); uses `--forge-border` color
- [x] **T7.4** — `Spinner`: `size`, `label`; `role="status"` with aria-live region; VisuallyHidden label; respects prefers-reduced-motion
- [x] **T7.5** — `Badge`: `variant` (solid/subtle/outline), `color` (accent/info/success/warning/danger/neutral); entity-state numeric mapping
- [x] **T7.6** — `Text`: `asChild`, `size` (xs–3xl), `weight` (normal/medium/semibold/bold), `color` (default/muted/disabled), `truncate`; renders `<p>` by default; does NOT render headings
- [x] **T7.7** — `Heading`: `asChild`, `level` (h1–h6 controls DOM element), `size` (independent visual scale); defaults level to `h2`
- [x] **T7.8** — `Kbd`: `keys` prop (array or string); renders styled keycap `<kbd>` elements with `+` separators; uses mono font
- [x] **T7.9** — `ScrollArea`: wraps Radix ScrollArea; `orientation` (horizontal/vertical/both), `scrollbarSize`; applies scrollbar token colors
- [x] **T7.10** — `Card`: `asChild`, `variant` (default/ghost/outlined), `padding` (none/sm/md/lg); compound sub-components `Card.Header`, `Card.Body`, `Card.Footer`; uses surface-raised + shadow-sm
- [x] **T7.11** — `IconButton`: wraps Radix Slot; `icon`, `label` (required — screen reader text via VisuallyHidden), `size` (sm/md/lg), `variant`; same variants as Button
- [x] **T7.12** — `Button`: `variant` (primary/secondary/ghost/danger), `size` (sm/md/lg), `type` (button/submit/reset), `fullWidth`, `startIcon`, `endIcon`, `asChild`, `disabled`, `loading` (shows Spinner, disables interaction); danger button uses darkened fill for WCAG AA
- [x] **T7.13** — `AlertDialog`: wraps Radix AlertDialog; `open`, `onOpenChange`, `title`, `description`, `confirmLabel`, `cancelLabel`, `onConfirm`, `onCancel`; blocks interaction, focus-trapped; danger variant for destructive confirmations

**Stories (T7.14)** — One story file per component covering all variants, sizes, states (disabled, loading, error), and keyboard interaction tests

**Tests (T7.15)** — Vitest + Testing Library + vitest-axe for all 13: render test, axe audit, keyboard navigation

---

## Track 8: Phase 1 — Forms (11 components)

> Depends on: T7.1–T7.3 (VisuallyHidden, Label, Separator). Build FormField last.

- [x] **T8.1** — `Input`: `type`, `size` (sm/md/lg), `variant` (default/filled), `error` (boolean + message), `disabled`, `startAdornment`, `endAdornment`, `clearable` (shows × button when value non-empty), `placeholder`; error state shows colored border AND error text
- [x] **T8.2** — `Textarea`: `size`, `resize` (none/vertical/both), `error`; auto-grows by default (resize observer on content); same error pattern as Input
- [x] **T8.3** — `Select`: wraps Radix Select; `options` (array of `{value, label, disabled?}`), `value`, `onChange`, `placeholder`, `disabled`, `error`, `size`; keyboard navigable
- [x] **T8.4** — `Checkbox`: wraps Radix Checkbox; `checked`, `indeterminate`, `label`, `disabled`; label association via Radix
- [x] **T8.5** — `Switch`: wraps Radix Switch; `checked`, `onChange`, `size` (sm/md), `label`; accessible toggle with visible on/off state beyond color
- [x] **T8.6** — `RadioGroup`: wraps Radix RadioGroup; `options` (array of `{value, label, disabled?}`), `value`, `onChange`, `orientation` (horizontal/vertical)
- [x] **T8.7** — `Slider`: wraps Radix Slider; `min`, `max`, `step`, `value`, `onChange`, `disabled`; thumb uses accent token; track fill uses accent with opacity
- [x] **T8.8** — `Toggle`: wraps Radix Toggle; `pressed`, `onChange`, `variant` (default/outline), `size`; two-state button for bold/italic, view mode switches
- [x] **T8.9** — `ToggleGroup`: wraps Radix ToggleGroup; `type` (single/multiple), `value`, `onChange`, `orientation`; used for toolbar tool selection, alignment controls
- [x] **T8.10** — `NumberInput`: `value`, `min`, `max`, `step`, `precision`, `onChange`, `disabled`; stepper +/- buttons; drag-to-adjust (pointerdown + pointermove vertical delta scrubs value); min/max clamping; uses mono font for value display
- [x] **T8.11** — `FormField`: `label`, `error` (string), `hint` (string), `required`; renders Label + slot for input child + error message + hint text; error shown as text (not just color); `required` adds asterisk with aria-required

**Stories (T8.12)** — All variants, error states, disabled states, and keyboard interaction for all 11 form components

**Tests (T8.13)** — Vitest + axe for all 11: render, axe audit, keyboard/interaction

---

## Track 9: Phase 1 — Disclosure (2 components)

> Depends on: T5.1–T5.6.

- [x] **T9.1** — `Accordion`: wraps Radix Accordion; `type` (single/multiple), `collapsible`, `defaultValue`, `value`, `onValueChange`; animated expand/collapse using duration-normal + easing-default; chevron icon rotates
- [x] **T9.2** — `Tabs`: wraps Radix Tabs; `value`, `onValueChange`, `orientation` (horizontal/vertical), `defaultValue`; compound sub-components `Tabs.List`, `Tabs.Trigger`, `Tabs.Content`; keyboard arrow navigation

**Stories + Tests (T9.3)**

---

## Track 10: Phase 1 — Feedback (4 components)

> Depends on: T5.1–T5.6, T7.4 (Spinner for loading states).

- [x] **T10.1** — `Alert`: `variant` (info/success/warning/error), `icon` (required for non-color indication), `closable`, `onClose`; compound sub-components `Alert.Icon`, `Alert.Title`, `Alert.Description`; icon + text label always present, never color alone
- [x] **T10.2** — `Progress`: wraps Radix Progress; `value` (null = indeterminate), `max`, `getValueLabel` (accessible label function); indeterminate uses CSS animation
- [x] **T10.3** — `Skeleton`: `width`, `height`, `radius`, `animate` (default true); shimmer animation using duration-slow; `@media (prefers-reduced-motion: reduce)` removes animation declaration entirely (not just sets to 0ms)
- [x] **T10.4** — `Toast`: wraps Radix Toast; `variant` (info/success/warning/error), `duration` (ms, default 5000), `action` (label + onClick); Toaster provider component for rendering portal; stackable at `--forge-z-toast`; auto-dismiss with configurable duration

**Stories + Tests (T10.5)**

---

## Track 11: Phase 1 — Overlays (5 components)

> Depends on: T5.1–T5.6, T7.12 (Button for dialog footers).

- [x] **T11.1** — `Dialog`: wraps Radix Dialog; `open`, `onOpenChange`, `size` (sm/md/lg), `title`, `description`; focus-trapped + scroll-locked; compound `Dialog.Trigger`, `Dialog.Content`, `Dialog.Header`, `Dialog.Footer`; uses shadow-lg + surface-overlay backdrop
- [x] **T11.2** — `Tooltip`: wraps Radix Tooltip; `content`, `side` (top/right/bottom/left), `align`, `delay` (ms); keyboard + hover trigger; accessible by default (content always in DOM, visibility via CSS)
- [x] **T11.3** — `DropdownMenu`: wraps Radix DropdownMenu; `items` (array with label/icon/shortcut/disabled/separator/submenu), `trigger`; keyboard navigable (arrow keys, enter, escape)
- [x] **T11.4** — `ContextMenu`: wraps Radix Context Menu; `items` (same schema as DropdownMenu), `trigger`; right-click + long-press trigger; supports submenus, checkable items (checkbox + radio), keyboard navigation; fundamental to every game dev tool
- [x] **T11.5** — `Popover`: wraps Radix Popover; `side`, `align`, `sideOffset`; compound `Popover.Trigger`, `Popover.Content`; for quick-edit panels, inline color pickers, mini-forms; focus managed automatically

**Stories + Tests (T11.6)** — Including keyboard navigation tests for all 5

---

## Track 12: Phase 1 Integration

> After all Phase 1 components pass tests individually.

- [x] **T12.1** — Audit all 35 Phase 1 components for WCAG AA compliance; fix any contrast failures; document muted text and danger button resolutions
- [x] **T12.2** — Validate `forced-colors: active` fallback on all 35 components (borders and focus visible)
- [x] **T12.3** — Full Storybook build passes with zero A11y addon violations on all stories
- [x] **T12.4** — Run size-limit; confirm no component exceeds 3 KB gzipped; confirm full barrel under 80 KB
- [x] **T12.5** — Publish `v0.1.0` of all 4 packages to registry (or private registry) via Changesets release PR

---

## Track 13: Phase 2a — Composites & Layout (13 components)

> Depends on: Track 12 complete (Phase 1 published).

### Overlays
- [x] **T13.1** — `Drawer`: extends Radix Dialog with `side` (left/right/top/bottom), `open`, `title`; slide-in animation using easing-default; non-blocking alternative to Dialog; same focus-trap + scroll-lock

### Composites
- [x] **T13.2** — `Toolbar`: wraps Radix Toolbar; roving tabindex keyboard focus between items; accepts `Button`, `IconButton`, `Toggle`, `ToggleGroup`, `Separator` as children with proper `Toolbar.Button`/`Toolbar.Link` wrappers
- [x] **T13.3** — `ResizablePanelGroup`: native HTML drag resize (no external lib unless necessary); `direction` (horizontal/vertical); panel size constraints (min/max); sizes persisted to localStorage by `storageKey` prop
- [x] **T13.4** — `Collapsible`: wraps Radix Collapsible; `open`, `onOpenChange`, `defaultOpen`; animated expand/collapse for single regions; simpler than Accordion for one-off use
- [x] **T13.5** — `Menubar`: wraps Radix Menubar; horizontal menu bar (File/Edit/View pattern); keyboard navigation with arrow keys; submenus; checkable items; used in Electron tools for native-feeling app chrome
- [x] **T13.6** — `Steps`: `steps` (array of `{label, description?, status: 'pending'|'active'|'completed'|'error'}`); horizontal indicator; visual connectors between steps; used for pipeline flows and import wizards

### Data Display
- [x] **T13.7** — `Avatar`: wraps Radix Avatar; `src`, `alt`, `fallback` (initials string); size tokens; fallback renders colored background with initials when image fails to load
- [x] **T13.8** — `AspectRatio`: wraps Radix AspectRatio; `ratio` prop (e.g., `16/9`); constrains child to exact ratio; used for asset thumbnails
- [x] **T13.9** — `Table`: semantic HTML table; compound `Table.Header`, `Table.Body`, `Table.Row`, `Table.Cell`, `Table.Head`; styled with forge tokens; for static/small data (use DataTable for large sets); sortable header cells optional
- [x] **T13.10** — `Breadcrumb`: `items` (array of `{label, href?}`); current page item has `aria-current="page"`; separator between items (chevron icon); last item non-link

### Layout
- [x] **T13.11** — `AppShell`: root layout wrapper; `sidebar` slot, `nav` slot, `main` slot; fixed-viewport (dvh/dvw); minimum 1280×720; CSS grid layout; sidebar width configurable via prop or CSS variable
- [x] **T13.12** — `DropZone`: `accept` (MIME types/extensions), `multiple`, `maxSize`, `onDrop`, `onError`; visual drag-over state (dashed border + accent color); click-to-browse fallback; file type/size validation with error display; accessible via keyboard
- [x] **T13.13** — `Pagination`: `page`, `pageSize`, `total`, `onPageChange`, `onPageSizeChange`; prev/next buttons; page number buttons (with ellipsis for large ranges); page size selector using Select component

- [x] **Stories + Tests (T13.14)** — All 13 Phase 2a components

---

## Track 14: Phase 2b — Complex Inputs & Data (8 components)

> Depends on: Track 13 complete. Each component here is standalone — build in parallel where possible.

- [x] **T14.1** — `DataTable`: wraps TanStack Table v8; `columns` (TanStack ColumnDef array), `data`, `sorting`, `filtering`, `columnResizing`, `rowSelection`; virtualization via TanStack Virtual for 10k+ rows; compound `DataTable.Toolbar` (filter inputs, column visibility), `DataTable.Pagination` (wraps Pagination component); empty and loading states

- [x] **T14.2** — `CommandPalette`: wraps cmdk; `items` (grouped list with label/icon/action/keywords), `open`, `onOpenChange`, `placeholder`; fuzzy search; keyboard-first (arrow keys, enter, escape); groups with headings; empty state; uses shadow-xl + surface-overlay backdrop; typically opened via `⌘K`

- [x] **T14.3** — `TreeView`: custom implementation; `nodes` (recursive tree structure with id/label/children/icon), `selected`, `expanded`, `onSelect`, `onExpand`; keyboard navigation (arrow keys to traverse, enter to select, space to expand); multi-select support; used for scene graphs, entity hierarchies, file trees

- [x] **T14.4** — `Combobox`: wraps cmdk or Radix Combobox; `options`, `value`, `onChange`, `placeholder`, `search` (controlled search string), `onSearchChange`, `loading`, `empty`; autocomplete with filtering for large lists (100s of items); accessible keyboard navigation

- [x] **T14.5** — `ColorPicker`: custom implementation; `value` (hex/rgb/hsl string), `onChange`, `format` (hex/rgb/hsl), `swatches` (preset colors array), `alpha` (boolean — show alpha channel), `eyeDropper` (boolean — native EyeDropper API); saturation/lightness 2D picker; hue slider; alpha slider (when enabled); hex/rgb/hsl text input; swatch grid

- [x] **T14.6** — `TagsInput`: `value` (string array), `onChange`, `suggestions` (optional autocomplete list), `max`, `placeholder`, `disabled`; add tag on Enter/comma/Tab; remove on Backspace or × chip button; pill chip rendering; keyboard focus management between chips and input

- [x] **T14.7** — `PropertyGrid`: `sections` (array of `{label, items: PropertyItem[]}`), `values`, `onChange`; inspector-style key-value editor; each row has a typed editor (text/number/color/boolean/select/vec2/vec3); sections are collapsible (wraps Collapsible); used in entity/material/physics inspectors

- [x] **T14.8** — `EditableText`: `value`, `onChange`, `onCommit`, `onCancel`, `placeholder`, `disabled`; renders static text; activates inline input on click or Enter; commits on blur or Enter; cancels on Escape; used for renaming entities, nodes, layers in-place

- [x] **Stories + Tests (T14.9)** — All 8 Phase 2b components

---

## Track 15: Phase 3 — Domain-Specific (3 components)

> Depends on: Track 14 complete. These are high-complexity, long-iteration components.

- [x] **T15.1** — `NodeEditor`: `nodes`, `edges`, `onConnect`, `onNodeChange`, `onEdgeChange`; visual node graph with ports, connections, and pan/zoom; evaluate reactflow adoption vs. custom; minimap; selection; keyboard shortcuts; used for shader, logic, and dialogue editors

- [x] **T15.2** — `Timeline`: `tracks` (array of `{id, label, clips: Clip[]}`), `currentTime`, `duration`, `onSeek`, `onClipChange`; horizontal time-based editor; playhead scrubbing; track lanes; clip drag/resize; zoom; used for animation sequences and cutscenes

- [x] **T15.3** — `VirtualCanvas`: `items`, `viewport` (`{x, y, zoom}`), `onViewportChange`, `onItemChange`; infinite pannable/zoomable canvas; mouse + trackpad gesture support; grid overlay; item selection and drag; used for map editors and level editors

- [x] **Stories + Tests (T15.4)**

---

## Track 16: Theme Extension Support

> Depends on: T5.6 (ThemeProvider base).

- [x] **T16.1** — Finalize generic `ThemeContract<TExtensions>` TypeScript type; ensure type safety flows through `ThemeProvider`, `useTheme()`, and `useTokens()`
- [x] **T16.2** — Document LoreEngine extension pattern with concrete example:
  - `LoreExtensions` interface
  - How extension tokens are passed to ThemeProvider
  - How they surface as CSS custom properties in consumer CSS
  - How `useTokens()` returns them for canvas use
- [x] **T16.3** — Create migration guide template for consuming tools:
  - Token mapping table (hardcoded values → ForgeUI tokens)
  - Component swap list (ad-hoc → ForgeUI equivalent)
  - Step-by-step adoption checklist

---

## Track 17: Rollout

> Depends on: Phase 3 complete and all packages at stable v1.0.

- [ ] **T17.1** — Pilot migration: **PipelineInspector** — map all existing components to ForgeUI equivalents; document pain points and patterns
- [ ] **T17.2** — **EntityArchitect** migration
- [ ] **T17.3** — **QuestForge** migration
- [ ] **T17.4** — **EncounterComposer** migration
- [ ] **T17.5** — **AssetGenerator** migration
- [ ] **T17.6** — **Director** migration
- [ ] **T17.7** — **TerrainComposer** migration
- [ ] **T17.8** — **LoreEngine** migration (largest surface area — last)
- [ ] **T17.9** — **Crucible**: adopt `@forgeui/tokens` only for shared constants; no component migration

---

## Summary

| Track | Tasks | Blocked by |
|-------|-------|------------|
| T1 Infrastructure | 10 | — |
| T2 tokens package | 19 | T1 |
| T3 icons package | 4 | T1 |
| T4 hooks package | 4 | T2 |
| T5 components setup | 6 | T2, T4 |
| T6 Storybook | 6 | T5 |
| T7 Primitives (13) | 15 | T5 |
| T8 Forms (11) | 13 | T7.1–T7.3 |
| T9 Disclosure (2) | 3 | T5 |
| T10 Feedback (4) | 5 | T7.4 |
| T11 Overlays (5) | 6 | T7.12 |
| T12 Phase 1 integration | 5 | T7–T11 |
| T13 Phase 2a (13) | 14 | T12 |
| T14 Phase 2b (8) | 9 | T13 |
| T15 Phase 3 (3) | 4 | T14 |
| T16 Theme extensions | 3 | T5.6 |
| T17 Rollout (9 tools) | 9 | T15 |
| **Total** | **135** | |
