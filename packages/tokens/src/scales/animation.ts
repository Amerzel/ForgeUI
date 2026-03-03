export const animation = {
  durationInstant: '0ms',
  durationFast: '100ms',
  durationNormal: '200ms',
  durationSlow: '400ms',

  // ease-out — default for enter animations and most UI transitions
  easingDefault: 'cubic-bezier(0, 0, 0.2, 1)',
  // ease-in — exit animations
  easingIn: 'cubic-bezier(0.4, 0, 1, 1)',
  // ease-out alias — for clarity when paired with easingIn
  easingOut: 'cubic-bezier(0, 0, 0.2, 1)',
  // symmetric — looping animations, resizing, drag
  easingInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const
