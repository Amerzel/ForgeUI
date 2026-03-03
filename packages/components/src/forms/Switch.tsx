import * as RadixSwitch from '@radix-ui/react-switch'

type SwitchSize = 'sm' | 'md'

interface SwitchProps extends Omit<React.ComponentPropsWithoutRef<typeof RadixSwitch.Root>, 'id'> {
  /** Visible label */
  label?: string
  id?: string
  size?: SwitchSize
}

let _idCounter = 0

const TRACK_SIZE: Record<SwitchSize, { width: number; height: number; thumbSize: number }> = {
  sm: { width: 28, height: 16, thumbSize: 12 },
  md: { width: 36, height: 20, thumbSize: 16 },
}

export function Switch({ label, id, size = 'md', disabled, checked, ...props }: SwitchProps) {
  const switchId = id ?? `forge-switch-${++_idCounter}`
  const { width, height, thumbSize } = TRACK_SIZE[size]
  const offset = (height - thumbSize) / 2
  const checkedTranslate = width - thumbSize - offset

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--forge-space-2)' }}>
      <RadixSwitch.Root
        id={switchId}
        checked={checked}
        disabled={disabled}
        style={{
          position: 'relative',
          display: 'inline-flex',
          width: `${width}px`,
          height: `${height}px`,
          flexShrink: 0,
          backgroundColor: checked ? 'var(--forge-accent)' : 'var(--forge-border)',
          borderRadius: 'var(--forge-radius-full)',
          border: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          outline: 'none',
          transition: `background-color var(--forge-duration-fast) var(--forge-easing-default)`,
        }}
        onFocus={(e) => {
          e.currentTarget.style.outline =
            'var(--forge-focus-ring-width) solid var(--forge-focus-ring-color)'
          e.currentTarget.style.outlineOffset = 'var(--forge-focus-ring-offset)'
        }}
        onBlur={(e) => {
          e.currentTarget.style.outline = 'none'
        }}
        {...props}
      >
        <RadixSwitch.Thumb
          style={{
            display: 'block',
            width: `${thumbSize}px`,
            height: `${thumbSize}px`,
            backgroundColor: '#ffffff',
            borderRadius: 'var(--forge-radius-full)',
            boxShadow: 'var(--forge-shadow-sm)',
            transform: checked ? `translateX(${checkedTranslate}px)` : `translateX(${offset}px)`,
            transition: `transform var(--forge-duration-fast) var(--forge-easing-default)`,
          }}
        />
      </RadixSwitch.Root>

      {label && (
        <label
          htmlFor={switchId}
          style={{
            fontSize: 'var(--forge-font-size-base)',
            color: disabled ? 'var(--forge-text-disabled)' : 'var(--forge-text)',
            cursor: disabled ? 'not-allowed' : 'pointer',
            userSelect: 'none',
          }}
        >
          {label}
        </label>
      )}
    </div>
  )
}
