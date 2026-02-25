# @forgeui/hooks

## 1.0.0

### Major Changes

- 9cd1f1a: v1.0.0 — Full component library, domain editors, typed theme extensions

  ## Summary

  ForgeUI is now feature-complete across all 4 tracks:
  - **43 core components** (Phases 1–2b) — primitives, forms, disclosure, feedback, overlays, composites, layout, complex inputs
  - **3 domain editors** (Phase 3) — NodeEditor, Timeline, VirtualCanvas
  - **Typed theme extensions** — ThemeContract<TExtensions> for tool-specific CSS custom properties
  - **274 unit tests** — 0 failures, 0 axe violations (WCAG AA)

  ***

  ## @forgeui/components

  ### Phase 2a — Composites & Layout (13 components)
  - `Drawer` — slide-in side panel (left/right/top/bottom), animated
  - `Collapsible` — Radix Collapsible with chevron rotation
  - `Toolbar` — compound (Toolbar.Button, .Separator, .ToggleGroup, .ToggleItem)
  - `Steps` — step indicator with pending/active/completed/error states
  - `Avatar` — Radix Avatar, 5 sizes, initials fallback
  - `AspectRatio` — Radix AspectRatio wrapper
  - `Breadcrumb` — nav with aria-current=page on last item
  - `Menubar` — Radix Menubar, shared MenuEntry types
  - `Table` — compound (Table.Header/.Body/.Row/.Head/.Cell), sortable columns
  - `AppShell` — CSS grid layout (nav/sidebar/main), 100dvh
  - `ResizablePanelGroup` + `ResizablePanel` — drag resize with localStorage persistence
  - `DropZone` — file drop with MIME/extension/size validation
  - `Pagination` — ellipsis, page size selector

  ### Phase 2b — Complex Inputs (8 components)
  - `DataTable` — TanStack Table v8 + Virtual; sorting, filtering, column resize, row selection, pagination, virtualization
  - `CommandPalette` — cmdk + Radix Dialog; fuzzy search, grouped items, keyboard-first
  - `TreeView` — recursive nodes, keyboard navigation, multi-select
  - `Combobox` — cmdk-based autocomplete with filtering
  - `ColorPicker` — 2D saturation/brightness picker, hue + alpha sliders, hex input, swatches
  - `TagsInput` — Enter/comma/Tab to add, backspace to remove, suggestions
  - `PropertyGrid` — typed editors (text/number/color/boolean/select/vec2/vec3), collapsible sections
  - `EditableText` — inline edit on click/Enter, commit/cancel

  ### Phase 3 — Domain Editors (3 components)
  - `NodeEditor` — @xyflow/react with ForgeUI token theming; dot grid, minimap, controls
  - `Timeline` — horizontal multi-track clip editor; ruler, playhead scrubbing, clip drag/resize
  - `VirtualCanvas` — infinite pannable/zoomable canvas; grid overlay, item drag, zoom indicator

  ***

  ## @forgeui/hooks

  ### ThemeContract<TExtensions>
  - Generic `ThemeContract<TExtensions>` type alias for typed extension token interfaces
  - `useTheme<T>()` and `useTokens<T>()` now accept type parameter
  - `useTheme()` now returns `extensions` (previously only available via useTokens)

  ***

  ## Migration

  See [`docs/THEME-EXTENSION.md`](../docs/THEME-EXTENSION.md) for:
  - LoreEngine extension example with typed contract
  - CSS custom property usage
  - Canvas/WebGL typed token access
  - Full migration guide for all 9 tools (token mapping, component swap list, checklist)

### Minor Changes

- 626de8d: Phase 1 complete — 35 components across 5 categories

  ## @forgeui/components

  ### Primitives (13)
  - `Button` — primary/secondary/ghost/danger, 3 sizes, loading state, asChild
  - `IconButton` — required accessible label via VisuallyHidden
  - `Badge` — solid/subtle/outline × 6 semantic colors
  - `Card` — compound Card.Header / Card.Body / Card.Footer
  - `Text` — polymorphic with asChild, sizes xs–3xl, truncate
  - `Heading` — level (DOM) vs size (visual) independent
  - `Label` — Radix Label with htmlFor association
  - `Separator` — horizontal/vertical, decorative toggle
  - `Spinner` — role=status, customizable label
  - `Kbd` — single key or multi-key combos
  - `ScrollArea` — Radix ScrollArea with forge scrollbar tokens
  - `VisuallyHidden` — accessible text hiding
  - `AlertDialog` — always includes Description for screen readers

  ### Forms (11)
  - `Input` — sizes, variants, error, start/end adornments, clearable
  - `Textarea` — auto-grow, resize control
  - `Select` — Radix Select, groups, id for label association
  - `Checkbox` — indeterminate support, auto-generated id
  - `Switch` — animated thumb, sm/md sizes
  - `RadioGroup` — horizontal/vertical orientation
  - `Slider` — single/range values, aria-label forwarded to thumb
  - `Toggle` — default/outline variants, 3 sizes
  - `ToggleGroup` — single/multiple type, horizontal/vertical
  - `FormField` — label + error (role=alert) + hint composition
  - `NumberInput` — drag-to-scrub, stepper buttons, monospace font

  ### Disclosure (2)
  - `Accordion` — single/multiple, collapsible, disabled items, chevron animation
  - `Tabs` — line/solid variants, horizontal/vertical orientation

  ### Feedback (4)
  - `Alert` — info/success/warning/danger, live mode (role=alert), dismissible
  - `Progress` — determinate/indeterminate, 4 color variants, 3 sizes
  - `Skeleton` — shimmer animation, circle mode, aria-hidden
  - `Toast` + `ToastList` + `ToastProvider` — Radix Toast, action buttons

  ### Overlays (5)
  - `Dialog` — Portal overlay, animated, close button, trigger prop
  - `Tooltip` + `TooltipProvider` — 4 sides, arrow, disabled prop
  - `DropdownMenu` — sub-menus, separators, shortcuts, danger variant
  - `ContextMenu` — right-click trigger, same item API as DropdownMenu
  - `Popover` — side/align configuration, arrow, controlled open state

  ## @forgeui/tokens
  - CSS custom properties for 4 palettes × 2 modes (8 scoped blocks)
  - OKLCH-interpolated color scales (12 steps per hue)
  - Spacing, typography, radius, shadows, animation, z-index, misc tokens
  - `getAccessibleForeground()` WCAG AA contrast utility
  - `getCssSelector(palette, mode)` helper

  ## @forgeui/icons
  - ~80 curated Lucide icons re-exported with `Icon` suffix
  - 10 custom game dev icons: NodeIcon, EdgeIcon, TimelineIcon, SceneGraphIcon,
    EntityIcon, ComponentIcon, SplineIcon, VertexIcon, TerrainIcon, NavMeshIcon

  ## @forgeui/hooks
  - `useTheme()` — palette/mode state with React 19 use() hook
  - `useTokens()` — resolved hex token values for canvas/WebGL use
  - `ThemeContext` with ResolvedTokens and ExtensionTokens types

  ## Quality
  - 165 unit tests, 0 failures, 0 axe violations (WCAG AA)
  - Storybook build passing with A11y addon
  - Bundle: 69.47 KB gzipped (limit: 80 KB)
  - forced-colors: active support in base.css

### Patch Changes

- Updated dependencies [626de8d]
- Updated dependencies [9cd1f1a]
  - @forgeui/tokens@1.0.0
