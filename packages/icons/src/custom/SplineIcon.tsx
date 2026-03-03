import type { IconProps } from '../types.js'

/** Spline / curve tool — smooth bezier path with control points */
export function SplineIcon({ size = 20, color = 'currentColor', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      {/* Bezier curve */}
      <path
        d="M3 15 C5 5, 15 15, 17 5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Anchor points */}
      <circle cx="3" cy="15" r="1.5" fill={color} />
      <circle cx="17" cy="5" r="1.5" fill={color} />
      {/* Control point handles */}
      <circle cx="5" cy="5" r="1" stroke={color} strokeWidth="1" fill="none" />
      <circle cx="15" cy="15" r="1" stroke={color} strokeWidth="1" fill="none" />
      <line x1="3" y1="15" x2="5" y2="5" stroke={color} strokeWidth="0.75" strokeDasharray="2 1" />
      <line
        x1="17"
        y1="5"
        x2="15"
        y2="15"
        stroke={color}
        strokeWidth="0.75"
        strokeDasharray="2 1"
      />
    </svg>
  )
}
