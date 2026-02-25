import type { IconProps } from '../types.js'

/** Node graph edge / connection — bezier curve between two nodes */
export function EdgeIcon({ size = 20, color = 'currentColor', ...props }: IconProps) {
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
      <circle cx="3" cy="10" r="2" fill={color} />
      <circle cx="17" cy="10" r="2" fill={color} />
      <path d="M5 10 C8 4, 12 16, 15 10" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
