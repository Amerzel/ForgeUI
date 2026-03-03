import type { IconProps } from '../types.js'

/** ECS component — a puzzle piece / data block attached to an entity */
export function ComponentIcon({ size = 20, color = 'currentColor', ...props }: IconProps) {
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
      {/* Main block */}
      <rect x="3" y="5" width="10" height="10" rx="1.5" stroke={color} strokeWidth="1.5" />
      {/* Top tab */}
      <path
        d="M7 5 L7 3 Q8 2 9 3 L9 5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Right socket */}
      <path
        d="M13 8 L15 8 Q17 9 15 11 L13 11"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}
