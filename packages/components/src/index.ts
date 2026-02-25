/**
 * @forgeui/components
 *
 * ForgeUI component library barrel export.
 * For CSS-optimal builds, prefer deep imports:
 *   import { Button } from '@forgeui/components/Button'
 *
 * Barrel imports pull all component CSS — fine for prototyping,
 * use deep imports in production for optimal bundle size.
 */

// Provider
export { ThemeProvider } from './ThemeProvider/index.js'
export type { ThemeProviderProps } from './ThemeProvider/index.js'

// Phase 1 components are exported here as they are implemented
// (populated incrementally through Track 7–11)
