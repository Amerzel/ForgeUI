export const zIndex = {
  base:     0,
  dropdown: 100,
  sticky:   200,
  overlay:  300,
  modal:    400,
  toast:    500,
  tooltip:  600,
} as const

export const focusRing = {
  color:  'var(--forge-accent)',
  width:  '2px',
  offset: '2px',
} as const

export const opacity = {
  subtle: 0.08,
  light:  0.15,
  medium: 0.40,
  heavy:  0.60,
} as const

export const iconSize = {
  xs: 14,
  sm: 16,
  md: 20,
  lg: 24,
} as const

export const containerWidth = {
  prose: '65ch',
  sm:    '384px',
  md:    '512px',
  lg:    '768px',
} as const

export const backdropBlur = {
  overlay: '8px',
} as const
