# @forgeui/tokens

Design tokens for ForgeUI — CSS custom properties and JS constants for all design decisions: colors, spacing, typography, shadows, animation, z-index, and more.

## Installation

```bash
npm install @forgeui/tokens
```

## Setup

Import the CSS file once at your app root:

```ts
import '@forgeui/tokens/tokens.css'
```

This makes all `--forge-*` CSS custom properties available throughout your app, scoped to the active palette and mode via `data-palette` and `data-theme` attributes (set automatically by `ThemeProvider`).

## CSS Custom Properties

### Colors

```css
/* Backgrounds */
var(--forge-bg)
var(--forge-surface)
var(--forge-surface-raised)
var(--forge-surface-hover)
var(--forge-surface-active)
var(--forge-surface-sunken)
var(--forge-surface-overlay)
var(--forge-surface-popover)

/* Borders */
var(--forge-border)
var(--forge-border-subtle)
var(--forge-border-strong)

/* Text */
var(--forge-text)
var(--forge-text-muted)
var(--forge-text-disabled)

/* Accent */
var(--forge-accent)

/* Status (each has base, -hover, -bg, -border, -foreground) */
var(--forge-info)         var(--forge-info-hover)    var(--forge-info-bg)
var(--forge-success)      var(--forge-success-hover)  var(--forge-success-bg)
var(--forge-warning)      var(--forge-warning-hover)  var(--forge-warning-bg)
var(--forge-danger)       var(--forge-danger-hover)   var(--forge-danger-bg)

/* Text on colored fills */
var(--forge-text-on-accent)
var(--forge-text-on-info)
var(--forge-text-on-success)
var(--forge-text-on-warning)
var(--forge-text-on-danger)
```

### Spacing

4px base multiplier scale (`N × 4px`):

```css
var(--forge-space-1)   /* 4px  */
var(--forge-space-2)   /* 8px  */
var(--forge-space-3)   /* 12px */
var(--forge-space-4)   /* 16px */
var(--forge-space-5)   /* 20px */
var(--forge-space-6)   /* 24px */
var(--forge-space-8)   /* 32px */
var(--forge-space-10)  /* 40px */
var(--forge-space-12)  /* 48px */
var(--forge-space-16)  /* 64px */
/* ... through space-64 (256px) */

/* Sub-unit exceptions */
var(--forge-space-px)   /* 1px */
var(--forge-space-0.5)  /* 2px */
```

### Typography

```css
/* Font stacks */
var(--forge-font-sans)     /* 'Inter', system-ui, sans-serif */
var(--forge-font-display)  /* 'Geist', 'Inter', system-ui, sans-serif */
var(--forge-font-mono)     /* 'JetBrains Mono', 'Fira Code', monospace */

/* Font sizes */
var(--forge-font-size-xs)    /* 11px */
var(--forge-font-size-sm)    /* 13px */
var(--forge-font-size-base)  /* 14px — default */
var(--forge-font-size-md)    /* 16px */
var(--forge-font-size-lg)    /* 18px */
var(--forge-font-size-xl)    /* 20px */
var(--forge-font-size-2xl)   /* 24px */
var(--forge-font-size-3xl)   /* 30px */

/* Font weights */
var(--forge-font-normal)    /* 400 */
var(--forge-font-medium)    /* 500 */
var(--forge-font-semibold)  /* 600 */
var(--forge-font-bold)      /* 700 */

/* Line heights */
var(--forge-leading-tight)    /* 1.25 */
var(--forge-leading-normal)   /* 1.5  */
var(--forge-leading-relaxed)  /* 1.75 */

/* Letter spacing */
var(--forge-tracking-tight)   /* -0.01em */
var(--forge-tracking-normal)  /* 0        */
var(--forge-tracking-wide)    /* 0.05em  */
```

### Border Radius

```css
var(--forge-radius-none)  /* 0px    */
var(--forge-radius-sm)    /* 2px    */
var(--forge-radius-md)    /* 3px — default */
var(--forge-radius-lg)    /* 6px    */
var(--forge-radius-xl)    /* 8px    */
var(--forge-radius-full)  /* 9999px */
```

### Shadows

```css
var(--forge-shadow-none)
var(--forge-shadow-sm)    /* 0 1px 2px rgb(0 0 0 / 0.5)   */
var(--forge-shadow-md)    /* 0 4px 8px rgb(0 0 0 / 0.6)   */
var(--forge-shadow-lg)    /* 0 8px 24px rgb(0 0 0 / 0.7)  */
var(--forge-shadow-xl)    /* 0 16px 48px rgb(0 0 0 / 0.8) */
var(--forge-shadow-inset) /* inset 0 1px 2px ...          */
var(--forge-shadow-ring-accent)
```

