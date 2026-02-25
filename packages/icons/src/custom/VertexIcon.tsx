import type { IconProps } from '../types.js'

/** Mesh vertex — triangle with highlighted vertex point */
export function VertexIcon({ size = 20, color = 'currentColor', ...props }: IconProps) {
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
      {/* Triangle wireframe */}
      <path
        d="M10 3 L17 15 L3 15 Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Highlighted vertex (top) */}
      <circle cx="10" cy="3" r="2" fill={color} />
      {/* Other vertices */}
      <circle cx="3" cy="15" r="1.5" stroke={color} strokeWidth="1" fill="none" />
      <circle cx="17" cy="15" r="1.5" stroke={color} strokeWidth="1" fill="none" />
    </svg>
  )
}
