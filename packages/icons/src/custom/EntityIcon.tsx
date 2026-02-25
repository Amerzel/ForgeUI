import type { IconProps } from '../types.js'

/** Entity — a game object/actor (cube with highlight) */
export function EntityIcon({ size = 20, color = 'currentColor', ...props }: IconProps) {
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
      {/* Front face */}
      <path
        d="M3 7 L10 3 L17 7 L17 13 L10 17 L3 13 Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Center vertical */}
      <line x1="10" y1="3" x2="10" y2="17" stroke={color} strokeWidth="1" strokeDasharray="2 1" />
      {/* Center horizontal */}
      <line x1="3" y1="10" x2="17" y2="10" stroke={color} strokeWidth="1" strokeDasharray="2 1" />
    </svg>
  )
}
