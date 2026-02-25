import type { IconProps } from '../types.js'

/** Scene graph / hierarchy tree — parent node with children */
export function SceneGraphIcon({ size = 20, color = 'currentColor', ...props }: IconProps) {
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
      {/* Root */}
      <rect x="7" y="2" width="6" height="4" rx="1" stroke={color} strokeWidth="1.5" />
      {/* Vertical stem */}
      <line x1="10" y1="6" x2="10" y2="9" stroke={color} strokeWidth="1.5" />
      {/* Horizontal branch */}
      <line x1="4" y1="9" x2="16" y2="9" stroke={color} strokeWidth="1.5" />
      {/* Left child stem */}
      <line x1="4" y1="9" x2="4" y2="12" stroke={color} strokeWidth="1.5" />
      {/* Right child stem */}
      <line x1="16" y1="9" x2="16" y2="12" stroke={color} strokeWidth="1.5" />
      {/* Left child */}
      <rect x="1" y="12" width="6" height="4" rx="1" stroke={color} strokeWidth="1.5" />
      {/* Right child */}
      <rect x="13" y="12" width="6" height="4" rx="1" stroke={color} strokeWidth="1.5" />
    </svg>
  )
}
