/**
 * @forgeui/tokens/color
 *
 * Color manipulation utilities for canvas/WebGL rendering and build-time token resolution.
 * All functions operate on hex strings (#rrggbb or #rgb) and return hex strings unless
 * noted otherwise. These are called at build time to produce static token values;
 * runtime components never call them directly.
 */

// ---------------------------------------------------------------------------
// Parsing helpers
// ---------------------------------------------------------------------------

/** Parse a hex color string to [r, g, b] integers 0–255. */
function parseHex(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  if (h.length === 3) {
    const r = parseInt((h[0] ?? '') + (h[0] ?? ''), 16)
    const g = parseInt((h[1] ?? '') + (h[1] ?? ''), 16)
    const b = parseInt((h[2] ?? '') + (h[2] ?? ''), 16)
    if (isNaN(r) || isNaN(g) || isNaN(b)) throw new Error(`Invalid hex color: ${hex}`)
    return [r, g, b]
  }
  if (h.length === 6) {
    const r = parseInt(h.slice(0, 2), 16)
    const g = parseInt(h.slice(2, 4), 16)
    const b = parseInt(h.slice(4, 6), 16)
    if (isNaN(r) || isNaN(g) || isNaN(b)) throw new Error(`Invalid hex color: ${hex}`)
    return [r, g, b]
  }
  throw new Error(`Invalid hex color: ${hex}`)
}

/** Convert RGB integers 0–255 to [h, s, l] where h=0–360, s=0–1, l=0–1. */
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const l = (max + min) / 2

  if (max === min) return [0, 0, l]

  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

  let h: number
  if (max === rn) {
    h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6
  } else if (max === gn) {
    h = ((bn - rn) / d + 2) / 6
  } else {
    h = ((rn - gn) / d + 4) / 6
  }

  return [h * 360, s, l]
}

/** Convert [h, s, l] (h=0–360, s=0–1, l=0–1) to RGB integers 0–255. */
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  if (s === 0) {
    const v = Math.round(l * 255)
    return [v, v, v]
  }

  const hue2rgb = (p: number, q: number, t: number): number => {
    let tt = t
    if (tt < 0) tt += 1
    if (tt > 1) tt -= 1
    if (tt < 1 / 6) return p + (q - p) * 6 * tt
    if (tt < 1 / 2) return q
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6
    return p
  }

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q
  const hn = h / 360

  return [
    Math.round(hue2rgb(p, q, hn + 1 / 3) * 255),
    Math.round(hue2rgb(p, q, hn) * 255),
    Math.round(hue2rgb(p, q, hn - 1 / 3) * 255),
  ]
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** Convert [r, g, b] integers 0–255 to a hex string. */
export function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map((v) =>
        Math.max(0, Math.min(255, Math.round(v)))
          .toString(16)
          .padStart(2, '0'),
      )
      .join('')
  )
}

/** Parse a hex string and return [r, g, b] integers 0–255. */
export function hexToRgb(hex: string): [number, number, number] {
  return parseHex(hex)
}

/**
 * Convert a hex color to GLSL-ready floats [r, g, b, a] in range 0–1.
 * Alpha is always 1.0 — modify the result if transparency is needed.
 */
export function hexToGlsl(hex: string): [number, number, number, number] {
  const [r, g, b] = parseHex(hex)
  return [r / 255, g / 255, b / 255, 1.0]
}

/**
 * Lighten a hex color by `amount` (0–1) in HSL lightness.
 * `lighten('#000000', 0.1)` → a very dark gray.
 */
export function lighten(color: string, amount: number): string {
  const [r, g, b] = parseHex(color)
  const [h, s, l] = rgbToHsl(r, g, b)
  const [nr, ng, nb] = hslToRgb(h, s, Math.min(1, l + amount))
  return rgbToHex(nr, ng, nb)
}

/**
 * Darken a hex color by `amount` (0–1) in HSL lightness.
 * `darken('#ffffff', 0.1)` → a very light gray.
 */
export function darken(color: string, amount: number): string {
  const [r, g, b] = parseHex(color)
  const [h, s, l] = rgbToHsl(r, g, b)
  const [nr, ng, nb] = hslToRgb(h, s, Math.max(0, l - amount))
  return rgbToHex(nr, ng, nb)
}

/**
 * Return an rgba() CSS string for a hex color at the given opacity (0–1).
 * Used for transparent overlays, tinted backgrounds, and disabled states.
 */
export function alpha(color: string, opacity: number): string {
  const [r, g, b] = parseHex(color)
  return `rgb(${r} ${g} ${b} / ${opacity})`
}

/**
 * Mix two hex colors together. `weight` (0–1) controls how much of color1
 * to use: 0 = all color2, 1 = all color1. Default is 0.5 (equal mix).
 */
export function mix(color1: string, color2: string, weight = 0.5): string {
  const [r1, g1, b1] = parseHex(color1)
  const [r2, g2, b2] = parseHex(color2)
  const w = Math.max(0, Math.min(1, weight))
  return rgbToHex(
    Math.round(r1 * w + r2 * (1 - w)),
    Math.round(g1 * w + g2 * (1 - w)),
    Math.round(b1 * w + b2 * (1 - w)),
  )
}

/**
 * Calculate the WCAG 2.1 relative luminance of a hex color.
 * Returns a value between 0 (black) and 1 (white).
 */
export function relativeLuminance(color: string): number {
  const [r, g, b] = parseHex(color).map((v) => {
    const sRGB = v / 255
    return sRGB <= 0.04045 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4)
  }) as [number, number, number]
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/**
 * Calculate the WCAG 2.1 contrast ratio between two hex colors.
 * Returns a value between 1 (no contrast) and 21 (black on white).
 */
export function contrastRatio(fg: string, bg: string): number {
  const l1 = relativeLuminance(fg)
  const l2 = relativeLuminance(bg)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Return the accessible foreground color (black or white) for a given
 * background color, based on WCAG 2.1 contrast ratio (4.5:1 threshold).
 */
export function getAccessibleForeground(bgColor: string): '#000000' | '#ffffff' {
  const whiteContrast = contrastRatio('#ffffff', bgColor)
  const blackContrast = contrastRatio('#000000', bgColor)
  return whiteContrast >= blackContrast ? '#ffffff' : '#000000'
}
