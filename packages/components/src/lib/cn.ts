import { clsx } from 'clsx'
import type { ClassValue } from 'clsx'

/**
 * Internal class merging utility. Wraps clsx for combining conditional
 * class names. Used by all components — not exported from the package.
 *
 * @example
 * cn('base', isActive && 'active', variant === 'primary' && 'primary')
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(...inputs)
}
