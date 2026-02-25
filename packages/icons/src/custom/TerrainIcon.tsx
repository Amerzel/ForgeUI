import type { IconProps } from '../types.js'

/** Terrain / heightmap — layered mountain silhouette with grid */
export function TerrainIcon({ size = 20, color = 'currentColor', ...props }: IconProps) {
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
      {/* Ground plane grid lines */}
      <line x1="2" y1="16" x2="18" y2="16" stroke={color} strokeWidth="1" opacity="0.5" />
      <line x1="4" y1="18" x2="10" y2="12" stroke={color} strokeWidth="0.75" opacity="0.4" />
      <line x1="10" y1="18" x2="16" y2="12" stroke={color} strokeWidth="0.75" opacity="0.4" />
      {/* Terrain silhouette */}
      <path
        d="M2 16 L7 10 L10 12 L13 7 L18 16 Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Peak marker */}
      <circle cx="13" cy="7" r="1.5" fill={color} />
    </svg>
  )
}
