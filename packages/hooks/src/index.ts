/**
 * @forgeui/hooks
 *
 * React hooks for consuming ForgeUI theme context.
 *
 * - `useTheme()` — read and switch the active palette and mode
 * - `useTokens()` — get resolved hex token values for canvas/WebGL rendering
 * - `ThemeContext` — the underlying context (for advanced use / ThemeProvider implementation)
 */

export { useTheme } from './useTheme.js'
export { useTokens } from './useTokens.js'
export { ThemeContext } from './ThemeContext.js'

export type { UseThemeResult } from './useTheme.js'
export type { UseTokensResult } from './useTokens.js'
export type { ThemeContextValue, ResolvedTokens, ExtensionTokens } from './ThemeContext.js'

// resolveTokens is exported for ThemeProvider (in @forgeui/components) to call internally
export { resolveTokens } from './resolveTokens.js'
