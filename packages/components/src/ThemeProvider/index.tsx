import { useState, useMemo, useRef, useEffect } from 'react'
import { ThemeContext } from '@forgeui/hooks'
import { resolveTokens } from '@forgeui/hooks'
import type { Palette, Mode } from '@forgeui/tokens'
import type { ExtensionTokens } from '@forgeui/hooks'

export interface ThemeProviderProps {
  /** Active color palette. Default: 'hearth-bronze' */
  palette?: Palette
  /** Color mode. Default: 'dark' */
  mode?: Mode
  /**
   * Domain-specific extension tokens for this tool.
   * Keys are injected as CSS custom properties on the wrapper element.
   *
   * @example
   * extensions={{ '--lore-prophecy': '#c084fc', '--lore-faction': '#38bdf8' }}
   */
  extensions?: ExtensionTokens
  children: React.ReactNode
}

/**
 * ThemeProvider — root theme context for ForgeUI.
 *
 * Renders a wrapper <div> with:
 * - data-palette and data-theme attributes (picked up by tokens.css)
 * - Inline style for extension CSS custom properties
 * - ThemeContext providing palette, mode, setters, and resolved token values
 *
 * Mount once at the app root. Nesting is supported for sub-tree overrides.
 *
 * @example
 * <ThemeProvider palette="hearth-bronze" mode="dark">
 *   <App />
 * </ThemeProvider>
 */
export function ThemeProvider({
  palette: paletteProp = 'hearth-bronze',
  mode: modeProp = 'dark',
  extensions = {},
  children,
}: ThemeProviderProps) {
  const [palette, setPalette] = useState<Palette>(paletteProp)
  const [mode, setMode] = useState<Mode>(modeProp)

  // Sync controlled props into state when parent changes them
  useEffect(() => { setPalette(paletteProp) }, [paletteProp])
  useEffect(() => { setMode(modeProp) }, [modeProp])

  const resolvedTokens = useMemo(() => resolveTokens(palette, mode), [palette, mode])

  // Build inline style object from extension tokens
  const extensionStyle = useMemo(() => {
    const style: Record<string, string> = {}
    for (const [key, value] of Object.entries(extensions)) {
      style[key] = value
    }
    return style
  }, [extensions])

  const contextValue = useMemo(
    () => ({ palette, mode, setPalette, setMode, resolvedTokens, extensions }),
    [palette, mode, resolvedTokens, extensions],
  )

  return (
    <ThemeContext value={contextValue}>
      <div
        data-palette={palette}
        data-theme={mode}
        data-forge-provider=""
        style={extensionStyle}
      >
        {children}
      </div>
    </ThemeContext>
  )
}
