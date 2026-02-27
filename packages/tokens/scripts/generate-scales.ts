/**
 * Scale generation script — run at build time via `tsx scripts/generate-scales.ts`.
 *
 * Takes color anchors at steps 50, 500, and 950 for each hue, interpolates
 * intermediate steps in OKLCH color space (perceptually uniform), and writes
 * the full 12-step scales to src/scales/ as static TS objects.
 *
 * Generated files are committed to source control. Consumers never depend on
 * this script at runtime.
 */

import { writeFileSync } from 'fs'
import { join } from 'path'
import { formatHex, interpolate, oklch, parse } from 'culori'

// ---------------------------------------------------------------------------
// Step mapping
// ---------------------------------------------------------------------------

// The 12 steps in order, and their positions on a 0–1 scale keyed by step name
// Steps 50 (pos 0), 500 (pos ~0.474), 950 (pos 1)
// We assign linear positions proportional to luminance intent

const STEP_POSITIONS: Record<string, number> = {
  '50': 0,
  '100': 0.053,
  '200': 0.158,
  '300': 0.263,
  '400': 0.368,
  '500': 0.474,
  '600': 0.579,
  '700': 0.684,
  '750': 0.737,
  '800': 0.789,
  '900': 0.895,
  '950': 1.0,
}

const STEPS = Object.keys(STEP_POSITIONS)

// ---------------------------------------------------------------------------
// Interpolation
// ---------------------------------------------------------------------------

function interpolateScale(anchors: { '50': string; '500': string; '950': string }): Record<string, string> {
  const pos50 = STEP_POSITIONS['50'] ?? 0
  const pos500 = STEP_POSITIONS['500'] ?? 0.474
  const pos950 = STEP_POSITIONS['950'] ?? 1.0

  // Build two interpolators: 50→500 and 500→950
  const lower = interpolate(
    [anchors['50'], anchors['500']].map((h) => { const c = parse(h); if (!c) throw new Error(`Invalid color: ${h}`); return oklch(c) }),
    'oklch',
  )
  const upper = interpolate(
    [anchors['500'], anchors['950']].map((h) => { const c = parse(h); if (!c) throw new Error(`Invalid color: ${h}`); return oklch(c) }),
    'oklch',
  )

  const result: Record<string, string> = {}

  for (const step of STEPS) {
    const pos = STEP_POSITIONS[step] ?? 0
    let color: ReturnType<typeof lower>

    if (pos <= pos500) {
      // Normalize 0–1 within the lower segment
      const t = (pos - pos50) / (pos500 - pos50)
      color = lower(t)
    } else {
      // Normalize 0–1 within the upper segment
      const t = (pos - pos500) / (pos950 - pos500)
      color = upper(t)
    }

    result[step] = formatHex(color) ?? '#000000'
  }

  return result
}

// ---------------------------------------------------------------------------
// Hue definitions
// ---------------------------------------------------------------------------

interface HueAnchors {
  name: string
  anchors: { '50': string; '500': string; '950': string }
}

const HUES: HueAnchors[] = [
  { name: 'blue',   anchors: { '50': '#eff6ff', '500': '#3b82f6', '950': '#172554' } },
  { name: 'red',    anchors: { '50': '#fef2f2', '500': '#ef4444', '950': '#450a0a' } },
  { name: 'green',  anchors: { '50': '#f0fdf4', '500': '#22c55e', '950': '#052e16' } },
  { name: 'amber',  anchors: { '50': '#fffbeb', '500': '#f59e0b', '950': '#451a03' } },
  { name: 'purple', anchors: { '50': '#faf5ff', '500': '#a855f7', '950': '#3b0764' } },
  { name: 'teal',   anchors: { '50': '#f0fdfa', '500': '#14b8a6', '950': '#042f2e' } },
  { name: 'orange', anchors: { '50': '#fff7ed', '500': '#f97316', '950': '#431407' } },
]

