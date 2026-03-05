import { useRef, useEffect } from 'react'
import { cn } from '../lib/cn.js'

/* ===================================================================
 * Color maps — each maps 0‑1 → [r, g, b]
 * =================================================================== */

type ColorMap = (t: number) => [number, number, number]

function lerp3(
  a: [number, number, number],
  b: [number, number, number],
  t: number,
): [number, number, number] {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]
}

function piecewise(stops: Array<[number, [number, number, number]]>): ColorMap {
  return (t: number) => {
    const clamped = Math.max(0, Math.min(1, t))
    for (let i = 1; i < stops.length; i++) {
      const curr = stops[i] as [number, [number, number, number]]
      const prev = stops[i - 1] as [number, [number, number, number]]
      if (clamped <= curr[0]) {
        const frac = (clamped - prev[0]) / (curr[0] - prev[0])
        return lerp3(prev[1], curr[1], frac)
      }
    }
    const last = stops[stops.length - 1] as [number, [number, number, number]]
    return last[1]
  }
}

const COLOR_MAPS: Record<HeatMapColorMap, ColorMap> = {
  viridis: piecewise([
    [0, [68, 1, 84]],
    [0.25, [59, 82, 139]],
    [0.5, [33, 145, 140]],
    [0.75, [94, 201, 98]],
    [1, [253, 231, 37]],
  ]),
  'red-green': piecewise([
    [0, [34, 197, 94]],
    [0.5, [250, 204, 21]],
    [1, [239, 68, 68]],
  ]),
  hot: piecewise([
    [0, [0, 0, 0]],
    [0.33, [230, 0, 0]],
    [0.66, [255, 210, 0]],
    [1, [255, 255, 255]],
  ]),
  cool: piecewise([
    [0, [0, 255, 255]],
    [0.5, [128, 0, 255]],
    [1, [255, 0, 255]],
  ]),
}

/* ===================================================================
 * Types
 * =================================================================== */

export type HeatMapColorMap = 'viridis' | 'red-green' | 'hot' | 'cool'

export interface RenderHeatMapOptions {
  /** Color map preset. Default: 'viridis' */
  colorMap?: HeatMapColorMap
  /** Overlay opacity 0‑1. Default: 0.6 */
  opacity?: number
  /** Data range minimum (auto-detected if omitted) */
  min?: number
  /** Data range maximum (auto-detected if omitted) */
  max?: number
  /** Only render values above this normalized threshold 0‑1 */
  threshold?: number
}

export interface HeatMapOverlayProps extends RenderHeatMapOptions {
  /** Pre-rendered RGBA heatmap data */
  rgbaData?: Uint8ClampedArray<ArrayBuffer> | ImageData
  /** Raw scalar data for component-side colorization */
  scalarData?: number[][] | Float32Array
  /** Canvas width in pixels */
  width: number
  /** Canvas height in pixels */
  height: number
  className?: string
  style?: React.CSSProperties
}

/* ===================================================================
 * Utility: renderHeatMap — draw scalar data onto a 2D context
 * =================================================================== */

export function renderHeatMap(
  ctx: CanvasRenderingContext2D,
  data: Float32Array | number[][],
  width: number,
  height: number,
  options: RenderHeatMapOptions = {},
): void {
  const { colorMap = 'viridis', opacity = 0.6, threshold } = options

  // Flatten data
  let flat: Float32Array | number[]
  let dataH: number
  let dataW: number
  if (Array.isArray(data)) {
    dataH = data.length
    dataW = data[0]?.length ?? 0
    flat = new Float32Array(dataH * dataW)
    for (let r = 0; r < dataH; r++) {
      const row = data[r] as number[]
      for (let c = 0; c < dataW; c++) {
        flat[r * dataW + c] = row[c] as number
      }
    }
  } else {
    flat = data
    // Assume square if not provided width/height context
    dataW = width
    dataH = height
  }

  // Compute range
  let dataMin = options.min ?? Infinity
  let dataMax = options.max ?? -Infinity
  if (options.min === undefined || options.max === undefined) {
    for (let i = 0; i < flat.length; i++) {
      const v = flat[i] as number
      if (v < dataMin) dataMin = v
      if (v > dataMax) dataMax = v
    }
  }
  const range = dataMax - dataMin || 1

  const map = COLOR_MAPS[colorMap]
  const img = ctx.createImageData(dataW, dataH)

  for (let i = 0; i < flat.length; i++) {
    const t = ((flat[i] as number) - dataMin) / range
    const px = i * 4

    if (threshold !== undefined && t < threshold) {
      img.data[px + 3] = 0
      continue
    }

    const [r, g, b] = map(t)
    img.data[px] = r
    img.data[px + 1] = g
    img.data[px + 2] = b
    img.data[px + 3] = Math.round(opacity * 255)
  }

  // Scale from data dimensions to canvas dimensions
  if (dataW === width && dataH === height) {
    ctx.putImageData(img, 0, 0)
  } else {
    const tmp = new OffscreenCanvas(dataW, dataH)
    const tmpCtx = tmp.getContext('2d')
    if (!tmpCtx) return
    tmpCtx.putImageData(img, 0, 0)
    ctx.imageSmoothingEnabled = false
    ctx.drawImage(tmp, 0, 0, width, height)
  }
}

/* ===================================================================
 * React component wrapper
 * =================================================================== */

export function HeatMapOverlay({
  rgbaData,
  scalarData,
  width,
  height,
  colorMap = 'viridis',
  opacity = 0.6,
  min,
  max,
  threshold,
  className,
  style,
}: HeatMapOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, width, height)

    if (rgbaData) {
      // Pre-rendered RGBA path
      const imageData =
        rgbaData instanceof ImageData
          ? rgbaData
          : new ImageData(new Uint8ClampedArray(rgbaData), width, height)

      if (opacity < 1) {
        // Apply opacity to the alpha channel
        const copy = new ImageData(
          new Uint8ClampedArray(imageData.data),
          imageData.width,
          imageData.height,
        )
        const alpha = Math.round(opacity * 255)
        for (let i = 3; i < copy.data.length; i += 4) {
          copy.data[i] = Math.min(copy.data[i] as number, alpha)
        }
        ctx.putImageData(copy, 0, 0)
      } else {
        ctx.putImageData(imageData, 0, 0)
      }
    } else if (scalarData) {
      renderHeatMap(ctx, scalarData, width, height, {
        colorMap,
        opacity,
        min,
        max,
        threshold,
      })
    }
  }, [rgbaData, scalarData, width, height, colorMap, opacity, min, max, threshold])

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={cn('forge-heatmap-overlay', className)}
      style={{
        pointerEvents: 'none',
        ...style,
      }}
      aria-label="Heat map overlay"
      role="img"
    />
  )
}
