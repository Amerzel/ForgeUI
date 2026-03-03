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

#### Gray Scale

Used for backgrounds, borders, and neutral text. Steps 50–700 follow a neutral
luminance ramp. Steps 800–950 shift intentionally toward a **warm/brown tint** to
create the dark, forge-workshop aesthetic expected in game development tooling. This
is a deliberate design choice, not a neutral gray — light mode will use the neutral
upper steps.

> **Palette decision:** The default palette is **Hearth Bronze** (#11) — warm amber
> accent on dark, forge-inspired surfaces with a tight 3px default radius. Three
> alternate themes are provided: **Midnight Forge** (#1, blue), **Deep Space**
> (#6, teal), and **Midnight Forge v2** (#10, gold). See "Palette Selection" section
> below for full specs.
>
> Hex values below are for the **Hearth Bronze** default. The warm-tinted grays
> (750–950) will differ per alternate theme.

| Step | Variable           | Hex       |
| ---- | ------------------ | --------- |
| 50   | `--forge-gray-50`  | `#faf8f5` |
| 100  | `--forge-gray-100` | `#f2e9df` |
| 200  | `--forge-gray-200` | `#e5d9cb` |
| 300  | `--forge-gray-300` | `#d1c1ad` |
| 400  | `--forge-gray-400` | `#9a8169` |
| 500  | `--forge-gray-500` | `#6b5c4a` |
| 600  | `--forge-gray-600` | `#4f4234` |
| 700  | `--forge-gray-700` | `#3f3227` |
| 750  | `--forge-gray-750` | `#332a1f` |
| 800  | `--forge-gray-800` | `#2a211a` |
| 900  | `--forge-gray-900` | `#1a140f` |
| 950  | `--forge-gray-950` | `#0c0805` |

Same 50–950 scale (including step 750) applies to the hue palettes below.

#### Hue Scale Anchors

Each hue scale is defined by **three anchor values** (50, 500, 950). Intermediate steps
are generated at build time using perceptually uniform interpolation in **OKLCH** color
space. The `@forgeui/tokens` build step produces the full 12-step scale from these
anchors. The generated values are committed to source control so consumers never depend
on the build step at runtime.

| Hue        | 50 (lightest) | 500 (midpoint) | 950 (darkest) | Use                                                  |
| ---------- | ------------- | -------------- | ------------- | ---------------------------------------------------- |
| **Blue**   | `#eff6ff`     | `#3b82f6`      | `#172554`     | Info states, links, focus rings (alternate palettes) |
| **Red**    | `#fef2f2`     | `#ef4444`      | `#450a0a`     | Danger/error states, destructive actions             |
| **Green**  | `#f0fdf4`     | `#22c55e`      | `#052e16`     | Success/valid states, confirmations                  |
| **Amber**  | `#fffbeb`     | `#f59e0b`      | `#451a03`     | Warning states, pending, accents                     |
| **Purple** | `#faf5ff`     | `#a855f7`      | `#3b0764`     | Badges, tags, decorative accents                     |
| **Teal**   | `#f0fdfa`     | `#14b8a6`      | `#042f2e`     | Info (alternate), accents (Deep Space palette)       |
| **Orange** | `#fff7ed`     | `#f97316`      | `#431407`     | Accents (Molten Core), warm highlights               |

> **Generation rule:** Given anchors at steps 50, 500, and 950, the build script
> interpolates in OKLCH to produce steps 100, 200, 300, 400, 600, 700, 750, 800,
> and 900. This ensures perceptual uniformity across the ramp — unlike RGB
> interpolation, which produces muddy midtones. The `scales/` directory in
> `@forgeui/tokens` contains the generated output as static TS objects.

#### Semantic Mapping (Dark Mode Default)

| Semantic Alias            | Derivation                  | Hearth Bronze Value    |
| ------------------------- | --------------------------- | ---------------------- |
| `--forge-bg`              | `gray-950`                  | `#0c0805`              |
| `--forge-surface`         | `gray-900`                  | `#1a140f`              |
| `--forge-surface-raised`  | `gray-800`                  | `#2a211a`              |
| `--forge-surface-hover`   | `lighten(surface, 0.04)`    | `#221a14`              |
| `--forge-surface-active`  | `gray-700`                  | `#3f3227`              |
| `--forge-surface-sunken`  | `darken(bg, 0.02)`          | `#080502`              |
| `--forge-surface-overlay` | `alpha(gray-950, 0.60)`     | `rgb(12 8 5 / 0.60)`   |
| `--forge-surface-popover` | `mix(surface, raised, 0.5)` | `#221b15`              |
| `--forge-bg-overlay`      | `rgb(0 0 0 / 0.60)`         | `rgb(0 0 0 / 0.60)`    |
| `--forge-bg-disabled`     | `alpha(gray-800, 0.50)`     | `rgb(42 33 26 / 0.50)` |
| `--forge-border`          | `gray-700`                  | `#3f3227`              |
| `--forge-border-subtle`   | `gray-750`                  | `#332a1f`              |
| `--forge-border-strong`   | `gray-600`                  | `#4f4234`              |
| `--forge-accent`          | palette-specific            | `#d97706`              |
| `--forge-text`            | `gray-100`                  | `#f2e9df`              |
| `--forge-text-muted`      | `gray-400`                  | `#9a8169`              |
| `--forge-text-disabled`   | `gray-500`                  | `#6b5c4a`              |

> **Derivation functions** reference the `color.ts` API (`lighten`, `darken`, `alpha`,
> `mix`). These are resolved at **build time** and baked into the CSS as static values.
> Runtime components never call these functions — they just read CSS custom properties.

#### Text-on-Color Tokens

Guarantee readable foreground text on filled backgrounds. Each value is resolved at
build time via `getAccessibleForeground(fillColor)`, which returns `#000000` or
`#ffffff` based on the WCAG luminance contrast ratio.

| Token                     | Derivation                         | Hearth Bronze Value            |
| ------------------------- | ---------------------------------- | ------------------------------ |
| `--forge-text-on-accent`  | `getAccessibleForeground(accent)`  | `#ffffff` (white on `#d97706`) |
| `--forge-text-on-info`    | `getAccessibleForeground(info)`    | `#ffffff` (white on `#3b82f6`) |
| `--forge-text-on-success` | `getAccessibleForeground(success)` | `#000000` (dark on `#4ade80`)  |
| `--forge-text-on-warning` | `getAccessibleForeground(warning)` | `#000000` (dark on `#fbbf24`)  |
| `--forge-text-on-danger`  | `getAccessibleForeground(danger)`  | `#ffffff` (white on `#ef4444`) |

> These values are **palette-specific** since each palette may have different accent/status
> colors. They are regenerated per palette at build time. The `-foreground` suffix on
> status quintuplets (e.g., `--forge-info-foreground`) is an alias for the matching
> text-on-color token.

#### Semantic Status

Mapped to vibrant scales (Blue, Red, Green, Amber). Each status color is a **quintuplet**
derived from the base value using formulas. The base value is palette-specific (see
Palette Selection table); all variants are formula-derived at build time.

**Derivation formulas** (applied identically to info, success, warning, danger):

| Suffix        | Derivation                          | Example (info = `blue-500`) |
| ------------- | ----------------------------------- | --------------------------- |
| _(base)_      | Palette-specific base               | `#3b82f6`                   |
| `-hover`      | `darken(base, 0.10)`                | `#2563eb` (≈ `blue-600`)    |
| `-bg`         | `alpha(base, 0.10)`                 | `rgb(59 130 246 / 0.10)`    |
| `-border`     | Scale step -100 from base (500→400) | `#60a5fa` (≈ `blue-400`)    |
| `-foreground` | `getAccessibleForeground(base)`     | `#ffffff`                   |

**Base values per status** (palette-invariant unless overridden in Palette Selection table):

| Status            | Default Base            | Hue Scale |
| ----------------- | ----------------------- | --------- |
| `--forge-info`    | `blue-500` (`#3b82f6`)  | Blue      |
| `--forge-success` | `green-500` (`#22c55e`) | Green     |
| `--forge-warning` | `amber-500` (`#f59e0b`) | Amber     |
| `--forge-danger`  | `red-500` (`#ef4444`)   | Red       |

> **Note:** The Palette Selection table can override these per-palette (e.g., Deep Space
> uses `#38bdf8` for info instead of the default). When overridden, the derivation
> formulas still apply to the overridden base — only the input changes, not the formula.
>
> **Danger button exception:** `--forge-danger` fills used as solid button backgrounds
> must use a darkened value (`darken(danger, 0.15)` → toward `#dc2626`) to pass WCAG AA
> for white foreground text. This is handled in the Button component, not the token.

### Spacing (4px Base, Multiplier Scale)

The naming convention is **multiplier-based**: `--forge-space-N` = `N × 4px`.

| Token               | Value   |
| ------------------- | ------- |
| `--forge-space-0`   | `0px`   |
| `--forge-space-px`  | `1px`   |
| `--forge-space-0.5` | `2px`   |
| `--forge-space-1`   | `4px`   |
| `--forge-space-2`   | `8px`   |
| `--forge-space-3`   | `12px`  |
| `--forge-space-4`   | `16px`  |
| `--forge-space-5`   | `20px`  |
| `--forge-space-6`   | `24px`  |
| `--forge-space-8`   | `32px`  |
| `--forge-space-10`  | `40px`  |
| `--forge-space-12`  | `48px`  |
| `--forge-space-16`  | `64px`  |
| `--forge-space-20`  | `80px`  |
| `--forge-space-24`  | `96px`  |
| `--forge-space-32`  | `128px` |
| `--forge-space-40`  | `160px` |
| `--forge-space-48`  | `192px` |
| `--forge-space-64`  | `256px` |

> **Exceptions:** `space-0`, `space-px`, and `space-0.5` are sub-unit values that
> do not follow the `N × 4px` rule. They exist for fine alignment needs (borders,
> icon nudges, 1px gaps). All other steps are strict 4px multiples.
>
> The upper values (20–64) cover layout-level spacing: page margins, section gaps,
> and large panel padding.

### Typography

Three font stacks cover all use cases across the 9-tool suite.

| Token                  | Value                                      | Use                                   |
| ---------------------- | ------------------------------------------ | ------------------------------------- |
| `--forge-font-sans`    | `'Inter', system-ui, sans-serif`           | Body text, labels, UI chrome          |
| `--forge-font-display` | `'Geist', 'Inter', system-ui, sans-serif`  | Page titles, hero headings            |
| `--forge-font-mono`    | `'JetBrains Mono', 'Fira Code', monospace` | Code, numeric values, terminal output |

#### Font Size Scale

> **Naming:** Font sizes use `--forge-font-size-*` (not `--forge-text-*`) to avoid
> collision with `--forge-text-{semantic}` color tokens (e.g., `--forge-text-muted`).

| Token                    | Size   | Line Height | Use                                      |
| ------------------------ | ------ | ----------- | ---------------------------------------- |
| `--forge-font-size-xs`   | `11px` | `16px`      | Metadata, timestamps, compact labels     |
| `--forge-font-size-sm`   | `13px` | `20px`      | Secondary text, descriptions, form hints |
| `--forge-font-size-base` | `14px` | `22px`      | Default body text, inputs, buttons       |
| `--forge-font-size-md`   | `16px` | `24px`      | Emphasized text, section labels          |
| `--forge-font-size-lg`   | `18px` | `28px`      | Subheadings, card titles                 |
| `--forge-font-size-xl`   | `20px` | `28px`      | Page section headings                    |
| `--forge-font-size-2xl`  | `24px` | `32px`      | Page titles                              |
| `--forge-font-size-3xl`  | `30px` | `36px`      | Hero headings, display text              |

Note: `14px` is the default base size — game dev tools are information-dense and benefit
from a slightly smaller base than typical web apps (16px).

#### Font Weight Scale

| Token                   | Value | Use                              |
| ----------------------- | ----- | -------------------------------- |
| `--forge-font-normal`   | `400` | Body text                        |
| `--forge-font-medium`   | `500` | Labels, slightly emphasized text |
| `--forge-font-semibold` | `600` | Section headers, button text     |
| `--forge-font-bold`     | `700` | Page titles, strong emphasis     |

#### Line Height Scale

Independent line-height tokens for use outside the font-size presets (e.g., adjusting density in data tables or code blocks).

| Token                     | Value  | Use                                     |
| ------------------------- | ------ | --------------------------------------- |
| `--forge-leading-tight`   | `1.25` | Compact UI (data tables, dense lists)   |
| `--forge-leading-normal`  | `1.5`  | Default body text                       |
| `--forge-leading-relaxed` | `1.75` | Long-form content, improved readability |

#### Letter Spacing Scale

| Token                     | Value     | Use                                 |
| ------------------------- | --------- | ----------------------------------- |
| `--forge-tracking-tight`  | `-0.01em` | Large headings (optical correction) |
| `--forge-tracking-normal` | `0`       | Default — no adjustment             |
| `--forge-tracking-wide`   | `0.05em`  | All-caps labels, overlines          |

### Border Radius

| Token                 | Value    | Use                                          |
| --------------------- | -------- | -------------------------------------------- |
| `--forge-radius-none` | `0px`    | No rounding (sharp edges)                    |
| `--forge-radius-sm`   | `2px`    | Subtle rounding (inline tags, small chips)   |
| `--forge-radius-md`   | `3px`    | Default (buttons, inputs, cards, dropdowns)  |
| `--forge-radius-lg`   | `6px`    | Larger containers (dialogs, drawers, panels) |
| `--forge-radius-xl`   | `8px`    | Feature cards, hero sections                 |
| `--forge-radius-full` | `9999px` | Pill shapes (toggle pills, circular avatars) |

`--forge-radius-md` (3px) is the default for most components. This tight radius pairs
with the Hearth Bronze palette to create a sharp, precision-tool aesthetic — warm
surfaces with crisp edges, like hand-forged metalwork.

### Shadows

Dark UIs need higher shadow opacity to be visible against dark surfaces.

| Token                        | Value                                 | Use                                           |
| ---------------------------- | ------------------------------------- | --------------------------------------------- |
| `--forge-shadow-none`        | `none`                                | Reset / remove shadow                         |
| `--forge-shadow-sm`          | `0 1px 2px rgb(0 0 0 / 0.5)`          | Subtle lift (cards)                           |
| `--forge-shadow-md`          | `0 4px 8px rgb(0 0 0 / 0.6)`          | Dropdowns, tooltips                           |
| `--forge-shadow-lg`          | `0 8px 24px rgb(0 0 0 / 0.7)`         | Modals, dialogs                               |
| `--forge-shadow-xl`          | `0 16px 48px rgb(0 0 0 / 0.8)`        | Command palettes, large modals                |
| `--forge-shadow-inset`       | `inset 0 1px 2px rgb(0 0 0 / 0.5)`    | Pressed/input states                          |
| `--forge-shadow-ring-accent` | `0 0 0 3px var(--forge-accent / 0.4)` | Colored focus glow for accent-filled elements |

### Animation & Motion

| Token                      | Value                          | Use                                                             |
| -------------------------- | ------------------------------ | --------------------------------------------------------------- |
| `--forge-duration-instant` | `0ms`                          | Programmatic state changes (no visible transition)              |
| `--forge-duration-fast`    | `100ms`                        | Hover, focus feedback                                           |
| `--forge-duration-normal`  | `200ms`                        | Panels, dropdowns                                               |
| `--forge-duration-slow`    | `400ms`                        | Page transitions, modals                                        |
| `--forge-easing-default`   | `cubic-bezier(0, 0, 0.2, 1)`   | Ease-out — default for enter animations and most UI transitions |
| `--forge-easing-in`        | `cubic-bezier(0.4, 0, 1, 1)`   | Ease-in — exit animations                                       |
| `--forge-easing-out`       | `cubic-bezier(0, 0, 0.2, 1)`   | Ease-out — alias for clarity when paired with `easing-in`       |
| `--forge-easing-in-out`    | `cubic-bezier(0.4, 0, 0.2, 1)` | Symmetric ease — looping animations, resizing, drag             |

> **Note:** `easing-default` is an **ease-out** curve, optimized for elements
> entering the viewport. It was previously mislabeled as "general purpose." The
> true symmetric curve is `easing-in-out`. For most enter/open transitions,
> `easing-default` (ease-out) is still the correct choice.

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

| Token                       | Value                 | Use                                                  |
| --------------------------- | --------------------- | ---------------------------------------------------- |
| `--forge-focus-ring-color`  | `var(--forge-accent)` | Ring color; defaults to accent for brand consistency |
| `--forge-focus-ring-width`  | `2px`                 | Ring thickness                                       |
| `--forge-focus-ring-offset` | `2px`                 | Gap between element edge and ring                    |

Applied via a shared utility style:

```css
.focus-ring:focus-visible {
  outline: var(--forge-focus-ring-width) solid var(--forge-focus-ring-color);
  outline-offset: var(--forge-focus-ring-offset);
}
```

### Z-Index

Fixed scale to prevent z-index wars across tools.

| Token                | Value | Use                      |
| -------------------- | ----- | ------------------------ |
| `--forge-z-base`     | `0`   | Default stacking         |
| `--forge-z-dropdown` | `100` | Dropdowns, popovers      |
| `--forge-z-sticky`   | `200` | Sticky headers, toolbars |
| `--forge-z-overlay`  | `300` | Overlays, backdrops      |
| `--forge-z-modal`    | `400` | Dialogs, modals          |
| `--forge-z-toast`    | `500` | Notifications, toasts    |
| `--forge-z-tooltip`  | `600` | Tooltips (always on top) |

### Opacity Scale

Standardized opacity values for overlays, disabled states, and tinted backgrounds.

| Token                    | Value  | Use                                        |
| ------------------------ | ------ | ------------------------------------------ |
| `--forge-opacity-subtle` | `0.08` | Hover tints, status-color backgrounds      |
| `--forge-opacity-light`  | `0.15` | Selected row highlights, badge backgrounds |
| `--forge-opacity-medium` | `0.40` | Disabled overlays, placeholder images      |
| `--forge-opacity-heavy`  | `0.60` | Modal backdrops, dimming overlays          |

### Icon Sizes

Consistent icon dimensions across components. Icons always render in a square bounding box.

| Token             | Value  | Use                                      |
| ----------------- | ------ | ---------------------------------------- |
| `--forge-icon-xs` | `14px` | Inline metadata icons, badge decorations |
| `--forge-icon-sm` | `16px` | Button icons, form field icons           |
| `--forge-icon-md` | `20px` | Default standalone icons, nav items      |
| `--forge-icon-lg` | `24px` | Page headers, empty state illustrations  |

### Container Widths

Max-width constraints for content areas and floating UI.

| Token                 | Value   | Use                                         |
| --------------------- | ------- | ------------------------------------------- |
| `--forge-max-w-prose` | `65ch`  | Long-form text content (descriptions, docs) |
| `--forge-max-w-sm`    | `384px` | Small dialogs, popovers                     |
| `--forge-max-w-md`    | `512px` | Default dialogs, settings panels            |
| `--forge-max-w-lg`    | `768px` | Wide dialogs, data tables in overlays       |

### Backdrop Blur

| Token                  | Value | Use                                            |
| ---------------------- | ----- | ---------------------------------------------- |
| `--forge-blur-overlay` | `8px` | Frosted-glass effect on modal/drawer backdrops |

### Selection & Highlight Colors

| Token                    | Use                                           |
| ------------------------ | --------------------------------------------- |
| `--forge-selection-bg`   | Text selection background (CSS `::selection`) |
| `--forge-selection-text` | Text selection foreground                     |
| `--forge-highlight-bg`   | Search/filter match highlight                 |

### Scrollbar Colors

Custom scrollbar styling for dark theme consistency. Applied via CSS scrollbar-color property and `::-webkit-scrollbar` pseudo-elements.

| Token                           | Use                                 |
| ------------------------------- | ----------------------------------- |
| `--forge-scrollbar-track`       | Scrollbar track (gutter) background |
| `--forge-scrollbar-thumb`       | Scrollbar thumb (draggable handle)  |
| `--forge-scrollbar-thumb-hover` | Thumb on hover                      |

### JS-Accessible Tokens

Critical for tool development (Node editors, Graph views, Canvas maps).

#### Raw Scales

```typescript
// @forgeui/tokens
export const tokens = {
  colors: {
    gray: { 50: '#faf8f5', /* ... */ 750: '#332a1f', /* ... */ 950: '#0c0805' },
    blue: {
      /* ... */
    },
    teal: {
      /* ... */
    },
    orange: {
      /* ... */
    },
  },
  spacing: {
    1: { css: '4px', value: 4 },
    2: { css: '8px', value: 8 },
    3: { css: '12px', value: 12 },
    4: { css: '16px', value: 16 },
    // ... through 64: { css: '256px', value: 256 }
  },
  typography: {
    fontSans: "'Inter', system-ui, sans-serif",
    fontDisplay: "'Geist', 'Inter', system-ui, sans-serif",
    fontMono: "'JetBrains Mono', 'Fira Code', monospace",
    fontSizeXs: '11px',
    fontSizeSm: '13px',
    fontSizeBase: '14px',
    fontSizeMd: '16px',
    fontSizeLg: '18px',
    fontSizeXl: '20px',
    fontSize2xl: '24px',
    fontSize3xl: '30px',
    fontNormal: 400,
    fontMedium: 500,
    fontSemibold: 600,
    fontBold: 700,
    leadingTight: 1.25,
    leadingNormal: 1.5,
    leadingRelaxed: 1.75,
    trackingTight: '-0.01em',
    trackingNormal: '0',
    trackingWide: '0.05em',
  },
  radius: { none: '0px', sm: '2px', md: '3px', lg: '6px', xl: '8px', full: '9999px' },
  shadows: {
    none: 'none',
    sm: '0 1px 2px rgb(0 0 0 / 0.5)',
    md: '0 4px 8px rgb(0 0 0 / 0.6)' /* ... */,
  },
  animation: {
    durationInstant: '0ms',
    durationFast: '100ms',
    durationNormal: '200ms',
    durationSlow: '400ms',
    easingDefault: 'cubic-bezier(0, 0, 0.2, 1)',
    easingInOut: 'cubic-bezier(0.4, 0, 0.2, 1)' /* ... */,
  },
  zIndex: { base: 0, dropdown: 100 /* ... */ },
  focusRing: { color: 'var(--forge-accent)', width: '2px', offset: '2px' },
  opacity: { subtle: 0.08, light: 0.15, medium: 0.4, heavy: 0.6 },
  iconSize: { xs: 14, sm: 16, md: 20, lg: 24 },
}
```

#### Semantic Token Mappings

In addition to raw scales, the JS export includes semantic aliases that mirror the CSS semantic tokens:

```typescript
export const semantic = {
  bg: 'var(--forge-bg)', // or resolved hex for canvas use
  surface: 'var(--forge-surface)',
  accent: 'var(--forge-accent)',
  text: 'var(--forge-text)',
  textMuted: 'var(--forge-text-muted)',
  info: 'var(--forge-info)',
  success: 'var(--forge-success)',
  warning: 'var(--forge-warning)',
  danger: 'var(--forge-danger)',
  // ... all semantic tokens
}
```

#### `color.ts` API

Color manipulation utilities for canvas/WebGL rendering and runtime theming:

```typescript
// @forgeui/tokens/color
export function lighten(color: string, amount: number): string
export function darken(color: string, amount: number): string
export function alpha(color: string, opacity: number): string // → 'rgba(r, g, b, a)'
export function hexToRgb(hex: string): [number, number, number]
export function rgbToHex(r: number, g: number, b: number): string
export function hexToGlsl(hex: string): [number, number, number, number] // → [r, g, b, a] floats 0–1
export function contrastRatio(fg: string, bg: string): number
export function getAccessibleForeground(bgColor: string): '#000000' | '#ffffff'
export function mix(color1: string, color2: string, weight?: number): string // weight 0–1, default 0.5
```

---

## Component inventory (59 total)

Informed by cross-referencing **shadcn/ui** (59 components), **Radix** (30), **Ark UI** (46),
**Park UI** (59), **Mantine** (130), and **Chakra UI** (107), plus an audit of the
**AssetGenerator** codebase (47 production components). The inventory below covers every
component pattern that appears in 2+ major libraries AND has a confirmed use case
across the 9-tool ecosystem.

### Composition Model: `asChild`

All primitives that render a semantic HTML element support the **`asChild`** prop
(not `as`). When `asChild` is true, the component merges its props and behavior onto
its single child element instead of rendering its own DOM node. This follows the
[Radix `asChild` pattern](https://www.radix-ui.com/primitives/docs/guides/composition)
and is implemented via `@radix-ui/react-slot`.

```tsx
// Default: renders a <button>
<Button variant="primary">Save</Button>

// asChild: merges onto child, renders <a> with Button styles + behavior
<Button variant="primary" asChild>
  <a href="/save">Save</a>
</Button>
```

This avoids the TypeScript complexity of the `as` prop (polymorphic components) and
provides better ref forwarding, event merging, and tree-shaking.

### Phase 1: Foundation (35 components)

Styling uses **CSS Modules** to prevent global namespace pollution.

#### Primitives (13)

| Component        | Props                                                                          | Notes                                                                                                              |
| ---------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| `Button`         | variant, size, type, fullWidth, startIcon, endIcon, asChild, disabled, loading | Primary, secondary, ghost, danger variants                                                                         |
| `IconButton`     | icon, label, size, variant                                                     | Accessible wrapper; requires `label` for screen readers                                                            |
| `Badge`          | variant, color                                                                 | Status indicators; includes numeric entity-state mapping                                                           |
| `Text`           | asChild, size, weight, color, truncate                                         | Inline/block text (`p`, `span`, `label`, `div`). Does **not** render headings — use `Heading` for that             |
| `Heading`        | asChild, level, size                                                           | Semantic heading levels (`h1`–`h6`); `level` controls the HTML element, `size` controls visual scale independently |
| `Separator`      | orientation, decorative                                                        | Horizontal/vertical divider; `decorative` hides from a11y tree                                                     |
| `Card`           | asChild, variant, padding                                                      | Surface container with border and shadow tokens                                                                    |
| `Kbd`            | keys                                                                           | Keyboard shortcut display (e.g., `⌘+S`); renders styled keycap elements                                            |
| `ScrollArea`     | orientation, scrollbarSize                                                     | Custom-styled scrollbar container; preserves native scroll behavior while matching dark theme                      |
| `Label`          | htmlFor                                                                        | Accessible form label; pairs with all form controls                                                                |
| `VisuallyHidden` | asChild                                                                        | Renders content visible only to screen readers                                                                     |
| `Spinner`        | size, label                                                                    | Loading indicator with accessible `role="status"` and live region                                                  |
| `AlertDialog`    | Radix AlertDialog — open, onOpenChange                                         | Confirmation dialog for destructive actions; blocks interaction until confirmed                                    |

#### Forms (11)

| Component     | Props                                                                                      | Notes                                                                                                                                                                            |
| ------------- | ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Input`       | type, size, variant, error, disabled, startAdornment, endAdornment, clearable, placeholder | Text input with built-in validation styling, adornment slots, and optional clear button                                                                                          |
| `Textarea`    | size, resize, error                                                                        | Auto-grows by default; resize configurable                                                                                                                                       |
| `Select`      | options, value, placeholder, disabled, error, size                                         | Radix Select for accessible dropdowns; size/error match Input for consistency                                                                                                    |
| `Checkbox`    | checked, indeterminate, label                                                              | Radix Checkbox with label association                                                                                                                                            |
| `Switch`      | checked, size, label                                                                       | Toggle switch for boolean settings                                                                                                                                               |
| `RadioGroup`  | options, value, orientation                                                                | Radix RadioGroup with keyboard navigation                                                                                                                                        |
| `Slider`      | min, max, step, value                                                                      | Radix Slider; useful for numeric tool parameters                                                                                                                                 |
| `Toggle`      | pressed, variant, size                                                                     | Radix Toggle; two-state button (on/off). Used for bold/italic toggles, view mode switches                                                                                        |
| `ToggleGroup` | type, value, orientation                                                                   | Radix ToggleGroup; single or multiple selection. Used for toolbar tool selection, alignment controls, mode switchers                                                             |
| `FormField`   | label, error, hint, required                                                               | Wrapper that composes label + input + error message                                                                                                                              |
| `NumberInput` | value, min, max, step, precision                                                           | Numeric input with stepper buttons, min/max clamping, and drag-to-adjust interaction (hold and drag vertically to scrub values). Used for transforms, dimensions, physics params |

#### Disclosure (2)

| Component   | Library         | Props                           | Notes                                                                                                                     |
| ----------- | --------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `Accordion` | Radix Accordion | type, collapsible, defaultValue | Collapsible content sections; single or multiple open panels. Used in inspector panels, settings groups, property editors |
| `Tabs`      | Radix Tabs      | value, orientation              | Tabbed content panels; horizontal/vertical. Used in inspectors, multi-view editors, settings                              |

#### Feedback (4)

| Component  | Library         | Props                          | Notes                                                                                                          |
| ---------- | --------------- | ------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| `Alert`    | —               | variant, icon, closable        | Status banner for info/success/warning/error; used for inline feedback and destructive action confirmations    |
| `Progress` | Radix Progress  | value, max, getValueLabel      | Linear progress bar; determinate or indeterminate. Used for build progress, asset processing, batch operations |
| `Skeleton` | —               | width, height, radius, animate | Loading placeholder; matches content shape while data loads. Shimmer animation uses `--forge-duration-slow`    |
| `Toast`    | **Radix Toast** | variant, duration, action      | Stackable notifications at `--forge-z-toast`; auto-dismiss with configurable duration                          |

#### Overlays (5)

| Component      | Library            | Props                                        | Notes                                                                                                          |
| -------------- | ------------------ | -------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `Dialog`       | Radix Dialog       | open, onOpenChange, size, title, description | Modal with focus trap and scroll lock                                                                          |
| `Tooltip`      | Radix Tooltip      | content, side, delay                         | Hover/focus info; accessible by default                                                                        |
| `DropdownMenu` | Radix DropdownMenu | items, trigger                               | Keyboard-navigable action menus                                                                                |
| `ContextMenu`  | Radix Context Menu | items, trigger                               | Right-click menus; fundamental to every game dev tool. Supports submenus, checkable items, keyboard navigation |
| `Popover`      | Radix Popover      | side, align, sideOffset                      | Anchored floating content; used for quick-edit panels, inline color pickers, mini-forms                        |

### Phase 2a: Radix Composites & Layout (13 components)

Components that wrap existing Radix primitives or compose straightforward layouts.
Lower risk — primarily integration and styling work.

#### Overlays (1)

| Component | Library                 | Props             | Notes                                                                                        |
| --------- | ----------------------- | ----------------- | -------------------------------------------------------------------------------------------- |
| `Drawer`  | Radix Dialog (extended) | side, open, title | Slide-in panel from any edge; non-blocking alternative to Dialog for properties and settings |

#### Composites (5)

| Component             | Library               | Notes                                                                                                                                                     |
| --------------------- | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Toolbar`             | **Radix Toolbar**     | Groups related controls (buttons, toggles, separators) with roving keyboard focus. Used in canvas toolbars, editor action bars                            |
| `ResizablePanelGroup` | —                     | Native-feeling resizable panels; persist sizes to localStorage. (Renamed from SplitPane for API clarity)                                                  |
| `Collapsible`         | **Radix Collapsible** | Animated show/hide for a single content region; simpler than Accordion for standalone use                                                                 |
| `Menubar`             | **Radix Menubar**     | Desktop-style horizontal menu bar (File, Edit, View...) with keyboard navigation and submenus. Used in Electron-based tools for native-feeling app chrome |
| `Steps`               | —                     | Multi-step wizard indicator with active/completed/error states. Used for asset pipeline flows, entity creation wizards, import workflows                  |

#### Data Display (4)

| Component     | Library               | Notes                                                                                                                                      |
| ------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `Avatar`      | **Radix Avatar**      | User/entity image with fallback initials                                                                                                   |
| `AspectRatio` | **Radix AspectRatio** | Constrains child to a fixed aspect ratio (e.g., 16:9 thumbnails)                                                                           |
| `Table`       | —                     | Simple semantic table (`Table.Header`, `Table.Body`, `Table.Row`, `Table.Cell`); for static/small data. Use `DataTable` for large datasets |
| `Breadcrumb`  | —                     | Navigation trail with separator and current-page indicator                                                                                 |

#### Layout (3)

| Component    | Library | Notes                                                                                                                                     |
| ------------ | ------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `AppShell`   | —       | Root layout (Sidebar + Nav + Main); fixed-viewport desktop assumption                                                                     |
| `DropZone`   | —       | Drag-and-drop file upload area with visual drag state, file type validation, and click-to-browse fallback. Used in asset import workflows |
| `Pagination` | —       | Page navigation controls (prev/next, page numbers, page size selector)                                                                    |

### Phase 2b: Complex Inputs & Data (8 components)

Custom-built components with significant internal logic. Higher complexity — each
requires dedicated design, testing, and iteration.

#### Data (3)

| Component        | Library            | Notes                                                                                                                                                                                     |
| ---------------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DataTable`      | **TanStack Table** | Virtualization support for 10k+ rows; sorting, filtering, column resize                                                                                                                   |
| `CommandPalette` | **cmdk**           | Fast, keyboard-first navigation; fuzzy search                                                                                                                                             |
| `TreeView`       | —                  | Hierarchical data display with expand/collapse, keyboard navigation, and selection. Used for scene graphs, entity hierarchies, file trees in EntityArchitect, LoreEngine, TerrainComposer |

#### Advanced Inputs (4)

| Component      | Library           | Props                                      | Notes                                                                                                                                                                                           |
| -------------- | ----------------- | ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Combobox`     | **cmdk** or Radix | options, value, placeholder, search        | Searchable select for large lists; autocomplete with filtering. Essential when Select doesn't scale (100s of entities/assets)                                                                   |
| `ColorPicker`  | —                 | value, format, swatches, alpha, eyeDropper | HSL/RGB/Hex color selection with saturation/hue/alpha controls. Optional `alpha` channel toggle and `eyeDropper` for native picker. Used in material editing, palette creation, map annotations |
| `TagsInput`    | —                 | value, suggestions, max                    | Multi-tag entry field; add/remove freeform tags as pills. Used for entity tagging, keyword management across LoreEngine and QuestForge                                                          |
| `PropertyGrid` | —                 | sections, values, onChange                 | Inspector-style key-value editor for entity properties; groups values into collapsible sections with typed editors per row                                                                      |

#### Display (1)

| Component      | Library | Notes                                                                                                                                                                              |
| -------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `EditableText` | —       | Inline text that switches to an input on click/Enter. Used for renaming entities, nodes, layers, and labels in-place without opening a dialog. (Renamed from Editable for clarity) |

### Phase 3: Domain-Specific (3 components)

Components that require deeper integration with tool-specific data structures.

| Component       | Library | Props                             | Notes                                                                              |
| --------------- | ------- | --------------------------------- | ---------------------------------------------------------------------------------- |
| `NodeEditor`    | —       | nodes, edges, onConnect           | Visual node graph for shader/logic/dialogue editors (future — may adopt reactflow) |
| `Timeline`      | —       | tracks, currentTime, onSeek       | Horizontal time-based track editor for animation sequences and cutscenes           |
| `VirtualCanvas` | —       | items, viewport, onViewportChange | Infinite pannable/zoomable canvas for spatial layouts (maps, level editors)        |

### Compound Component Patterns

Several components use **dot-notation** sub-components for structured composition:

```tsx
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Body>Content</Card.Body>
  <Card.Footer>Actions</Card.Footer>
</Card>

<Dialog>
  <Dialog.Trigger>Open</Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>Title</Dialog.Header>
    <Dialog.Footer>Actions</Dialog.Footer>
  </Dialog.Content>
</Dialog>
```

| Component   | Sub-components                                                       |
| ----------- | -------------------------------------------------------------------- |
| `Card`      | `Card.Header`, `Card.Body`, `Card.Footer`                            |
| `Dialog`    | `Dialog.Trigger`, `Dialog.Content`, `Dialog.Header`, `Dialog.Footer` |
| `Alert`     | `Alert.Icon`, `Alert.Title`, `Alert.Description`                     |
| `DataTable` | `DataTable.Toolbar`, `DataTable.Pagination`                          |
| `Table`     | `Table.Header`, `Table.Body`, `Table.Row`, `Table.Cell`              |

---

## Theming architecture

### Theme Contract Extensions

Tools can provide domain-specific tokens (e.g., LoreEngine's "Prophecy" color) via the `ThemeProvider` without bloating the core system. The contract uses a generic type parameter for type-safe extensions.

```typescript
type Palette = 'hearth-bronze' | 'midnight-forge' | 'deep-space' | 'midnight-forge-v2'
type Mode = 'dark' | 'light'

interface ThemeContract<TExtensions extends Record<string, unknown> = Record<string, never>> {
  palette: Palette
  mode: Mode
  colors: BaseColors
  spacing: SpacingScale
  shadows: ShadowScale
  animation: AnimationTokens
  zIndex: ZIndexScale
  extensions: TExtensions
}

// In LoreEngine:
interface LoreExtensions {
  prophecy: string
  factionPrimary: string
  factionSecondary: string
  timeline: { past: string; present: string; future: string }
}
type LoreTheme = ThemeContract<LoreExtensions>

// In TerrainComposer:
interface TerrainExtensions {
  terrain: { grass: string; water: string; rock: string }
  gridLine: string
}
type TerrainTheme = ThemeContract<TerrainExtensions>
```

#### CSS Injection Mechanism

`ThemeProvider` injects extension tokens as **inline `style`** on a wrapping `<div>`,
making them available as CSS custom properties to all descendants:

```tsx
// ThemeProvider renders:
<div style={{ '--lore-prophecy': '#c084fc', '--lore-faction-primary': '#38bdf8', ... }}>
  {children}
</div>
```

- **ForgeUI components** consume only core tokens in their CSS — extensions never leak into the library.
- **Consumer-authored CSS** can reference extension tokens freely (they're standard CSS custom properties on the DOM).
- **`useTokens()` hook** reads both core + extension tokens from ThemeProvider context for JS consumption (canvas, WebGL, runtime logic).
- Extensions are **JS-only within ForgeUI components**; they become **CSS-accessible at the consumer level**.

#### Palette & Mode Switching

`ThemeProvider` accepts `palette` and `mode` props and renders data attributes on the
wrapping `<div>`:

```tsx
// Consumer app root:
<ThemeProvider palette="hearth-bronze" mode="dark">
  <App />
</ThemeProvider>

// ThemeProvider renders:
<div data-palette="hearth-bronze" data-theme="dark" style={{ ...extensionVars }}>
  {children}
</div>
```

Each palette ships as a CSS block scoped to its data attribute. The `tokens.css` file
contains all four palettes:

```css
/* tokens.css — all palettes, scoped by data attribute */
[data-palette='hearth-bronze'][data-theme='dark'] {
  --forge-bg: #0c0805;
  --forge-surface: #1a140f;
  --forge-accent: #d97706;
  /* ... all semantic tokens */
}
[data-palette='midnight-forge'][data-theme='dark'] {
  --forge-bg: #0a0a1a;
  --forge-surface: #121830;
  --forge-accent: #4f8ff7;
  /* ... */
}
/* ... deep-space, midnight-forge-v2, and light-mode variants */
```

- **Runtime switching**: Changing the `palette` or `mode` prop swaps the data
  attributes. CSS custom properties cascade instantly — no JS recalculation needed.
- **JS access**: `useTheme()` returns `{ palette, mode, setPalette, setMode }`.
  `useTokens()` returns resolved token values for the active palette (for canvas/WebGL).
- **SSR-safe**: Data attributes work with server rendering. No flash-of-wrong-theme
  if the initial HTML includes the correct attributes.
- **Default**: If no `palette` prop is provided, defaults to `'hearth-bronze'`.
  If no `mode` prop is provided, defaults to `'dark'`.

### Layout Assumptions

All 9 tools are **fixed-viewport desktop applications** (Electron or full-window browser). ForgeUI does not ship responsive breakpoints. If a tool requires responsive behavior, it handles its own breakpoint logic on top of ForgeUI's layout primitives.

`AppShell` targets a minimum viewport of **1280×720** and uses CSS `dvh`/`dvw` units for full-viewport layouts.

---

## Accessibility

### WCAG Compliance

All components must meet **WCAG 2.1 AA** as a baseline:

- **Text contrast**: All text/background combinations must achieve **4.5:1** contrast ratio (normal text) or **3:1** (large text ≥18px / bold ≥14px).
- **Non-text contrast**: Interactive component boundaries and focus indicators must achieve **3:1** against adjacent colors.

### Known Issues to Address

- **Danger buttons**: Solid red fills (`--forge-danger`) with white text may not reach 4.5:1. Use a darker fill value for danger button backgrounds specifically.
- **Muted text**: `--forge-text-muted` (gray-400) must be validated against all surface levels (`surface`, `surface-raised`, `surface-sunken`). Current value may need 10–15% lightening.

### Color-Independence

- **Status indicators** (Badge, Alert, Toast) must never rely on color alone. Mandate an accompanying icon, text label, or pattern for each status variant.
- **Form validation**: Error states show both a colored border and an error message text — not just a red border.

### Motion & Reduced Motion

- All duration tokens are zeroed out via `prefers-reduced-motion: reduce` (see Animation section).
- **Skeleton shimmer** additionally checks `@media (prefers-reduced-motion: reduce)` and **disables entirely** (not just zero duration — removes the animation declaration to avoid any flicker).

### High Contrast & Forced Colors

- Components include a `@media (forced-colors: active)` fallback that ensures visible borders and focus indicators when the OS forces a high-contrast palette (Windows High Contrast Mode).
- This does not need to look polished — just functional and usable.

---

## Color & Theming

### Light Mode Architecture

Light mode is **not** a reversed dark scale. Warm-tinted grays (800–950) do not reverse cleanly to light backgrounds. Light mode requires its own semantic mapping:

| Dark Mode                             | Light Mode                               |
| ------------------------------------- | ---------------------------------------- |
| `gray-950` → `--forge-bg`             | `neutral-50` → `--forge-bg`              |
| `gray-900` → `--forge-surface`        | `white` → `--forge-surface`              |
| `gray-800` → `--forge-surface-raised` | `neutral-100` → `--forge-surface-raised` |
| `gray-100` → `--forge-text`           | `gray-900` → `--forge-text`              |

CSS scoping uses **data attributes** on the wrapping element (set by `ThemeProvider`):

```css
/* Each palette × mode combination is a separate block in tokens.css */
[data-palette='hearth-bronze'][data-theme='dark'] {
  --forge-bg: #0c0805;
  --forge-surface: #1a140f;
  /* ... warm grays */
}
[data-palette='hearth-bronze'][data-theme='light'] {
  --forge-bg: #faf8f5;
  --forge-surface: #ffffff;
  /* ... neutral warm tones */
}
/* ... midnight-forge, deep-space, midnight-forge-v2 dark/light variants */
```

The `ThemeContract` includes a `mode` field (`'dark' | 'light'`) so components and consumer code can branch on the active theme programmatically.

### Palette Selection

**Default: Hearth Bronze (#11)** — artisanal blacksmith warmth with amber accent.

| Token     | Hearth Bronze (default) | Midnight Forge (#1) | Deep Space (#6)  | Midnight Forge v2 (#10) |
| --------- | ----------------------- | ------------------- | ---------------- | ----------------------- |
| `bg`      | `#0c0805`               | `#0a0a1a`           | `#07090e`        | `#080c14`               |
| `surface` | `#1a140f`               | `#121830`           | `#0e1420`        | `#101828`               |
| `raised`  | `#2a211a`               | `#1e2d4a`           | `#162032`        | `#1a2540`               |
| `border`  | `#3f3227`               | `#2a3f5f`           | `#243044`        | `#283650`               |
| `text`    | `#f2e9df`               | `#e0e4ec`           | `#d4dae5`        | `#e2e8f0`               |
| `muted`   | `#9a8169`               | `#8892a8`           | `#6b7a90`        | `#7889a4`               |
| `accent`  | `#d97706` (amber)       | `#4f8ff7` (blue)    | `#14b8a6` (teal) | `#f59e0b` (gold)        |
| `info`    | `#3b82f6`               | `#3b82f6`           | `#38bdf8`        | `#3b82f6`               |
| `success` | `#4ade80`               | `#34d399`           | `#22c55e`        | `#34d399`               |
| `warning` | `#fbbf24`               | `#fbbf24`           | `#f59e0b`        | `#fb923c`               |
| `danger`  | `#f87171`               | `#f87171`           | `#ef4444`        | `#f87171`               |
| Gray tint | Warm/brown              | Navy/blue           | Deep navy        | Navy/blue               |
| Radius    | `3px`                   | `3px`               | `3px`            | `3px`                   |

All four palettes use the **same 3px default radius** for a sharp, precision-tool feel.

**Known issues to resolve during implementation:**

- **Accent/warning collision** in Midnight Forge v2 (#10): gold accent `#f59e0b` is close to warning `#fb923c`. Differentiate by shifting warning toward pure amber or accent toward deeper gold.
- **Danger button fills**: Light reds (`#f87171`) on solid fills may not clear WCAG AA for white text. Use darker fills (toward `#dc2626`) for danger button backgrounds specifically.
- **Muted text contrast**: Hearth Bronze muted (`#9a8169`) and Deep Space muted (`#6b7a90`) need validation against their respective surfaces. May need 10–15% lightening.

### Font Loading

- Fonts are **self-hosted** (bundled with the Electron app or served from the same origin) — no external CDN requests.
- Use `font-display: swap` to prevent invisible text during load.
- **Subsetting**: Ship only Latin + Latin Extended subsets. Tools needing CJK or other scripts load supplementary font files on demand.

---

## Build & Distribution

### Output Format

All packages are built with **tsup**, producing:

- **ESM** (primary) — for modern bundlers (Vite, esbuild).
- **CJS** (secondary) — for legacy Node tooling or SSR if needed.
- **TypeScript declarations** (`.d.ts`) — generated alongside each format.

### CSS Delivery

- **Authoring:** Components are styled with CSS Modules (`.module.css` files) — unchanged.
- **Build pipeline:** A PostCSS step (`postcss-modules`) pre-compiles CSS Modules into scoped CSS with **deterministic class names** at build time.
- **Output:** Pre-scoped `.css` files are shipped alongside JS. Consumers need **no CSS Module bundler support** — just standard CSS imports.
- **Tools:** `tsup` (JS/TS → ESM/CJS/dts) + `postcss-modules` (CSS → scoped CSS + class name map).
- `@forgeui/tokens` outputs a standalone `tokens.css` file containing all CSS custom properties. Consumers import it once at their app root.
- No runtime CSS-in-JS. No Tailwind.

```js
// postcss.config.js (simplified)
module.exports = {
  plugins: {
    'postcss-modules': {
      generateScopedName: '[name]__[local]--[hash:base64:5]',
      getJSON() {}, // class map consumed by tsup plugin
    },
  },
}
```

### Entry Points

Packages support both barrel and deep imports:

```typescript
// Barrel (convenient, tree-shaking relies on bundler)
import { Button, Input } from '@forgeui/components'

// Deep import (guaranteed minimal, no barrel overhead)
import { Button } from '@forgeui/components/Button'
```

Each component is a separate entry point in the package's `exports` map.

### Build Order

Turborepo manages the dependency graph:

```
tokens ──→ hooks ──→ components
tokens ──→ icons      (parallel with hooks)
```

`hooks` depends on `tokens` (for `useTokens()`); `components` depends on both `tokens` and `hooks`.
`icons` depends only on `tokens` and builds in parallel with `hooks`.

### Tree-Shaking & CSS

**Barrel imports** (`import { Button, Input } from '@forgeui/components'`) pull all CSS for the barrel — bundlers cannot tree-shake CSS side effects. **Deep imports** (`import { Button } from '@forgeui/components/Button'`) are CSS-optimal, pulling only the styles for that component.

Each package.json specifies:

```json
{ "sideEffects": ["*.css"] }
```

This tells bundlers that CSS imports have side effects (must not be removed), while all JS is side-effect-free and safe to tree-shake.

### Bundle Size Targets

| Scope                                       | Target  |
| ------------------------------------------- | ------- |
| Per-component (JS + CSS, gzipped)           | < 3 KB  |
| Full barrel `@forgeui/components` (gzipped) | < 80 KB |

CI tracks bundle sizes via `size-limit` and fails PRs that exceed budgets.

### Cross-Package Versioning

All four published packages (`tokens`, `components`, `hooks`, `icons`) use a **fixed** Changesets group. When any package in the group bumps, all packages bump to the same version. This prevents version drift between tightly coupled packages.

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

| Concern       | Choice                       | Rationale                                              |
| ------------- | ---------------------------- | ------------------------------------------------------ |
| CSS Approach  | **CSS Modules**              | Scoped styles, zero runtime overhead, high performance |
| Icons         | **Lucide React**             | Large, consistent library + custom SVG extension       |
| Testing       | **Vitest + Testing Library** | Fast, modern test runner with DOM testing              |
| Accessibility | **vitest-axe**               | Automated A11y testing; zero-violation policy in CI    |
| Styling Utils | **clsx**                     | Lightweight class merging for variant composition      |
| Build         | **tsup**                     | Fast TS bundler; outputs ESM + CJS + declarations      |
| Versioning    | **Changesets**               | Automated semver bumps and changelogs                  |

### Quality Gates

- **A11y**: 100% `vitest-axe` pass rate on every component.
- **Canvas-Ready**: Every color token must be available as a raw hex string for `<canvas>` use.
- **Performance**: Individual packages are tree-shakeable; deep imports supported.
- **Visuals**: Storybook A11y and Interaction addons active on every story.
- **Types**: TypeScript strict mode; no `any` in public API surfaces.

### Infrastructure Config Files

| File                       | Spec                                                                                    |
| -------------------------- | --------------------------------------------------------------------------------------- |
| `eslint.config.js`         | ESLint 9 flat config + `eslint-plugin-jsx-a11y` + `eslint-plugin-react-hooks`           |
| `.prettierrc`              | Single quotes, no semicolons, trailing commas (`all`)                                   |
| `tsconfig.json`            | TypeScript project references, `composite: true`, strict mode                           |
| `turbo.json`               | Pipeline: `tokens` → `hooks` → `components`; `icons` parallel                           |
| `.github/workflows/ci.yml` | Lint → test (vitest + axe) → build → Storybook build → bundle size check (`size-limit`) |
| `pnpm-workspace.yaml`      | `packages: ['packages/*', 'apps/*']`                                                    |

---

## Implementation Strategy

### Phase 1: Foundation (35 components)

- Setup Monorepo (pnpm + Turborepo).
- Define full numeric color scales (50–950, including 750) for all palettes and export JS-accessible objects.
- Define spacing, typography, border radius, shadow, animation, z-index, focus ring, opacity, icon size, container width, and scrollbar token scales.
- Implement 13 Primitives: Button, IconButton, Badge, Text, Heading, Separator, Card, Kbd, ScrollArea, Label, VisuallyHidden, Spinner, AlertDialog.
- Implement 11 Form components: Input, Textarea, Select, Checkbox, Switch, RadioGroup, Slider, Toggle, ToggleGroup, FormField, NumberInput.
- Implement 2 Disclosure components: Accordion, Tabs.
- Implement 4 Feedback components: Alert, Progress, Skeleton, Toast.
- Implement 5 Overlay components: Dialog, Tooltip, DropdownMenu, ContextMenu, Popover.
- Set up Vitest + Testing Library with axe audits.
- Set up Storybook with A11y and Interaction addons.
- Configure Changesets for versioning.

### Phase 2a: Radix Composites & Layout (13 components)

Lower risk — primarily wrapping existing Radix primitives and composing layouts.

- Build `Drawer` extending Radix Dialog for slide-in panels.
- Build `Toolbar` with roving focus and grouped controls.
- Build `ResizablePanelGroup` with persisted panel sizes.
- Integrate **Radix Collapsible** for `Collapsible`.
- Integrate **Radix Menubar** for `Menubar` (desktop-style app menus).
- Build `Steps` for multi-step wizard indicator.
- Integrate **Radix Avatar** for `Avatar`.
- Integrate **Radix AspectRatio** for `AspectRatio`.
- Build `Table` (simple semantic table with compound sub-components).
- Build `Breadcrumb` navigation trail.
- Build `AppShell` targeting 1280×720 minimum viewport.
- Build `DropZone` with drag state, file validation, and click fallback.
- Build `Pagination` controls.

### Phase 2b: Complex Inputs & Data (8 components)

Higher complexity — each requires dedicated design, testing, and iteration.

- Integrate **TanStack Table** for `DataTable` with virtualization.
- Integrate **cmdk** for `CommandPalette` and `Combobox`.
- Build `TreeView` for hierarchical data (scene graphs, entity trees, file browsers).
- Build `ColorPicker` with HSL/RGB/Hex modes, swatch presets, alpha toggle, and eyeDropper.
- Build `TagsInput` with freeform entry and optional suggestions.
- Build `PropertyGrid` inspector-style key-value editor.
- Build `EditableText` for inline rename interactions.

### Phase 3: Domain-Specific Components & Rollout (3 components)

#### Domain Components

- Build `NodeEditor` for visual node graphs (future — may adopt reactflow).
- Build `Timeline` for time-based track editing.
- Build `VirtualCanvas` for infinite pannable/zoomable spatial layouts.

#### Extension Support

- Implement generic `ThemeContract<T>` provider with typed extensions and CSS injection.
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

#### Compatibility & React Target

- ForgeUI targets **React 19+**. Tools on older versions must upgrade before adopting.
- **No `forwardRef`**: React 19 supports ref as a regular prop — components accept `ref` natively without wrapping in `forwardRef`.
- **`'use client'` directive**: tsup's `banner` option prepends `'use client';` to every component entry point, ensuring compatibility with React Server Components.
- **`use()` hook**: ThemeProvider context is compatible with React 19's `use()` hook for reading context in async components.
- ForgeUI does not depend on any specific bundler. Pre-compiled CSS ships alongside JS — no CSS Module bundler support required at the consumer level.
