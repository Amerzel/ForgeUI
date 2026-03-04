/**
 * Generates src/tokens.css — all 4 palettes × 2 modes as data-attribute-scoped
 * CSS blocks. Called by generate-scales.ts at the end of the build step.
 */

import { writeFileSync } from 'fs'
import { join } from 'path'
import { alpha, darken, getAccessibleForeground, lighten, mix } from '../src/color.js'

// ---------------------------------------------------------------------------
// Palette definitions
// ---------------------------------------------------------------------------

interface PaletteBase {
  bg: string
  surface: string
  raised: string
  border: string
  text: string
  muted: string
  accent: string
  info: string
  success: string
  warning: string
  danger: string
}

type PaletteName = 'hearth-bronze' | 'midnight-forge' | 'deep-space' | 'midnight-forge-v2'

const DARK_PALETTES: Record<PaletteName, PaletteBase> = {
  'hearth-bronze': {
    bg: '#0c0805',
    surface: '#1a140f',
    raised: '#2a211a',
    border: '#3f3227',
    text: '#f2e9df',
    muted: '#9a8169',
    accent: '#d97706',
    info: '#3b82f6',
    success: '#4ade80',
    warning: '#fbbf24',
    danger: '#f87171',
  },
  'midnight-forge': {
    bg: '#0a0a1a',
    surface: '#121830',
    raised: '#1e2d4a',
    border: '#2a3f5f',
    text: '#e0e4ec',
    muted: '#8892a8',
    accent: '#4f8ff7',
    info: '#3b82f6',
    success: '#34d399',
    warning: '#fbbf24',
    danger: '#f87171',
  },
  'deep-space': {
    bg: '#07090e',
    surface: '#0e1420',
    raised: '#162032',
    border: '#243044',
    text: '#d4dae5',
    muted: '#6b7a90',
    accent: '#14b8a6',
    info: '#38bdf8',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
  },
  'midnight-forge-v2': {
    bg: '#080c14',
    surface: '#101828',
    raised: '#1a2540',
    border: '#283650',
    text: '#e2e8f0',
    muted: '#7889a4',
    accent: '#f59e0b',
    info: '#3b82f6',
    success: '#34d399',
    warning: '#fb923c',
    danger: '#f87171',
  },
}

// Light mode uses a separate neutral mapping (not a reversed dark scale)
const LIGHT_PALETTES: Record<PaletteName, PaletteBase> = {
  'hearth-bronze': {
    bg: '#faf8f5',
    surface: '#ffffff',
    raised: '#f2e9df',
    border: '#d1c1ad',
    text: '#1a140f',
    muted: '#6b5c4a',
    accent: '#b45309', // darkened amber for light bg contrast
    info: '#1d4ed8',
    success: '#15803d',
    warning: '#b45309',
    danger: '#dc2626',
  },
  'midnight-forge': {
    bg: '#f8faff',
    surface: '#ffffff',
    raised: '#eef2ff',
    border: '#c7d2fe',
    text: '#0a0a1a',
    muted: '#4338ca',
    accent: '#2563eb',
    info: '#1d4ed8',
    success: '#047857',
    warning: '#b45309',
    danger: '#dc2626',
  },
  'deep-space': {
    bg: '#f0f9ff',
    surface: '#ffffff',
    raised: '#e0f2fe',
    border: '#7dd3fc',
    text: '#07090e',
    muted: '#0369a1',
    accent: '#0e7490',
    info: '#0284c7',
    success: '#15803d',
    warning: '#b45309',
    danger: '#dc2626',
  },
  'midnight-forge-v2': {
    bg: '#f8fafc',
    surface: '#ffffff',
    raised: '#f1f5f9',
    border: '#cbd5e1',
    text: '#080c14',
    muted: '#475569',
    accent: '#d97706',
    info: '#1d4ed8',
    success: '#047857',
    warning: '#c2410c',
    danger: '#dc2626',
  },
}

// ---------------------------------------------------------------------------
// CSS block generation
// ---------------------------------------------------------------------------

