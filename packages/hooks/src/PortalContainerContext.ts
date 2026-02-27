import { createContext, useContext } from 'react'

/**
 * Context for the portal container element.
 *
 * ThemeProvider sets this to its wrapper <div> so Radix portals render
 * inside the themed scope, inheriting CSS custom properties correctly.
 * When no ThemeProvider is present, portals fall back to document.body.
 */
export const PortalContainerContext = createContext<HTMLElement | null>(null)
PortalContainerContext.displayName = 'PortalContainerContext'

/**
 * Returns the nearest ThemeProvider's container element for Radix portals.
 * Pass the result to `<Portal container={...}>` in portal-based components.
 */
export function usePortalContainer(): HTMLElement | undefined {
  return useContext(PortalContainerContext) ?? undefined
}
