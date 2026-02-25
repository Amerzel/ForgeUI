import type { IconProps } from '../types.js'

/** Navigation mesh — tiled polygon walkable area */
export function NavMeshIcon({ size = 20, color = 'currentColor', ...props }: IconProps) {
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
      {/* Outer polygon */}
      <path
        d="M10 2 L17 6 L17 14 L10 18 L3 14 L3 6 Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Interior triangulation */}
      <line x1="10" y1="2" x2="3" y2="14" stroke={color} strokeWidth="0.75" opacity="0.6" />
      <line x1="10" y1="2" x2="17" y2="14" stroke={color} strokeWidth="0.75" opacity="0.6" />
      <line x1="3" y1="6" x2="17" y2="14" stroke={color} strokeWidth="0.75" opacity="0.6" />
      <line x1="10" y1="18" x2="17" y2="6" stroke={color} strokeWidth="0.75" opacity="0.6" />
      {/* Center dot */}
      <circle cx="10" cy="10" r="1.5" fill={color} />
    </svg>
  )
}