function buildBlock(palette: PaletteName, mode: 'dark' | 'light'): string {
  const p = mode === 'dark' ? DARK_PALETTES[palette] : LIGHT_PALETTES[palette]

  // Derived surface tokens
  const surfaceHover = lighten(p.surface, 0.04)
  // surface-active = gray-700 equivalent = same as border token (both map to gray-700 in plan)
  const surfaceActive = p.border
  const surfaceSunken = darken(p.bg, 0.02)
  const surfaceOverlay = alpha(p.bg, 0.6)
  const bgOverlay = 'rgb(0 0 0 / 0.6)'
  const bgDisabled = alpha(p.raised, 0.5)
  const surfacePopover = mix(p.surface, p.raised, 0.5)

  // Derived border tokens
  const borderSubtle = darken(p.border, 0.05)
  const borderStrong = lighten(p.border, 0.05)

  // Derived text tokens
  const textDisabled = darken(p.muted, 0.15)

  // Status quintuplets
  const makeStatus = (base: string) => ({
    base,
    hover: darken(base, 0.1),
    bg: alpha(base, 0.1),
    border: lighten(base, 0.15),
    foreground: getAccessibleForeground(base),
  })
  const statusInfo = makeStatus(p.info)
  const statusSuccess = makeStatus(p.success)
  const statusWarning = makeStatus(p.warning)
  const statusDanger = makeStatus(p.danger)

  // Text-on-color tokens
  const textOnAccent = getAccessibleForeground(p.accent)
  const textOnInfo = getAccessibleForeground(p.info)
  const textOnSuccess = getAccessibleForeground(p.success)
  const textOnWarning = getAccessibleForeground(p.warning)
  const textOnDanger = getAccessibleForeground(p.danger)

  // Selection & highlight
  const selectionBg = alpha(p.accent, 0.3)
  const selectionText = p.text
  const highlightBg = alpha(p.accent, 0.25)

  // Scrollbar
  const scrollbarTrack = p.surface
  const scrollbarThumb = p.border
  const scrollbarThumbHover = lighten(p.border, 0.1)

  return `[data-palette='${palette}'][data-theme='${mode}'] {
  /* --- Surfaces --- */
  --forge-bg: ${p.bg};
  --forge-surface: ${p.surface};
  --forge-surface-raised: ${p.raised};
  --forge-surface-hover: ${surfaceHover};
  --forge-surface-active: ${surfaceActive};
  --forge-surface-sunken: ${surfaceSunken};
  --forge-surface-overlay: ${surfaceOverlay};
  --forge-surface-popover: ${surfacePopover};
  --forge-bg-overlay: ${bgOverlay};
  --forge-bg-disabled: ${bgDisabled};

  /* --- Borders --- */
  --forge-border: ${p.border};
  --forge-border-subtle: ${borderSubtle};
  --forge-border-strong: ${borderStrong};

  /* --- Accent --- */
  --forge-accent: ${p.accent};

  /* --- Text --- */
  --forge-text: ${p.text};
  --forge-text-muted: ${p.muted};
  --forge-text-disabled: ${textDisabled};

  /* --- Text on color --- */
  --forge-text-on-accent: ${textOnAccent};
  --forge-text-on-info: ${textOnInfo};
  --forge-text-on-success: ${textOnSuccess};
  --forge-text-on-warning: ${textOnWarning};
  --forge-text-on-danger: ${textOnDanger};

  /* --- Info --- */
  --forge-info: ${statusInfo.base};
  --forge-info-hover: ${statusInfo.hover};
  --forge-info-bg: ${statusInfo.bg};
  --forge-info-border: ${statusInfo.border};
  --forge-info-foreground: ${statusInfo.foreground};

  /* --- Success --- */
  --forge-success: ${statusSuccess.base};
  --forge-success-hover: ${statusSuccess.hover};
  --forge-success-bg: ${statusSuccess.bg};
  --forge-success-border: ${statusSuccess.border};
  --forge-success-foreground: ${statusSuccess.foreground};

  /* --- Warning --- */
  --forge-warning: ${statusWarning.base};
  --forge-warning-hover: ${statusWarning.hover};
  --forge-warning-bg: ${statusWarning.bg};
  --forge-warning-border: ${statusWarning.border};
  --forge-warning-foreground: ${statusWarning.foreground};

  /* --- Danger --- */
  --forge-danger: ${statusDanger.base};
  --forge-danger-hover: ${statusDanger.hover};
  --forge-danger-bg: ${statusDanger.bg};
  --forge-danger-border: ${statusDanger.border};
  --forge-danger-foreground: ${statusDanger.foreground};

  /* --- Selection --- */
  --forge-selection-bg: ${selectionBg};
  --forge-selection-text: ${selectionText};
  --forge-highlight-bg: ${highlightBg};

  /* --- Scrollbar --- */
  --forge-scrollbar-track: ${scrollbarTrack};
  --forge-scrollbar-thumb: ${scrollbarThumb};
  --forge-scrollbar-thumb-hover: ${scrollbarThumbHover};
}`
}

// ---------------------------------------------------------------------------
// Static (palette-invariant) tokens
// ---------------------------------------------------------------------------