// ---------------------------------------------------------------------------
// Gray scales per palette (manually specified — warm/cool tints)
// ---------------------------------------------------------------------------

interface GrayPalette {
  name: string
  steps: Record<string, string>
}

const GRAY_PALETTES: GrayPalette[] = [
  {
    name: 'hearth-bronze',
    steps: {
      '50':  '#faf8f5',
      '100': '#f2e9df',
      '200': '#e5d9cb',
      '300': '#d1c1ad',
      '400': '#9a8169',
      '500': '#6b5c4a',
      '600': '#4f4234',
      '700': '#3f3227',
      '750': '#332a1f',
      '800': '#2a211a',
      '900': '#1a140f',
      '950': '#0c0805',
    },
  },
  {
    name: 'midnight-forge',
    steps: {
      '50':  '#f0f4ff',
      '100': '#e0e7ff',
      '200': '#c7d2fe',
      '300': '#a5b4fc',
      '400': '#818cf8',
      '500': '#6366f1',
      '600': '#4338ca',
      '700': '#3730a3',
      '750': '#312e81',
      '800': '#1e1b4b',  // starts deep navy tint
      '900': '#121830',
      '950': '#0a0a1a',
    },
  },
  {
    name: 'deep-space',
    steps: {
      '50':  '#f0f9ff',
      '100': '#e0f2fe',
      '200': '#bae6fd',
      '300': '#7dd3fc',
      '400': '#38bdf8',
      '500': '#0ea5e9',
      '600': '#0369a1',
      '700': '#075985',
      '750': '#0c4a6e',
      '800': '#162032',  // deep navy
      '900': '#0e1420',
      '950': '#07090e',
    },
  },
  {
    name: 'midnight-forge-v2',
    steps: {
      '50':  '#f8fafc',
      '100': '#f1f5f9',
      '200': '#e2e8f0',
      '300': '#cbd5e1',
      '400': '#94a3b8',
      '500': '#64748b',
      '600': '#475569',
      '700': '#334155',
      '750': '#283650',
      '800': '#1a2540',
      '900': '#101828',
      '950': '#080c14',
    },
  },
]

// ---------------------------------------------------------------------------
// Code generation helpers
// ---------------------------------------------------------------------------

function scaleToTs(scale: Record<string, string>, varName: string): string {
  const entries = Object.entries(scale)
    .map(([step, hex]) => `  '${step}': '${hex}',`)
    .join('\n')
  return `export const ${varName} = {\n${entries}\n} as const\n`
}

function formatFile(content: string): string {
  return `// AUTO-GENERATED — do not edit by hand. Run \`pnpm build\` in @forgeui/tokens to regenerate.\n\n${content}`
}

// ---------------------------------------------------------------------------
// Write hue scales
// ---------------------------------------------------------------------------

const srcDir = join(import.meta.dirname, '..', 'src', 'scales')

for (const hue of HUES) {
  const scale = interpolateScale(hue.anchors)
  const varName = `${hue.name}Scale`
  const ts = formatFile(scaleToTs(scale, varName))
  writeFileSync(join(srcDir, `${hue.name}.ts`), ts)
  console.log(`✓ Generated ${hue.name} scale`)
}

// ---------------------------------------------------------------------------
// Write gray scales
// ---------------------------------------------------------------------------

let grayTs = '// AUTO-GENERATED — do not edit by hand.\n\n'
for (const palette of GRAY_PALETTES) {
  const varName = `gray${palette.name.split('-').map((w) => (w[0] ?? '').toUpperCase() + w.slice(1)).join('')}Scale`
  grayTs += scaleToTs(palette.steps, varName) + '\n'
}
writeFileSync(join(srcDir, 'gray.ts'), grayTs)
console.log('✓ Generated gray scales (all 4 palettes)')

// ---------------------------------------------------------------------------
// Generate tokens.css
// ---------------------------------------------------------------------------

import { writeTokensCss } from './generate-tokens-css.js'
writeTokensCss()
console.log('✓ Generated tokens.css')
