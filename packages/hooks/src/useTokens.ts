import { use } from 'react'
import { ThemeContext } from './ThemeContext.js'
import type { ResolvedTokens, ExtensionTokens } from './ThemeContext.js'

export interface UseTokensResult<TExtensions extends ExtensionTokens = ExtensionTokens> {
  /** Resolved hex color values for the active palette — safe for canvas/WebGL use */
  tokens: ResolvedTokens
  /**
   * Extension tokens provided by the consuming tool.
   * Typed as TExtensions when using useTokens<YourExtensions>().
   */
  extensions: TExtensions
}

/**
 * Returns resolved token values (actual hex strings, not CSS variable references)
 * for the active palette and mode. Use this in canvas renderers, WebGL shaders,
 * or any context where CSS custom properties are not available.
 *
 * For standard CSS/JSX rendering, prefer CSS custom properties via tokens.css.
 * Must be called inside a <ThemeProvider>.
 *
 * @example — typed extensions
 * interface LoreExtensions { '--lore-prophecy': string }
 * const { extensions } = useTokens<LoreExtensions>()
 * // Access resolved token for canvas rendering
 * ctx.fillStyle = extensions['--lore-prophecy']
 */
export function useTokens<TExtensions extends ExtensionTokens = ExtensionTokens>(): UseTokensResult<TExtensions> {
  const ctx = use(ThemeContext)
  if (!ctx) {
    throw new Error('useTokens() must be used inside a <ThemeProvider>.')
  }
  return {
    tokens: ctx.resolvedTokens,
    extensions: ctx.extensions as TExtensions,
  }
}
