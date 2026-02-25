import type { IconProps } from '../types.js'

/** Timeline track editor — horizontal tracks with keyframe diamonds */
export function TimelineIcon({ size = 20, color = 'currentColor', ...props }: IconProps) {
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
      {/* Track lines */}
      <line x1="2" y1="7" x2="18" y2="7" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="2" y1="13" x2="18" y2="13" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      {/* Keyframe diamonds */}
      <path d="M6 7 L8 5 L10 7 L8 9 Z" fill={color} />
      <path d="M12 7 L14 5 L16 7 L14 9 Z" fill={color} />
      <path d="M4 13 L6 11 L8 13 L6 15 Z" fill={color} />
      <path d="M14 13 L16 11 L18 13 L16 15 Z" fill={color} />
      {/* Playhead */}
      <line x1="10" y1="2" x2="10" y2="18" stroke={color} strokeWidth="1" strokeDasharray="2 1" strokeLinecap="round" />
    </svg>
  )
}
