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

// Phase 1 — Primitives
export { VisuallyHidden } from './primitives/VisuallyHidden.js'
export { Label }          from './primitives/Label.js'
export { Separator }      from './primitives/Separator.js'
export { Spinner }        from './primitives/Spinner.js'
export { Badge }          from './primitives/Badge.js'
export { Text }           from './primitives/Text.js'
export { Heading }        from './primitives/Heading.js'
export { Kbd }            from './primitives/Kbd.js'
export { ScrollArea }     from './primitives/ScrollArea.js'
export { Card }           from './primitives/Card.js'
export { Button }         from './primitives/Button.js'
export { IconButton }     from './primitives/IconButton.js'
export { AlertDialog }    from './primitives/AlertDialog.js'
