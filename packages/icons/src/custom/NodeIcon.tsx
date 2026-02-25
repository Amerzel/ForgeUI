import type { IconProps } from '../types.js'

/** Visual node graph node — circle with connection ports */
export function NodeIcon({ size = 20, color = 'currentColor', ...props }: IconProps) {
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
      <circle cx="10" cy="10" r="5" stroke={color} strokeWidth="1.5" />
      <circle cx="10" cy="3" r="1.5" fill={color} />
      <circle cx="10" cy="17" r="1.5" fill={color} />
      <circle cx="3" cy="10" r="1.5" fill={color} />
      <circle cx="17" cy="10" r="1.5" fill={color} />
    </svg>
  )
}
