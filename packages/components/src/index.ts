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

// Phase 1 — Feedback
export { Alert }         from './feedback/Alert.js'
export { Progress }      from './feedback/Progress.js'
export { Skeleton }      from './feedback/Skeleton.js'
export { ToastProvider, ToastList } from './feedback/Toast.js'
export type { ToastItem, ToastVariant } from './feedback/Toast.js'

// Phase 1 — Disclosure
export { Accordion } from './disclosure/Accordion.js'
export { Tabs }      from './disclosure/Tabs.js'

// Phase 1 — Forms
export { Input }        from './forms/Input.js'
export { Textarea }     from './forms/Textarea.js'
export { Select }       from './forms/Select.js'
export { Checkbox }     from './forms/Checkbox.js'
export { Switch }       from './forms/Switch.js'
export { RadioGroup }   from './forms/RadioGroup.js'
export { Slider }       from './forms/Slider.js'
export { Toggle }       from './forms/Toggle.js'
export { ToggleGroup }  from './forms/ToggleGroup.js'
export { FormField }    from './forms/FormField.js'
export { NumberInput }  from './forms/NumberInput.js'

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
