/**
 * Resolves semantic token values to actual hex strings for the given palette/mode.
 * Called once at ThemeProvider mount and on palette/mode change.
 * These resolved values are what useTokens() returns for canvas/WebGL consumers.
 */

import type { Palette, Mode } from '@forgeui/tokens'
import { darken, lighten } from '@forgeui/tokens'
import type { ResolvedTokens } from './ThemeContext.js'

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

const DARK: Record<Palette, PaletteBase> = {
  'hearth-bronze': {
    bg: '#0c0805', surface: '#1a140f', raised: '#2a211a', border: '#3f3227',
    text: '#f2e9df', muted: '#9a8169', accent: '#d97706',
    info: '#3b82f6', success: '#4ade80', warning: '#fbbf24', danger: '#f87171',
  },
  'midnight-forge': {
    bg: '#0a0a1a', surface: '#121830', raised: '#1e2d4a', border: '#2a3f5f',
    text: '#e0e4ec', muted: '#8892a8', accent: '#4f8ff7',
    info: '#3b82f6', success: '#34d399', warning: '#fbbf24', danger: '#f87171',
  },
  'deep-space': {
    bg: '#07090e', surface: '#0e1420', raised: '#162032', border: '#243044',
    text: '#d4dae5', muted: '#6b7a90', accent: '#14b8a6',
    info: '#38bdf8', success: '#22c55e', warning: '#f59e0b', danger: '#ef4444',
  },
  'midnight-forge-v2': {
    bg: '#080c14', surface: '#101828', raised: '#1a2540', border: '#283650',
    text: '#e2e8f0', muted: '#7889a4', accent: '#f59e0b',
    info: '#3b82f6', success: '#34d399', warning: '#fb923c', danger: '#f87171',
  },
}

const LIGHT: Record<Palette, PaletteBase> = {
  'hearth-bronze': {
    bg: '#faf8f5', surface: '#ffffff', raised: '#f2e9df', border: '#d1c1ad',
    text: '#1a140f', muted: '#6b5c4a', accent: '#b45309',
    info: '#1d4ed8', success: '#15803d', warning: '#b45309', danger: '#dc2626',
  },
  'midnight-forge': {
    bg: '#f8faff', surface: '#ffffff', raised: '#eef2ff', border: '#c7d2fe',
    text: '#0a0a1a', muted: '#4338ca', accent: '#2563eb',
    info: '#1d4ed8', success: '#047857', warning: '#b45309', danger: '#dc2626',
  },
  'deep-space': {
    bg: '#f0f9ff', surface: '#ffffff', raised: '#e0f2fe', border: '#7dd3fc',
    text: '#07090e', muted: '#0369a1', accent: '#0e7490',
    info: '#0284c7', success: '#15803d', warning: '#b45309', danger: '#dc2626',
  },
  'midnight-forge-v2': {
    bg: '#f8fafc', surface: '#ffffff', raised: '#f1f5f9', border: '#cbd5e1',
    text: '#080c14', muted: '#475569', accent: '#d97706',
    info: '#1d4ed8', success: '#047857', warning: '#c2410c', danger: '#dc2626',
  },
}

export function resolveTokens(palette: Palette, mode: Mode): ResolvedTokens {
  const p = mode === 'dark' ? DARK[palette] : LIGHT[palette]
  return {
    bg:            p.bg,
    surface:       p.surface,
    surfaceRaised: p.raised,
    surfaceHover:  lighten(p.surface, 0.04),
    surfaceActive: p.border,
    surfaceSunken: darken(p.bg, 0.02),
    border:        p.border,
    borderSubtle:  darken(p.border, 0.05),
    borderStrong:  lighten(p.border, 0.05),
    accent:        p.accent,
    text:          p.text,
    textMuted:     p.muted,
    textDisabled:  darken(p.muted, 0.15),
    info:          p.info,
    success:       p.success,
    warning:       p.warning,
    danger:        p.danger,
  }
}

