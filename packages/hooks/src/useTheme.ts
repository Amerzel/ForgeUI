import { use } from 'react'
import { ThemeContext } from './ThemeContext.js'
import type { ExtensionTokens } from './ThemeContext.js'
import type { Palette, Mode } from '@forgeui/tokens'

export interface UseThemeResult<TExtensions extends ExtensionTokens = ExtensionTokens> {
  /** Active palette name */
  palette: Palette
  /** Active mode ('dark' | 'light') */
  mode: Mode
  /** Switch the active palette */
  setPalette: (palette: Palette) => void
  /** Switch the active mode */
  setMode: (mode: Mode) => void
  /**
   * Domain-specific extension tokens provided to ThemeProvider.extensions.
   * Typed as TExtensions when using useTheme<YourExtensions>().
   */
  extensions: TExtensions
}

/**
 * Returns the active palette and mode, setters to change them,
 * and domain extension tokens.
 *
 * Must be called inside a <ThemeProvider>.
 *
 * @example — typed extensions
 * interface LoreExtensions { '--lore-prophecy': string }
 * const { extensions } = useTheme<LoreExtensions>()
 * extensions['--lore-prophecy'] // string
 */
export function useTheme<TExtensions extends ExtensionTokens = ExtensionTokens>(): UseThemeResult<TExtensions> {
  const ctx = use(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme() must be used inside a <ThemeProvider>.')
  }
  return {
    palette: ctx.palette,
    mode: ctx.mode,
    setPalette: ctx.setPalette,
    setMode: ctx.setMode,
    extensions: ctx.extensions as TExtensions,
  }
}
