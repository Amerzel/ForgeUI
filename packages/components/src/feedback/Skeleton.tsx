import { cn } from '../lib/cn.js'

interface SkeletonProps {
  /** Width of the skeleton — CSS value or number (px). Default: '100%' */
  width?: string | number
  /** Height of the skeleton — CSS value or number (px). Default: '16px' */
  height?: string | number
  /** When true, renders as a circle (avatar placeholder). Overrides borderRadius. */
  circle?: boolean
  className?: string
  style?: React.CSSProperties
}

/**
 * Animated loading placeholder. Use in place of content while it loads.
 * Zero semantic meaning — renders aria-hidden for screen readers.
 */
export function Skeleton({
  width = '100%',
  height = '16px',
  circle = false,
  className,
  style,
}: SkeletonProps) {
  const w = typeof width === 'number' ? `${width}px` : width
  const h = typeof height === 'number' ? `${height}px` : height

  return (
    <div
      aria-hidden="true"
      className={cn('forge-skeleton', className)}
      style={{
        width: w,
        height: h,
        borderRadius: circle ? '9999px' : 'var(--forge-radius-sm)',
        backgroundColor: 'var(--forge-surface-raised)',
        backgroundImage: `linear-gradient(
          90deg,
          transparent 0%,
          color-mix(in srgb, var(--forge-text) 5%, transparent) 50%,
          transparent 100%
        )`,
        backgroundSize: '200% 100%',
        animation: 'forge-skeleton-shimmer 1.5s ease-in-out infinite',
        flexShrink: 0,
        ...style,
      }}
    >
      <style>{`
        @keyframes forge-skeleton-shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .forge-skeleton { animation: none; }
        }
      `}</style>
    </div>
  )
}
