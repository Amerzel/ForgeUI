import { use } from 'react'
import { ThemeContext } from './ThemeContext.js'
import type { Palette, Mode } from '@forgeui/tokens'

export interface UseThemeResult {
  /** Active palette name */
  palette: Palette
  /** Active mode ('dark' | 'light') */
  mode: Mode
  /** Switch the active palette */
  setPalette: (palette: Palette) => void
  /** Switch the active mode */
  setMode: (mode: Mode) => void
}

/**
 * Returns the active palette and mode, and setters to change them.
 * Must be called inside a <ThemeProvider>.
 */
export function useTheme(): UseThemeResult {
  const ctx = use(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme() must be used inside a <ThemeProvider>.')
  }
  return {
    palette: ctx.palette,
    mode: ctx.mode,
    setPalette: ctx.setPalette,
    setMode: ctx.setMode,
  }
}
