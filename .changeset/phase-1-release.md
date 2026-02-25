---
"@forgeui/components": minor
"@forgeui/tokens": minor
"@forgeui/icons": minor
"@forgeui/hooks": minor
---

Phase 1 complete — 35 components across 5 categories

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
