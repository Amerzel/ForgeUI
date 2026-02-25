import { VisuallyHidden } from './VisuallyHidden.js'

type SpinnerSize = 'sm' | 'md' | 'lg'

const SIZE_PX: Record<SpinnerSize, number> = { sm: 14, md: 18, lg: 24 }

interface SpinnerProps {
  /** Visual size. Default: 'md' */
  size?: SpinnerSize
  /** Accessible label for screen readers. Default: 'Loading' */
  label?: string
  className?: string
}

/**
 * Loading indicator with `role="status"` and a live region for screen readers.
 * Respects `prefers-reduced-motion` via the duration token.
 */
export function Spinner({ size = 'md', label = 'Loading', className }: SpinnerProps) {
  const px = SIZE_PX[size]
  return (
    <span
      role="status"
      aria-label={label}
      className={className}
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <svg
        width={px}
        height={px}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{
          animation: `forge-spin var(--forge-duration-slow, 400ms) linear infinite`,
          color: 'currentColor',
        }}
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeOpacity="0.25"
        />
        <path
          d="M12 2a10 10 0 0 1 10 10"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
      <VisuallyHidden>{label}</VisuallyHidden>
      <style>{`
        @keyframes forge-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </span>
  )
}