### Animation

```css
var(--forge-duration-instant)  /* 0ms   */
var(--forge-duration-fast)     /* 100ms */
var(--forge-duration-normal)   /* 200ms */
var(--forge-duration-slow)     /* 400ms */

var(--forge-easing-default)    /* cubic-bezier(0, 0, 0.2, 1)    — ease-out */
var(--forge-easing-in)         /* cubic-bezier(0.4, 0, 1, 1)    — ease-in  */
var(--forge-easing-out)        /* cubic-bezier(0, 0, 0.2, 1)    — alias    */
var(--forge-easing-in-out)     /* cubic-bezier(0.4, 0, 0.2, 1)  — symmetric */
```

All duration tokens are automatically zeroed when `prefers-reduced-motion: reduce` is active.

### Z-Index

```css
var(--forge-z-base)      /* 0   */
var(--forge-z-dropdown)  /* 100 */
var(--forge-z-sticky)    /* 200 */
var(--forge-z-overlay)   /* 300 */
var(--forge-z-modal)     /* 400 */
var(--forge-z-toast)     /* 500 */
var(--forge-z-tooltip)   /* 600 */
```

### Other

```css
/* Focus ring */
var(--forge-focus-ring-color)   /* var(--forge-accent) */
var(--forge-focus-ring-width)   /* 2px */
var(--forge-focus-ring-offset)  /* 2px */

/* Opacity */
var(--forge-opacity-subtle)   /* 0.08 */
var(--forge-opacity-light)    /* 0.15 */
var(--forge-opacity-medium)   /* 0.40 */
var(--forge-opacity-heavy)    /* 0.60 */

/* Icon sizes */
var(--forge-icon-xs)  /* 14px */
var(--forge-icon-sm)  /* 16px */
var(--forge-icon-md)  /* 20px */
var(--forge-icon-lg)  /* 24px */

/* Container widths */
var(--forge-max-w-prose)  /* 65ch  */
var(--forge-max-w-sm)     /* 384px */
var(--forge-max-w-md)     /* 512px */
var(--forge-max-w-lg)     /* 768px */
```

## JS / TypeScript

```ts
import { tokens, semantic, generateCssVars } from '@forgeui/tokens'

// Raw scale values
tokens.colors.gray[950]           // '#0c0805'
tokens.colors.amber[500]          // '#f59e0b'
tokens.spacing[4].value           // 16
tokens.spacing[4].css             // '16px'
tokens.radius.md                  // '3px'
tokens.animation.durationNormal   // '200ms'
tokens.zIndex.modal               // 400

// Semantic aliases (CSS var strings — use in style props)
semantic.bg        // 'var(--forge-bg)'
semantic.surface   // 'var(--forge-surface)'
semantic.accent    // 'var(--forge-accent)'
semantic.text      // 'var(--forge-text)'
semantic.textMuted // 'var(--forge-text-muted)'

// Generate a full CSS variable block (useful for SSR or custom injection)
const cssBlock = generateCssVars('hearth-bronze', 'dark')
```

## Color utilities

```ts
import {
  lighten, darken, alpha, mix,
  hexToRgb, rgbToHex, hexToGlsl,
  contrastRatio, getAccessibleForeground,
} from '@forgeui/tokens/color'

lighten('#d97706', 0.1)                    // lighter amber
darken('#d97706', 0.1)                     // darker amber
alpha('#d97706', 0.5)                      // 'rgba(217, 119, 6, 0.5)'
mix('#d97706', '#1a140f', 0.3)             // blend 30/70

hexToRgb('#d97706')                        // [217, 119, 6]
rgbToHex(217, 119, 6)                      // '#d97706'
hexToGlsl('#d97706')                       // [0.851, 0.467, 0.024, 1.0]

contrastRatio('#f2e9df', '#0c0805')        // ~16.5
getAccessibleForeground('#d97706')         // '#ffffff'
```

`hexToGlsl` is particularly useful for passing token colors to WebGL uniforms.

## Palettes

| Palette | Accent | Gray tint |
|---------|--------|-----------|
| `hearth-bronze` | Amber `#d97706` | Warm/brown |
| `midnight-forge` | Blue `#4f8ff7` | Navy/blue |
| `deep-space` | Teal `#14b8a6` | Deep navy |
| `midnight-forge-v2` | Gold `#f59e0b` | Navy/blue |

Palette and mode are applied by `ThemeProvider` in `@forgeui/components` via `data-palette` and `data-theme` data attributes on a wrapping element. All CSS token blocks are scoped to those attributes.
