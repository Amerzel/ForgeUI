import { createContext } from 'react'
import type { Palette, Mode } from '@forgeui/tokens'

/**
 * Resolved semantic token values for canvas/WebGL use.
 * These are actual hex strings (not CSS variable references) resolved
 * against the active palette at ThemeProvider mount time.
 */
export interface ResolvedTokens {
  // Surfaces
  bg: string
  surface: string
  surfaceRaised: string
  surfaceHover: string
  surfaceActive: string
  surfaceSunken: string
  // Borders
  border: string
  borderSubtle: string
  borderStrong: string
  // Accent
  accent: string
  // Text
  text: string
  textMuted: string
  textDisabled: string
  // Status
  info: string
  success: string
  warning: string
  danger: string
}

/**
 * Extension tokens provided by a consuming tool via ThemeProvider.
 * These are plain key→value pairs that get injected as CSS custom properties
 * on the ThemeProvider wrapper element.
 */
export type ExtensionTokens = Record<string, string>

/**
 * ThemeContract<TExtensions> — typed extension contract for a consuming tool.
 *
 * Defines the shape of domain-specific CSS custom properties that a tool
 * passes to ThemeProvider.extensions. Using this type provides:
 * - Auto-complete for extension token keys
 * - Type-checked values in useTheme<TExtensions>() and useTokens<TExtensions>()
 * - Documentation of which tokens a tool owns
 *
 * @example
 * interface LoreExtensions extends ThemeContract {
 *   '--lore-prophecy': string
 *   '--lore-faction': string
 *   '--lore-relic': string
 * }
 *
 * // In ThemeProvider:
 * <ThemeProvider extensions={{ '--lore-prophecy': '#c084fc', '--lore-faction': '#38bdf8', '--lore-relic': '#fb7185' }}>
 *
 * // In hooks:
 * const { extensions } = useTokens<LoreExtensions>()
 * extensions['--lore-prophecy'] // string — type-safe
 */
export type ThemeContract<TExtensions extends ExtensionTokens = ExtensionTokens> = TExtensions

export interface ThemeContextValue {
  palette: Palette
  mode: Mode
  setPalette: (palette: Palette) => void
  setMode: (mode: Mode) => void
  /** Resolved hex values for the active palette — for canvas/WebGL use */
  resolvedTokens: ResolvedTokens
  /** Extension tokens provided by the consuming tool */
  extensions: ExtensionTokens
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)
ThemeContext.displayName = 'ThemeContext'