const STATIC_TOKENS = `/* ============================================================
   @forgeui/tokens — static tokens (palette-invariant)
   ============================================================ */

:root {
  /* --- Spacing (4px base) --- */
  --forge-space-0: 0px;
  --forge-space-px: 1px;
  --forge-space-0\\.5: 2px;
  --forge-space-1: 4px;
  --forge-space-2: 8px;
  --forge-space-3: 12px;
  --forge-space-4: 16px;
  --forge-space-5: 20px;
  --forge-space-6: 24px;
  --forge-space-8: 32px;
  --forge-space-10: 40px;
  --forge-space-12: 48px;
  --forge-space-16: 64px;
  --forge-space-20: 80px;
  --forge-space-24: 96px;
  --forge-space-32: 128px;
  --forge-space-40: 160px;
  --forge-space-48: 192px;
  --forge-space-64: 256px;

  /* --- Typography — Font families --- */
  --forge-font-sans: 'Inter', system-ui, sans-serif;
  --forge-font-display: 'Geist', 'Inter', system-ui, sans-serif;
  --forge-font-mono: 'JetBrains Mono', 'Fira Code', monospace;

  /* --- Typography — Font sizes with paired line heights --- */
  --forge-font-size-xs: 11px;
  --forge-line-height-xs: 16px;
  --forge-font-size-sm: 13px;
  --forge-line-height-sm: 20px;
  --forge-font-size-base: 14px;
  --forge-line-height-base: 22px;
  --forge-font-size-md: 16px;
  --forge-line-height-md: 24px;
  --forge-font-size-lg: 18px;
  --forge-line-height-lg: 28px;
  --forge-font-size-xl: 20px;
  --forge-line-height-xl: 28px;
  --forge-font-size-2xl: 24px;
  --forge-line-height-2xl: 32px;
  --forge-font-size-3xl: 30px;
  --forge-line-height-3xl: 36px;

  /* --- Typography — Font weights --- */
  --forge-font-normal: 400;
  --forge-font-medium: 500;
  --forge-font-semibold: 600;
  --forge-font-bold: 700;

  /* --- Typography — Line heights (standalone) --- */
  --forge-leading-tight: 1.25;
  --forge-leading-normal: 1.5;
  --forge-leading-relaxed: 1.75;

  /* --- Typography — Letter spacing --- */
  --forge-tracking-tight: -0.01em;
  --forge-tracking-normal: 0;
  --forge-tracking-wide: 0.05em;

  /* --- Border radius --- */
  --forge-radius-none: 0px;
  --forge-radius-sm: 2px;
  --forge-radius-md: 3px;
  --forge-radius-lg: 6px;
  --forge-radius-xl: 8px;
  --forge-radius-full: 9999px;

  /* --- Shadows --- */
  --forge-shadow-none: none;
  --forge-shadow-sm: 0 1px 2px rgb(0 0 0 / 0.5);
  --forge-shadow-md: 0 4px 8px rgb(0 0 0 / 0.6);
  --forge-shadow-lg: 0 8px 24px rgb(0 0 0 / 0.7);
  --forge-shadow-xl: 0 16px 48px rgb(0 0 0 / 0.8);
  --forge-shadow-inset: inset 0 1px 2px rgb(0 0 0 / 0.5);
  --forge-shadow-ring-accent: 0 0 0 3px color-mix(in srgb, var(--forge-accent) 40%, transparent);

  /* --- Animation durations --- */
  --forge-duration-instant: 0ms;
  --forge-duration-fast: 100ms;
  --forge-duration-normal: 200ms;
  --forge-duration-slow: 400ms;

  /* --- Animation easings --- */
  --forge-easing-default: cubic-bezier(0, 0, 0.2, 1);
  --forge-easing-in: cubic-bezier(0.4, 0, 1, 1);
  --forge-easing-out: cubic-bezier(0, 0, 0.2, 1);
  --forge-easing-in-out: cubic-bezier(0.4, 0, 0.2, 1);

  /* --- Focus ring --- */
  --forge-focus-ring-color: var(--forge-accent);
  --forge-focus-ring-width: 2px;
  --forge-focus-ring-offset: 2px;

  /* --- Z-index --- */
  --forge-z-base: 0;
  --forge-z-dropdown: 100;
  --forge-z-sticky: 200;
  --forge-z-overlay: 300;
  --forge-z-modal: 400;
  --forge-z-toast: 500;
  --forge-z-tooltip: 600;

  /* --- Opacity --- */
  --forge-opacity-subtle: 0.08;
  --forge-opacity-light: 0.15;
  --forge-opacity-medium: 0.4;
  --forge-opacity-heavy: 0.6;

  /* --- Icon sizes --- */
  --forge-icon-xs: 14px;
  --forge-icon-sm: 16px;
  --forge-icon-md: 20px;
  --forge-icon-lg: 24px;

  /* --- Container widths --- */
  --forge-max-w-prose: 65ch;
  --forge-max-w-sm: 384px;
  --forge-max-w-md: 512px;
  --forge-max-w-lg: 768px;

  /* --- Backdrop blur --- */
  --forge-blur-overlay: 8px;
}

/* --- Reduced motion --- */
@media (prefers-reduced-motion: reduce) {
  :root {
    --forge-duration-fast: 0ms;
    --forge-duration-normal: 0ms;
    --forge-duration-slow: 0ms;
  }
}
`

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export function writeTokensCss(): void {
  const palettes: PaletteName[] = [
    'hearth-bronze',
    'midnight-forge',
    'deep-space',
    'midnight-forge-v2',
  ]
  const modes: Array<'dark' | 'light'> = ['dark', 'light']

  const paletteBlocks = palettes
    .flatMap((palette) => modes.map((mode) => buildBlock(palette, mode)))
    .join('\n\n')

  const css = `/* ============================================================
   @forgeui/tokens — tokens.css
   AUTO-GENERATED — do not edit by hand.
   Run \`pnpm build\` in @forgeui/tokens to regenerate.
   ============================================================ */

${STATIC_TOKENS}

/* ============================================================
   Palette × mode semantic tokens
   ============================================================ */

${paletteBlocks}
`

  writeFileSync(join(import.meta.dirname, '..', 'src', 'tokens.css'), css)
}
